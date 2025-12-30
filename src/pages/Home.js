import { topics } from "../data/topics.js";

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function HomePage() {
  return {
    title: "Home",
    render: (outlet) => {
      const page = document.createElement("div");
      page.className = "page";

      const topicCards = topics
        .map((topic) => {
          return `
            <a class="card span6" href="${topic.href}">
              <h3>${escapeHtml(topic.title)}</h3>
              <p>${escapeHtml(topic.description)}</p>
            </a>
          `;
        })
        .join("");

      page.innerHTML = `
        <h1>Canada, made easier to understand</h1>
        <p>
          Canada in Data helps Canadians see and understand the country through clear, interactive charts.
          We focus on public Canadian datasets and explain what the numbers mean.
        </p>
        <div class="cardGrid">
          ${topicCards}
        </div>
      `;

      outlet.appendChild(page);
    },
  };
}



