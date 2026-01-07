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

      const topicCards = topics
        .map((topic) => {
          return `
            <a class="card span6" href="${topic.href}">
              <h3>${escapeHtml(topic.title)}</h3>
              <p>${escapeHtml(topic.description)}</p>
              <span class="card-arrow">→</span>
            </a>
          `;
        })
        .join("");

      page.innerHTML = `
        <section class="hero">
          <div class="hero-content container">
            <h1>Canada, made easier to understand</h1>
            <p class="lead">
              Canada in Data helps Canadians see and understand the country through clear, 
              interactive visualizations. We focus on public Canadian datasets and explain 
              what the numbers mean for everyday life.
            </p>
          </div>
        </section>
        
        <section class="container page">
          <div class="section-header">
            <div class="section-label">Explore Topics</div>
            <h2>What would you like to explore?</h2>
            <p>Dive into interactive stories built from official Statistics Canada data.</p>
          </div>
          
          <div class="cardGrid">
            ${topicCards}
          </div>
        </section>
      `;

      outlet.appendChild(page);
    },
  };
}
