// Grain Production Charts - D3 visualizations
// Requires D3.js to be loaded globally
// Extracted from R Markdown file, preserving exact structure and styling

// Production History Chart
function initProductionChart() {
  const baseUrl = import.meta.env.BASE_URL;
  
  // Wait for D3.js to load and container to exist
  if (typeof d3 === "undefined") {
    console.error("D3.js is not loaded. Please ensure d3.min.js is available.");
    return;
  }
  
  const container = document.getElementById("plot-history-production-container");
  if (!container) {
    console.error("Container #plot-history-production-container not found");
    return;
  }
  
  // Skip if chart already exists
  if (container.querySelector("svg")) {
    return;
  }
  
  d3.json(baseUrl + "data/grain_production_by_year.json")
    .then(function(jsonData) {
      const data = jsonData.data;
      const xAxisBreaks = jsonData.xAxisBreaks;
      
      // LabelClean function (replicates R function)
      function labelClean(value) {
        if (!isFinite(value) || isNaN(value)) return "";
        
        const absValue = Math.abs(value);
        let suffix = "";
        let scale = 1;
        
        if (absValue >= 1e9) {
          suffix = "B";
          scale = 1e9;
        } else if (absValue >= 1e6) {
          suffix = "M";
          scale = 1e6;
        } else if (absValue >= 1e3) {
          suffix = "K";
          scale = 1e3;
        }
        
        const scaled = value / scale;
        let txt = scaled.toFixed(1);
        txt = txt.replace(/\.0$/, "");
        
        return txt + suffix;
      }
      
      // Set dimensions and margins - make responsive
      const margin = {top: 40, right: 20, bottom: 50, left: 80};
      const containerWidth = container.clientWidth || 960;
      const maxWidth = 960;
      const width = Math.min(containerWidth - margin.left - margin.right, maxWidth - margin.left - margin.right);
      const height = 576 - margin.top - margin.bottom;
      
      // Create SVG
      const svg = d3.select("#plot-history-production-container")
        .append("svg")
        .attr("id", "plot-history-production")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("max-width", "100%")
        .style("height", "auto");
      
      const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      // Create tooltip
      const tooltip = d3.select("body").append("div")
        .attr("class", "plot-history-production-tooltip")
        .style("opacity", 0);
      
      // Create hover line
      const hoverLine = g.append("line")
        .attr("class", "hover-line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", height);
      
      // Create hover year label (will be added to x-axis group after axis is created)
      let hoverYearLabel;
      
      // Scales
      const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);
      
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);
      
      // Grid lines
      const xGridLines = g.selectAll(".x-grid")
        .data(xAxisBreaks)
        .enter().append("line")
        .attr("class", "grid-line")
        .attr("x1", d => xScale(d))
        .attr("x2", d => xScale(d))
        .attr("y1", 0)
        .attr("y2", height);
      
      const yTicks = yScale.ticks(5);
      const yGridLines = g.selectAll(".y-grid")
        .data(yTicks)
        .enter().append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d));
      
      // Line generator
      const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.value))
        .curve(d3.curveLinear);
      
      // Draw line
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
      
      // Function to show hover tooltip and line
      function showHover(event, d) {
        // Show tooltip with only production value
        tooltip.transition()
          .duration(100)
          .style("opacity", 1);
        
        tooltip.html(labelClean(d.value))
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .attr("class", "plot-history-production-tooltip visible");
        
        // Show vertical line from x-axis to point
        const xPos = xScale(d.year);
        const yPos = yScale(d.value);
        hoverLine
          .attr("x1", xPos)
          .attr("x2", xPos)
          .attr("y1", height)
          .attr("y2", yPos)
          .transition()
          .duration(100)
          .style("opacity", 1);
        
        // Show year label on x-axis
        hoverYearLabel
          .attr("x", xPos)
          .text(String(d.year))
          .transition()
          .duration(100)
          .style("opacity", 1);
        
        // Hide any always-visible year labels that are close to the hover year
        // Threshold: if hover year is within 4 years of a break year, hide that label
        const proximityThreshold = 4;
        xAxisTickLabels.each(function() {
          const tickLabel = d3.select(this);
          const tickYear = parseInt(tickLabel.text());
          if (Math.abs(d.year - tickYear) <= proximityThreshold) {
            tickLabel.transition().duration(100).style("opacity", 0);
          }
        });
      }
      
      // Function to hide hover tooltip and line
      function hideHover() {
        // Hide tooltip
        tooltip.transition()
          .duration(100)
          .style("opacity", 0)
          .attr("class", "plot-history-production-tooltip");
        
        // Hide vertical line
        hoverLine.transition()
          .duration(100)
          .style("opacity", 0);
        
        // Hide year label on x-axis
        hoverYearLabel.transition()
          .duration(100)
          .style("opacity", 0);
        
        // Show all always-visible year labels again
        xAxisTickLabels.transition()
          .duration(100)
          .style("opacity", 1);
      }
      
      // Create invisible hover rectangles from each point down to x-axis
      // These allow hovering anywhere below a point to trigger the tooltip
      const hoverRects = g.selectAll(".hover-rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "hover-rect")
        .attr("x", d => xScale(d.year) - 10)
        .attr("y", d => yScale(d.value))
        .attr("width", 20)
        .attr("height", d => height - yScale(d.value))
        .style("fill", "transparent")
        .style("cursor", "pointer")
        .on("mouseover", showHover)
        .on("mouseout", hideHover);
      
      // Draw points
      const points = g.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.value))
        .attr("r", 1.5)
        .style("cursor", "pointer")
        .on("mouseover", showHover)
        .on("mouseout", hideHover);
      
      // X axis (no comma formatting)
      const xAxis = d3.axisBottom(xScale)
        .tickValues(xAxisBreaks)
        .tickSize(0)
        .tickPadding(8)
        .tickFormat(d => String(d));
      
      const xAxisGroup = g.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      
      // Store reference to x-axis tick labels for hiding when hover gets close
      const xAxisTickLabels = xAxisGroup.selectAll(".tick text");
      
      // Create hover year label matching D3 axis tick label positioning exactly
      // D3 axisBottom tick labels have: y = tickPadding (8), dy = 0.71em, text-anchor = middle
      hoverYearLabel = xAxisGroup.append("text")
        .attr("class", "hover-year-label")
        .attr("x", 0)
        .attr("y", 8)
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("opacity", 0);
      
      // Y axis
      const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(0)
        .tickPadding(8)
        .tickFormat(d => labelClean(d));
      
      g.append("g")
        .attr("class", "axis")
        .call(yAxis);
      
      // Title
      g.append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "start")
        .text("Total Major Crop Production in Canada");
      
      // X axis label
      g.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Year");
      
      // Y axis label
      g.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Production (metric tonnes)");
      
      // Caption
      g.append("text")
        .attr("class", "caption")
        .attr("x", width)
        .attr("y", height + 40)
        .attr("text-anchor", "end")
        .text("Data from Statistics Canada, Table 32-10-0359");
    })
    .catch(function(error) {
      console.error("Error loading production data:", error);
    });
}

// Area History Chart
function initAreaChart() {
  const baseUrl = import.meta.env.BASE_URL;
  
  // Wait for D3.js to load and container to exist
  if (typeof d3 === "undefined") {
    console.error("D3.js is not loaded. Please ensure d3.min.js is available.");
    return;
  }
  
  const container = document.getElementById("plot-history-area-container");
  if (!container) {
    console.error("Container #plot-history-area-container not found");
    return;
  }
  
  // Skip if chart already exists
  if (container.querySelector("svg")) {
    return;
  }
  
  d3.json(baseUrl + "data/grain_area_by_year.json")
    .then(function(jsonData) {
      const data = jsonData.data;
      const xAxisBreaks = jsonData.xAxisBreaks;
      
      // LabelClean function (replicates R function)
      function labelClean(value) {
        if (!isFinite(value) || isNaN(value)) return "";
        
        const absValue = Math.abs(value);
        let suffix = "";
        let scale = 1;
        
        if (absValue >= 1e9) {
          suffix = "B";
          scale = 1e9;
        } else if (absValue >= 1e6) {
          suffix = "M";
          scale = 1e6;
        } else if (absValue >= 1e3) {
          suffix = "K";
          scale = 1e3;
        }
        
        const scaled = value / scale;
        let txt = scaled.toFixed(1);
        txt = txt.replace(/\.0$/, "");
        
        return txt + suffix;
      }
      
      // Set dimensions and margins - make responsive
      const margin = {top: 40, right: 20, bottom: 50, left: 80};
      const containerWidth = container.clientWidth || 960;
      const maxWidth = 960;
      const width = Math.min(containerWidth - margin.left - margin.right, maxWidth - margin.left - margin.right);
      const height = 576 - margin.top - margin.bottom;
      
      // Create SVG
      const svg = d3.select("#plot-history-area-container")
        .append("svg")
        .attr("id", "plot-history-area")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("max-width", "100%")
        .style("height", "auto");
      
      const g = svg.append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      
      // Create tooltip
      const tooltip = d3.select("body").append("div")
        .attr("class", "plot-history-area-tooltip")
        .style("opacity", 0);
      
      // Create hover line
      const hoverLine = g.append("line")
        .attr("class", "hover-line")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", 0)
        .attr("y2", height);
      
      // Create hover year label (will be added to x-axis group after axis is created)
      let hoverYearLabel;
      
      // Scales
      const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.year))
        .range([0, width]);
      
      const yScale = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.value)])
        .nice()
        .range([height, 0]);
      
      // Grid lines
      const xGridLines = g.selectAll(".x-grid")
        .data(xAxisBreaks)
        .enter().append("line")
        .attr("class", "grid-line")
        .attr("x1", d => xScale(d))
        .attr("x2", d => xScale(d))
        .attr("y1", 0)
        .attr("y2", height);
      
      const yTicks = yScale.ticks(5);
      const yGridLines = g.selectAll(".y-grid")
        .data(yTicks)
        .enter().append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d));
      
      // Line generator
      const line = d3.line()
        .x(d => xScale(d.year))
        .y(d => yScale(d.value))
        .curve(d3.curveLinear);
      
      // Draw line
      g.append("path")
        .datum(data)
        .attr("class", "line")
        .attr("d", line);
      
      // Store reference to x-axis tick labels for hiding when hover gets close
      let xAxisTickLabels;
      
      // Function to show hover tooltip and line
      function showHover(event, d) {
        // Show tooltip with only area value
        tooltip.transition()
          .duration(100)
          .style("opacity", 1);
        
        tooltip.html(labelClean(d.value))
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 10) + "px")
          .attr("class", "plot-history-area-tooltip visible");
        
        // Show vertical line from x-axis to point
        const xPos = xScale(d.year);
        const yPos = yScale(d.value);
        hoverLine
          .attr("x1", xPos)
          .attr("x2", xPos)
          .attr("y1", height)
          .attr("y2", yPos)
          .transition()
          .duration(100)
          .style("opacity", 1);
        
        // Show year label on x-axis
        hoverYearLabel
          .attr("x", xPos)
          .text(String(d.year))
          .transition()
          .duration(100)
          .style("opacity", 1);
        
        // Hide any always-visible year labels that are close to the hover year
        // Threshold: if hover year is within 4 years of a break year, hide that label
        const proximityThreshold = 4;
        xAxisTickLabels.each(function() {
          const tickLabel = d3.select(this);
          const tickYear = parseInt(tickLabel.text());
          if (Math.abs(d.year - tickYear) <= proximityThreshold) {
            tickLabel.transition().duration(100).style("opacity", 0);
          }
        });
      }
      
      // Function to hide hover tooltip and line
      function hideHover() {
        // Hide tooltip
        tooltip.transition()
          .duration(100)
          .style("opacity", 0)
          .attr("class", "plot-history-area-tooltip");
        
        // Hide vertical line
        hoverLine.transition()
          .duration(100)
          .style("opacity", 0);
        
        // Hide year label on x-axis
        hoverYearLabel.transition()
          .duration(100)
          .style("opacity", 0);
        
        // Show all always-visible year labels again
        xAxisTickLabels.transition()
          .duration(100)
          .style("opacity", 1);
      }
      
      // Create invisible hover rectangles from each point down to x-axis
      // These allow hovering anywhere below a point to trigger the tooltip
      const hoverRects = g.selectAll(".hover-rect")
        .data(data)
        .enter().append("rect")
        .attr("class", "hover-rect")
        .attr("x", d => xScale(d.year) - 10)
        .attr("y", d => yScale(d.value))
        .attr("width", 20)
        .attr("height", d => height - yScale(d.value))
        .style("fill", "transparent")
        .style("cursor", "pointer")
        .on("mouseover", showHover)
        .on("mouseout", hideHover);
      
      // Draw points
      const points = g.selectAll(".point")
        .data(data)
        .enter().append("circle")
        .attr("class", "point")
        .attr("cx", d => xScale(d.year))
        .attr("cy", d => yScale(d.value))
        .attr("r", 1.5)
        .style("cursor", "pointer")
        .on("mouseover", showHover)
        .on("mouseout", hideHover);
      
      // X axis (no comma formatting)
      const xAxis = d3.axisBottom(xScale)
        .tickValues(xAxisBreaks)
        .tickSize(0)
        .tickPadding(8)
        .tickFormat(d => String(d));
      
      const xAxisGroup = g.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);
      
      // Store reference to x-axis tick labels for hiding when hover gets close
      xAxisTickLabels = xAxisGroup.selectAll(".tick text");
      
      // Create hover year label matching D3 axis tick label positioning exactly
      // D3 axisBottom tick labels have: y = tickPadding (8), dy = 0.71em, text-anchor = middle
      hoverYearLabel = xAxisGroup.append("text")
        .attr("class", "hover-year-label")
        .attr("x", 0)
        .attr("y", 8)
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("opacity", 0);
      
      // Y axis
      const yAxis = d3.axisLeft(yScale)
        .ticks(5)
        .tickSize(0)
        .tickPadding(8)
        .tickFormat(d => labelClean(d));
      
      g.append("g")
        .attr("class", "axis")
        .call(yAxis);
      
      // Title
      g.append("text")
        .attr("class", "title")
        .attr("x", 0)
        .attr("y", -20)
        .attr("text-anchor", "start")
        .text("Total Seeded Area for Major Crops in Canada");
      
      // X axis label
      g.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Year");
      
      // Y axis label
      g.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -50)
        .attr("text-anchor", "middle")
        .text("Seeded area (hectares)");
      
      // Caption
      g.append("text")
        .attr("class", "caption")
        .attr("x", width)
        .attr("y", height + 40)
        .attr("text-anchor", "end")
        .text("Data from Statistics Canada, Table 32-10-0359");
    })
    .catch(function(error) {
      console.error("Error loading area data:", error);
    });
}

// Crop Components Chart
function initCropComponentsChart() {
  const baseUrl = import.meta.env.BASE_URL;
  
  if (typeof d3 === "undefined") {
    console.error("D3.js is not loaded.");
    return;
  }
  
  const container = document.getElementById("plot-history-by-crop-container");
  if (!container) {
    console.error("Container #plot-history-by-crop-container not found");
    return;
  }
  
  // Skip if chart already exists
  if (container.querySelector("svg")) {
    return;
  }
  
  d3.json(baseUrl + "data/grain_crop_components.json")
    .then(function(jsonData) {
      const rawData = jsonData.data;
      const crops = jsonData.crops;
      const xAxisBreaks = jsonData.xAxisBreaks;
      const measureColours = jsonData.measureColours;
      const measures = ["Effective yield (t/ha seeded)", "Seeded area (hectares)", "Production (tonnes)"];
      
      // LabelClean function
      function labelClean(value) {
        if (!isFinite(value) || isNaN(value)) return "";
        const absValue = Math.abs(value);
        let suffix = "";
        let scale = 1;
        if (absValue >= 1e9) { suffix = "B"; scale = 1e9; }
        else if (absValue >= 1e6) { suffix = "M"; scale = 1e6; }
        else if (absValue >= 1e3) { suffix = "K"; scale = 1e3; }
        const scaled = value / scale;
        let txt = scaled.toFixed(1);
        txt = txt.replace(/\.0$/, "");
        return txt + suffix;
      }
      
      // Organize data by crop and measure
      const dataMap = {};
      crops.forEach(crop => {
        dataMap[crop] = {};
        measures.forEach(measure => {
          dataMap[crop][measure] = rawData
            .filter(d => d.crop === crop && d.measure === measure)
            .sort((a, b) => a.year - b.year);
        });
      });
      
      // Global year extent (shared across all panels so data gaps are visible)
      const globalYearExtent = d3.extent(rawData, d => d.year);
      
      // Dimensions - fixed layout based on panel sizes
      const margin = {top: 100, right: 20, bottom: 50, left: 10};
      const panelWidth = 250;
      const panelHeight = 120;
      const panelGapX = 40;
      const panelGapY = 50;
      const yAxisWidth = 60;
      
      // Calculate required width based on fixed panel layout
      const requiredWidth = margin.left + yAxisWidth + 3 * panelWidth + 2 * panelGapX + margin.right;
      
      const numCrops = crops.length;
      const totalHeight = margin.top + numCrops * (panelHeight + panelGapY) + margin.bottom;
      
      // Create SVG - use fixed width to maintain aspect ratio
      const svg = d3.select("#plot-history-by-crop-container")
        .append("svg")
        .attr("width", requiredWidth)
        .attr("height", totalHeight)
        .attr("viewBox", `0 0 ${requiredWidth} ${totalHeight}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("max-width", "100%")
        .style("height", "auto")
        .style("background-color", "transparent");
      
      // Title and subtitle
      svg.append("text")
        .attr("class", "main-title")
        .attr("x", margin.left + yAxisWidth)
        .attr("y", 25)
        .text("Production Components by Crop");
      
      svg.append("text")
        .attr("class", "subtitle")
        .attr("x", margin.left + yAxisWidth)
        .attr("y", 42)
        .text("Production, seeded area, and effective yield for each major crop");
      
      // Store panel references for linked hover
      const panelRefs = {};
      
      // Create panels
      crops.forEach((crop, cropIndex) => {
        panelRefs[crop] = {};
        
        // Add crop name once per row, right-justified above the row
        const rowY = margin.top + cropIndex * (panelHeight + panelGapY);
        const rowRightX = requiredWidth - margin.right;
        
        svg.append("text")
          .attr("class", "crop-name")
          .attr("x", rowRightX)
          .attr("y", rowY - 20)
          .attr("text-anchor", "end")
          .style("font-size", "11px")
          .style("font-weight", "bold")
          .text(crop);
        
        measures.forEach((measure, measureIndex) => {
          const panelData = dataMap[crop][measure];
          if (panelData.length === 0) return;
          
          const colour = measureColours[measure];
          
          // Panel position
          const panelX = margin.left + yAxisWidth + measureIndex * (panelWidth + panelGapX);
          const panelY = margin.top + cropIndex * (panelHeight + panelGapY);
          
          // Create panel group
          const panel = svg.append("g")
            .attr("transform", "translate(" + panelX + "," + panelY + ")");
          
          // Scales
          // Use global year extent so all panels share the same x-axis scale
          // This makes gaps in data visible (e.g., crops that start later)
          const xScale = d3.scaleLinear()
            .domain(globalYearExtent)
            .range([0, panelWidth]);
          
          const yScale = d3.scaleLinear()
            .domain([0, d3.max(panelData, d => d.value)])
            .nice()
            .range([panelHeight, 0]);
          
          // Grid lines (y only)
          const yTicks = yScale.ticks(4);
          panel.selectAll(".y-grid")
            .data(yTicks)
            .enter().append("line")
            .attr("class", "grid-line")
            .attr("x1", 0)
            .attr("x2", panelWidth)
            .attr("y1", d => yScale(d))
            .attr("y2", d => yScale(d));
          
          // Measure label above plot, left-aligned with plot edge, grey text
          panel.append("text")
            .attr("class", "panel-title")
            .attr("x", 0)
            .attr("y", -8)
            .attr("text-anchor", "start")
            .text(measure);
          
          // Line generator
          const line = d3.line()
            .x(d => xScale(d.year))
            .y(d => yScale(d.value))
            .curve(d3.curveLinear);
          
          // Draw line
          panel.append("path")
            .datum(panelData)
            .attr("class", "panel-line")
            .attr("d", line)
            .style("stroke", colour);
          
          // Draw points
          panel.selectAll(".panel-point")
            .data(panelData)
            .enter().append("circle")
            .attr("class", "panel-point")
            .attr("cx", d => xScale(d.year))
            .attr("cy", d => yScale(d.value))
            .attr("r", 0.8)
            .style("fill", colour)
            .style("stroke", colour);
          
          // Hover line
          const hoverLine = panel.append("line")
            .attr("class", "hover-line")
            .attr("x1", 0)
            .attr("x2", 0)
            .attr("y1", 0)
            .attr("y2", panelHeight);
          
          // Y axis (left side)
          const yAxis = d3.axisLeft(yScale)
            .ticks(4)
            .tickSize(0)
            .tickPadding(3)
            .tickFormat(d => labelClean(d));
          
          const yAxisGroup = panel.append("g")
            .attr("class", "axis y-axis")
            .call(yAxis);
          
          // Store reference to y-axis tick labels for hiding when hover gets close
          const yAxisTickLabels = yAxisGroup.selectAll(".tick text");
          
          // X axis (bottom, only for last crop row - with permanent labels)
          let xAxisTickLabels = null;
          if (cropIndex === crops.length - 1) {
            const xAxis = d3.axisBottom(xScale)
              .tickValues(xAxisBreaks)
              .tickSize(0)
              .tickPadding(5)
              .tickFormat(d => String(d));
            
            const xAxisGroup = panel.append("g")
              .attr("class", "axis x-axis")
              .attr("transform", "translate(0," + panelHeight + ")")
              .call(xAxis);
            
            xAxisTickLabels = xAxisGroup.selectAll(".tick text");
          }
          
          // Hover year label at bottom of each panel (for all rows, not just bottom)
          const hoverYearLabel = panel.append("text")
            .attr("class", "hover-year-label")
            .attr("x", 0)
            .attr("y", panelHeight + 5)
            .attr("dy", "0.71em")
            .attr("text-anchor", "middle")
            .style("font-size", "9px")
            .style("opacity", 0);
          
          // Hover value label on y-axis (shows the data value)
          // Positioned to match D3 axisLeft tick labels: x = -tickPadding (3), dy for vertical centering
          const hoverValueLabel = panel.append("text")
            .attr("class", "hover-value-label")
            .attr("x", -3)
            .attr("y", 0)
            .attr("dy", "0.32em")
            .attr("text-anchor", "end")
            .style("font-size", "9px")
            .style("opacity", 0);
          
          // Hover tick mark on y-axis (centered on the axis line)
          const hoverYTick = panel.append("line")
            .attr("class", "hover-y-tick")
            .attr("x1", -2)
            .attr("x2", 2)
            .attr("y1", 0)
            .attr("y2", 0)
            .attr("stroke-width", 1)
            .style("opacity", 0);
          
          // Store panel references
          panelRefs[crop][measure] = {
            panel: panel,
            xScale: xScale,
            yScale: yScale,
            hoverLine: hoverLine,
            xAxisTickLabels: xAxisTickLabels,
            yAxisTickLabels: yAxisTickLabels,
            hoverYearLabel: hoverYearLabel,
            hoverValueLabel: hoverValueLabel,
            hoverYTick: hoverYTick,
            data: panelData,
            colour: colour
          };
          
          // Invisible hover rectangles for the panel
          panel.selectAll(".hover-rect")
            .data(panelData)
            .enter().append("rect")
            .attr("class", "hover-rect")
            .attr("x", d => xScale(d.year) - 5)
            .attr("y", d => yScale(d.value))
            .attr("width", 10)
            .attr("height", d => panelHeight - yScale(d.value))
            .style("fill", "transparent")
            .style("cursor", "pointer")
            .on("mouseover", function(event, d) { showLinkedHover(event, d, crop); })
            .on("mouseout", function() { hideLinkedHover(crop); });
        });
      });
      
      // Linked hover functions
      function showLinkedHover(event, d, crop) {
        const year = d.year;
        
        measures.forEach(measure => {
          const ref = panelRefs[crop][measure];
          if (!ref) return;
          
          // Find data point for this year
          const dataPoint = ref.data.find(p => p.year === year);
          if (!dataPoint) return;
          
          const xPos = ref.xScale(year);
          const yPos = ref.yScale(dataPoint.value);
          
          // Show value label on y-axis
          ref.hoverValueLabel
            .attr("y", yPos)
            .text(labelClean(dataPoint.value))
            .transition()
            .duration(100)
            .style("opacity", 1);
          
          // Show tick mark on y-axis (centered on axis line)
          ref.hoverYTick
            .attr("y1", yPos)
            .attr("y2", yPos)
            .transition()
            .duration(100)
            .style("opacity", 1);
          
          // Show hover line from x-axis to point
          ref.hoverLine
            .attr("x1", xPos)
            .attr("x2", xPos)
            .attr("y1", panelHeight)
            .attr("y2", yPos)
            .transition()
            .duration(100)
            .style("opacity", 1);
          
          // Show year label below each panel in the hovered row
          ref.hoverYearLabel
            .attr("x", xPos)
            .text(String(year))
            .transition()
            .duration(100)
            .style("opacity", 1);
          
          // Hide nearby permanent x-axis labels (only exists on bottom row)
          if (ref.xAxisTickLabels) {
            const xProximityThreshold = 10;
            ref.xAxisTickLabels.each(function() {
              const tickLabel = d3.select(this);
              const tickYear = parseInt(tickLabel.text());
              if (Math.abs(year - tickYear) <= xProximityThreshold) {
                tickLabel.transition().duration(100).style("opacity", 0);
              }
            });
          }
          
          // Hide nearby permanent y-axis labels (based on pixel distance)
          const yProximityThreshold = 15; // pixels
          ref.yAxisTickLabels.each(function() {
            const tickLabel = d3.select(this);
            // Get the y position of this tick label from its parent transform
            const tickTransform = d3.select(this.parentNode).attr("transform");
            const tickY = parseFloat(tickTransform.match(/translate\(0,([^)]+)\)/)[1]);
            if (Math.abs(yPos - tickY) <= yProximityThreshold) {
              tickLabel.transition().duration(100).style("opacity", 0);
            }
          });
        });
      }
      
      function hideLinkedHover(crop) {
        measures.forEach(measure => {
          const ref = panelRefs[crop][measure];
          if (!ref) return;
          
          // Hide value label on y-axis
          ref.hoverValueLabel
            .transition()
            .duration(100)
            .style("opacity", 0);
          
          // Hide tick mark on y-axis
          ref.hoverYTick
            .transition()
            .duration(100)
            .style("opacity", 0);
          
          // Hide hover line
          ref.hoverLine
            .transition()
            .duration(100)
            .style("opacity", 0);
          
          // Hide year label below each panel
          ref.hoverYearLabel
            .transition()
            .duration(100)
            .style("opacity", 0);
          
          // Show all permanent x-axis labels again (only exists on bottom row)
          if (ref.xAxisTickLabels) {
            ref.xAxisTickLabels
              .transition()
              .duration(100)
              .style("opacity", 1);
          }
          
          // Show all permanent y-axis labels again
          ref.yAxisTickLabels
            .transition()
            .duration(100)
            .style("opacity", 1);
        });
        
        // If a year is selected, restore it after hover ends
        if (selectedYear !== null) {
          setTimeout(() => {
            showYearSelector(selectedYear);
          }, 150);
        }
      }
      
      // Year selector functionality
      let selectedYear = null;
      
      // Function to show year across all panels for all crops
      function showYearSelector(year) {
        selectedYear = year;
        
        crops.forEach(crop => {
          measures.forEach(measure => {
            const ref = panelRefs[crop][measure];
            if (!ref) return;
            
            // Find data point for this year
            const dataPoint = ref.data.find(p => p.year === year);
            if (!dataPoint) {
              // Hide elements if no data for this year
              ref.hoverValueLabel.style("opacity", 0);
              ref.hoverYTick.style("opacity", 0);
              ref.hoverLine.style("opacity", 0);
              ref.hoverYearLabel.style("opacity", 0);
              return;
            }
            
            const xPos = ref.xScale(year);
            const yPos = ref.yScale(dataPoint.value);
            
            // Show value label on y-axis
            ref.hoverValueLabel
              .attr("y", yPos)
              .text(labelClean(dataPoint.value))
              .transition()
              .duration(100)
              .style("opacity", 1);
            
            // Show tick mark on y-axis
            ref.hoverYTick
              .attr("y1", yPos)
              .attr("y2", yPos)
              .transition()
              .duration(100)
              .style("opacity", 1);
            
            // Show hover line from x-axis to point
            ref.hoverLine
              .attr("x1", xPos)
              .attr("x2", xPos)
              .attr("y1", panelHeight)
              .attr("y2", yPos)
              .transition()
              .duration(100)
              .style("opacity", 1);
            
            // Show year label below each panel
            ref.hoverYearLabel
              .attr("x", xPos)
              .text(String(year))
              .transition()
              .duration(100)
              .style("opacity", 1);
            
            // Hide nearby permanent x-axis labels (only exists on bottom row)
            if (ref.xAxisTickLabels) {
              const xProximityThreshold = 10;
              ref.xAxisTickLabels.each(function() {
                const tickLabel = d3.select(this);
                const tickYear = parseInt(tickLabel.text());
                if (Math.abs(year - tickYear) <= xProximityThreshold) {
                  tickLabel.transition().duration(100).style("opacity", 0);
                }
              });
            }
            
            // Hide nearby permanent y-axis labels
            const yProximityThreshold = 15;
            ref.yAxisTickLabels.each(function() {
              const tickLabel = d3.select(this);
              const tickTransform = d3.select(this.parentNode).attr("transform");
              const tickY = parseFloat(tickTransform.match(/translate\(0,([^)]+)\)/)[1]);
              if (Math.abs(yPos - tickY) <= yProximityThreshold) {
                tickLabel.transition().duration(100).style("opacity", 0);
              }
            });
          });
        });
      }
      
      // Function to hide year selector display
      function hideYearSelector() {
        selectedYear = null;
        
        crops.forEach(crop => {
          measures.forEach(measure => {
            const ref = panelRefs[crop][measure];
            if (!ref) return;
            
            // Hide value label on y-axis
            ref.hoverValueLabel
              .transition()
              .duration(100)
              .style("opacity", 0);
            
            // Hide tick mark on y-axis
            ref.hoverYTick
              .transition()
              .duration(100)
              .style("opacity", 0);
            
            // Hide hover line
            ref.hoverLine
              .transition()
              .duration(100)
              .style("opacity", 0);
            
            // Hide year label below each panel
            ref.hoverYearLabel
              .transition()
              .duration(100)
              .style("opacity", 0);
            
            // Show all permanent x-axis labels again (only exists on bottom row)
            if (ref.xAxisTickLabels) {
              ref.xAxisTickLabels
                .transition()
                .duration(100)
                .style("opacity", 1);
            }
            
            // Show all permanent y-axis labels again
            ref.yAxisTickLabels
              .transition()
              .duration(100)
              .style("opacity", 1);
          });
        });
      }
      
      // Create year selector UI
      // Make the container position relative for absolute positioning
      d3.select("#plot-history-by-crop-container")
        .style("position", "relative");
      
      const yearSelectorContainer = d3.select("#plot-history-by-crop-container")
        .append("div")
        .attr("class", "year-selector-container")
        .style("position", "absolute")
        .style("top", "0")
        .style("left", "0")
        .style("width", "100%")
        .style("height", "100%")
        .style("pointer-events", "none")
        .style("z-index", "10");
      
      // Button container for "Pick year" and "Clear" buttons
      const buttonContainer = yearSelectorContainer
        .append("div")
        .style("position", "absolute")
        .style("top", "10px")
        .style("right", "10px")
        .style("display", "flex")
        .style("gap", "8px")
        .style("pointer-events", "all");
      
      // "Pick year" button in top right (positioned relative to SVG top-right)
      const pickYearButton = buttonContainer
        .append("button")
        .attr("class", "pick-year-button")
        .style("padding", "6px 12px")
        .style("background", "rgba(139, 195, 74, 0.1)")
        .style("border", "1px solid rgba(139, 195, 74, 0.5)")
        .style("border-radius", "4px")
        .style("color", "var(--text-primary)")
        .style("cursor", "pointer")
        .style("font-size", "12px")
        .style("font-family", "inherit")
        .text("Pick year")
        .on("click", function(event) {
          event.stopPropagation();
          const isVisible = yearSelectorWindow.style("display") !== "none";
          yearSelectorWindow.style("display", isVisible ? "none" : "block");
          if (!isVisible && selectedYear) {
            yearInput.node().value = selectedYear;
            yearSlider.property("value", selectedYear);
          }
        });
      
      // Clear button (X) next to Pick year button
      const clearYearButton = buttonContainer
        .append("button")
        .attr("class", "clear-year-button")
        .style("padding", "6px 10px")
        .style("background", "rgba(139, 195, 74, 0.1)")
        .style("border", "1px solid rgba(139, 195, 74, 0.5)")
        .style("border-radius", "4px")
        .style("color", "var(--text-primary)")
        .style("cursor", "pointer")
        .style("font-size", "14px")
        .style("font-family", "inherit")
        .style("line-height", "1")
        .style("width", "28px")
        .style("height", "28px")
        .style("display", "flex")
        .style("align-items", "center")
        .style("justify-content", "center")
        .text("×")
        .on("click", function(event) {
          event.stopPropagation();
          hideYearSelector();
          yearInput.node().value = "";
          yearSelectorWindow.style("display", "none");
        });
      
      // Year selector window (positioned to the left of button)
      const yearSelectorWindow = yearSelectorContainer
        .append("div")
        .attr("class", "year-selector-window")
        .style("position", "absolute")
        .style("top", "10px")
        .style("right", "120px")
        .style("background", "var(--bg-card)")
        .style("border", "1px solid var(--border-subtle)")
        .style("border-radius", "8px")
        .style("padding", "15px")
        .style("padding-top", "12px")
        .style("min-width", "250px")
        .style("box-shadow", "var(--shadow-card)")
        .style("z-index", "1000")
        .style("display", "none")
        .style("pointer-events", "all");
      
      // Year slider (create first so input can reference it)
      const sliderContainer = yearSelectorWindow
        .append("div")
        .style("margin-top", "0");
      
      const sliderLabels = sliderContainer
        .append("div")
        .style("display", "flex")
        .style("justify-content", "space-between")
        .style("margin-bottom", "5px")
        .style("font-size", "11px")
        .style("color", "var(--text-secondary)");
      
      sliderLabels.append("span").text(globalYearExtent[0]);
      sliderLabels.append("span").text(globalYearExtent[1]);
      
      const yearSlider = sliderContainer
        .append("input")
        .attr("type", "range")
        .attr("class", "year-slider")
        .attr("min", globalYearExtent[0])
        .attr("max", globalYearExtent[1])
        .attr("step", "1")
        .style("width", "100%")
        .style("cursor", "pointer");
      
      // Input and slider container
      const inputContainer = yearSelectorWindow
        .append("div")
        .style("display", "flex")
        .style("align-items", "center")
        .style("gap", "10px")
        .style("margin-bottom", "8px");
      
      // Year input field
      const yearInput = inputContainer
        .append("input")
        .attr("type", "text")
        .attr("class", "year-input")
        .attr("placeholder", "____")
        .style("flex", "1")
        .style("padding", "6px 8px")
        .style("background", "var(--bg-dark)")
        .style("border", "1px solid var(--border-subtle)")
        .style("border-radius", "4px")
        .style("color", "var(--text-primary)")
        .style("font-size", "14px")
        .style("font-family", "inherit")
        .style("text-align", "center")
        .style("letter-spacing", "0.1em")
        .on("input", function() {
          const value = parseInt(this.value);
          if (!isNaN(value) && value >= globalYearExtent[0] && value <= globalYearExtent[1]) {
            yearSlider.property("value", value);
            showYearSelector(value);
          }
        })
        .on("blur", function() {
          const value = parseInt(this.value);
          if (isNaN(value) || value < globalYearExtent[0] || value > globalYearExtent[1]) {
            if (selectedYear) {
              this.value = selectedYear;
            } else {
              this.value = "";
            }
          }
        });
      
      // Update input when year is selected via slider
      yearSlider.on("input", function() {
        const value = parseInt(this.value);
        yearInput.node().value = value;
        showYearSelector(value);
      });
      
      
      // Hide year selector when clicking outside
      d3.select("body").on("click.year-selector", function(event) {
        if (!yearSelectorContainer.node().contains(event.target)) {
          yearSelectorWindow.style("display", "none");
        }
      });
      
      // Prevent closing when clicking inside the window
      yearSelectorWindow.on("click", function(event) {
        event.stopPropagation();
      });
      
      // Caption
      svg.append("text")
        .attr("class", "caption")
        .attr("x", requiredWidth - margin.right)
        .attr("y", totalHeight - 15)
        .attr("text-anchor", "end")
        .text("Data from Statistics Canada, Table 32-10-0359");
      
      // X-axis label
      svg.append("text")
        .attr("class", "axis-label")
        .attr("x", margin.left + yAxisWidth + (3 * panelWidth + 2 * panelGapX) / 2)
        .attr("y", totalHeight - 15)
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .text("Year");
    })
    .catch(function(error) {
      console.error("Error loading crop components data:", error);
    });
}

// Cumulative Decomposition Chart
function initCumulativeChart() {
  const baseUrl = import.meta.env.BASE_URL;
  
  if (typeof d3 === "undefined") {
    console.error("D3.js is not loaded.");
    return;
  }
  
  const container = document.getElementById("plot-cumulative-container");
  if (!container) {
    console.error("Container #plot-cumulative-container not found");
    return;
  }
  
  // Skip if chart already exists
  if (container.querySelector("svg")) {
    return;
  }
  
  d3.json(baseUrl + "data/grain_decomposition.json")
    .then(function(jsonData) {
      const cumulativeData = jsonData.cumulativeData;
      const connectingSegments = jsonData.connectingSegments;
      const componentConnectors = jsonData.componentConnectors;
      const xAxisBreaks = jsonData.xAxisBreaks;
      const colours = jsonData.colours;
      const uniqueYears = jsonData.uniqueYears;
      
      // Set dimensions and margins - make responsive
      const margin = {top: 60, right: 20, bottom: 50, left: 80};
      const containerWidth = container.clientWidth || 960;
      const maxWidth = 960;
      const width = Math.min(containerWidth - margin.left - margin.right, maxWidth - margin.left - margin.right);
      const height = 500 - margin.top - margin.bottom;
      
      // Create SVG
      const svgContainer = d3.select("#plot-cumulative-container")
        .append("svg")
        .attr("id", "plot-cumulative")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .attr("viewBox", `0 0 ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
        .attr("preserveAspectRatio", "xMidYMid meet")
        .style("max-width", "100%")
        .style("height", "auto");
      
      const svg = svgContainer.append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);
      
      // Create scales
      const xExtent = d3.extent(cumulativeData, d => d.xPosition);
      const xScale = d3.scaleLinear()
        .domain([xExtent[0] - 1, xExtent[1] + 1])
        .range([0, width]);
      
      const yExtent = d3.extent(cumulativeData.flatMap(d => [d.cumulativeStart, d.cumulativeEnd]));
      const yPadding = (yExtent[1] - yExtent[0]) * 0.05;
      const yScale = d3.scaleLinear()
        .domain([Math.min(yExtent[0] - yPadding, 0), yExtent[1] + yPadding])
        .range([height, 0]);
      
      // Add horizontal grid lines
      const yTicks = yScale.ticks(6);
      svg.selectAll(".grid-line")
        .data(yTicks)
        .enter()
        .append("line")
        .attr("class", "grid-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", d => yScale(d))
        .attr("y2", d => yScale(d));
      
      // Add zero line
      svg.append("line")
        .attr("class", "zero-line")
        .attr("x1", 0)
        .attr("x2", width)
        .attr("y1", yScale(0))
        .attr("y2", yScale(0))
        .attr("stroke-width", 0.5);
      
      // Add connecting segments between years
      svg.selectAll(".connecting-segment")
        .data(connectingSegments)
        .enter()
        .append("line")
        .attr("class", "connecting-segment")
        .attr("x1", d => xScale(d.year + 0.4))
        .attr("x2", d => xScale(d.yearEnd - 0.4))
        .attr("y1", d => yScale(d.yValue))
        .attr("y2", d => yScale(d.yValue))
        .attr("stroke-width", 0.5);
      
      // Add component connectors (grey lines between components within year)
      svg.selectAll(".component-connector")
        .data(componentConnectors)
        .enter()
        .append("line")
        .attr("class", "component-connector")
        .attr("x1", d => xScale(d.xStart))
        .attr("x2", d => xScale(d.xEnd))
        .attr("y1", d => yScale(d.yValue))
        .attr("y2", d => yScale(d.yValue))
        .attr("stroke-width", 0.5);
      
      // Add vertical bars for each component
      svg.selectAll(".component-bar")
        .data(cumulativeData)
        .enter()
        .append("line")
        .attr("class", "component-bar")
        .attr("x1", d => xScale(d.xPosition))
        .attr("x2", d => xScale(d.xPosition))
        .attr("y1", d => yScale(d.cumulativeStart))
        .attr("y2", d => yScale(d.cumulativeEnd))
        .attr("stroke", d => colours[d.component])
        .attr("stroke-width", 1.5);
      
      // Create x-axis
      const xAxis = d3.axisBottom(xScale)
        .tickValues(xAxisBreaks)
        .tickSize(0)
        .tickPadding(8)
        .tickFormat(d => String(d));
      
      const xAxisGroup = svg.append("g")
        .attr("class", "axis x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);
      
      // Create y-axis with percentage format
      const yAxis = d3.axisLeft(yScale)
        .ticks(6)
        .tickSize(0)
        .tickPadding(8)
        .tickFormat(d => Math.round(d * 100) + "%");
      
      const yAxisGroup = svg.append("g")
        .attr("class", "axis y-axis")
        .call(yAxis);
      
      // Add title
      svg.append("text")
        .attr("class", "title")
        .attr("x", width / 2)
        .attr("y", -35)
        .attr("text-anchor", "middle")
        .text("Cumulative Production Change Decomposition");
      
      // Add legend
      const legendItems = ["Seeded Area", "Within-Crop Effective Yield", "Crop Mix"];
      const legendSpacing = 200;
      const legendY = -15;
      
      const legend = svg.append("g")
        .attr("class", "legend")
        .attr("transform", `translate(${width / 2 - (legendItems.length * legendSpacing) / 2}, ${legendY})`);
      
      legendItems.forEach((item, i) => {
        const g = legend.append("g")
          .attr("transform", `translate(${i * legendSpacing}, 0)`);
        
        g.append("line")
          .attr("x1", 0)
          .attr("x2", 20)
          .attr("y1", 0)
          .attr("y2", 0)
          .attr("stroke", colours[item])
          .attr("stroke-width", 2);
        
        g.append("text")
          .attr("class", "legend-text")
          .attr("x", 25)
          .attr("y", 0)
          .attr("dy", "0.32em")
          .text(item);
      });
      
      // Add x-axis label
      svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height + 40)
        .attr("text-anchor", "middle")
        .text("Year");
      
      // Add y-axis label
      svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", -60)
        .attr("text-anchor", "middle")
        .text("Cumulative change from 1908");
      
      // Store reference to x-axis tick labels for hiding on hover
      const xAxisTickLabels = xAxisGroup.selectAll(".tick text");
      
      // Highlight ribbon for hovered year (spans width of components: -0.25 to +0.25 around year)
      const highlightRibbon = svg.insert("rect", ":first-child")
        .attr("class", "highlight-ribbon")
        .attr("y", 0)
        .attr("height", height)
        .style("opacity", 0);
      
      // Hover year label on x-axis
      const hoverYearLabel = xAxisGroup.append("text")
        .attr("class", "hover-year-label")
        .attr("y", 9)
        .attr("dy", "0.71em")
        .attr("text-anchor", "middle")
        .style("font-size", "11px")
        .style("opacity", 0);
      
      // Mini-window dimensions
      const miniWindowWidth = 120;
      const miniWindowHeight = 185;
      const miniWindowPadding = 10;
      const miniWindowX = 10;
      const miniWindowY = 15;
      
      // Create mini-window group (initially hidden)
      const miniWindow = svg.append("g")
        .attr("class", "mini-window")
        .attr("transform", `translate(${miniWindowX}, ${miniWindowY})`)
        .style("opacity", 0);
      
      // Mini-window background
      miniWindow.append("rect")
        .attr("class", "mini-window-bg")
        .attr("width", miniWindowWidth)
        .attr("height", miniWindowHeight)
        .attr("rx", 4)
        .attr("ry", 4);
      
      // Mini-window year title
      const miniWindowTitle = miniWindow.append("text")
        .attr("class", "mini-window-title")
        .attr("x", miniWindowWidth / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle");
      
      // Mini chart area within the window
      const miniChartX = 70;
      const miniChartY = 35;
      const miniChartWidth = 40;
      const miniChartHeight = 110;
      
      // Create mini y-scale (will be updated on hover)
      let miniYScale = d3.scaleLinear()
        .range([miniChartHeight, 0]);
      
      // Mini chart group
      const miniChart = miniWindow.append("g")
        .attr("transform", `translate(${miniChartX}, ${miniChartY})`);
      
      // Zero line for mini chart
      const miniZeroLine = miniChart.append("line")
        .attr("class", "mini-zero-line")
        .attr("x1", 0)
        .attr("x2", miniChartWidth)
        .attr("stroke-width", 0.5);
      
      // Component bars in mini chart
      const componentOrder = ["Seeded Area", "Within-Crop Effective Yield", "Crop Mix"];
      const barSpacing = miniChartWidth / 3;
      
      const miniBars = componentOrder.map((comp, i) => {
        return miniChart.append("line")
          .attr("class", "mini-bar")
          .attr("x1", (i + 0.5) * barSpacing)
          .attr("x2", (i + 0.5) * barSpacing)
          .attr("stroke", colours[comp])
          .attr("stroke-width", 4);
      });
      
      // Component connectors in mini chart
      const miniConnectors = [0, 1].map(i => {
        return miniChart.append("line")
          .attr("class", "mini-connector")
          .attr("x1", (i + 0.5) * barSpacing)
          .attr("x2", (i + 1.5) * barSpacing)
          .attr("stroke-width", 0.5);
      });
      
      // Labels for each component (on the left side)
      const labelX = miniWindowPadding;
      const labelStartY = miniChartY + 15;
      const labelSpacing = 32;
      
      const componentLabels = componentOrder.map((comp, i) => {
        const g = miniWindow.append("g")
          .attr("transform", `translate(${labelX}, ${labelStartY + i * labelSpacing})`);
        
        // Colour indicator
        g.append("rect")
          .attr("width", 8)
          .attr("height", 8)
          .attr("y", -4)
          .attr("fill", colours[comp]);
        
        // Short name
        const shortNames = {
          "Seeded Area": "Area",
          "Within-Crop Effective Yield": "Yield",
          "Crop Mix": "Mix"
        };
        
        g.append("text")
          .attr("class", "mini-window-label")
          .attr("x", 12)
          .attr("dy", "0.32em")
          .text(shortNames[comp]);
        
        // Value text (will be updated)
        const valueText = g.append("text")
          .attr("class", "mini-window-value")
          .attr("x", 12)
          .attr("y", 12)
          .attr("dy", "0.32em");
        
        return valueText;
      });
      
      // Year Net label (sum of the three components for the hovered year)
      const yearNetLabel = miniWindow.append("g")
        .attr("transform", `translate(${labelX}, ${labelStartY + 3 * labelSpacing})`);
      
      yearNetLabel.append("text")
        .attr("class", "mini-window-label")
        .attr("dy", "0.32em")
        .style("font-weight", "bold")
        .text("Year Net:");
      
      const yearNetValue = yearNetLabel.append("text")
        .attr("class", "mini-window-value")
        .attr("x", 55)
        .attr("dy", "0.32em")
        .style("font-weight", "bold");
      
      // Cumulative label (total cumulative change from base year)
      const cumulativeLabel = miniWindow.append("g")
        .attr("transform", `translate(${labelX}, ${labelStartY + 3.8 * labelSpacing})`);
      
      cumulativeLabel.append("text")
        .attr("class", "mini-window-label")
        .attr("dy", "0.32em")
        .style("font-weight", "bold")
        .text("Cumulative:");
      
      const cumulativeValue = cumulativeLabel.append("text")
        .attr("class", "mini-window-value")
        .attr("x", 70)
        .attr("dy", "0.32em")
        .style("font-weight", "bold");
      
      // Create invisible rectangles for hover detection (one per year)
      const yearWidth = xScale(uniqueYears[1]) - xScale(uniqueYears[0]);
      
      svg.selectAll(".hover-rect")
        .data(uniqueYears)
        .enter()
        .append("rect")
        .attr("class", "hover-rect")
        .attr("x", d => xScale(d) - yearWidth / 2)
        .attr("y", 0)
        .attr("width", yearWidth)
        .attr("height", height)
        .attr("fill", "transparent")
        .style("cursor", "crosshair")
        .on("mouseover", function(event, year) {
          showMiniWindow(year);
        })
        .on("mouseout", function() {
          hideMiniWindow();
        });
      
      function showMiniWindow(year) {
        // Get all component data for this year
        const yearComponents = cumulativeData.filter(d => d.year === year);
        if (yearComponents.length === 0) return;
        
        // Show highlight ribbon (spans from -0.50 to +0.50 around the year)
        const ribbonX1 = xScale(year - 0.50);
        const ribbonX2 = xScale(year + 0.50);
        highlightRibbon
          .attr("x", ribbonX1)
          .attr("width", ribbonX2 - ribbonX1)
          .style("opacity", 1);
        
        // Show year label on x-axis
        hoverYearLabel
          .attr("x", xScale(year))
          .text(year)
          .style("opacity", 1);
        
        // Hide nearby x-axis labels (within 10 years)
        const xProximityThreshold = 10;
        xAxisTickLabels.each(function() {
          const tickYear = +d3.select(this).text();
          const yearDiff = Math.abs(tickYear - year);
          if (yearDiff <= xProximityThreshold) {
            d3.select(this).style("opacity", 0);
          } else {
            d3.select(this).style("opacity", 1);
          }
        });
        
        // Update title
        miniWindowTitle.text(year);
        
        // Get data in component order
        const areaData = yearComponents.find(d => d.component === "Seeded Area");
        const yieldData = yearComponents.find(d => d.component === "Within-Crop Effective Yield");
        const mixData = yearComponents.find(d => d.component === "Crop Mix");
        
        const orderedData = [areaData, yieldData, mixData];
        
        // Calculate y-scale domain for mini chart
        const allValues = orderedData.flatMap(d => [d.cumulativeStart, d.cumulativeEnd]);
        const minVal = Math.min(0, ...allValues);
        const maxVal = Math.max(0, ...allValues);
        const padding = (maxVal - minVal) * 0.1;
        
        miniYScale.domain([minVal - padding, maxVal + padding]);
        
        // Update zero line position
        miniZeroLine
          .attr("y1", miniYScale(0))
          .attr("y2", miniYScale(0));
        
        // Update bars
        orderedData.forEach((d, i) => {
          miniBars[i]
            .attr("y1", miniYScale(d.cumulativeStart))
            .attr("y2", miniYScale(d.cumulativeEnd));
        });
        
        // Update connectors
        miniConnectors[0]
          .attr("y1", miniYScale(areaData.cumulativeEnd))
          .attr("y2", miniYScale(areaData.cumulativeEnd));
        miniConnectors[1]
          .attr("y1", miniYScale(yieldData.cumulativeEnd))
          .attr("y2", miniYScale(yieldData.cumulativeEnd));
        
        // Update value labels
        orderedData.forEach((d, i) => {
          const pct = Math.round(d.value * 100);
          const sign = pct >= 0 ? "+" : "";
          componentLabels[i].text(sign + pct + "%");
        });
        
        // Update Year Net (sum of the three component values for this year)
        const yearNetPct = Math.round((areaData.value + yieldData.value + mixData.value) * 100);
        const yearNetSign = yearNetPct >= 0 ? "+" : "";
        yearNetValue.text(yearNetSign + yearNetPct + "%");
        
        // Update Cumulative (total cumulative change from base year)
        const cumulativePct = Math.round(mixData.cumulativeEnd * 100);
        const cumulativeSign = cumulativePct >= 0 ? "+" : "";
        cumulativeValue.text(cumulativeSign + cumulativePct + "%");
        
        // Show mini window
        miniWindow.style("opacity", 1);
      }
      
      function hideMiniWindow() {
        miniWindow.style("opacity", 0);
        highlightRibbon.style("opacity", 0);
        hoverYearLabel.style("opacity", 0);
        
        // Restore all x-axis labels
        xAxisTickLabels.style("opacity", 1);
      }
    })
    .catch(function(error) {
      console.error("Error loading decomposition data:", error);
    });
}

// Export initialization functions
export function initGrainProductionCharts() {
  initProductionChart();
  initAreaChart();
  initCropComponentsChart();
  initCumulativeChart();
}
