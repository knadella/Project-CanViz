import { HomePage } from "./pages/Home.js";
import { TopicsIndexPage } from "./pages/TopicsIndex.js";
import { ConsumerPriceIndexPage } from "./pages/topics/ConsumerPriceIndex.js";

function normalisePath(path) {
  const trimmed = (path || "").trim();
  if (!trimmed) return "/";
  if (!trimmed.startsWith("/")) return `/${trimmed}`;
  return trimmed;
}

function getHashPath() {
  // location.hash includes the leading #, example: "#/topics"
  const raw = window.location.hash.replace(/^#/, "");
  return normalisePath(raw);
}

export function createRouter({ outlet, setTitle }) {
  if (!outlet) throw new Error("Router requires an outlet element");

  /** @type {{ destroy?: () => void } | null} */
  let current = null;

  const routes = {
    "/": HomePage,
    "/topics": TopicsIndexPage,
    "/topics/consumer-price-index": ConsumerPriceIndexPage,
  };

  function renderNotFound(path) {
    setTitle("Not found");
    outlet.innerHTML = "";

    const wrap = document.createElement("div");
    wrap.className = "page";
    wrap.innerHTML = `
      <h1>Page not found</h1>
      <p>We could not find <code>${escapeHtml(path)}</code>.</p>
      <p><a href="#/">Go back to the home page</a></p>
    `;
    outlet.appendChild(wrap);
  }

  function navigate() {
    const path = getHashPath();

    if (current && typeof current.destroy === "function") {
      current.destroy();
    }

    const pageFactory = routes[path];
    if (!pageFactory) {
      current = null;
      renderNotFound(path);
      return;
    }

    const page = pageFactory();
    current = page;

    setTitle(page.title || "");
    outlet.innerHTML = "";
    page.render(outlet);
  }

  function start() {
    window.addEventListener("hashchange", navigate);
    navigate();
  }

  return { start, navigate };
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}



