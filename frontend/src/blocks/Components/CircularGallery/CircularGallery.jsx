import {
  Camera,
  Mesh,
  Plane,
  Program,
  Renderer,
  Texture,
  Transform,
} from "ogl";
import { useEffect, useRef } from "react";

import "./CircularGallery.css";

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function lerp(p1, p2, t) {
  return p1 + (p2 - p1) * t;
}

function autoBind(instance) {
  const proto = Object.getPrototypeOf(instance);
  Object.getOwnPropertyNames(proto).forEach((key) => {
    if (key !== "constructor" && typeof instance[key] === "function") {
      instance[key] = instance[key].bind(instance);
    }
  });
}

class Media {
  constructor({
    geometry,
    gl,
    image,
    description,
    link,
    index,
    length,
    renderer,
    scene,
    screen,
    viewport,
    bend,
    borderRadius = 0,
    onClick,
  }) {
    this.extra = 0;
    this.geometry = geometry;
    this.gl = gl;
    this.image = image;
    this.description = description;
    this.link = link;
    this.index = index;
    this.length = length;
    this.renderer = renderer;
    this.scene = scene;
    this.screen = screen;
    this.viewport = viewport;
    this.bend = bend;
    this.borderRadius = borderRadius;
    this.isHovered = false;
    this.onClick = onClick;
    this.createShader();
    this.createMesh();
    this.onResize();
  }
  
  createShader() {
    this.mainTexture = new Texture(this.gl, { generateMipmaps: false });
    this.descriptionTexture = new Texture(this.gl, { generateMipmaps: false });
    
    this.program = new Program(this.gl, {
      depthTest: false,
      depthWrite: false,
      vertex: `
        precision highp float;
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        varying vec2 vUv;
        void main() {
          vUv = uv;
          vec3 p = position;
          p.z = 0.0;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform vec2 uImageSizes;
        uniform vec2 uPlaneSizes;
        uniform sampler2D tMainMap;
        uniform sampler2D tDescriptionMap;
        uniform float uBorderRadius;
        uniform float uHoverAmount;
        varying vec2 vUv;
        
        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 d = abs(p) - b;
          return length(max(d, vec2(0.0))) + min(max(d.x, d.y), 0.0) - r;
        }
        
        void main() {
          vec2 ratio = vec2(
            min((uPlaneSizes.x / uPlaneSizes.y) / (uImageSizes.x / uImageSizes.y), 1.0),
            min((uPlaneSizes.y / uPlaneSizes.x) / (uImageSizes.y / uImageSizes.x), 1.0)
          );
          vec2 uv = vec2(
            vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
            vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
          );
          
          vec4 mainColor = texture2D(tMainMap, uv);
          vec4 descriptionColor = texture2D(tDescriptionMap, uv);
          vec4 color = mix(mainColor, descriptionColor, uHoverAmount);
          
          float d = roundedBoxSDF(vUv - 0.5, vec2(0.5 - uBorderRadius), uBorderRadius);
          if(d > 0.0) {
            discard;
          }
          
          gl_FragColor = vec4(color.rgb, 1.0);
        }
      `,
      uniforms: {
        tMainMap: { value: this.mainTexture },
        tDescriptionMap: { value: this.descriptionTexture },
        uPlaneSizes: { value: [0, 0] },
        uImageSizes: { value: [0, 0] },
        uBorderRadius: { value: this.borderRadius },
        uHoverAmount: { value: 0 },
      },
      transparent: true,
    });
    
    // Load main image
    const mainImg = new Image();
    mainImg.crossOrigin = "anonymous";
    mainImg.src = this.image;
    mainImg.onload = () => {
      this.mainTexture.image = mainImg;
      this.program.uniforms.uImageSizes.value = [
        mainImg.naturalWidth,
        mainImg.naturalHeight,
      ];
    };
    
    // Load description image
    const descImg = new Image();
    descImg.crossOrigin = "anonymous";
    descImg.src = this.description;
    descImg.onload = () => {
      this.descriptionTexture.image = descImg;
    };
    
    this.hoverAmount = 0;
    this.targetHoverAmount = 0;
  }
  
  createMesh() {
    this.plane = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program,
    });
    this.plane.setParent(this.scene);
  }
  
  setHovered(hovered) {
    this.isHovered = hovered;
    this.targetHoverAmount = hovered ? 1 : 0;
  }
  
  update(scroll, direction) {
    this.plane.position.x = this.x - scroll.current - this.extra;

    const x = this.plane.position.x;
    const H = this.viewport.width / 2;

    if (this.bend === 0) {
      this.plane.position.y = 0;
      this.plane.rotation.z = 0;
    } else {
      const B_abs = Math.abs(this.bend);
      const R = (H * H + B_abs * B_abs) / (2 * B_abs);
      const effectiveX = Math.min(Math.abs(x), H);

      const arc = R - Math.sqrt(R * R - effectiveX * effectiveX);
      if (this.bend > 0) {
        this.plane.position.y = -arc;
        this.plane.rotation.z = -Math.sign(x) * Math.asin(effectiveX / R);
      } else {
        this.plane.position.y = arc;
        this.plane.rotation.z = Math.sign(x) * Math.asin(effectiveX / R);
      }
    }

    // Update hover animation
    this.hoverAmount = lerp(this.hoverAmount, this.targetHoverAmount, 0.1);
    this.program.uniforms.uHoverAmount.value = this.hoverAmount;

    const planeOffset = this.plane.scale.x / 2;
    const viewportOffset = this.viewport.width / 2;
    this.isBefore = this.plane.position.x + planeOffset < -viewportOffset;
    this.isAfter = this.plane.position.x - planeOffset > viewportOffset;
    if (direction === "right" && this.isBefore) {
      this.extra -= this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
    if (direction === "left" && this.isAfter) {
      this.extra += this.widthTotal;
      this.isBefore = this.isAfter = false;
    }
  }
  
  onResize({ screen, viewport } = {}) {
    if (screen) this.screen = screen;
    if (viewport) {
      this.viewport = viewport;
      if (this.plane.program.uniforms.uViewportSizes) {
        this.plane.program.uniforms.uViewportSizes.value = [
          this.viewport.width,
          this.viewport.height,
        ];
      }
    }
    this.scale = this.screen.height / 1500;
    this.plane.scale.y =
      (this.viewport.height * (900 * this.scale)) / this.screen.height;
    this.plane.scale.x =
      (this.viewport.width * (700 * this.scale)) / this.screen.width;
    this.plane.program.uniforms.uPlaneSizes.value = [
      this.plane.scale.x,
      this.plane.scale.y,
    ];
    this.padding = 2;
    this.width = this.plane.scale.x + this.padding;
    this.widthTotal = this.width * this.length;
    this.x = this.width * this.index;
  }
}

class App {
  constructor(
    container,
    {
      items,
      bend,
      borderRadius = 0,
      scrollSpeed = 2,
      scrollEase = 0.05,
      onItemClick,
    } = {},
  ) {
    document.documentElement.classList.remove("no-js");
    this.container = container;
    this.scrollSpeed = scrollSpeed;
    this.onItemClick = onItemClick;
    this.scroll = { ease: scrollEase, current: 0, target: 0, last: 0 };
    this.onCheckDebounce = debounce(this.onCheck, 200);
    
    // Add drag tracking variables
    this.isDragging = false;
    this.dragStartX = 0;
    this.dragStartY = 0;
    this.dragThreshold = 5; // pixels - minimum movement to consider it a drag
    
    this.createRenderer();
    this.createCamera();
    this.createScene();
    this.onResize();
    this.createGeometry();
    this.createMedias(items, bend, borderRadius);
    this.update();
    this.addEventListeners();
  }
  
  createRenderer() {
    this.renderer = new Renderer({ alpha: true, antialias: true });
    this.gl = this.renderer.gl;
    this.gl.clearColor(0, 0, 0, 0);
    this.container.appendChild(this.gl.canvas);
  }
  
  createCamera() {
    this.camera = new Camera(this.gl);
    this.camera.fov = 45;
    this.camera.position.z = 20;
  }
  
  createScene() {
    this.scene = new Transform();
  }
  
  createGeometry() {
    this.planeGeometry = new Plane(this.gl, {
      heightSegments: 50,
      widthSegments: 100,
    });
  }
  
  createMedias(items, bend = 1, borderRadius) {
    const galleryItems = items;
    this.mediasImages = galleryItems.concat(galleryItems);
    this.medias = this.mediasImages.map((data, index) => {
      return new Media({
        geometry: this.planeGeometry,
        gl: this.gl,
        image: data.image,
        description: data.description,
        link: data.link,
        index,
        length: this.mediasImages.length,
        renderer: this.renderer,
        scene: this.scene,
        screen: this.screen,
        viewport: this.viewport,
        bend,
        borderRadius,
        onClick: () => {
          if (this.onItemClick) {
            this.onItemClick(data.link);
          }
        },
      });
    });
  }
  
  getMediaAtPosition(x, y) {
    // Convert screen coordinates to world coordinates
    const rect = this.gl.canvas.getBoundingClientRect();
    const normalizedX = ((x - rect.left) / rect.width) * 2 - 1;
    const normalizedY = -((y - rect.top) / rect.height) * 2 + 1;
    
    // Convert to world space
    const worldX = (normalizedX * this.viewport.width) / 2;
    const worldY = (normalizedY * this.viewport.height) / 2;
    
    // Find which media is at this position
    for (let media of this.medias) {
      const mediaLeft = media.plane.position.x - media.plane.scale.x / 2;
      const mediaRight = media.plane.position.x + media.plane.scale.x / 2;
      const mediaTop = media.plane.position.y + media.plane.scale.y / 2;
      const mediaBottom = media.plane.position.y - media.plane.scale.y / 2;
      
      if (worldX >= mediaLeft && worldX <= mediaRight && 
          worldY >= mediaBottom && worldY <= mediaTop) {
        return media;
      }
    }
    return null;
  }
  
  onMouseMove(e) {
    const hoveredMedia = this.getMediaAtPosition(e.clientX, e.clientY);
    
    // Update hover states
    this.medias.forEach(media => {
      media.setHovered(media === hoveredMedia);
    });
    
    // Update cursor style
    this.gl.canvas.style.cursor = hoveredMedia ? 'pointer' : 'default';
  }
  
  onMouseClick(e) {
    // Only handle clicks if we haven't been dragging
    if (!this.isDragging) {
      const clickedMedia = this.getMediaAtPosition(e.clientX, e.clientY);
      if (clickedMedia && clickedMedia.onClick) {
        clickedMedia.onClick();
      }
    }
  }
  
  onTouchDown(e) {
    this.isDown = true;
    this.isDragging = false; // Reset dragging state
    this.scroll.position = this.scroll.current;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    this.start = clientX;
    this.dragStartX = clientX;
    this.dragStartY = clientY;
  }
  
  onTouchMove(e) {
    if (!this.isDown) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    // Check if we've moved enough to consider this a drag
    const deltaX = Math.abs(clientX - this.dragStartX);
    const deltaY = Math.abs(clientY - this.dragStartY);
    
    if (!this.isDragging && (deltaX > this.dragThreshold || deltaY > this.dragThreshold)) {
      this.isDragging = true;
    }
    
    const distance = (this.start - clientX) * (this.scrollSpeed * 0.025);
    this.scroll.target = this.scroll.position + distance;
  }
  
  onTouchUp() {
    this.isDown = false;
    this.onCheck();
    
    // Reset dragging state after a short delay to prevent click events
    setTimeout(() => {
      this.isDragging = false;
    }, 50);
  }
  
  onWheel(e) {
    const delta = e.deltaY || e.wheelDelta || e.detail;
    this.scroll.target +=
      (delta > 0 ? this.scrollSpeed : -this.scrollSpeed) * 0.2;
    this.onCheckDebounce();
  }
  
  onCheck() {
    if (!this.medias || !this.medias[0]) return;
    const width = this.medias[0].width;
    const itemIndex = Math.round(Math.abs(this.scroll.target) / width);
    const item = width * itemIndex;
    this.scroll.target = this.scroll.target < 0 ? -item : item;
  }
  
  onResize() {
    this.screen = {
      width: this.container.clientWidth,
      height: this.container.clientHeight,
    };
    this.renderer.setSize(this.screen.width, this.screen.height);
    this.camera.perspective({
      aspect: this.screen.width / this.screen.height,
    });
    const fov = (this.camera.fov * Math.PI) / 180;
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;
    this.viewport = { width, height };
    if (this.medias) {
      this.medias.forEach((media) =>
        media.onResize({ screen: this.screen, viewport: this.viewport }),
      );
    }
  }
  
  update() {
    this.scroll.current = lerp(
      this.scroll.current,
      this.scroll.target,
      this.scroll.ease,
    );
    const direction = this.scroll.current > this.scroll.last ? "right" : "left";
    if (this.medias) {
      this.medias.forEach((media) => media.update(this.scroll, direction));
    }
    this.renderer.render({ scene: this.scene, camera: this.camera });
    this.scroll.last = this.scroll.current;
    this.raf = window.requestAnimationFrame(this.update.bind(this));
  }
  
  addEventListeners() {
    this.boundOnResize = this.onResize.bind(this);
    this.boundOnWheel = this.onWheel.bind(this);
    this.boundOnTouchDown = this.onTouchDown.bind(this);
    this.boundOnTouchMove = this.onTouchMove.bind(this);
    this.boundOnTouchUp = this.onTouchUp.bind(this);
    this.boundOnMouseMove = this.onMouseMove.bind(this);
    this.boundOnMouseClick = this.onMouseClick.bind(this);
    
    window.addEventListener("resize", this.boundOnResize);
    window.addEventListener("mousewheel", this.boundOnWheel);
    window.addEventListener("wheel", this.boundOnWheel);
    window.addEventListener("mousedown", this.boundOnTouchDown);
    window.addEventListener("mousemove", this.boundOnTouchMove);
    window.addEventListener("mouseup", this.boundOnTouchUp);
    window.addEventListener("touchstart", this.boundOnTouchDown);
    window.addEventListener("touchmove", this.boundOnTouchMove);
    window.addEventListener("touchend", this.boundOnTouchUp);
    
    // Add mouse move and click for hover detection and clicking
    this.gl.canvas.addEventListener("mousemove", this.boundOnMouseMove);
    this.gl.canvas.addEventListener("click", this.boundOnMouseClick);
    this.gl.canvas.addEventListener("mouseleave", () => {
      // Clear all hovers when mouse leaves canvas
      this.medias.forEach(media => media.setHovered(false));
      this.gl.canvas.style.cursor = 'default';
    });
  }
  
  destroy() {
    window.cancelAnimationFrame(this.raf);
    window.removeEventListener("resize", this.boundOnResize);
    window.removeEventListener("mousewheel", this.boundOnWheel);
    window.removeEventListener("wheel", this.boundOnWheel);
    window.removeEventListener("mousedown", this.boundOnTouchDown);
    window.removeEventListener("mousemove", this.boundOnTouchMove);
    window.removeEventListener("mouseup", this.boundOnTouchUp);
    window.removeEventListener("touchstart", this.boundOnTouchDown);
    window.removeEventListener("touchmove", this.boundOnTouchMove);
    window.removeEventListener("touchend", this.boundOnTouchUp);
    
    if (this.gl && this.gl.canvas) {
      this.gl.canvas.removeEventListener("mousemove", this.boundOnMouseMove);
      this.gl.canvas.removeEventListener("click", this.boundOnMouseClick);
    }
    
    if (
      this.renderer &&
      this.renderer.gl &&
      this.renderer.gl.canvas.parentNode
    ) {
      this.renderer.gl.canvas.parentNode.removeChild(this.renderer.gl.canvas);
    }
  }
}

export default function CircularGallery({
  items,
  bend = 3,
  borderRadius = 0.05,
  scrollSpeed = 2,
  scrollEase = 0.05,
}) {
  const containerRef = useRef(null);
  
  const handleItemClick = (link) => {
    window.open(link, '_blank');
  };
  
  useEffect(() => {
    const app = new App(containerRef.current, {
      items,
      bend,
      borderRadius,
      scrollSpeed,
      scrollEase,
      onItemClick: handleItemClick,
    });
    return () => {
      app.destroy();
    };
  }, [items, bend, borderRadius, scrollSpeed, scrollEase]);
  
  return <div className="circular-gallery" ref={containerRef} />;
}