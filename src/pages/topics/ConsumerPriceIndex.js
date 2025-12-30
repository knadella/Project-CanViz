import { renderCpiLineChart } from "../../charts/cpiLineChart.js";

export function ConsumerPriceIndexPage() {
  /** @type {(() => void) | null} */
  let cleanup = null;

  return {
    title: "Consumer Price Index",
    render: (outlet) => {
      const page = document.createElement("div");
      page.className = "page";
      page.innerHTML = `
        <h1>Consumer Price Index</h1>
        <p>
          The Consumer Price Index is one way to measure how the overall level of consumer prices changes over time.
          This page will grow into a collection of charts and short explanations.
        </p>

        <h2>National index over time</h2>
        <p>
          The chart below is a starter example using a small sample dataset. Later, we can swap in the full table
          downloaded from Statistics Canada.
        </p>
      `;

      const panel = document.createElement("div");
      panel.className = "chartPanel";

      const titleRow = document.createElement("div");
      titleRow.className = "chartTitleRow";
      titleRow.innerHTML = `
        <h3>Consumer Price Index (sample)</h3>
        <small>Source: sample file in this repository</small>
      `;

      const chartMount = document.createElement("div");
      panel.appendChild(titleRow);
      panel.appendChild(chartMount);

      page.appendChild(panel);
      outlet.appendChild(page);

      cleanup = renderCpiLineChart({
        container: chartMount,
        dataUrl: `${import.meta.env.BASE_URL}data/cpi_sample.csv`,
        width: 860,
        height: 380,
      });
    },
    destroy: () => {
      if (cleanup) cleanup();
      cleanup = null;
    },
  };
}



