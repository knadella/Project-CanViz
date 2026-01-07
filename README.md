# Project CanViz

A collaborative project for building interactive web data visualisations using D3.js and publicly available Canadian data.

## Overview

This repository contains interactive data visualisations and web products built with D3.js, focusing on publicly available datasets from Canada.

## Technologies

- **D3.js** - Data-driven documents for creating interactive visualisations
- **HTML/CSS/JavaScript** - Core web technologies
- **Public Canadian Data Sources** - Various open data portals and APIs

## Getting Started

### Prerequisites

- A modern web browser
- Node.js
- Node Package Manager (npm)

### Setup

1. Clone this repository
2. Open the project in your preferred code editor
3. Install dependencies: `npm install`
4. Start the development server: `npm run dev`
5. Open the local address Vite prints in your browser

## Project Structure

```
.
├── README.md
├── index.html                 # Single app shell (Vite entry)
├── package.json               # JavaScript dependencies (includes D3) and scripts
├── vite.config.js             # Build configuration (GitHub Pages base path)
├── public/                    # Static files served as-is
│   └── data/                  # CSV and other files charts can load
├── src/                       # Website source code (pages, charts, shared layout)
│   ├── main.js                # App entry (mount layout, start router)
│   ├── router.js              # Hash based router (GitHub Pages friendly)
│   ├── components/            # Shared user interface components
│   ├── layout/                # Shared layout (navigation, footer)
│   ├── pages/                 # Pages (landing, topics, and topic pages)
│   ├── charts/                # D3 chart modules (one chart per file)
│   └── fetch_inflation_data.py # Helper script to download CPI data from Statistics Canada
├── data/                      # Optional local data outputs (not served automatically)
└── .github/workflows/          # GitHub Actions (build and deploy to GitHub Pages)
```

## Data Sources

We use publicly available data from various Canadian sources, including:
- Statistics Canada
- Open Data portals (federal, provincial, municipal)
- Government APIs
- Other publicly accessible datasets

## Contributing

This is a collaborative project. Feel free to:
- Add new visualisations
- Improve existing code
- Suggest new data sources
- Enhance documentation

## Developing project

This repository is a small website for publishing interactive charts using Data Driven Documents (D3). It is built with Vite (a small development server and build tool) and deployed as a static site on GitHub Pages.

### What you need

- Node.js
- Node Package Manager (npm)

### How to run the site locally

From the repository root:

```bash
npm install
npm run dev
```

Vite will print a local address to open in your browser. While it is running, edits to files in `src/` will refresh the page automatically.

### How pages and navigation work

GitHub Pages is a static host. To avoid “page not found” errors when navigating directly to a deep link, this project uses **hash based routes** (for example `/#/topics`).

The router is defined in `src/router.js`. It maps a route string to a page module.

### Project structure (website)

- `index.html`: the single app shell
- `src/main.js`: boots the app, sets up the shared layout, and starts routing
- `src/router.js`: hash router and route table
- `src/layout/`: shared layout used on every page (header, navigation, footer)
- `src/components/`: shared user interface components
- `src/pages/`: page modules
  - `src/pages/topics/`: topic pages (one folder per topic page is fine if a topic grows)
- `src/charts/`: chart modules (one chart per file)
- `public/data/`: static data files served by the site (charts can load from here)

### How to add a new topic page

1. Create a new page module in `src/pages/topics/`, for example `src/pages/topics/Housing.js`.
2. Add a route in `src/router.js`, for example:
   - `"/topics/housing": HousingPage`
3. Add a navigation link (optional) in `src/components/NavBar.js`.
4. Add a tile in `src/pages/TopicsIndex.js` so it appears on the Topics page.

Each page module should export a function that returns an object with:
- `title`: used for the browser tab title
- `render(outlet)`: called to render the page into the main content area
- optional `destroy()`: clean up any listeners or chart state when navigating away

### How to add a D3 chart to a page

1. Add a chart module in `src/charts/`, for example `src/charts/housingChart.js`.
2. Export a single render function that takes a container element and inputs (data path, size).
3. From the page module, create a `div` as the chart mount point and call the chart render function.
4. Put any small CSV or other static files the chart needs in `public/data/`, then load them using `import.meta.env.BASE_URL` as a prefix (this keeps paths working on GitHub Pages).

### Building and deploying

To create a production build locally:

```bash
npm run build
```

Deployment uses GitHub Actions in `.github/workflows/deploy.yml`:
- Work normally on the `main` branch.
- When you are ready to publish, merge or push changes to the `production` branch.
- A push to `production` triggers the workflow, which builds the site and deploys it to GitHub Pages.

## License

This project is open source. Please ensure any data used complies with the terms of use from the respective data sources.

