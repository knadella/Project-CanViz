import { NavBar } from "../components/NavBar.js";

export function AppLayout() {
  const el = document.createElement("div");
  el.className = "appShell";

  const header = document.createElement("header");
  header.className = "appHeader";

  const main = document.createElement("main");
  main.className = "appMain";

  const footer = document.createElement("footer");
  footer.className = "appFooter";
  footer.innerHTML = `
    <div class="container">
      <small>
        Built by collaborators. Data sources are public Canadian sources, including Statistics Canada.
      </small>
    </div>
  `;

  const nav = NavBar();
  header.appendChild(nav);

  const outlet = document.createElement("div");
  outlet.className = "container";
  main.appendChild(outlet);

  el.appendChild(header);
  el.appendChild(main);
  el.appendChild(footer);

  return { el, outlet };
}



