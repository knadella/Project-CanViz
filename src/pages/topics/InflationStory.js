export function InflationStoryPage() {
  return {
    title: "The Inflation Story",
    render: (outlet) => {
      const page = document.createElement("div");
      page.className = "inflation-story";
      
      page.innerHTML = `
        <style>
          /* Page-specific overrides only - uses shared classes from styles.css */
          .inflation-story {
            background: var(--bg-paper);
          }
          
          .inflation-story .section-header {
            max-width: 680px;
            margin-bottom: 2.5rem;
            border-left: 4px solid var(--accent-primary);
            padding-left: 1.25rem;
          }
          
          .inflation-story .section-number::after {
            display: none;
          }
          
          #cpi-chart, #food-chart {
            display: block;
            margin: 0 auto;
          }
          
          /* Transition section uses stat-callout base */
          .transition-section {
            padding: 5rem 2rem;
            text-align: center;
            background: var(--bg-card);
            border-top: 1px solid var(--border-subtle);
            border-bottom: 1px solid var(--border-subtle);
          }
          
          .transition-section .big-stat {
            font-family: 'Libre Baskerville', Georgia, serif;
            font-size: clamp(4rem, 12vw, 7rem);
            font-weight: 700;
            color: var(--accent-primary);
            line-height: 1.1;
            margin-bottom: 1rem;
          }
          
          .transition-section .big-stat-label {
            font-size: 1.15rem;
            color: var(--text-secondary);
            max-width: 500px;
            margin: 0 auto;
            line-height: 1.65;
          }
          
          /* Summary grid uses stat-grid base */
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
            gap: 1rem;
            margin: 1.5rem 0;
          }
          
          /* Mobile adjustments for page-specific elements */
          @media (max-width: 768px) {
            .inflation-story .section-header {
              margin-bottom: 1.5rem;
            }
            
            .transition-section {
              padding: 3rem 1.25rem;
            }
            
            .transition-section .big-stat {
              font-size: clamp(3rem, 14vw, 5rem);
            }
            
            .summary-grid {
              grid-template-columns: 1fr 1fr;
            }
          }
          
          @media (max-width: 480px) {
            .transition-section {
              padding: 2.5rem 1rem;
            }
            
            .transition-section .big-stat {
              font-size: clamp(2.5rem, 16vw, 4rem);
            }
          }
          
          @media (hover: none) and (pointer: coarse) {
            .chart-container {
              touch-action: pan-x pan-y;
            }
          }
          
          @media (max-height: 500px) and (orientation: landscape) {
            .transition-section {
              padding: 2rem 1.5rem;
            }
          }
        </style>
        
        <!-- Hero Section -->
        <section class="story-hero">
          <div class="story-hero-content">
            <h1>The Inflation Story</h1>
            <p class="subtitle">A decade of rising prices, visualized. Explore how the cost of living has changed across Canada from 2015 to 2025.</p>
          </div>
          <div class="scroll-indicator">
            <span>Scroll to explore</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
        </section>
        
        <!-- Section 1: CPI Overview -->
        <section class="story-section" id="overview">
          <div class="section-header">
            <div class="section-number">Part One</div>
            <h2>The Big Picture</h2>
            <p class="lead">The Consumer Price Index (CPI) tracks how prices change over time. Hover over the chart to see how each category has performed relative to any starting point you choose.</p>
          </div>
          
          <div class="chart-wrapper">
            <h3 class="chart-title">Consumer Price Index by Category</h3>
            <p class="chart-subtitle" id="cpi-subtitle">10 Years of Monthly Data — 6 Main Categories</p>
            
            <div class="chart-container">
              <div class="loading" id="cpi-loading">Loading data...</div>
              <svg id="cpi-chart"></svg>
            </div>
            
          </div>
        </section>
        
        <!-- Transition -->
        <section class="transition-section">
          <div class="big-stat" id="overall-increase">33%</div>
          <p class="big-stat-label">Overall prices have increased since January 2015 — but not all categories are equal.</p>
        </section>
        
        <!-- Section 2: Category Deep Dive -->
        <section class="story-section" id="category-analysis">
          <div class="section-header">
            <div class="section-number">Part Two</div>
            <h2>Breaking Down the Basket</h2>
            <p class="lead">See which categories drive overall inflation. Click any category to drill down into its components — all the way down to individual items like beef, cheese, or gasoline.</p>
          </div>
          
          <div class="chart-wrapper">
            <h3 class="chart-title">Inflation Contributors by Category</h3>
            <p class="chart-subtitle">Percentage point contributions to overall CPI change</p>
            
            <div class="controls">
              <div class="control-group" style="width: 100%;">
                <label>Time Period</label>
                <div class="preset-buttons">
                  <button class="preset-btn" data-preset="1y">1 Year</button>
                  <button class="preset-btn" data-preset="2y">2 Years</button>
                  <button class="preset-btn" data-preset="5y">5 Years</button>
                  <button class="preset-btn active" data-preset="all">All Time</button>
                  <button class="preset-btn" data-preset="covid">COVID Era</button>
                  <button class="preset-btn" data-preset="ytd">YTD</button>
                </div>
              </div>
            </div>
            <!-- Hidden inputs to maintain compatibility with chart code -->
            <input type="hidden" id="startDate" value="2015-01">
            <input type="hidden" id="endDate" value="2025-11">
            
            
            <div class="loading" id="food-loading" style="display: none;">Calculating contributions...</div>
            <div class="error" id="food-error" style="display: none;"></div>
            
            <div class="summary-grid" id="summary" style="display: none;">
              <div class="stat-card">
                <div class="stat-label">Total Inflation</div>
                <div class="stat-value" id="totalInflation">—</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Period</div>
                <div class="stat-value" id="period" style="font-size: 1rem; color: var(--text-secondary);">—</div>
              </div>
            </div>
            
            <div class="chart-container">
              <svg id="food-chart"></svg>
            </div>
            
          </div>
        </section>
        
        <!-- Tooltips -->
        <div class="tooltip" id="tooltip"></div>
      `;
      
      outlet.appendChild(page);
      
      // Load D3 and initialize charts
      loadD3().then(() => {
        initCharts();
      });
    },
    destroy: () => {
      // Cleanup if needed
    }
  };
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

function initCharts() {
  // Import the chart initialization code
  import('/src/charts/inflationStoryCharts.js').then(module => {
    module.initCpiChart();
    module.initIcicleChart();
  }).catch(err => {
    console.error('Failed to load charts:', err);
    document.getElementById('cpi-loading').textContent = 'Error loading charts';
  });
}

