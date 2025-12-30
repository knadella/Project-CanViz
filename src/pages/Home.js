export function HomePage() {
  return {
    title: "Home",
    render: (outlet) => {
      const page = document.createElement("div");
      page.className = "page";

      page.innerHTML = `
        <h1>Canada, made easier to understand</h1>
        <p>
          Canada in Data helps Canadians see and understand the country through clear, interactive charts.
          We focus on public Canadian datasets and explain what the numbers mean.
        </p>
        <div class="cardGrid">
          <a class="card span6" href="#/topics">
            <h3>Explore topics</h3>
            <p>Browse curated pages with charts and plain language explanations.</p>
          </a>
          <a class="card span6" href="#/topics/consumer-price-index">
            <h3>Consumer Price Index</h3>
            <p>See how prices change over time and learn how the index is measured.</p>
          </a>
        </div>
      `;

      outlet.appendChild(page);
    },
  };
}



