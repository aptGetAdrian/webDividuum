import descriptionsRaw from "../../public/assets/guests/opisi_govorcev.md?raw";

/**
 * Guest roster.
 *
 * Descriptions live in public/assets/guests/opisi_govorcev.md so the prose stays
 * editable as prose. This file holds everything the markdown can't express —
 * photo, episode link, and the mono role label shown on the tile — and joins the
 * two on `name`, which must match a `## heading` in the markdown exactly.
 *
 * `role` is the one-word domain shown under each photo. It is what makes the grid
 * scannable: the point of the section is the *range* of people, so the label says
 * what someone is, not what number they are.
 */
const roster = [
  { name: "Dejan Zavec",         role: "Boksar",       image: "/assets/guests/dejanZavec.png",         link: "https://www.youtube.com/watch?v=2O3BO2vq6Xk" },
  { name: "dr. Viktor Markelj",  role: "Inženir",      image: "/assets/guests/viktorMarkelj2.png",     link: "https://www.youtube.com/watch?v=NpdTZQ3u2_Q" },
  { name: "Polona Kovač",        role: "Aktivistka",   image: "/assets/guests/polonaKovac.png",        link: "https://www.youtube.com/watch?v=hyObyUGyQAM" },
  { name: "Matej Skoliber",      role: "Pivovar",      image: "/assets/guests/matejSkoliber2.png",     link: "https://www.youtube.com/watch?v=ub_pnkapdxo" },
  { name: "Damijan Janžekovič",  role: "Predavatelj",  image: "/assets/guests/damijanJanzekovic2.png", link: "https://www.youtube.com/watch?v=AkM8cE0vj7c" },
  { name: "Grega Ivančič",       role: "Podjetnik",    image: "/assets/guests/gregaIvancic.png",       link: "https://www.youtube.com/watch?v=XJ8QTTpcj5E" },
  { name: "Anže Zavrl",          role: "Harmonikar",   image: "/assets/guests/anzeZavrl.png",          link: "https://www.youtube.com/watch?v=gbjWNM5jveI" },
  { name: "ddr. Ivan Rihtarič",  role: "Profesor",     image: "/assets/guests/ivanRihtaric2.png",      link: "https://www.youtube.com/watch?v=ptYK6YBr1hc" },
  { name: "dr. Aleš Maver",      role: "Publicist",    image: "/assets/guests/alesMaver2.png",         link: "https://www.youtube.com/watch?v=4W448Sls-yg" },
  { name: "Andrej Štremfelj",    role: "Alpinist",     image: "/assets/guests/andrejStremfelj2.png",   link: "https://www.youtube.com/watch?v=Mm1Nveb-c44" },
  { name: "Jaka Tomc",           role: "Pisatelj",     image: "/assets/guests/jakaTomc.png",           link: "https://www.youtube.com/watch?v=zC9AsyN2o3Y" },
  { name: 'Goran "Gogi" Šrok',   role: "Pričevalec",   image: "/assets/guests/goranSrok2.png",         link: "https://www.youtube.com/watch?v=jZTkqyXzgpI" },
  { name: "Uroš Dokl",           role: "Kustos",       image: "/assets/guests/urosDokl.png",           link: "https://www.youtube.com/watch?v=qQR6SndqFwQ" },
  { name: "Igor Plohl",          role: "Učitelj",      image: "/assets/guests/igorPlohl2.png",         link: "https://www.youtube.com/watch?v=g8pRKA66VS0" },
  // NOTE: pre-existing in the old FeaturedGuests.jsx — Martin Bele points at Igor
  // Plohl's episode. Left as found; needs the real video id.
  { name: "dr. Martin Bele",     role: "Zgodovinar",   image: "/assets/guests/martinBele.png",         link: "https://www.youtube.com/watch?v=g8pRKA66VS0" },
];

/** Split "## Name\n\nbody" sections into { [name]: body }, collapsing wrapped lines. */
function parseDescriptions(markdown) {
  const byName = {};
  for (const section of markdown.split(/^##[ \t]+/m).slice(1)) {
    const breakAt = section.indexOf("\n");
    if (breakAt === -1) continue;
    const name = section.slice(0, breakAt).trim();
    byName[name] = section
      .slice(breakAt + 1)
      .trim()
      .replace(/\s*\n\s*/g, " ");
  }
  return byName;
}

const descriptions = parseDescriptions(descriptionsRaw);

export const guests = roster.map((guest) => {
  const description = descriptions[guest.name];
  if (import.meta.env.DEV && !description) {
    console.warn(
      `[guests] No "## ${guest.name}" heading in opisi_govorcev.md — tile will render without a description.`,
    );
  }
  return { ...guest, description: description ?? "" };
});
