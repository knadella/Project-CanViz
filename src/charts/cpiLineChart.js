import * as d3 from "d3";

export function renderCpiLineChart({ container, dataUrl, width, height }) {
  if (!container) throw new Error("renderCpiLineChart requires container");
  if (!dataUrl) throw new Error("renderCpiLineChart requires dataUrl");

  const w = Number(width) || 860;
  const h = Number(height) || 380;

  const margin = { top: 16, right: 18, bottom: 40, left: 56 };
  const innerW = w - margin.left - margin.right;
  const innerH = h - margin.top - margin.bottom;

  container.innerHTML = "";

  const svg = d3
    .select(container)
    .append("svg")
    .attr("viewBox", `0 0 ${w} ${h}`)
    .style("width", "100%")
    .style("height", "auto")
    .attr("role", "img")
    .attr("aria-label", "Consumer Price Index line chart");

  const g = svg
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

  const parseMonth = d3.timeParse("%Y-%m");

  let isDestroyed = false;

  d3.csv(dataUrl, (row) => {
    const date = parseMonth(String(row.month || row.Month || "").trim());
    const valueRaw = row.index ?? row.Index ?? row.value ?? row.Value;
    const value = valueRaw === undefined ? NaN : Number(String(valueRaw).trim());
    return { date, value };
  })
    .then((rows) => {
      if (isDestroyed) return;

      const data = rows
        .filter((d) => d.date instanceof Date && !Number.isNaN(d.value))
        .sort((a, b) => a.date - b.date);

      if (data.length === 0) {
        g.append("text")
          .attr("x", 0)
          .attr("y", 16)
          .attr("fill", "currentColor")
          .text("No data available.");
        return;
      }

      const x = d3
        .scaleTime()
        .domain(d3.extent(data, (d) => d.date))
        .range([0, innerW]);

      const y = d3
        .scaleLinear()
        .domain(d3.extent(data, (d) => d.value))
        .nice()
        .range([innerH, 0]);

      g.append("g")
        .attr("transform", `translate(0,${innerH})`)
        .call(d3.axisBottom(x).ticks(6))
        .call((axisG) => {
          axisG.selectAll("text").attr("fill", "#6c757d").attr("font-size", "13px");
          axisG.selectAll("path,line").attr("stroke", "#e0e0e0");
        });

      g.append("g")
        .call(d3.axisLeft(y).ticks(6))
        .call((axisG) => {
          axisG.selectAll("text").attr("fill", "#6c757d").attr("font-size", "13px");
          axisG.selectAll("path,line").attr("stroke", "#e0e0e0");
        });

      const line = d3
        .line()
        .x((d) => x(d.date))
        .y((d) => y(d.value));

      g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "#0066cc")
        .attr("stroke-width", 2.5)
        .attr("d", line);

      const last = data[data.length - 1];
      g.append("circle")
        .attr("cx", x(last.date))
        .attr("cy", y(last.value))
        .attr("r", 4)
        .attr("fill", "#ff6b35")
        .attr("stroke", "#ffffff")
        .attr("stroke-width", 2);
    })
    .catch((err) => {
      if (isDestroyed) return;
      g.append("text")
        .attr("x", 0)
        .attr("y", 16)
        .attr("fill", "currentColor")
        .text("Error loading chart data.");
      // eslint-disable-next-line no-console
      console.error(err);
    });

  return () => {
    isDestroyed = true;
    container.innerHTML = "";
  };
}



