export function InflationStoryPage() {
  return {
    title: "The Inflation Story",
    render: (outlet) => {
      const page = document.createElement("div");
      page.className = "inflation-story";
      
      page.innerHTML = `
        <style>
          .inflation-story {
            background: var(--bg-dark);
          }
          
          /* Hero Section */
          .story-hero {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 4rem 2rem;
            position: relative;
            background: 
              radial-gradient(ellipse at 20% 80%, rgba(78, 205, 196, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(255, 107, 107, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(249, 199, 79, 0.08) 0%, transparent 60%),
              var(--bg-dark);
          }
          
          .story-hero::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: 
              linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
            background-size: 60px 60px;
            pointer-events: none;
          }
          
          .story-hero-content {
            position: relative;
            z-index: 1;
            max-width: 900px;
          }
          
          .story-hero h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(3rem, 8vw, 5rem);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--text-primary) 0%, var(--accent-gold) 50%, var(--accent-coral) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .story-hero .subtitle {
            font-size: 1.35rem;
            color: var(--text-secondary);
            font-weight: 300;
            max-width: 600px;
            margin: 0 auto 3rem;
          }
          
          .scroll-indicator {
            position: absolute;
            bottom: 3rem;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 0.5rem;
            color: var(--text-muted);
            font-size: 0.85rem;
            letter-spacing: 0.1em;
            text-transform: uppercase;
            animation: float 2s ease-in-out infinite;
          }
          
          .scroll-indicator svg {
            width: 24px;
            height: 24px;
            stroke: var(--accent-teal);
          }
          
          @keyframes float {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(8px); }
          }
          
          /* Sections */
          .story-section {
            padding: 6rem 2rem;
            max-width: 1400px;
            margin: 0 auto;
          }
          
          .section-header {
            max-width: 800px;
            margin-bottom: 3rem;
          }
          
          .section-number {
            font-family: 'Playfair Display', serif;
            font-size: 0.9rem;
            color: var(--accent-teal);
            letter-spacing: 0.15em;
            text-transform: uppercase;
            margin-bottom: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
          }
          
          .section-number::after {
            content: '';
            height: 1px;
            width: 60px;
            background: linear-gradient(90deg, var(--accent-teal), transparent);
          }
          
          .story-section h2 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 600;
            margin-bottom: 1.25rem;
            color: var(--text-primary);
          }
          
          .story-section .lead {
            font-size: 1.15rem;
            color: var(--text-secondary);
            font-weight: 300;
          }
          
          /* Chart Container */
          .chart-wrapper {
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 16px;
            padding: 2rem;
            margin: 2rem 0;
            position: relative;
            overflow: hidden;
          }
          
          .chart-wrapper::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, var(--accent-teal), transparent);
          }
          
          .chart-title {
            font-family: 'Playfair Display', serif;
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
            color: var(--text-primary);
          }
          
          .chart-subtitle {
            font-size: 0.95rem;
            color: var(--text-muted);
            margin-bottom: 1.5rem;
          }
          
          .chart-container {
            position: relative;
            width: 100%;
            overflow: visible;
          }
          
          #cpi-chart, #food-chart {
            display: block;
            margin: 0 auto;
          }
          
          .chart-note {
            margin-top: 1.5rem;
            padding: 1rem 1.25rem;
            background: rgba(78, 205, 196, 0.08);
            border-left: 3px solid var(--accent-teal);
            border-radius: 0 8px 8px 0;
            font-size: 0.9rem;
            color: var(--text-secondary);
          }
          
          .chart-note strong {
            color: var(--accent-teal);
          }
          
          /* Transition Section */
          .transition-section {
            padding: 8rem 2rem;
            text-align: center;
            position: relative;
            background: radial-gradient(ellipse at 50% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 60%);
          }
          
          .big-stat {
            font-family: 'Playfair Display', serif;
            font-size: clamp(4rem, 12vw, 8rem);
            font-weight: 700;
            background: linear-gradient(135deg, var(--accent-coral) 0%, var(--accent-gold) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            line-height: 1;
            margin-bottom: 1.5rem;
          }
          
          .big-stat-label {
            font-size: 1.25rem;
            color: var(--text-secondary);
            font-weight: 300;
            max-width: 500px;
            margin: 0 auto;
          }
          
          /* Controls */
          .controls {
            display: flex;
            gap: 1.5rem;
            flex-wrap: wrap;
            align-items: flex-end;
            margin: 1.5rem 0;
            padding: 1.25rem;
            background: rgba(255,255,255,0.03);
            border-radius: 12px;
            border: 1px solid var(--border-subtle);
          }
          
          .control-group {
            display: flex;
            flex-direction: column;
            gap: 0.4rem;
          }
          
          .control-group label {
            font-size: 0.75rem;
            font-weight: 500;
            color: var(--text-muted);
            text-transform: uppercase;
            letter-spacing: 0.08em;
          }
          
          .control-group input,
          .control-group select {
            padding: 0.6rem 1rem;
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            font-size: 0.9rem;
            background: var(--bg-dark);
            color: var(--text-primary);
            font-family: inherit;
          }
          
          .control-group input:focus,
          .control-group select:focus {
            outline: none;
            border-color: var(--accent-teal);
            box-shadow: 0 0 0 3px rgba(78, 205, 196, 0.15);
          }
          
          .preset-buttons {
            display: flex;
            gap: 0.5rem;
            flex-wrap: wrap;
          }
          
          .preset-btn {
            padding: 0.5rem 1rem;
            background: rgba(255,255,255,0.05);
            border: 1px solid var(--border-subtle);
            border-radius: 6px;
            color: var(--text-secondary);
            font-size: 0.85rem;
            font-family: inherit;
            cursor: pointer;
            transition: all 0.2s;
          }
          
          .preset-btn:hover {
            background: rgba(255,255,255,0.1);
            border-color: var(--accent-teal);
            color: var(--text-primary);
          }
          
          .preset-btn.active {
            background: linear-gradient(135deg, var(--accent-teal) 0%, #3db9b0 100%);
            border-color: var(--accent-teal);
            color: var(--bg-dark);
            font-weight: 600;
          }
          
          .date-display {
            display: flex;
            align-items: center;
            gap: 1rem;
            padding: 1rem 1.25rem;
            background: rgba(78, 205, 196, 0.08);
            border-radius: 8px;
            margin-bottom: 1.5rem;
          }
          
          .date-display #dateRangeText {
            font-family: 'Playfair Display', serif;
            font-size: 1.1rem;
            color: var(--text-primary);
          }
          
          .date-display #periodLength {
            font-size: 0.9rem;
            color: var(--text-muted);
          }
          
          /* Summary Stats */
          .summary-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
            gap: 1.25rem;
            margin: 2rem 0;
          }
          
          .stat-card {
            background: rgba(255,255,255,0.03);
            border: 1px solid var(--border-subtle);
            border-radius: 12px;
            padding: 1.25rem;
            text-align: center;
          }
          
          .stat-card .stat-label {
            font-size: 0.75rem;
            text-transform: uppercase;
            letter-spacing: 0.08em;
            color: var(--text-muted);
            margin-bottom: 0.5rem;
          }
          
          .stat-card .stat-value {
            font-family: 'Playfair Display', serif;
            font-size: 1.75rem;
            font-weight: 600;
          }
          
          .stat-card .stat-value.positive { color: var(--accent-coral); }
          .stat-card .stat-value.negative { color: var(--accent-teal); }
          
          /* Tooltip */
          .tooltip {
            position: fixed;
            background: rgba(17, 24, 39, 0.95);
            border: 1px solid var(--border-subtle);
            color: var(--text-primary);
            padding: 0.75rem 1rem;
            border-radius: 10px;
            font-size: 0.85rem;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.2s;
            box-shadow: 0 10px 40px rgba(0,0,0,0.4);
            z-index: 1000;
            backdrop-filter: blur(8px);
          }
          
          .tooltip.visible { opacity: 1; }
          
          .tooltip strong {
            display: block;
            margin-bottom: 0.4rem;
            color: var(--accent-gold);
            font-size: 0.9rem;
            border-bottom: 1px solid var(--border-subtle);
            padding-bottom: 0.4rem;
          }
          
          .tooltip .value-row {
            margin: 0.25rem 0;
            color: var(--text-secondary);
          }
          
          /* ============================================
             RESPONSIVE STYLES - Mobile Optimization
             ============================================ */
          
          /* Large tablets and small desktops */
          @media (max-width: 1024px) {
            .story-section {
              padding: 5rem 1.5rem;
            }
            
            .chart-wrapper {
              padding: 1.5rem;
            }
            
            .summary-grid {
              grid-template-columns: repeat(2, 1fr);
            }
          }
          
          /* Tablets */
          @media (max-width: 768px) {
            .story-hero {
              min-height: 60vh;
              padding: 3rem 1.25rem;
            }
            
            .story-hero h1 {
              font-size: clamp(2rem, 10vw, 3.5rem);
            }
            
            .story-hero .subtitle {
              font-size: 1.1rem;
              margin-bottom: 2rem;
            }
            
            .scroll-indicator {
              bottom: 2rem;
              font-size: 0.75rem;
            }
            
            .story-section {
              padding: 3rem 1rem;
            }
            
            .section-header {
              margin-bottom: 2rem;
            }
            
            .story-section h2 {
              font-size: clamp(1.5rem, 5vw, 2rem);
            }
            
            .story-section .lead {
              font-size: 1rem;
            }
            
            .chart-wrapper {
              padding: 1rem;
              border-radius: 12px;
              margin: 1rem 0;
            }
            
            .chart-title {
              font-size: 1.25rem;
            }
            
            .chart-subtitle {
              font-size: 0.85rem;
            }
            
            .controls {
              flex-direction: column;
              gap: 1rem;
              padding: 1rem;
            }
            
            .control-group {
              width: 100%;
            }
            
            .control-group input,
            .control-group select {
              width: 100%;
              padding: 0.75rem 1rem;
              font-size: 16px; /* Prevents zoom on iOS */
            }
            
            .preset-buttons {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 0.5rem;
              width: 100%;
            }
            
            .preset-btn {
              padding: 0.75rem 0.5rem;
              font-size: 0.8rem;
              text-align: center;
            }
            
            .date-display {
              flex-direction: column;
              align-items: flex-start;
              gap: 0.5rem;
              padding: 0.875rem 1rem;
            }
            
            .date-display #dateRangeText {
              font-size: 1rem;
            }
            
            .summary-grid {
              grid-template-columns: 1fr 1fr;
              gap: 0.75rem;
            }
            
            .stat-card {
              padding: 1rem;
            }
            
            .stat-card .stat-value {
              font-size: 1.5rem;
            }
            
            .transition-section {
              padding: 5rem 1.25rem;
            }
            
            .big-stat {
              font-size: clamp(3rem, 15vw, 5rem);
            }
            
            .big-stat-label {
              font-size: 1rem;
              padding: 0 1rem;
            }
            
            .chart-note {
              padding: 0.875rem 1rem;
              font-size: 0.85rem;
            }
            
            /* Chart container mobile adjustments */
            .chart-container {
              margin: 0 -0.5rem;
              overflow-x: auto;
              -webkit-overflow-scrolling: touch;
            }
            
            #cpi-chart, #food-chart {
              min-width: 100%;
            }
          }
          
          /* Small phones */
          @media (max-width: 480px) {
            .story-hero {
              min-height: 55vh;
              padding: 2.5rem 1rem;
            }
            
            .story-hero h1 {
              font-size: clamp(1.75rem, 12vw, 2.5rem);
              margin-bottom: 1rem;
            }
            
            .story-hero .subtitle {
              font-size: 1rem;
              line-height: 1.5;
            }
            
            .story-section {
              padding: 2.5rem 0.875rem;
            }
            
            .section-number {
              font-size: 0.8rem;
            }
            
            .story-section h2 {
              font-size: 1.35rem;
              margin-bottom: 1rem;
            }
            
            .story-section .lead {
              font-size: 0.95rem;
              line-height: 1.6;
            }
            
            .chart-wrapper {
              padding: 0.875rem;
              border-radius: 10px;
            }
            
            .chart-title {
              font-size: 1.1rem;
            }
            
            .controls {
              padding: 0.875rem;
              gap: 0.875rem;
            }
            
            .preset-buttons {
              grid-template-columns: repeat(2, 1fr);
            }
            
            .preset-btn {
              padding: 0.625rem 0.375rem;
              font-size: 0.75rem;
            }
            
            .date-display #dateRangeText {
              font-size: 0.9rem;
            }
            
            .date-display #periodLength {
              font-size: 0.8rem;
            }
            
            .summary-grid {
              grid-template-columns: 1fr;
            }
            
            .stat-card .stat-label {
              font-size: 0.7rem;
            }
            
            .stat-card .stat-value {
              font-size: 1.35rem;
            }
            
            .transition-section {
              padding: 4rem 1rem;
            }
            
            .big-stat {
              font-size: clamp(2.5rem, 18vw, 4rem);
            }
            
            .big-stat-label {
              font-size: 0.9rem;
            }
            
            .chart-note {
              font-size: 0.8rem;
              padding: 0.75rem;
            }
          }
          
          /* Extra small phones */
          @media (max-width: 360px) {
            .story-hero h1 {
              font-size: 1.65rem;
            }
            
            .preset-buttons {
              grid-template-columns: 1fr 1fr;
            }
            
            .preset-btn {
              font-size: 0.7rem;
              padding: 0.5rem 0.25rem;
            }
          }
          
          /* Touch-friendly tooltip */
          @media (hover: none) and (pointer: coarse) {
            .tooltip {
              display: none !important;
            }
            
            .chart-container {
              touch-action: pan-x pan-y;
            }
          }
          
          /* Landscape phone optimization */
          @media (max-height: 500px) and (orientation: landscape) {
            .story-hero {
              min-height: auto;
              padding: 2rem 1.5rem;
            }
            
            .scroll-indicator {
              display: none;
            }
            
            .transition-section {
              padding: 3rem 1.5rem;
            }
          }
          
          /* High DPI display adjustments */
          @media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
            .chart-wrapper {
              border-width: 0.5px;
            }
          }
          
          /* Reduce motion for accessibility */
          @media (prefers-reduced-motion: reduce) {
            .scroll-indicator {
              animation: none;
            }
            
            * {
              transition-duration: 0.01ms !important;
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
            
            <div class="chart-note">
              <strong>Tip:</strong> Move your cursor across the chart to re-index all series from that date. Watch how relative performance shifts depending on your starting point.
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
              <div class="control-group" style="flex: 1; min-width: 100%;">
                <label>Time Period Presets</label>
                <div class="preset-buttons">
                  <button class="preset-btn" data-preset="1y">1 Year</button>
                  <button class="preset-btn" data-preset="2y">2 Years</button>
                  <button class="preset-btn" data-preset="5y">5 Years</button>
                  <button class="preset-btn active" data-preset="all">All Time</button>
                  <button class="preset-btn" data-preset="covid">COVID Era</button>
                  <button class="preset-btn" data-preset="ytd">YTD</button>
                </div>
              </div>
              <div class="control-group">
                <label>Start Date</label>
                <input type="month" id="startDate" value="2015-01" min="2015-01" max="2025-11">
              </div>
              <div class="control-group">
                <label>End Date</label>
                <input type="month" id="endDate" value="2025-11" min="2015-01" max="2025-11">
              </div>
            </div>
            
            <div class="date-display" id="dateRangeDisplay">
              <span id="dateRangeText">January 2015 — November 2025</span>
              <span id="periodLength">(10 years, 10 months)</span>
            </div>
            
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
            
            <div class="chart-note">
              <strong>Drill Down:</strong> Click any category to explore its subcategories. For example: <span style="color: var(--accent-coral);">Food</span> → Stores → Meat → Beef. Click a parent to zoom back out.
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

