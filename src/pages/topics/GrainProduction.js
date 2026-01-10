export function GrainProductionPage() {
  return {
    title: "Grain Production",
    render: (outlet) => {
      const page = document.createElement("div");
      page.className = "grain-production-page";
      
      page.innerHTML = `
        <style>
          /* Page-specific overrides only - uses shared classes from styles.css */
          .grain-production-page {
            background: var(--bg-paper);
          }
          
          /* Expandable methodology details section */
          .grain-production-page details.methodology-details {
            margin: 1.5em 0;
            max-width: 680px;
          }
          
          .grain-production-page details.methodology-details summary {
            cursor: pointer;
            color: var(--accent-primary);
            font-style: italic;
            display: inline;
            transition: color 0.2s ease;
          }
          
          .grain-production-page details.methodology-details summary:hover {
            text-decoration: underline;
            color: var(--accent-secondary);
          }
          
          .grain-production-page details.methodology-details .details-content {
            background: var(--bg-elevated);
            padding: 1.5em 2em;
            margin-top: 1em;
            border-radius: var(--radius);
            border: 1px solid var(--border-subtle);
            border-left: 4px solid var(--accent-secondary);
          }
          
          .grain-production-page details.methodology-details .details-content p {
            max-width: none;
          }
          
          .grain-production-page details.methodology-details .details-content p:last-child {
            margin-bottom: 0;
          }
          
          .grain-production-page details.methodology-details .details-content h4 {
            font-family: var(--font-serif);
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 1.5em;
            margin-bottom: 0.75em;
            color: var(--text-primary);
          }
          
          .grain-production-page details.methodology-details .details-content ul,
          .grain-production-page details.methodology-details .details-content ol {
            max-width: none;
          }
          
          .grain-production-page .math-block {
            text-align: center;
            font-size: 1.2em;
            margin: 1em 0;
          }
          
          .grain-production-page .math-caption {
            text-align: center;
            font-style: italic;
            margin-top: -10px;
            margin-bottom: 10px;
            color: var(--text-muted);
          }
          
          /* Chart-specific styles - all using CSS variables */
          .grain-chart {
            font-family: var(--font-sans);
            background-color: transparent;
            max-width: 100%;
            height: auto;
          }
          
          .grain-chart .axis {
            font-size: 11px;
            fill: var(--text-secondary);
            color: var(--text-secondary);
          }
          
          .grain-chart .axis text {
            fill: var(--text-secondary);
          }
          
          .grain-chart .axis path,
          .grain-chart .axis line {
            stroke: var(--border-medium);
          }
          
          .grain-chart .title {
            font-size: 14px;
            font-weight: bold;
            fill: var(--text-primary);
          }
          
          .grain-chart .caption {
            font-size: 10px;
            fill: var(--text-muted);
          }
          
          .grain-chart .axis-label {
            fill: var(--text-secondary);
          }
          
          .grain-chart .grid-line {
            stroke: var(--border-subtle);
            stroke-width: 1;
          }
          
          .grain-chart .hover-line {
            stroke: var(--text-secondary);
            stroke-width: 1;
            stroke-dasharray: 4, 4;
            opacity: 0;
            pointer-events: none;
          }
          
          .grain-chart .hover-year-label {
            fill: var(--text-primary);
          }
          
          /* Production chart - uses primary accent */
          #plot-history-production .line {
            fill: none;
            stroke: var(--accent-primary);
            stroke-width: 1.5;
          }
          
          #plot-history-production .point {
            fill: var(--accent-primary);
            stroke: var(--accent-primary);
            stroke-width: 0.8;
          }
          
          /* Area chart - uses secondary accent */
          #plot-history-area .line {
            fill: none;
            stroke: var(--accent-secondary);
            stroke-width: 1.5;
          }
          
          #plot-history-area .point {
            fill: var(--accent-secondary);
            stroke: var(--accent-secondary);
            stroke-width: 0.8;
          }
          
          /* Shared tooltip styles */
          .grain-tooltip {
            position: absolute;
            background: var(--bg-dark);
            border: 1px solid var(--border-medium);
            border-radius: var(--radius);
            padding: 8px 12px;
            font-size: 12px;
            color: var(--text-inverse);
            pointer-events: none;
            opacity: 0;
            z-index: 1000;
            box-shadow: var(--shadow-hover);
          }
          
          .grain-tooltip.visible {
            opacity: 1;
          }
          
          /* Legacy tooltip class names for chart compatibility */
          .plot-history-production-tooltip,
          .plot-history-area-tooltip {
            position: absolute;
            background: var(--bg-dark);
            border: 1px solid var(--border-medium);
            border-radius: var(--radius);
            padding: 8px 12px;
            font-size: 12px;
            color: var(--text-inverse);
            pointer-events: none;
            opacity: 0;
            z-index: 1000;
            box-shadow: var(--shadow-hover);
          }
          
          .plot-history-production-tooltip.visible,
          .plot-history-area-tooltip.visible {
            opacity: 1;
          }
          
          /* By-crop panel chart */
          #plot-history-by-crop-container {
            position: relative;
          }
          
          #plot-history-by-crop-container svg {
            max-width: 100%;
            height: auto;
          }
          
          #plot-history-by-crop-container .main-title {
            font-size: 16px;
            font-weight: bold;
            fill: var(--text-primary);
          }
          
          #plot-history-by-crop-container .subtitle {
            font-size: 12px;
            fill: var(--text-muted);
          }
          
          #plot-history-by-crop-container .panel-title {
            font-size: 9px;
            font-weight: normal;
            fill: var(--text-secondary);
          }
          
          #plot-history-by-crop-container .axis {
            font-size: 9px;
            fill: var(--text-secondary);
          }
          
          #plot-history-by-crop-container .axis text {
            fill: var(--text-secondary);
          }
          
          #plot-history-by-crop-container .axis path,
          #plot-history-by-crop-container .axis line {
            stroke: var(--border-medium);
          }
          
          #plot-history-by-crop-container .grid-line {
            stroke: var(--border-subtle);
            stroke-width: 0.5;
          }
          
          #plot-history-by-crop-container .panel-line {
            fill: none;
            stroke-width: 0.5;
          }
          
          #plot-history-by-crop-container .hover-year-label,
          #plot-history-by-crop-container .hover-value-label,
          #plot-history-by-crop-container .crop-name {
            fill: var(--text-primary);
          }
          
          #plot-history-by-crop-container .hover-y-tick {
            stroke: var(--text-primary);
          }
          
          /* Cumulative decomposition chart */
          #plot-cumulative-container svg {
            max-width: 100%;
            height: auto;
          }
          
          #plot-cumulative-container .axis {
            font-size: 11px;
            fill: var(--text-secondary);
          }
          
          #plot-cumulative-container .axis text {
            fill: var(--text-secondary);
          }
          
          #plot-cumulative-container .axis path {
            stroke: none;
          }
          
          #plot-cumulative-container .axis line {
            stroke: var(--border-medium);
          }
          
          #plot-cumulative-container .title {
            font-size: 14px;
            font-weight: bold;
            fill: var(--text-primary);
          }
          
          #plot-cumulative-container .axis-label {
            font-size: 10px;
            fill: var(--text-secondary);
          }
          
          #plot-cumulative-container .grid-line {
            stroke: var(--border-subtle);
            stroke-width: 1;
          }
          
          #plot-cumulative-container .legend-text {
            font-size: 9px;
            fill: var(--text-secondary);
          }
          
          #plot-cumulative-container .mini-window-bg {
            fill: var(--bg-card);
            stroke: var(--border-medium);
            stroke-width: 1;
          }
          
          #plot-cumulative-container .mini-window-title {
            font-size: 12px;
            font-weight: bold;
            fill: var(--text-primary);
          }
          
          #plot-cumulative-container .mini-window-label {
            font-size: 10px;
            fill: var(--text-secondary);
          }
          
          #plot-cumulative-container .mini-window-value {
            font-size: 10px;
            font-weight: 500;
            fill: var(--text-primary);
          }
          
          #plot-cumulative-container .hover-year-label {
            fill: var(--text-primary);
          }
          
          #plot-cumulative-container .highlight-ribbon {
            fill: var(--border-accent);
          }
          
          #plot-cumulative-container .zero-line,
          #plot-cumulative-container .mini-zero-line {
            stroke: var(--text-muted);
          }
          
          #plot-cumulative-container .connecting-segment,
          #plot-cumulative-container .component-connector,
          #plot-cumulative-container .mini-connector {
            stroke: var(--border-medium);
          }
          
          /* Year selector styling */
          .pick-year-button {
            transition: all 0.2s ease;
            background: var(--bg-card);
            border: 1px solid var(--border-medium);
            color: var(--text-secondary);
            padding: 0.5rem 1rem;
            border-radius: var(--radius);
            cursor: pointer;
          }
          
          .pick-year-button:hover {
            background: var(--border-accent);
            border-color: var(--accent-primary);
            color: var(--accent-primary);
          }
          
          .year-input:focus {
            outline: none;
            border-color: var(--accent-primary) !important;
            box-shadow: 0 0 0 3px var(--border-accent);
          }
          
          .year-input::placeholder {
            color: var(--text-muted);
          }
          
          .year-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            background: var(--border-medium);
            border-radius: 2px;
            outline: none;
          }
          
          .year-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 14px;
            height: 14px;
            background: var(--accent-primary);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .year-slider::-webkit-slider-thumb:hover {
            background: var(--accent-secondary);
            transform: scale(1.1);
          }
          
          .year-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
            background: var(--accent-primary);
            border-radius: 50%;
            cursor: pointer;
            border: none;
          }
          
          .close-year-selector:hover {
            color: var(--text-primary) !important;
          }
          
          /* MathJax styling */
          .grain-production-page .MathJax,
          .grain-production-page mjx-container {
            color: var(--text-primary);
          }
          
          .grain-production-page mjx-container[display="true"] {
            margin: 1em 0;
          }
          
          /* Mobile adjustments */
          @media (max-width: 768px) {
            .grain-production-page details.methodology-details .details-content {
              padding: 1em 1.25em;
            }
          }
          
          @media (hover: none) and (pointer: coarse) {
            .chart-container {
              touch-action: pan-x pan-y;
            }
          }
        </style>
        
        <!-- Hero Section - uses shared .story-hero class -->
        <section class="story-hero">
          <div class="story-hero-content">
            <h1>Grain Production</h1>
            <p class="subtitle">Understanding how planted area, yield and crop mix have interacted in the history of Canadian grain production</p>
          </div>
          <div class="scroll-indicator">
            <span>Scroll to explore</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
        </section>
        
        <!-- Section 1: History - uses shared .story-section class -->
        <section class="story-section" id="history">
          <div class="section-header">
            <div class="section-number">Part One</div>
            <h2>History of Production</h2>
            <p class="lead">The production of major crops in Canada has increased considerably over the last 120 years. Today farmers in Canada produce <span id="production-ratio">—</span> times more than they did in the early 1900s.</p>
          </div>
          
          <div class="chart-wrapper">
            <h3 class="chart-title">Total Grain Production</h3>
            <p class="chart-subtitle">Annual production from <span id="first-year">—</span> to <span id="last-year">—</span> — In <span id="last-year-2">—</span> production hit a record with <span id="production-2025-million">—</span> million tonnes</p>
            
            <div class="chart-container">
              <div id="plot-history-production-container"></div>
            </div>
            
            <div class="chart-note">
              <strong>Tip:</strong> Hover below the production line in the chart to see values for specific years.
            </div>
          </div>
          
          <p>What accounts for the rise in production? Production is made up of the total area seeded and the amount of grain produced per seeded hectare. In this report we call this <strong>effective yield</strong>, defined as production divided by seeded area.</p>
          
          <p><strong>The change in total production can come from two different sources: changes in seeded area or changes in effective yield.</strong></p>
        </section>
        
        <!-- Section 2: Seeded Area -->
        <section class="story-section" id="seeded-area">
          <div class="section-header">
            <div class="section-number">Part Two</div>
            <h2>Seeded Area</h2>
            <p class="lead">Seeded area for major crops in Canada has more than <span id="area-multiplier">—</span> between <span id="area-first-year">—</span> and <span id="area-last-year">—</span>.</p>
          </div>
          
          <div class="chart-wrapper">
            <h3 class="chart-title">Total Seeded Area</h3>
            <p class="chart-subtitle">Millions of hectares planted annually</p>
            
            <div class="chart-container">
              <div id="plot-history-area-container"></div>
            </div>
          </div>
        </section>
        
        <!-- Section 3: Effective Yield -->
        <section class="story-section" id="effective-yield">
          <div class="section-header">
            <div class="section-number">Part Three</div>
            <h2>Effective Yield by Crop</h2>
            <p class="lead">Over the last 120 years effective yield has increased for almost every crop. That means changes in output per seeded hectare account for part of the growth in production.</p>
          </div>
          
          <p>Seeded area for individual crop types has not seen a steady increase the way overall seeded area has. Some crops like barley, mixed grains and oats have seen their seeded area decline, while others like canola and corn have seen large increases.</p>
          
          <div class="chart-wrapper">
            <h3 class="chart-title">Production, Area & Yield by Crop</h3>
            <p class="chart-subtitle">Individual crop performance over time</p>
            
            <div class="chart-container">
              <div id="plot-history-by-crop-container"></div>
            </div>
          </div>
        </section>
        
        <!-- Section 4: Framework -->
        <section class="story-section" id="framework">
          <div class="section-header">
            <div class="section-number">Part Four</div>
            <h2>A Framework for Understanding Change</h2>
            <p class="lead">Total production growth can be decomposed into three interpretable components.</p>
          </div>
          
          <ul>
            <li><strong>Total seeded area effect</strong>: more or less land is seeded to major crops</li>
            <li><strong>Within-crop effective yield effect</strong>: output per seeded hectare rises or falls within existing crops</li>
            <li><strong>Crop mix effect</strong>: land shifts toward or away from crops that produce more output per seeded hectare</li>
          </ul>
          
          <details class="methodology-details">
            <summary>Click here to read details on the framework</summary>
            <div class="details-content">
              <p>Formally:</p>
              
              <p class="math-block">\\[P_{\\text{total}} = \\sum_{i} A_{i} Y_{i}\\]</p>
              <p class="math-caption">The production identity</p>
              
              <p>where \\(A_{i}\\) is seeded area and \\(Y_{i}\\) is <strong>effective yield</strong>, defined as production per seeded hectare for crop i.</p>
              
              <p class="math-block">\\[Y_{i} \\equiv P_{i} / A_{i}\\]</p>
              
              <p>This expression can be reorganised to separate <strong>how much land</strong> is farmed from <strong>how productive</strong> that land is:</p>
              
              <p class="math-block">\\[P_{\\text{total}} = A_{\\text{total}} \\times \\bar{Y}\\]</p>
              
              <p>where:</p>
              
              <ul>
                <li>\\(A_{\\text{total}} = \\sum_{i} A_{i}\\) is total seeded area across major crops, and</li>
                <li>\\(\\bar{Y} = \\sum_{i} s_{i} Y_{i}\\) is the area-weighted average effective yield of the crop basket</li>
              </ul>
              
              <h4>Decomposing changes over time</h4>
              
              <p>Taking logarithmic changes converts the multiplicative relationship into an additive one:</p>
              
              <p class="math-block">\\[\\Delta \\ln P_{\\text{total}} = \\Delta \\ln A_{\\text{total}} + \\Delta \\ln \\bar{Y}\\]</p>
              
              <p>Changes in the average effective yield Ȳ can arise from two distinct sources:</p>
              
              <ol>
                <li><strong>Within-crop effective yield changes</strong>: output per seeded hectare rises or falls within a given crop</li>
                <li><strong>Crop mix changes</strong>: the composition of crops shifts, even if no individual crop's effective yield changes</li>
              </ol>
              
              <p>The within-crop effective yield effect is computed by holding crop shares fixed at their previous-year values:</p>
              
              <p class="math-block">\\[\\text{Within effect}_{t} = \\sum_{i} s_{i,t-1} \\times \\Delta \\ln Y_{i,t}\\]</p>
              
              <p>The crop mix effect is then the residual:</p>
              
              <p class="math-block">\\[\\text{Mix effect}_{t} = \\Delta \\ln \\bar{Y}_{t} - \\text{Within effect}_{t}\\]</p>
              
              <p>This gives the full three-way decomposition:</p>
              
              <p class="math-block">\\[\\Delta \\ln P_{\\text{total}} = \\Delta \\ln A_{\\text{total}} + \\text{Within effect} + \\text{Mix effect}\\]</p>
              <p class="math-caption">The three-way decomposition</p>
            </div>
          </details>
        </section>
        
        <!-- Section 5: Decomposition Results -->
        <section class="story-section" id="decomposition">
          <div class="section-header">
            <div class="section-number">Part Five</div>
            <h2>What Accounts for the Change?</h2>
            <p class="lead">Using the decomposition identity, each year's change in total production can be attributed to three components.</p>
          </div>
          
          <div class="chart-wrapper">
            <h3 class="chart-title">Cumulative Production Decomposition</h3>
            <p class="chart-subtitle">Contributions to production growth since <span id="base-year">1908</span></p>
            
            <div class="chart-container">
              <div id="plot-cumulative-container"></div>
            </div>
          </div>
          
          <p>Canadian grain production grew by a factor of <span id="production-multiplier">—</span> between 1908 and <span id="final-year">—</span>. The cumulative log change over this period was <span id="cumulative-log-change-production">—</span> percentage points.</p>
          
          <p><strong>The expansion of seeded area contributed <span id="cumulative-area">—</span> percentage points. Within-crop effective yield changes added <span id="cumulative-within">—</span> percentage points. Crop mix shifts contributed <span id="cumulative-mix">—</span> percentage points.</strong></p>
          
          <p>This tells us that production has changed from a combination of extensive growth (more land is being used) and intensive growth (more is being produced on the land that is seeded). The mix of crops did not play a major part.</p>
          
          <p><strong>Before 1960, within-crop effective yield swings exceeded 15% in <span id="within-exceeds-15-pre-1960">—</span> years. After 1960, this happened only <span id="within-exceeds-15-post-1960">—</span> times.</strong> This pattern is consistent with more stable production outcomes in the modern period.</p>
        </section>
        
        <!-- Section 6: Future -->
        <section class="story-section" id="future">
          <div class="section-header">
            <div class="section-number">Part Six</div>
            <h2>Looking Ahead</h2>
            <p class="lead">In this framework, production can change through more seeded area, higher within-crop effective yields, or shifts in crop mix.</p>
          </div>
          
          <p>Over the last 120 years the crop mix contribution has been smaller in cumulative terms, so if the historical pattern continues, changes in crop mix will play a much smaller role than seeded area and within-crop effective yields.</p>
          
          <p>Seeded area could continue to play a significant role if climate change increases average temperatures at northern latitudes. But climate change is a double-edged sword — more extreme weather could put downward pressure on within-crop effective yields.</p>
        </section>
      `;
      
      outlet.appendChild(page);
      
      // Clear any existing charts from containers
      const containers = [
        'plot-history-production-container',
        'plot-history-area-container',
        'plot-history-by-crop-container',
        'plot-cumulative-container'
      ];
      
      containers.forEach(id => {
        const container = document.getElementById(id);
        if (container) {
          container.innerHTML = '';
        }
      });
      
      // Load MathJax, D3.js and statistics, then initialize charts
      requestAnimationFrame(() => {
        loadMathJax().then(() => {
          const typesetMath = () => {
            if (window.MathJax && window.MathJax.typesetPromise) {
              const element = page.querySelector('.story-section') || page;
              window.MathJax.typesetPromise([element]).catch((err) => {
                console.error('MathJax typeset error:', err);
                if (window.MathJax.typesetPromise) {
                  window.MathJax.typesetPromise().catch(() => {});
                }
              });
            }
          };
          
          requestAnimationFrame(() => {
            typesetMath();
          });
          
          loadD3().then(() => {
            if (typeof d3 === "undefined") {
              console.error("D3.js failed to load");
              return;
            }
            
            loadStatistics().then(() => {
              requestAnimationFrame(() => {
                const allContainersExist = containers.every(id => {
                  const container = document.getElementById(id);
                  return container !== null;
                });
                
                if (allContainersExist && typeof d3 !== "undefined") {
                  import('/src/charts/grainProductionCharts.js').then(module => {
                    if (module.initGrainProductionCharts) {
                      module.initGrainProductionCharts();
                    }
                  }).catch(err => {
                    console.error('Failed to load charts:', err);
                  });
                } else {
                  console.error('Containers or D3 not ready:', {
                    containersExist: allContainersExist,
                    d3Loaded: typeof d3 !== "undefined"
                  });
                }
              });
            });
          });
        });
      });
      
      // Re-render MathJax when details section is opened
      const detailsElement = page.querySelector('details.methodology-details');
      if (detailsElement) {
        detailsElement.addEventListener('toggle', () => {
          if (detailsElement.open && window.MathJax) {
            setTimeout(() => {
              window.MathJax.typesetPromise([detailsElement]).catch((err) => {
                console.error('MathJax typeset error:', err);
              });
            }, 100);
          }
        });
      }
    },
    destroy: () => {
      // Cleanup if needed
    }
  };
}

function loadMathJax() {
  return new Promise((resolve) => {
    if (window.MathJax && window.MathJax.typesetPromise) {
      resolve();
      return;
    }
    
    const existingScript = document.querySelector('script[src*="mathjax"]');
    if (existingScript) {
      existingScript.addEventListener('load', resolve);
      existingScript.addEventListener('error', resolve);
      return;
    }
    
    window.MathJax = {
      tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']],
        processEscapes: true,
        processEnvironments: true
      },
      options: {
        skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre']
      }
    };
    
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    script.onload = () => {
      const checkMathJax = () => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          resolve();
        } else {
          setTimeout(checkMathJax, 50);
        }
      };
      checkMathJax();
    };
    script.onerror = () => {
      console.error('MathJax failed to load');
      resolve();
    };
    document.head.appendChild(script);
  });
}

function loadD3() {
  return new Promise((resolve) => {
    if (window.d3) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://d3js.org/d3.v7.min.js';
    script.onload = resolve;
    document.head.appendChild(script);
  });
}

function loadStatistics() {
  const baseUrl = import.meta.env.BASE_URL;
  
  return fetch(baseUrl + 'data/grain_statistics.json')
    .then(response => response.json())
    .then(stats => {
      document.getElementById('production-ratio').textContent = stats.productionRatio;
      document.getElementById('last-year').textContent = stats.lastYear;
      document.getElementById('production-2025-million').textContent = stats.production2025MillionTonnes;
      document.getElementById('first-year').textContent = stats.firstYear;
      document.getElementById('last-year-2').textContent = stats.lastYear;
      document.getElementById('area-multiplier').textContent = stats.areaMultiplier;
      document.getElementById('area-first-year').textContent = stats.areaFirstYear;
      document.getElementById('area-last-year').textContent = stats.areaLastYear;
      document.getElementById('production-multiplier').textContent = stats.productionMultiplier;
      document.getElementById('final-year').textContent = stats.lastYear;
      document.getElementById('cumulative-log-change-production').textContent = stats.cumulativeLogChangeProduction;
      document.getElementById('cumulative-area').textContent = stats.cumulativeArea;
      document.getElementById('cumulative-within').textContent = stats.cumulativeWithin;
      document.getElementById('cumulative-mix').textContent = stats.cumulativeMix;
      document.getElementById('within-exceeds-15-pre-1960').textContent = stats.withinExceeds15Pre1960;
      document.getElementById('within-exceeds-15-post-1960').textContent = stats.withinExceeds15Post1960;
    })
    .catch(error => {
      console.error('Error loading statistics:', error);
    });
}
