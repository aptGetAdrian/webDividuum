import { useEffect, useRef, useState } from "react";

/**
 * Adds `is-in` to a section once it enters the viewport, so its `[data-reveal]`
 * children rise into place. One observer per section rather than one per element.
 *
 * Fires once and disconnects — nothing re-animates on scroll back up.
 */
/**
 * The negative bottom margin is what stops it firing early: it pulls the trigger
 * line up from the viewport bottom, so a section has to be properly scrolled into
 * view before it reveals rather than the instant its top edge appears.
 */
const useReveal = ({ threshold = 0.1, rootMargin = "0px 0px -22% 0px" } = {}) => {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const node = ref.current;
    // No observer (old browser, SSR/prerender): show everything rather than
    // leaving the section permanently invisible.
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setShown(true);
        observer.disconnect();
      },
      { threshold, rootMargin },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin]);

  return [ref, shown];
};

export default useReveal;
