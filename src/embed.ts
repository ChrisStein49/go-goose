// Embedded mode (iframe on ganzgraz.at/spiel): the page around the game should have the only
// scrollbar. So the game reports its content height to the parent page, which sets the iframe
// height to match, and the game itself never scrolls inside the frame.
//
// Parent page snippet: see docs/cloudflare-migration-checklist.md, section 6b.

const embedded = window.parent !== window;

if (embedded) {
  document.documentElement.classList.add("embedded");

  const style = document.createElement("style");
  style.textContent = `
    html.embedded, html.embedded body { overflow: hidden; }
    /* body normally has min-height: 100svh; inside an auto-sized frame that would feed back
       into the measured height and the frame would never shrink. */
    html.embedded body { min-height: 0; }
    /* The frame is as tall as the content, so a centred fixed overlay could end up off-screen.
       Pin the confirm dialog near the top, where the back button that opens it sits. */
    html.embedded .modal-overlay { align-items: flex-start; padding-top: 96px; }
  `;
  document.head.appendChild(style);

  let last = 0;
  const report = () => {
    const root = document.getElementById("root");
    if (!root) return;
    const height = Math.ceil(root.getBoundingClientRect().height);
    if (height === last) return;
    last = height;
    // Height is not sensitive and frame-ancestors in public/_headers already limits who can
    // embed the game, so "*" is fine as target origin.
    window.parent.postMessage({ type: "go-goose:height", height }, "*");
  };

  const start = () => {
    const root = document.getElementById("root");
    if (root) new ResizeObserver(report).observe(root);
    report();
  };

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
  else start();
  window.addEventListener("load", report);
}

export {};
