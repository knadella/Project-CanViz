// Inflation Story Charts - D3 visualizations
// Requires D3.js to be loaded globally

let allSubcatData = null;
let weightsData = null;
let dataDateRange = { start: "2015-01", end: "2025-11" };

// Complete hierarchy definition
const HIERARCHY = {
  "Food": {
    children: {
      "Food from Stores": {
        children: {
          "Meat": {
            children: {
              "Fresh/Frozen Meat": { children: { "Beef": {}, "Pork": {} } },
              "Poultry": { children: { "Chicken": {} } },
              "Processed Meat": {}
            }
          },
          "Fish & Seafood": {},
          "Dairy & Eggs": {
            children: {
              "Dairy Products": { children: { "Fresh Milk": {}, "Butter": {}, "Cheese": {} } },
              "Eggs": {}
            }
          },
          "Bakery & Cereals": { children: { "Bakery Products": {}, "Cereal Products": {} } },
          "Fruits & Nuts": { children: { "Fresh Fruit": {}, "Preserved Fruit": {}, "Nuts & Seeds": {} } },
          "Vegetables": { children: { "Fresh Vegetables": {}, "Preserved Vegetables": {} } },
          "Other Food & Beverages": { children: { "Sugar & Candy": {}, "Coffee & Tea": {}, "Soft Drinks": {}, "Other Prepared Foods": {} } }
        }
      },
      "Restaurants": { children: { "Fast Food": {}, "Table Service": {}, "Cafeterias": {} } }
    }
  },
  "Shelter": {
    children: {
      "Rented": { children: { "Rent": {}, "Tenant Insurance": {} } },
      "Owned": { children: { "Mortgage Interest": {}, "Replacement Cost": {}, "Property Taxes": {}, "Home Insurance": {}, "Maintenance": {} } },
      "Utilities": { children: { "Electricity": {}, "Natural Gas": {}, "Water": {}, "Fuel Oil": {} } }
    }
  },
  "Transportation": {
    children: {
      "Private Transport": {
        children: {
          "Vehicle Purchase": { children: { "New/Used Vehicles": {}, "Vehicle Leasing": {} } },
          "Gasoline": {},
          "Vehicle Operation": { children: { "Parts & Repairs": {}, "Auto Insurance": {} } }
        }
      },
      "Public Transport": { children: { "Local Transit": { children: { "Bus & Subway": {} } }, "Inter-city": { children: { "Air Travel": {} } } } }
    }
  },
  "Household": {
    children: {
      "Operations": { children: { "Communications": { children: { "Phone": {} } }, "Childcare & Housekeeping": {}, "Cleaning Products": {}, "Other Services": {} } },
      "Furnishings": { children: { "Furniture": {}, "Equipment": { children: { "Appliances": {} } } } }
    }
  },
  "Clothing": { children: { "Apparel": { children: { "Women's": {}, "Men's": {}, "Children's": {} } }, "Footwear": {} } },
  "Health & Care": {
    children: {
      "Health Care": { children: { "Health Goods": { children: { "Medicines": {} } }, "Health Services": { children: { "Dental": {} } } } },
      "Personal Care": { children: { "Personal Products": {}, "Personal Services": {} } }
    }
  },
  "Recreation & Education": {
    children: {
      "Recreation": { children: { "Rec Equipment": {}, "Rec Vehicles": {}, "Home Entertainment": {}, "Travel": { children: { "Hotels": {}, "Tours": {} } }, "Other Recreation": {} } },
      "Education": { children: { "Schools": { children: { "Tuition": {} } }, "Reading": {} } }
    }
  },
  "Alcohol & Tobacco": { children: { "Alcohol": { children: { "Bars & Restaurants": {}, "Liquor Stores": {} } }, "Tobacco": {} } }
};

// Weight mapping
const WEIGHT_MAP = {
  "Food": "Food", "Shelter": "Shelter", "Transportation": "Transportation",
  "Household": "Household operations, furnishings and equipment", "Clothing": "Clothing and footwear",
  "Health & Care": "Health and personal care", "Recreation & Education": "Recreation, education and reading",
  "Alcohol & Tobacco": "Alcoholic beverages, tobacco products and recreational cannabis",
  "Food from Stores": "Food purchased from stores", "Restaurants": "Food purchased from restaurants",
  "Fast Food": "Food purchased from fast food and take-out restaurants",
  "Table Service": "Food purchased from table-service restaurants",
  "Cafeterias": "Food purchased from cafeterias and other restaurants",
  "Meat": "Meat", "Fresh/Frozen Meat": "Fresh or frozen meat (excluding poultry)",
  "Beef": "Fresh or frozen beef", "Pork": "Fresh or frozen pork",
  "Poultry": "Fresh or frozen poultry", "Chicken": "Fresh or frozen chicken",
  "Processed Meat": "Processed meat", "Fish & Seafood": "Fish, seafood and other marine products",
  "Dairy & Eggs": "Dairy products and eggs", "Dairy Products": "Dairy products",
  "Fresh Milk": "Fresh milk", "Butter": "Butter", "Cheese": "Cheese", "Eggs": "Eggs",
  "Bakery & Cereals": "Bakery and cereal products (excluding baby food)",
  "Bakery Products": "Bakery products", "Cereal Products": "Cereal products (excluding baby food)",
  "Fruits & Nuts": "Fruit, fruit preparations and nuts", "Fresh Fruit": "Fresh fruit",
  "Preserved Fruit": "Preserved fruit and fruit preparations", "Nuts & Seeds": "Nuts and seeds",
  "Vegetables": "Vegetables and vegetable preparations", "Fresh Vegetables": "Fresh vegetables",
  "Preserved Vegetables": "Preserved vegetables and vegetable preparations",
  "Other Food & Beverages": "Other food products and non-alcoholic beverages",
  "Sugar & Candy": "Sugar and confectionery", "Coffee & Tea": "Coffee and tea",
  "Soft Drinks": "Non-alcoholic beverages", "Other Prepared Foods": "Other food preparations",
  "Rented": "Rented accommodation", "Rent": "Rent", "Tenant Insurance": "Tenants' insurance premiums",
  "Owned": "Owned accommodation", "Mortgage Interest": "Mortgage interest cost",
  "Replacement Cost": "Homeowners' replacement cost", "Property Taxes": "Property taxes and other special charges",
  "Home Insurance": "Homeowners' home and mortgage insurance", "Maintenance": "Homeowners' maintenance and repairs",
  "Utilities": "Water, fuel and electricity", "Electricity": "Electricity",
  "Natural Gas": "Natural gas", "Water": "Water", "Fuel Oil": "Fuel oil and other fuels",
  "Private Transport": "Private transportation", "Vehicle Purchase": "Purchase, leasing and rental of passenger vehicles",
  "New/Used Vehicles": "Purchase of passenger vehicles", "Vehicle Leasing": "Leasing of passenger vehicles",
  "Gasoline": "Gasoline", "Vehicle Operation": "Operation of passenger vehicles",
  "Parts & Repairs": "Passenger vehicle parts, maintenance and repairs",
  "Auto Insurance": "Passenger vehicle insurance premiums", "Public Transport": "Public transportation",
  "Local Transit": "Local and commuter transportation", "Bus & Subway": "City bus and subway transportation",
  "Inter-city": "Inter-city transportation", "Air Travel": "Air transportation",
  "Operations": "Household operations", "Communications": "Communications",
  "Phone": "Telephone services", "Childcare & Housekeeping": "Child care and housekeeping services",
  "Cleaning Products": "Household cleaning products", "Other Services": "Other household goods and services",
  "Furnishings": "Household furnishings and equipment", "Furniture": "Furniture and household textiles",
  "Equipment": "Household equipment", "Appliances": "Household appliances",
  "Apparel": "Clothing", "Women's": "Women's clothing", "Men's": "Men's clothing",
  "Children's": "Children's clothing", "Footwear": "Footwear",
  "Health Care": "Health care", "Health Goods": "Health care goods",
  "Medicines": "Medicinal and pharmaceutical products", "Health Services": "Health care services",
  "Dental": "Dental care services", "Personal Care": "Personal care",
  "Personal Products": "Personal care supplies and equipment", "Personal Services": "Personal care services",
  "Recreation": "Recreation", "Rec Equipment": "Recreational equipment and services (excluding recreational vehicles)",
  "Rec Vehicles": "Purchase and operation of recreational vehicles",
  "Home Entertainment": "Home entertainment equipment, parts and services",
  "Travel": "Travel services", "Hotels": "Traveller accommodation", "Tours": "Travel tours",
  "Other Recreation": "Other cultural and recreational services",
  "Education": "Education and reading", "Schools": "Education", "Tuition": "Tuition fees",
  "Reading": "Reading material (excluding textbooks)",
  "Alcohol": "Alcoholic beverages", "Bars & Restaurants": "Alcoholic beverages served in licensed establishments",
  "Liquor Stores": "Alcoholic beverages purchased from stores", "Tobacco": "Tobacco products and smokers' supplies"
};

export function initCpiChart() {
  const d3 = window.d3;
  
  d3.json("/data/inflation_multi_series.json")
    .then(data => {
      document.getElementById("cpi-loading").style.display = "none";
      
      const parseDate = d3.utcParse("%Y-%m");
      
      const series = data.series.map(({category, data: seriesData}) => ({
        key: category,
        values: seriesData.map(d => ({
          Date: parseDate(d.date),
          value: d.value
        })).filter(d => d.Date !== null)
      }));
      
      // Calculate overall increase for the big stat
      const overallSeriesForStat = series.find(s => s.key === "Overall");
      if (overallSeriesForStat && overallSeriesForStat.values.length > 0) {
        const firstOverall = overallSeriesForStat.values[0].value;
        const lastOverall = overallSeriesForStat.values[overallSeriesForStat.values.length - 1].value;
        const overallPctIncrease = ((lastOverall - firstOverall) / firstOverall * 100).toFixed(0);
        document.getElementById("overall-increase").textContent = overallPctIncrease + "%";
      }
      
      const normalizedSeries = series.map(({key, values}) => {
        const v = values[0].value;
        return {key, values: values.map(({Date, value}) => ({Date, value: value / v}))};
      });
      
      const overallSeries = series.find(s => s.key === "Overall");
      const allDates = normalizedSeries.flatMap(s => s.values.map(d => d.Date));
      
      const width = 928;
      const height = 520;
      const marginTop = 20;
      const marginRight = 120;
      const marginBottom = 30;
      const marginLeft = 50;
      
      const x = d3.scaleUtc()
        .domain(d3.extent(allDates))
        .range([marginLeft, width - marginRight])
        .clamp(true);
      
      const k = d3.max(normalizedSeries, ({values}) => 
        d3.max(values, d => d.value) / d3.min(values, d => d.value)
      );
      
      const y = d3.scaleLog()
        .domain([1 / k, k])
        .rangeRound([height - marginBottom, marginTop]);
      
      const colors = {
        "Overall": "#94a3b8",
        "Food": "#ff6b6b",
        "Shelter": "#4ecdc4",
        "Transport": "#f9c74f",
        "Goods": "#a78bfa",
        "Services": "#fb923c"
      };
      
      const z = (key) => colors[key] || "#666";
      const bisect = d3.bisector(d => d.Date).left;
      
      const svgWidth = width + 80;
      
      const svg = d3.select("#cpi-chart")
        .attr("width", svgWidth)
        .attr("height", height)
        .attr("viewBox", [0, 0, svgWidth, height])
        .attr("style", "max-width: 100%; height: auto;");
      
      // X-Axis
      svg.append("g")
        .attr("transform", `translate(0,${height - marginBottom})`)
        .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
        .call(g => g.select(".domain").attr("stroke", "rgba(255,255,255,0.2)"))
        .call(g => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"))
        .call(g => g.selectAll(".tick text").attr("fill", "#94a3b8"));
      
      // Y-Axis
      svg.append("g")
        .attr("transform", `translate(${marginLeft},0)`)
        .call(d3.axisLeft(y).ticks(null, x => +x.toFixed(6) + "×"))
        .call(g => g.selectAll(".tick line").clone()
          .attr("stroke-opacity", d => d === 1 ? 0.3 : 0.1)
          .attr("stroke", "rgba(255,255,255,0.2)")
          .attr("x2", width - marginLeft - marginRight))
        .call(g => g.select(".domain").remove())
        .call(g => g.selectAll(".tick text").attr("fill", "#94a3b8"));
      
      const rule = svg.append("g")
        .append("line")
        .attr("y1", height)
        .attr("y2", 0)
        .attr("stroke", "rgba(255,255,255,0.5)")
        .attr("stroke-dasharray", "3,3");
      
      const annotationGroup = svg.append("g").attr("class", "annotation-group");
      const annotationBg = annotationGroup.append("rect").attr("class", "annotation-bg").attr("rx", 6)
        .attr("fill", "#111827").attr("stroke", "#4ecdc4").attr("stroke-width", 1);
      const annotationText = annotationGroup.append("text").attr("class", "annotation-text")
        .attr("fill", "#f8fafc").attr("font-size", "12px");
      
      const serie = svg.append("g")
        .style("font", "bold 10px sans-serif")
        .selectAll("g")
        .data(normalizedSeries)
        .join("g");
      
      const line = d3.line()
        .x(d => x(d.Date))
        .y(d => y(d.value));
      
      serie.append("path")
        .attr("fill", "none")
        .attr("stroke-width", 2.5)
        .attr("stroke-linejoin", "round")
        .attr("stroke-linecap", "round")
        .attr("stroke", d => z(d.key))
        .attr("d", d => line(d.values));
      
      serie.append("text")
        .datum(d => ({key: d.key, value: d.values[d.values.length - 1].value}))
        .attr("fill", d => z(d.key))
        .attr("paint-order", "stroke")
        .attr("stroke", "#111827")
        .attr("stroke-width", 4)
        .attr("x", x.range()[1] + 6)
        .attr("y", d => y(d.value))
        .attr("dy", "0.35em")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .text(d => d.key);
      
      function update(date) {
        date = d3.utcMonth.round(date);
        
        document.getElementById("cpi-subtitle").textContent = date.toLocaleString("en", {
          timeZone: "UTC",
          month: "long",
          year: "numeric"
        });
        
        rule.attr("transform", `translate(${x(date) + 0.5},0)`);
        
        serie.attr("transform", ({values}) => {
          const i = bisect(values, date, 0, values.length - 1);
          const idx = Math.max(0, Math.min(i, values.length - 1));
          return `translate(0,${y(1) - y(values[idx].value / values[0].value)})`;
        });
        
        if (overallSeries) {
          const hoverIndex = bisect(overallSeries.values, date, 0, overallSeries.values.length - 1);
          const hoverIdx = Math.max(0, Math.min(hoverIndex, overallSeries.values.length - 1));
          const hoverValue = overallSeries.values[hoverIdx].value;
          const hoverDate = overallSeries.values[hoverIdx].Date;
          
          const latestValue = overallSeries.values[overallSeries.values.length - 1].value;
          const latestDate = overallSeries.values[overallSeries.values.length - 1].Date;
          
          const percentIncrease = ((latestValue - hoverValue) / hoverValue) * 100;
          const monthsDiff = d3.utcMonth.count(hoverDate, latestDate);
          const yearsDiff = monthsDiff / 12;
          
          let annotationStr = "";
          if (yearsDiff > 0.01) {
            const annualAvgRate = (Math.pow(latestValue / hoverValue, 1 / yearsDiff) - 1) * 100;
            const monthStr = hoverDate.toLocaleString("en", { timeZone: "UTC", month: "short" });
            const yearStr = hoverDate.toLocaleString("en", { timeZone: "UTC", year: "2-digit" });
            annotationStr = `+${percentIncrease.toFixed(1)}% since ${monthStr} '${yearStr} (${annualAvgRate.toFixed(1)}%/yr avg)`;
          } else {
            annotationStr = "Hover over earlier dates to see change";
          }
          
          annotationText.text(annotationStr);
          const bbox = annotationText.node().getBBox();
          const padding = 10;
          
          annotationBg
            .attr("x", 10)
            .attr("y", marginTop + 10)
            .attr("width", bbox.width + padding * 2)
            .attr("height", bbox.height + padding * 2);
          
          annotationText
            .attr("x", 10 + padding)
            .attr("y", marginTop + 10 + padding + bbox.height * 0.8);
        }
      }
      
      d3.transition()
        .ease(d3.easeCubicOut)
        .duration(1500)
        .tween("date", () => {
          const i = d3.interpolateDate(x.domain()[1], x.domain()[0]);
          return t => update(i(t));
        });
      
      svg.on("mousemove touchmove", function(event) {
        const [mouseX] = d3.pointer(event, this);
        update(x.invert(mouseX));
        if (event.preventDefault) event.preventDefault();
      });
      
      svg.on("mouseleave", function() {
        update(x.domain()[0]);
      });
    })
    .catch(error => {
      console.error("CPI chart error:", error);
      document.getElementById("cpi-loading").textContent = "Error loading data";
    });
}

export function initIcicleChart() {
  const d3 = window.d3;
  
  Promise.all([
    d3.json("/data/all_subcategories.json"),
    d3.json("/data/basket_weights.json")
  ]).then(([subcats, weights]) => {
    allSubcatData = subcats;
    weightsData = weights;
    
    if (subcats.date_range) {
      dataDateRange = subcats.date_range;
    }
    
    document.getElementById("startDate").min = dataDateRange.start;
    document.getElementById("startDate").max = dataDateRange.end;
    document.getElementById("endDate").min = dataDateRange.start;
    document.getElementById("endDate").max = dataDateRange.end;
    
    applyPreset("all");
    
    document.querySelectorAll(".preset-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".preset-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        applyPreset(btn.dataset.preset);
      });
    });
    
    document.getElementById("startDate").addEventListener("change", () => {
      updateDateDisplay();
      calculateContributions();
    });
    document.getElementById("endDate").addEventListener("change", () => {
      updateDateDisplay();
      calculateContributions();
    });
    
  }).catch(error => {
    console.error("Data loading error:", error);
    document.getElementById("food-error").style.display = "block";
    document.getElementById("food-error").textContent = `Error loading data: ${error.message}`;
  });
}

function applyPreset(preset) {
  let endDate = dataDateRange.end;
  const [dataEndYear, dataEndMonth] = endDate.split("-").map(Number);
  let startDate;
  
  switch(preset) {
    case "1y": startDate = `${dataEndYear - 1}-${String(dataEndMonth).padStart(2, "0")}`; break;
    case "2y": startDate = `${dataEndYear - 2}-${String(dataEndMonth).padStart(2, "0")}`; break;
    case "5y": startDate = `${dataEndYear - 5}-${String(dataEndMonth).padStart(2, "0")}`; break;
    case "all": startDate = dataDateRange.start; break;
    case "covid": 
      startDate = "2020-03"; 
      endDate = "2022-12";
      break;
    case "ytd": startDate = `${dataEndYear}-01`; break;
    default: startDate = dataDateRange.start;
  }
  
  if (startDate < dataDateRange.start) startDate = dataDateRange.start;
  if (endDate > dataDateRange.end) endDate = dataDateRange.end;
  
  document.getElementById("startDate").value = startDate;
  document.getElementById("endDate").value = endDate;
  
  updateDateDisplay();
  calculateContributions();
}

function updateDateDisplay() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  
  const formatDate = (dateStr) => {
    const [year, month] = dateStr.split("-");
    const monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };
  
  document.getElementById("dateRangeText").textContent = `${formatDate(startDate)} — ${formatDate(endDate)}`;
  
  const [sy, sm] = startDate.split("-").map(Number);
  const [ey, em] = endDate.split("-").map(Number);
  const totalMonths = (ey - sy) * 12 + (em - sm);
  const years = Math.floor(totalMonths / 12);
  const months = totalMonths % 12;
  
  let periodStr = "";
  if (years > 0) periodStr += `${years} year${years > 1 ? "s" : ""}`;
  if (years > 0 && months > 0) periodStr += ", ";
  if (months > 0) periodStr += `${months} month${months > 1 ? "s" : ""}`;
  if (!periodStr) periodStr = "Same month";
  
  document.getElementById("periodLength").textContent = `(${periodStr})`;
}

function calculateContributions() {
  const startDate = document.getElementById("startDate").value;
  const endDate = document.getElementById("endDate").value;
  
  if (!allSubcatData || !weightsData) return;
  
  document.getElementById("food-loading").style.display = "block";
  document.getElementById("food-error").style.display = "none";
  
  try {
    const results = calculateAllContributions(startDate, endDate);
    displayResults(results);
    drawIcicleChart(results);
    document.getElementById("food-loading").style.display = "none";
  } catch (error) {
    console.error("Calculation error:", error);
    document.getElementById("food-loading").style.display = "none";
    document.getElementById("food-error").style.display = "block";
    document.getElementById("food-error").textContent = `Error: ${error.message}`;
  }
}

function getWeight(displayName) {
  const statCanName = WEIGHT_MAP[displayName];
  if (statCanName && weightsData.all_weights_pct[statCanName]) {
    return weightsData.all_weights_pct[statCanName] / 100;
  }
  return 0;
}

function getCpiData(displayName) {
  return allSubcatData.series.find(s => s.category === displayName);
}

function getCpiValue(data, date) {
  const point = data.find(d => d.date === date);
  return point ? point.value : null;
}

function buildHierarchyNode(name, hierarchyDef, startDate, endDate) {
  const weight = getWeight(name);
  const series = getCpiData(name);
  
  let percentageChange = null;
  let contribution = null;
  
  if (series) {
    const startValue = getCpiValue(series.data, startDate);
    const endValue = getCpiValue(series.data, endDate);
    
    if (startValue && endValue) {
      percentageChange = ((endValue / startValue - 1) * 100);
      contribution = weight * percentageChange;
    }
  }
  
  const node = { name, weight, percentageChange, contribution };
  
  if (hierarchyDef.children) {
    node.children = [];
    for (const [childName, childDef] of Object.entries(hierarchyDef.children)) {
      const childNode = buildHierarchyNode(childName, childDef, startDate, endDate);
      if (childNode.weight > 0 || (childNode.children && childNode.children.length > 0)) {
        node.children.push(childNode);
      }
    }
    node.children.sort((a, b) => Math.abs(b.contribution || 0) - Math.abs(a.contribution || 0));
    if (node.children.length === 0) delete node.children;
  }
  
  return node;
}

function calculateAllContributions(startDate, endDate) {
  const contributions = [];
  let totalContribution = 0;
  
  for (const [categoryName, categoryDef] of Object.entries(HIERARCHY)) {
    const node = buildHierarchyNode(categoryName, categoryDef, startDate, endDate);
    if (node.weight > 0) {
      contributions.push(node);
      totalContribution += node.contribution || 0;
    }
  }
  
  contributions.sort((a, b) => Math.abs(b.contribution || 0) - Math.abs(a.contribution || 0));
  
  return { startDate, endDate, totalOverallInflation: totalContribution, totalContribution, contributions };
}

function displayResults(results) {
  document.getElementById("summary").style.display = "grid";
  
  const inflationEl = document.getElementById("totalInflation");
  inflationEl.textContent = `${results.totalOverallInflation.toFixed(1)}%`;
  inflationEl.className = `stat-value ${results.totalOverallInflation >= 0 ? 'positive' : 'negative'}`;
  
  // Format period nicely
  const formatDate = (dateStr) => {
    const [year, month] = dateStr.split("-");
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${monthNames[parseInt(month) - 1]} ${year}`;
  };
  document.getElementById("period").textContent = `${formatDate(results.startDate)} → ${formatDate(results.endDate)}`;
}

function drawIcicleChart(results) {
  const d3 = window.d3;
  const width = 928;
  const height = 600;
  
  const data = { name: "CPI Basket", contribution: results.totalContribution, children: results.contributions };
  
  const colorSchemes = {
    "CPI Basket": d3.scaleSequential([0, 1], d3.interpolateGreys).domain([0, 1]),
    "Food": d3.scaleSequential([0.2, 0.9], d3.interpolateReds),
    "Shelter": d3.scaleSequential([0.2, 0.9], d3.interpolateBlues),
    "Transportation": d3.scaleSequential([0.3, 0.9], d3.interpolateOranges),
    "Household": d3.scaleSequential([0.2, 0.9], d3.interpolatePurples),
    "Clothing": d3.scaleSequential([0.3, 0.9], d3.interpolatePuRd),
    "Health & Care": d3.scaleSequential([0.2, 0.9], d3.interpolateGreens),
    "Recreation & Education": d3.scaleSequential([0.3, 0.9], d3.interpolateYlOrBr),
    "Alcohol & Tobacco": d3.scaleSequential([0.3, 0.9], d3.interpolateRdPu)
  };
  
  function getRootCategory(d) {
    if (!d.parent) return "CPI Basket";
    if (d.parent.data.name === "CPI Basket") return d.data.name;
    return getRootCategory(d.parent);
  }
  
  function getColor(d) {
    const rootCat = getRootCategory(d);
    const scheme = colorSchemes[rootCat] || colorSchemes["CPI Basket"];
    const depthRatio = Math.min(d.depth / 5, 1);
    return scheme(0.4 + depthRatio * 0.5);
  }
  
  const hierarchy = d3.hierarchy(data)
    .sum(d => d.children ? 0 : Math.abs(d.contribution || 0.001))
    .sort((a, b) => b.value - a.value);
  
  const root = d3.partition().size([height, (hierarchy.height + 1) * width / 3])(hierarchy);
  
  const svg = d3.select("#food-chart")
    .attr("viewBox", [0, 0, width, height])
    .attr("width", width)
    .attr("height", height)
    .attr("style", "max-width: 100%; height: auto;");
  
  svg.selectAll("*").remove();
  
  const cell = svg.selectAll("g").data(root.descendants()).join("g")
    .attr("transform", d => `translate(${d.y0},${d.x0})`);
  
  const rect = cell.append("rect")
    .attr("width", d => d.y1 - d.y0 - 1)
    .attr("height", d => rectHeight(d))
    .attr("fill-opacity", 0.9)
    .attr("fill", d => getColor(d))
    .attr("rx", 3)
    .attr("stroke", "rgba(0,0,0,0.2)")
    .attr("stroke-width", 0.5)
    .style("cursor", d => d.children ? "pointer" : "default")
    .on("click", clicked)
    .on("mouseover", function(event, d) { 
      d3.select(this).attr("fill-opacity", 1).attr("stroke", "#fff").attr("stroke-width", 2);
      showTooltip(event, d); 
    })
    .on("mousemove", function(event) { moveTooltip(event); })
    .on("mouseout", function() { 
      d3.select(this).attr("fill-opacity", 0.9).attr("stroke", "rgba(0,0,0,0.2)").attr("stroke-width", 0.5);
      hideTooltip(); 
    });
  
  const text = cell.append("text")
    .style("user-select", "none")
    .attr("pointer-events", "none")
    .attr("x", 6)
    .attr("y", 16)
    .attr("fill", "white")
    .attr("fill-opacity", d => +labelVisible(d))
    .style("font-size", "11px")
    .style("font-weight", "500")
    .style("text-shadow", "0 1px 2px rgba(0,0,0,0.5)");
  
  text.append("tspan").text(d => d.data.name);
  
  const format = d3.format(".2f");
  const tspan = text.append("tspan")
    .attr("fill-opacity", d => labelVisible(d) * 0.8)
    .attr("x", 6)
    .attr("y", 30)
    .style("font-size", "10px")
    .text(d => {
      if (d.data.contribution !== undefined && d.data.contribution !== null) {
        const sign = d.data.contribution >= 0 ? '+' : '';
        return `${sign}${format(d.data.contribution)} pp`;
      }
      return "";
    });
  
  let focus = root;
  function clicked(event, p) {
    if (!p.children) return;
    focus = focus === p ? p = p.parent : p;
    if (!p) p = root;
    
    root.each(d => d.target = {
      x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
      x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
      y0: d.y0 - p.y0,
      y1: d.y1 - p.y0
    });
    
    const t = cell.transition().duration(750)
      .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);
    
    rect.transition(t).attr("height", d => rectHeight(d.target));
    text.transition(t).attr("fill-opacity", d => +labelVisible(d.target));
    tspan.transition(t).attr("fill-opacity", d => labelVisible(d.target) * 0.8);
  }
  
  function rectHeight(d) { return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2); }
  function labelVisible(d) { return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 24; }
  
  const tooltip = d3.select("#tooltip");
  
  function showTooltip(event, d) {
    const data = d.data;
    let html = `<strong>${data.name}</strong>`;
    if (data.contribution !== undefined && data.contribution !== null) {
      html += `<div class="value-row">Contribution: ${data.contribution >= 0 ? '+' : ''}${data.contribution.toFixed(3)} pp</div>`;
    }
    if (data.weight !== undefined && data.weight > 0) {
      html += `<div class="value-row">CPI Basket Weight: ${(data.weight * 100).toFixed(2)}%</div>`;
    }
    if (data.percentageChange !== undefined && data.percentageChange !== null) {
      html += `<div class="value-row">Price Change: ${data.percentageChange >= 0 ? '+' : ''}${data.percentageChange.toFixed(2)}%</div>`;
    }
    if (d.children) html += `<div class="value-row" style="color: #4ecdc4; margin-top: 4px;">Click to drill down →</div>`;
    tooltip.html(html).classed("visible", true);
  }
  
  function moveTooltip(event) {
    tooltip.style("left", (event.pageX + 15) + "px").style("top", (event.pageY - 10) + "px");
  }
  
  function hideTooltip() { tooltip.classed("visible", false); }
}

