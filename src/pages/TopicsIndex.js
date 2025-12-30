import { topics } from "../data/topics.js";

export function TopicsIndexPage() {
  return {
    title: "Topics",
    render: (outlet) => {
      const page = document.createElement("div");
      page.className = "page";

      const cards = topics
        .map((t) => {
          return `
            <a class="card span6" href="${t.href}">
              <h3>${escapeHtml(t.title)}</h3>
              <p>${escapeHtml(t.description)}</p>
            </a>
          `;
        })
        .join("");

      page.innerHTML = `
        <h1>Topics</h1>
        <p>
          Each topic page combines charts with short explanations. New pages can be added as the project grows.
        </p>
        <div class="cardGrid">${cards}</div>
      `;

      outlet.appendChild(page);
    },
  };
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}



