export function GrainProductionPage() {
  return {
    title: "Grain Production",
    render: (outlet) => {
      const page = document.createElement("div");
      page.className = "grain-production-page";
      
      page.innerHTML = `
        <style>
          /* Offset anchor targets to account for fixed navbar */
          .grain-production-page [name], .grain-production-page [id] {
            scroll-margin-top: 70px;
          }
          
          /* Page container */
          .grain-production-page {
            background: var(--bg-dark);
          }
          
          /* Hero Section */
          .grain-production-hero {
            min-height: 70vh;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            text-align: center;
            padding: 4rem 2rem;
            position: relative;
            background: 
              radial-gradient(ellipse at 20% 80%, rgba(139, 195, 74, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at 80% 20%, rgba(255, 193, 7, 0.12) 0%, transparent 50%),
              radial-gradient(ellipse at 50% 50%, rgba(141, 110, 99, 0.08) 0%, transparent 60%),
              var(--bg-dark);
          }
          
          .grain-production-hero::before {
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
          
          .grain-production-hero-content {
            position: relative;
            z-index: 1;
            max-width: 900px;
          }
          
          .grain-production-hero h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(3rem, 8vw, 5rem);
            font-weight: 700;
            line-height: 1.1;
            margin-bottom: 1.5rem;
            background: linear-gradient(135deg, var(--text-primary) 0%, rgba(255, 193, 7, 0.9) 50%, rgba(139, 195, 74, 0.8) 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .grain-production-hero .subtitle {
            font-size: 1.35rem;
            color: var(--text-secondary);
            font-weight: 300;
            max-width: 600px;
            margin: 0 auto 3rem;
          }
          
          .grain-production-scroll-indicator {
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
            animation: grain-float 2s ease-in-out infinite;
          }
          
          .grain-production-scroll-indicator svg {
            width: 24px;
            height: 24px;
            stroke: rgba(139, 195, 74, 0.8);
          }
          
          @keyframes grain-float {
            0%, 100% { transform: translateX(-50%) translateY(0); }
            50% { transform: translateX(-50%) translateY(8px); }
          }
          
          .grain-production-page .page-content {
            max-width: var(--maxWidth);
            margin: 0 auto;
            padding: 3rem 2rem 4rem;
          }
          
          @media (min-width: 768px) {
            .grain-production-page .page-content {
              padding: 3rem 3rem 4rem;
            }
          }
          
          /* Typography */
          .grain-production-page .page-content h1 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(2rem, 4vw, 3rem);
            font-weight: 600;
            margin-bottom: 1rem;
            color: var(--text-primary);
          }
          
          .grain-production-page .page-content .subtitle {
            font-size: 1.2rem;
            color: var(--text-secondary);
            margin-bottom: 3rem;
            font-weight: 300;
            max-width: 700px;
          }
          
          .grain-production-page h2 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: clamp(1.75rem, 3vw, 2.5rem);
            font-weight: 600;
            margin-top: 3rem;
            margin-bottom: 1.5rem;
            color: var(--text-primary);
            border-bottom: 2px solid var(--border-subtle);
            padding-bottom: 0.5rem;
          }
          
          .grain-production-page h3 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 1.5rem;
            font-weight: 600;
            margin-top: 2rem;
            margin-bottom: 1rem;
            color: var(--text-primary);
          }
          
          .grain-production-page p {
            margin-bottom: 1.25rem;
            font-size: 1.1rem;
            line-height: 1.8;
            color: var(--text-secondary);
          }
          
          .grain-production-page strong {
            font-weight: 600;
            color: var(--text-primary);
          }
          
          .grain-production-page hr {
            border: none;
            border-top: 2px solid var(--border-subtle);
            margin: 3rem 0;
          }
          
          .grain-production-page ul, .grain-production-page ol {
            margin-bottom: 1.25rem;
            padding-left: 1.5rem;
            color: var(--text-secondary);
          }
          
          .grain-production-page li {
            margin-bottom: 0.5rem;
            line-height: 1.8;
          }
          
          /* Expandable methodology details section */
          .grain-production-page details.methodology-details {
            margin: 1.5em 0;
          }
          
          .grain-production-page details.methodology-details summary {
            cursor: pointer;
            color: var(--accent-teal);
            font-style: italic;
            display: inline;
            transition: color 0.2s ease;
          }
          
          .grain-production-page details.methodology-details summary:hover {
            text-decoration: underline;
            color: var(--accent-gold);
          }
          
          .grain-production-page details.methodology-details .details-content {
            background: var(--bg-card);
            padding: 1.5em 2em;
            margin-top: 1em;
            border-radius: var(--radius);
            border-left: 3px solid var(--accent-teal);
            border: 1px solid var(--border-subtle);
            border-left: 3px solid var(--accent-teal);
          }
          
          .grain-production-page details.methodology-details .details-content p {
            margin-bottom: 1em;
          }
          
          .grain-production-page details.methodology-details .details-content p:last-child {
            margin-bottom: 0;
          }
          
          .grain-production-page details.methodology-details .details-content h4 {
            font-family: 'Playfair Display', Georgia, serif;
            font-size: 1.25rem;
            font-weight: 600;
            margin-top: 1.5em;
            margin-bottom: 0.75em;
            color: var(--text-primary);
          }
          
          .grain-production-page details.methodology-details .details-content ul,
          .grain-production-page details.methodology-details .details-content ol {
            margin-bottom: 1em;
          }
          
          /* Chart containers */
          .grain-production-page .chart-container {
            margin: 2rem 0;
            padding: 2rem;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: var(--radius-lg);
            box-shadow: var(--shadow-card);
            position: relative;
            overflow: hidden;
          }
          
          .grain-production-page .chart-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 1px;
            background: linear-gradient(90deg, transparent, rgba(139, 195, 74, 0.8), transparent);
          }
          
          .grain-production-page .chart-note {
            margin-top: 1.5rem;
            padding: 1rem 1.25rem;
            background: rgba(139, 195, 74, 0.08);
            border-left: 3px solid rgba(139, 195, 74, 0.8);
            border-radius: 0 8px 8px 0;
            font-size: 0.9rem;
            color: var(--text-secondary);
          }
          
          .grain-production-page .chart-note strong {
            color: rgba(139, 195, 74, 0.9);
          }
          
          /* Chart styles - updated for dark theme */
          #plot-history-production {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: transparent;
            max-width: 100%;
            height: auto;
          }
          
          #plot-history-production .axis {
            font-size: 11px;
            fill: var(--text-secondary);
            color: var(--text-secondary);
          }
          
          #plot-history-production .axis text {
            fill: var(--text-secondary);
          }
          
          #plot-history-production .axis path,
          #plot-history-production .axis line {
            stroke: var(--border-subtle);
          }
          
          #plot-history-production .title {
            font-size: 14px;
            font-weight: bold;
            fill: var(--text-primary);
          }
          
          #plot-history-production .caption {
            font-size: 10px;
            fill: var(--text-muted);
          }
          
          #plot-history-production .axis-label {
            fill: var(--text-secondary);
          }
          
          #plot-history-production .grid-line {
            stroke: var(--border-subtle);
            stroke-width: 1;
          }
          
          #plot-history-production .line {
            fill: none;
            stroke: var(--accent-coral);
            stroke-width: 0.8;
          }
          
          #plot-history-production .point {
            fill: var(--accent-coral);
            stroke: var(--accent-coral);
            stroke-width: 0.8;
          }
          
          #plot-history-production .hover-line {
            stroke: var(--text-secondary);
            stroke-width: 1;
            stroke-dasharray: 4, 4;
            opacity: 0;
            pointer-events: none;
          }
          
          #plot-history-production .hover-year-label {
            fill: var(--text-primary);
          }
          
          .plot-history-production-tooltip {
            position: absolute;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 12px;
            color: var(--text-primary);
            pointer-events: none;
            opacity: 0;
            z-index: 1000;
            box-shadow: var(--shadow-hover);
          }
          
          .plot-history-production-tooltip.visible {
            opacity: 1;
          }
          
          #plot-history-area {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: transparent;
            max-width: 100%;
            height: auto;
          }
          
          #plot-history-area .axis {
            font-size: 11px;
            fill: var(--text-secondary);
            color: var(--text-secondary);
          }
          
          #plot-history-area .axis text {
            fill: var(--text-secondary);
          }
          
          #plot-history-area .axis path,
          #plot-history-area .axis line {
            stroke: var(--border-subtle);
          }
          
          #plot-history-area .title {
            font-size: 14px;
            font-weight: bold;
            fill: var(--text-primary);
          }
          
          #plot-history-area .caption {
            font-size: 10px;
            fill: var(--text-muted);
          }
          
          #plot-history-area .axis-label {
            fill: var(--text-secondary);
          }
          
          #plot-history-area .grid-line {
            stroke: var(--border-subtle);
            stroke-width: 1;
          }
          
          #plot-history-area .line {
            fill: none;
            stroke: var(--accent-teal);
            stroke-width: 0.8;
          }
          
          #plot-history-area .point {
            fill: var(--accent-teal);
            stroke: var(--accent-teal);
            stroke-width: 0.8;
          }
          
          #plot-history-area .hover-line {
            stroke: var(--text-secondary);
            stroke-width: 1;
            stroke-dasharray: 4, 4;
            opacity: 0;
            pointer-events: none;
          }
          
          #plot-history-area .hover-year-label {
            fill: var(--text-primary);
          }
          
          .plot-history-area-tooltip {
            position: absolute;
            background: var(--bg-card);
            border: 1px solid var(--border-subtle);
            border-radius: 8px;
            padding: 8px 12px;
            font-size: 12px;
            color: var(--text-primary);
            pointer-events: none;
            opacity: 0;
            z-index: 1000;
            box-shadow: var(--shadow-hover);
          }
          
          .plot-history-area-tooltip.visible {
            opacity: 1;
          }
          
          #plot-history-by-crop-container {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: transparent;
            max-width: 100%;
            height: auto;
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
            stroke: var(--border-subtle);
          }
          
          #plot-history-by-crop-container .caption {
            font-size: 10px;
            fill: var(--text-muted);
          }
          
          #plot-history-by-crop-container .axis-label {
            fill: var(--text-secondary);
          }
          
          #plot-history-by-crop-container .grid-line {
            stroke: var(--border-subtle);
            stroke-width: 0.5;
          }
          
          #plot-history-by-crop-container .panel-line {
            fill: none;
            stroke-width: 0.5;
          }
          
          #plot-history-by-crop-container .panel-point {
            stroke-width: 0.5;
          }
          
          #plot-history-by-crop-container .hover-line {
            stroke: var(--text-secondary);
            stroke-width: 1;
            stroke-dasharray: 4, 4;
            opacity: 0;
            pointer-events: none;
          }
          
          #plot-history-by-crop-container .hover-year-label,
          #plot-history-by-crop-container .hover-value-label {
            fill: var(--text-primary);
          }
          
          #plot-history-by-crop-container .crop-name {
            fill: var(--text-primary);
          }
          
          #plot-cumulative-container {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            background-color: transparent;
            max-width: 100%;
            height: auto;
          }
          
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
            stroke: var(--border-subtle);
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
          
          #plot-cumulative-container .mini-window {
            pointer-events: none;
          }
          
          #plot-cumulative-container .mini-window-bg {
            fill: var(--bg-card);
            stroke: var(--border-subtle);
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
            fill: rgba(255, 255, 255, 0.05);
          }
          
          #plot-cumulative-container .zero-line,
          #plot-cumulative-container .mini-zero-line {
            stroke: var(--text-muted);
          }
          
          #plot-cumulative-container .connecting-segment,
          #plot-cumulative-container .component-connector,
          #plot-cumulative-container .mini-connector {
            stroke: var(--border-subtle);
          }
          
          #plot-history-by-crop-container .hover-y-tick {
            stroke: var(--text-primary);
          }
          
          /* Year selector styling */
          .year-selector-container {
            position: relative;
          }
          
          .pick-year-button {
            transition: all 0.2s ease;
          }
          
          .pick-year-button:hover {
            background: rgba(139, 195, 74, 0.2) !important;
            border-color: rgba(139, 195, 74, 0.8) !important;
          }
          
          .year-selector-window {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          
          .year-input {
            letter-spacing: 0.1em;
          }
          
          .year-input:focus {
            outline: none;
            border-color: rgba(139, 195, 74, 0.8) !important;
            box-shadow: 0 0 0 3px rgba(139, 195, 74, 0.15);
          }
          
          .year-input::placeholder {
            color: var(--text-muted);
            letter-spacing: 0.2em;
          }
          
          .year-slider {
            -webkit-appearance: none;
            appearance: none;
            height: 4px;
            background: var(--border-subtle);
            border-radius: 2px;
            outline: none;
          }
          
          .year-slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            background: rgba(139, 195, 74, 0.9);
            border-radius: 50%;
            cursor: pointer;
            transition: all 0.2s ease;
          }
          
          .year-slider::-webkit-slider-thumb:hover {
            background: rgba(139, 195, 74, 1);
            transform: scale(1.1);
          }
          
          .year-slider::-moz-range-thumb {
            width: 14px;
            height: 14px;
            background: rgba(139, 195, 74, 0.9);
            border-radius: 50%;
            cursor: pointer;
            border: none;
            transition: all 0.2s ease;
          }
          
          .year-slider::-moz-range-thumb:hover {
            background: rgba(139, 195, 74, 1);
            transform: scale(1.1);
          }
          
          .close-year-selector:hover {
            color: var(--text-primary) !important;
          }
          
          /* MathJax styling */
          .grain-production-page .MathJax {
            color: var(--text-primary);
          }
          
          .grain-production-page mjx-container {
            color: var(--text-primary);
          }
          
          .grain-production-page mjx-container[display="true"] {
            margin: 1em 0;
          }
          
          .grain-production-page .details-content mjx-container {
            color: var(--text-primary);
          }
        </style>
        
        <!-- Hero Section -->
        <section class="grain-production-hero">
          <div class="grain-production-hero-content">
            <h1>Grain Production</h1>
            <p class="subtitle">Understanding how planted area, yield and crop mix have interacted in the history of Canadian grain production</p>
          </div>
          <div class="grain-production-scroll-indicator">
            <span>Scroll to explore</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 5v14M19 12l-7 7-7-7"/>
            </svg>
          </div>
        </section>
        
        <div class="page-content">
          <h2>History of production, seeded area and effective yield</h2>
        
        <p>The production of major crops in Canada has increased considerably over the last 120 years. Today farmers in Canada produce <span id="production-ratio">—</span> times more than they did in the early 1900s. In fact in <span id="last-year">—</span> production hit a record with <span id="production-2025-million">—</span> million tonnes produced. In the plot below we see total production from <span id="first-year">—</span> to <span id="last-year-2">—</span>. It shows how production has been increasing steadily with year-to-year variation.</p>
        
        <h3>Total production</h3>
        
        <div class="chart-container">
          <div id="plot-history-production-container"></div>
          <div class="chart-note">
            <strong>Tip:</strong> Hover below the production line in the chart to see production values for specific years.
          </div>
        </div>
        
        <p>What accounts for the rise in production? Production is made up of the total area seeded and the amount of grain produced per seeded hectare. In this report we call this <strong>effective yield</strong>, defined as production divided by seeded area. This differs from the standard yield definition (production per harvested hectare), but harvested area is only available back to 1960 in our data. Using effective yield lets us build a single consistent series back to the early 1900s.</p>
        
        <p>If farmers kept expanding the area on which they plant crops, it is possible, in principle, that the increases in production could have been fully accounted for by increased seeded area without any changes in effective yield. Or conversely, the area seeded over the last 120 years could have stayed constant and effective yields could have risen through a mix of agronomic productivity changes and changes in the share of seeded land that is harvested. <strong>The change in total production can come from two different sources: changes in seeded area or changes in effective yield.</strong></p>
        
        <h3>Total seeded area</h3>
        
        <p>The plot below shows that seeded area accounts for part of the increase. Seeded area for major crops in Canada has more than <span id="area-multiplier">—</span> between <span id="area-first-year">—</span> and <span id="area-last-year">—</span></p>
        
        <div class="chart-container">
          <div id="plot-history-area-container"></div>
        </div>
        
        <h3>Effective yield</h3>
        
        <p>The other part of total production is how much each crop produces per seeded hectare. Since each crop type has very different effective yields the plot below shows effective yield by crop. Also included for each crop is its seeded area and production.</p>
        
        <p>We see that over the last 120 years effective yield has increased for almost every crop. That means changes in output per seeded hectare account for part of the growth in production.</p>
        
        <p>What the plot also shows is seeded area for individual crop types has not seen a steady increase the way overall seeded area has. Some crops like barley, mixed grains and oats have seen their seeded area decline. While others like canola and corn have seen large increases in their seeded area.</p>
        
        <div class="chart-container">
          <div id="plot-history-by-crop-container"></div>
        </div>
        
        <p>The panels of effective yield, seeded area and production for each crop illustrate the complexity of Canadian crop production. Total production has grown substantially, but this growth reflects a combination of changes in total seeded area, changes in effective yield within individual crops, and shifts in the mix of crops grown. Some crops have expanded dramatically (such as canola and soybeans), while others have contracted (such as oats and barley). Effective yields have generally trended upward, but the pace varies across crops.</p>
        
        <p>To make sense of these interacting forces we need a framework for disentangling and quantifying their respective contributions to aggregate production growth.</p>
        
        <hr>
        
        <h2>A framework for understanding changes in crop production</h2>
        
        <p>Total crop production in Canada is the sum of production across individual crops. For each crop, production is area multiplied by effective yield.</p>
        
        <p>This allows total production growth to be decomposed into three interpretable components:</p>
        
        <ul>
          <li><strong>Total seeded area effect</strong>: more or less land is seeded to major crops</li>
          <li><strong>Within-crop effective yield effect</strong>: output per seeded hectare rises or falls within existing crops</li>
          <li><strong>Crop mix effect</strong>: land shifts toward or away from crops that produce more output per seeded hectare</li>
        </ul>
        
        <details class="methodology-details">
          <summary>Click here to read details on the framework</summary>
          <div class="details-content">
            <p>Formally:</p>
            
            <p style="text-align: center; font-size: 1.2em; margin: 1em 0;">
              \\[P_{\\text{total}} = \\sum_{i} A_{i} Y_{i}\\]
            </p>
            
            <p style="text-align: center; font-style: italic; margin-top: -10px; margin-bottom: 10px; color: var(--text-muted);">The production identity</p>
            
            <p>where \\(A_{i}\\) is seeded area and \\(Y_{i}\\) is <strong>effective yield</strong>, defined as production per seeded hectare for crop i. So we add up each crop's production (its area times its yield) to get total production.</p>
            
            <p style="text-align: center; font-size: 1.2em; margin: 1em 0;">
              \\[Y_{i} \\equiv P_{i} / A_{i}\\]
            </p>
            
            <p>This differs from the standard agricultural definition of yield (production per harvested hectare). We use effective yield so the decomposition can be computed consistently over the full historical period. As a result, changes in \\(Y_{i}\\) reflect both agronomic productivity and changes in the harvested-to-seeded relationship.</p>
            
            <p>This expression can be reorganised to separate <strong>how much land</strong> is farmed from <strong>how productive</strong> that land is on average:</p>
            
            <p style="text-align: center; font-size: 1.2em; margin: 1em 0;">
              \\[P_{\\text{total}} = A_{\\text{total}} \\times \\bar{Y}\\]
            </p>
            
            <p>where:</p>
            
            <ul>
              <li>\\(A_{\\text{total}} = \\sum_{i} A_{i}\\) is total seeded area across major crops, and</li>
              <li>\\(\\bar{Y} = \\sum_{i} s_{i} Y_{i}\\) is the area-weighted average effective yield of the crop basket, with \\(s_{i} = A_{i} / A_{\\text{total}}\\) representing each crop's share of total area.</li>
            </ul>
            
            <p>The average effective yield \\(\\bar{Y}\\) is not the simple average of effective yields across crops. It weights each crop's effective yield by its share of total area, so crops that occupy more land count more heavily.</p>
            
            <h4>Decomposing changes over time</h4>
            
            <p>Taking logarithmic changes converts the multiplicative relationship into an additive one:</p>
            
            <p style="text-align: center; font-size: 1.2em; margin: 1em 0;">
              \\[\\Delta \\ln P_{\\text{total}} = \\Delta \\ln A_{\\text{total}} + \\Delta \\ln \\bar{Y}\\]
            </p>
            
            <p>Log differences approximate percentage changes (a 0.02 change in log is roughly a 2% change), and the components now add up exactly to total growth.</p>
            
            <p>Changes in the average effective yield Ȳ can arise from two distinct sources:</p>
            
            <ol>
              <li><strong>Within-crop effective yield changes</strong>: output per seeded hectare rises or falls within a given crop, holding the crop mix fixed. These changes can reflect weather, pests, agronomic practices, genetics, and changes in the share of seeded land that is harvested.</li>
              
              <li><strong>Crop mix changes</strong>: the composition of crops shifts, even if no individual crop's effective yield changes. For example, if wheat has higher output per seeded hectare than canola, shifting land from canola to wheat raises Ȳ even if each crop's effective yield is unchanged.</li>
            </ol>
            
            <p>To separate these effects, we use a <strong>shift-share decomposition</strong> (also called a Laspeyres decomposition when using base-period weights). The within-crop effective yield effect is computed by holding crop shares fixed at their previous-year values and measuring only the effective yield changes:</p>
            
            <p style="text-align: center; font-size: 1.2em; margin: 1em 0;">
              \\[\\text{Within effect}_{t} = \\sum_{i} s_{i,t-1} \\times \\Delta \\ln Y_{i,t}\\]
            </p>
            
            <p>where \\(s_{i,t-1}\\) is crop i's share of total area in the previous year and \\(\\Delta \\ln Y_{i,t} = \\ln Y_{i,t} - \\ln Y_{i,t-1}\\) is the log change in that crop's effective yield. The crop mix effect is then the residual:</p>
            
            <p style="text-align: center; font-size: 1.2em; margin: 1em 0;">
              \\[\\text{Mix effect}_{t} = \\Delta \\ln \\bar{Y}_{t} - \\text{Within effect}_{t}\\]
            </p>
            
            <p>Whatever change in average effective yield is not captured by within-crop effective yield changes is assigned to the residual (crop mix) term.</p>
            
            <p>Substituting the effective yield decomposition into the production identity gives the full three-way decomposition:</p>
            
            <p style="text-align: center; font-size: 1.2em; margin: 1em 0;">
              \\[\\Delta \\ln P_{\\text{total}} = \\Delta \\ln A_{\\text{total}} + \\text{Within effect} + \\text{Mix effect}\\]
            </p>
            
            <p style="text-align: center; font-style: italic; margin-top: -10px; margin-bottom: 10px; color: var(--text-muted);">The three-way decomposition</p>
            
            <p>This identity holds exactly: the three components sum to total production growth. Each term can be interpreted as the contribution (in log points, approximately percentage points) of land expansion, within-crop effective yield changes, and crop reallocation respectively.</p>
            
            <p>There are some common questions about this framework that you may care to understand.</p>
            
            <p><strong>How does year-to-year decomposition compare to a direct two-period comparison?</strong></p>
            
            <p>The <strong>total production change</strong> is identical either way. Chaining year-to-year log changes gives the same result as comparing the start and end years directly. This is a property of logarithms: the sum of year-to-year log changes equals the log of the ratio of endpoints.</p>
            
            <p>However, the <strong>within-crop effective yield</strong> and <strong>crop mix</strong> components can differ between approaches. This is the classic index number problem. In the year-to-year (chain-linked) approach, each year's effective yield change is weighted by the previous year's crop shares. In a direct two-period comparison, effective yield changes would be weighted by starting-year shares for the entire span.</p>
            
            <p>Neither approach is wrong. They answer different questions. Chain-linking captures how effective yield and mix contributed as they happened over time. A direct comparison asks what we would attribute to effective yield if we jumped from the start to the end holding the starting crop shares fixed.</p>
            
            <p><strong>Why does the cumulative log change differ from simple percent change?</strong></p>
            
            <p>If production grew by a factor of \\(X\\), simple percent change gives \\((X - 1) \\times 100\\), while cumulative log change gives \\(\\ln(X) \\times 100\\). These are different metrics related by: \\(\\exp(\\text{log change}) = 1 + \\text{simple percent} / 100\\).</p>
            
            <p>For small changes, they are nearly identical. For large cumulative changes over many decades, they diverge substantially.</p>
            
            <p><strong>Why use log changes at all?</strong></p>
            
            <p>Log changes decompose additively. The three components (seeded area, within-crop effective yield, crop mix) sum exactly to total growth. With simple percent changes, you get interaction terms that do not add up cleanly. The trade-off is that simple percent change is more intuitive, but log changes allow exact additive decomposition.</p>
            
            <p><strong>What happens when a crop has no production?</strong></p>
            
            <p>Crops with zero production (and therefore zero effective yield) in either year are excluded from the within versus mix decomposition because log(0) is undefined. We keep the previous-year area weights defined over the full crop basket. Any contribution from crop failures, entry and exit of crops, or undefined yield changes is captured in the residual (crop mix) term.</p>
          </div>
        </details>
        
        <h3>Why this matters</h3>
        
        <p>The decomposition answers a practical question: <strong>why did production change?</strong> The dominant component reveals the nature of the change:</p>
        
        <ul>
          <li>If the <strong>area effect</strong> dominates, growth was land-driven. This pathway is potentially unsustainable if available agricultural land is finite or if expansion comes at environmental cost.</li>
          
          <li>If <strong>within-crop effective yields</strong> dominate, most of the change is associated with higher output per seeded hectare within existing crops. This can reflect many influences, including weather, agronomic practices, and changes in the harvested-to-seeded relationship.</li>
          
          <li>If the <strong>crop mix effect</strong> dominates, the pattern is consistent with structural change in agriculture, where seeded land shifts between crops. These shifts can be related to prices, climate, and policy, among other factors.</li>
        </ul>
        
        <p>This framework makes it possible to distinguish whether long-run production outcomes reflect extensive growth (more inputs), intensive growth (more output per input), or compositional change (different allocation of inputs).</p>
        
        <hr>
        
        <h2>What accounts for the change in production?</h2>
        
        <p>Using the decomposition identity, each year's change in total production can be attributed to three components: changes in total seeded area, within-crop effective yield changes, and shifts in crop mix. The results of the decomposition are plotted below.</p>
        
        <div class="chart-container">
          <div id="plot-cumulative-container"></div>
        </div>
        
        <p>Canadian grain production grew by a factor of <span id="production-multiplier">—</span> between <span id="base-year">1908</span> and <span id="final-year">—</span>. The cumulative log change over this period was <span id="cumulative-log-change-production">—</span> percentage points. <strong>The expansion of seeded area contributed <span id="cumulative-area">—</span> percentage points. Within-crop effective yield changes added <span id="cumulative-within">—</span> percentage points. Crop mix shifts contributed <span id="cumulative-mix">—</span> percentage points.</strong> Which tells us that production has changed from a combination of extensive growth (more land is being used) and intensive growth (more is being produced on the land that is seeded). The mix of crops did not play a major part in how production has changed.</p>
        
        <p>This ranking may seem surprising given the dramatic year-to-year swings visible in the plot. Within-crop effective yields fluctuate from year to year, reflecting weather, pests, growing conditions, and changes in the harvested-to-seeded relationship. But <strong>those large swings often cancel out</strong>, a poor year is followed by a recovery, and the cumulative effect can be smaller than the volatility suggests. Meanwhile, seeded area expanded steadily, especially during the settlement of the prairies in the early twentieth century. Small but consistent gains compound over 117 years.</p>
        
        <p>The year-to-year plot reveals a striking pattern in effective yield variability. <strong>Before 1960, within-crop effective yield swings exceeded 15% in <span id="within-exceeds-15-pre-1960">—</span> years. After 1960, this happened only <span id="within-exceeds-15-post-1960">—</span> times. This pattern is consistent with more stable production outcomes per seeded hectare in the modern period</strong>, though it also reflects changes in reporting, crop mix, and the harvested-to-seeded relationship.</p>
        
        <h2>Where could future changes in production come from?</h2>
        
        <p>This is not a report forecasting future grain production. But the decomposition does provide a useful way to think about where future changes could come from. In this framework, production can change through more seeded area, higher within-crop effective yields (more output per seeded hectare), or shifts in crop mix toward crops with higher output per seeded hectare. Over the last 120 years the crop mix contribution has been smaller in cumulative terms, so if the historical pattern continues, changes in crop mix will play a much smaller role than seeded area and within-crop effective yields.</p>
        
        <p>Seeded area could continue to play a significant role, for example if climate change increases average temperatures at northern latitudes and lengthens the growing season. But climate change is a double-edged sword in crop production. More extreme weather could put downward pressure on within-crop effective yields, either by reducing field productivity or by increasing the share of seeded land that is not ultimately harvested. If Canadian farmers catch a lucky break with the effects of climate change and keep up improvements in technology and management practices, within-crop effective yields could continue playing a significant part in future production increases.</p>
        </div>
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
      // Use requestAnimationFrame to ensure DOM is fully ready
      requestAnimationFrame(() => {
        loadMathJax().then(() => {
          // Typeset math in the page element after MathJax loads
          const typesetMath = () => {
            if (window.MathJax && window.MathJax.typesetPromise) {
              // Try to typeset the page element, fallback to whole document
              const element = page.querySelector('.page-content') || page;
              window.MathJax.typesetPromise([element]).catch((err) => {
                console.error('MathJax typeset error:', err);
                // Fallback: typeset entire document
                if (window.MathJax.typesetPromise) {
                  window.MathJax.typesetPromise().catch(() => {});
                }
              });
            }
          };
          
          // Wait a frame to ensure DOM is ready, then typeset
          requestAnimationFrame(() => {
            typesetMath();
          });
          
          loadD3().then(() => {
            // Ensure D3 is actually available
            if (typeof d3 === "undefined") {
              console.error("D3.js failed to load");
              return;
            }
            
            loadStatistics().then(() => {
              // Wait one more frame to ensure containers are in DOM
              requestAnimationFrame(() => {
                // Verify containers exist before importing
                const allContainersExist = containers.every(id => {
                  const container = document.getElementById(id);
                  return container !== null;
                });
                
                if (allContainersExist && typeof d3 !== "undefined") {
                  // Import chart module and call initialization function
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
            // Wait a bit for the content to be visible
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
      // MathJax already loaded, just resolve
      resolve();
      return;
    }
    
    // Check if script is already being loaded
    const existingScript = document.querySelector('script[src*="mathjax"]');
    if (existingScript) {
      // Wait for existing script to load
      existingScript.addEventListener('load', resolve);
      existingScript.addEventListener('error', resolve);
      return;
    }
    
    // Configure MathJax before loading
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
      // Wait for MathJax to be fully initialized
      const checkMathJax = () => {
        if (window.MathJax && window.MathJax.typesetPromise) {
          resolve();
        } else {
          // Check again after a short delay
          setTimeout(checkMathJax, 50);
        }
      };
      checkMathJax();
    };
    script.onerror = () => {
      console.error('MathJax failed to load');
      resolve(); // Resolve anyway to not block page rendering
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
      // Insert calculated values into text
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
