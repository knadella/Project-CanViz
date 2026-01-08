"""
Script to fetch grain production data from Statistics Canada API.
Table 32-10-0359: Estimated areas, yield and production of principal field crops
"""

import requests
import zipfile
import io
import csv
import json
import math
from pathlib import Path
from datetime import datetime
from collections import defaultdict
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

STATCAN_BASE_URL = "https://www150.statcan.gc.ca/t1/wds/rest"
GRAIN_PRODUCTION_TABLE = "32100359"

# Crop groupings structure (from YAML)
CROP_GROUPINGS = {
    "crop_groupings": {
        "Wheat": {
            "crops": ["Wheat, all"]
        },
        "Coarse Grains": {
            "crops": ["Barley", "Corn for grain", "Oats", "Rye, all", "Mixed grains"]
        },
        "Oilseeds": {
            "crops": ["Canola (rapeseed)", "Flaxseed", "Soybeans"]
        },
        "Pulses and Special Crops": {
            "crops": ["Peas, dry", "Lentils", "Beans, all dry (white and coloured)", "Chick peas", "Mustard seed", "Canary seed", "Sunflower seed"]
        }
    }
}


def fetch_statcan_table(table_id: str) -> str:
    """Fetch CSV data from Statistics Canada."""
    url = f"{STATCAN_BASE_URL}/getFullTableDownloadCSV/{table_id}/en"
    
    logger.info(f"Fetching table {table_id} from Statistics Canada...")
    
    response = requests.get(url, timeout=30)
    response.raise_for_status()
    result = response.json()
    
    download_url = result.get('object')
    logger.info(f"Downloading from: {download_url}")
    
    zip_response = requests.get(download_url, timeout=120)
    zip_response.raise_for_status()
    
    with zipfile.ZipFile(io.BytesIO(zip_response.content)) as z:
        csv_files = [f for f in z.namelist() if f.endswith('.csv') and not f.endswith('_MetaData.csv')]
        if not csv_files:
            raise ValueError("No CSV file found")
        
        with z.open(csv_files[0]) as f:
            return f.read().decode('utf-8-sig')


def find_column_name(reader, possible_names):
    """Find the actual column name from a list of possible names (case-insensitive)."""
    if not reader.fieldnames:
        return None
    
    fieldnames_lower = {name.lower(): name for name in reader.fieldnames}
    
    for possible in possible_names:
        if possible.lower() in fieldnames_lower:
            return fieldnames_lower[possible.lower()]
    
    return None


def process_grain_data(csv_content: str, output_dir: Path):
    """Process grain production data and generate JSON files."""
    
    # Extract all crop names from groupings
    all_crops = []
    for group in CROP_GROUPINGS["crop_groupings"].values():
        all_crops.extend(group["crops"])
    
    logger.info(f"Processing data for {len(all_crops)} crops")
    
    # Save crop groupings JSON
    groupings_path = output_dir / "crop_groupings.json"
    with open(groupings_path, 'w', encoding='utf-8') as f:
        json.dump(CROP_GROUPINGS, f, indent=2)
    logger.info(f"Saved crop groupings to {groupings_path}")
    
    # Parse CSV and identify column names
    reader = csv.DictReader(io.StringIO(csv_content))
    
    # Find column names (try common variations)
    geo_col = find_column_name(reader, ['GEO', 'Geography', 'geo'])
    crop_col = find_column_name(reader, ['Type_of_crop', 'Type of crop', 'TYPE_OF_CROP', 'Crop', 'crop'])
    disposition_col = find_column_name(reader, ['Harvest_disposition', 'Harvest disposition', 'HARVEST_DISPOSITION', 'Disposition', 'disposition'])
    ref_date_col = find_column_name(reader, ['REF_DATE', 'REF_DATE', 'Reference date', 'Date', 'date', 'Year', 'year'])
    value_col = find_column_name(reader, ['VALUE', 'Value', 'value'])
    
    if not all([geo_col, crop_col, disposition_col, ref_date_col, value_col]):
        logger.error(f"Missing required columns. Found: {reader.fieldnames}")
        raise ValueError("Could not identify all required columns")
    
    logger.info(f"Using columns: GEO={geo_col}, Crop={crop_col}, Disposition={disposition_col}, Date={ref_date_col}, Value={value_col}")
    
    # Filter and process data
    production_data = defaultdict(lambda: defaultdict(float))  # crop -> year -> production
    area_data = defaultdict(lambda: defaultdict(float))  # crop -> year -> area
    
    for row in reader:
        geo = row.get(geo_col, '').strip('"').strip()
        crop = row.get(crop_col, '').strip('"').strip()
        disposition = row.get(disposition_col, '').strip('"').strip()
        ref_date = row.get(ref_date_col, '').strip('"').strip()
        value_str = row.get(value_col, '').strip('"').strip()
        
        # Filter for Canada and major crops
        if geo != 'Canada':
            continue
        
        if crop not in all_crops:
            continue
        
        if disposition not in ['Production (metric tonnes)', 'Seeded area (hectares)']:
            continue
        
        try:
            # Parse year from REF_DATE (could be YYYY or YYYY-MM format)
            if '-' in ref_date:
                year = int(ref_date.split('-')[0])
            else:
                year = int(ref_date)
            
            value = float(value_str)
            
            if disposition == 'Production (metric tonnes)':
                production_data[crop][year] += value
            elif disposition == 'Seeded area (hectares)':
                area_data[crop][year] += value
                
        except (ValueError, KeyError) as e:
            logger.debug(f"Skipping row: {e}")
            continue
    
    # Calculate aggregates and effective yields
    # Collect all years from all crops (ensure they're all integers)
    all_years = set()
    for crop_data in production_data.values():
        all_years.update(crop_data.keys())
    for crop_data in area_data.values():
        all_years.update(crop_data.keys())
    years = sorted(all_years)
    
    # Annual aggregates
    production_by_year = []
    area_by_year = []
    
    for year in years:
        total_production = sum(production_data[crop].get(year, 0) for crop in all_crops)
        total_area = sum(area_data[crop].get(year, 0) for crop in all_crops)
        
        if total_production > 0:
            production_by_year.append({"year": year, "value": total_production})
        if total_area > 0:
            area_by_year.append({"year": year, "value": total_area})
    
    # Crop components data
    crop_components = []
    for crop in sorted(all_crops):
        crop_years = sorted(set(
            list(production_data[crop].keys()) + 
            list(area_data[crop].keys())
        ))
        
        for year in crop_years:
            production = production_data[crop].get(year, 0)
            area = area_data[crop].get(year, 0)
            
            if production > 0:
                crop_components.append({
                    "year": year,
                    "crop": crop,
                    "measure": "Production (tonnes)",
                    "value": production
                })
            
            if area > 0:
                crop_components.append({
                    "year": year,
                    "crop": crop,
                    "measure": "Seeded area (hectares)",
                    "value": area
                })
            
            if production > 0 and area > 0:
                effective_yield = production / area
                crop_components.append({
                    "year": year,
                    "crop": crop,
                    "measure": "Effective yield (t/ha seeded)",
                    "value": effective_yield
                })
    
    # Calculate year breaks for x-axis
    def year_breaks(years):
        if not years:
            return []
        min_year = min(years)
        max_year = max(years)
        span = max_year - min_year
        
        if span > 100:
            interval = 25
        elif span >= 50:
            interval = 20
        else:
            interval = 10
        
        first_break = min_year
        while first_break % interval != 0:
            first_break += 1
        
        breaks = list(range(first_break, max_year + 1, interval))
        if breaks and breaks[-1] < max_year:
            breaks.append(max_year)
        
        return breaks
    
    # Decomposition calculation
    crop_panel = []
    for crop in sorted(all_crops):
        crop_years = sorted(set(
            list(production_data[crop].keys()) + 
            list(area_data[crop].keys())
        ))
        
        for year in crop_years:
            production = production_data[crop].get(year, 0)
            area = area_data[crop].get(year, 0)
            
            if production > 0 and area > 0:
                crop_panel.append({
                    "year": year,
                    "crop": crop,
                    "production": production,
                    "area": area,
                    "effective_yield": production / area
                })
    
    # Calculate annual aggregates for decomposition
    annual_aggregates = []
    for year in sorted(years):
        year_crops = [c for c in crop_panel if c["year"] == year]
        if not year_crops:
            continue
        
        total_prod = sum(c["production"] for c in year_crops)
        total_area = sum(c["area"] for c in year_crops)
        
        if total_area > 0:
            # Area-weighted average yield
            shares = [c["area"] / total_area for c in year_crops]
            avg_yield = sum(s * c["effective_yield"] for s, c in zip(shares, year_crops))
            
            annual_aggregates.append({
                "year": year,
                "p_total": total_prod,
                "a_total": total_area,
                "y_bar": avg_yield
            })
    
    # Calculate log changes and decomposition
    log_changes = []
    for i in range(1, len(annual_aggregates)):
        prev = annual_aggregates[i-1]
        curr = annual_aggregates[i]
        
        if prev["p_total"] > 0 and prev["a_total"] > 0 and curr["p_total"] > 0 and curr["a_total"] > 0:
            delta_ln_p = math.log(curr["p_total"]) - math.log(prev["p_total"])
            delta_ln_a = math.log(curr["a_total"]) - math.log(prev["a_total"])
            delta_ln_y_bar = math.log(curr["y_bar"]) - math.log(prev["y_bar"])
            
            # Within-crop yield effect
            prev_year = prev["year"]
            curr_year = curr["year"]
            
            prev_crops = {c["crop"]: c for c in crop_panel if c["year"] == prev_year}
            curr_crops = {c["crop"]: c for c in crop_panel if c["year"] == curr_year}
            
            common_crops = set(prev_crops.keys()) & set(curr_crops.keys())
            
            within_effect = 0.0
            if common_crops and prev["a_total"] > 0:
                for crop in common_crops:
                    prev_crop = prev_crops[crop]
                    curr_crop = curr_crops[crop]
                    
                    if prev_crop["effective_yield"] > 0 and curr_crop["effective_yield"] > 0:
                        share = prev_crop["area"] / prev["a_total"]
                        delta_ln_y = math.log(curr_crop["effective_yield"]) - math.log(prev_crop["effective_yield"])
                        within_effect += share * delta_ln_y
            
            mix_effect = delta_ln_y_bar - within_effect
            
            log_changes.append({
                "year": curr_year,
                "delta_ln_p": delta_ln_p,
                "delta_ln_a": delta_ln_a,
                "delta_ln_y_bar": delta_ln_y_bar,
                "within_effective_yield": within_effect,
                "crop_mix": mix_effect
            })
    
    # Calculate cumulative decomposition
    cumulative_data = []
    connecting_segments = []
    component_connectors = []
    
    cumulative_start = 0.0
    for i, change in enumerate(log_changes):
        # Seeded Area
        area_start = cumulative_start
        area_end = area_start + change["delta_ln_a"]
        
        # Within-Crop Effective Yield
        yield_start = area_end
        yield_end = yield_start + change["within_effective_yield"]
        
        # Crop Mix
        mix_start = yield_end
        mix_end = mix_start + change["crop_mix"]
        
        cumulative_data.extend([
            {
                "year": change["year"],
                "component": "Seeded Area",
                "value": change["delta_ln_a"],
                "cumulativeStart": area_start,
                "cumulativeEnd": area_end,
                "xPosition": change["year"] - 0.25
            },
            {
                "year": change["year"],
                "component": "Within-Crop Effective Yield",
                "value": change["within_effective_yield"],
                "cumulativeStart": yield_start,
                "cumulativeEnd": yield_end,
                "xPosition": change["year"]
            },
            {
                "year": change["year"],
                "component": "Crop Mix",
                "value": change["crop_mix"],
                "cumulativeStart": mix_start,
                "cumulativeEnd": mix_end,
                "xPosition": change["year"] + 0.25
            }
        ])
        
        # Connecting segments between years
        if i < len(log_changes) - 1:
            connecting_segments.append({
                "year": change["year"],
                "yearEnd": log_changes[i+1]["year"],
                "yValue": mix_end
            })
        
        # Component connectors within year
        component_connectors.extend([
            {
                "year": change["year"],
                "xStart": change["year"] - 0.25,
                "xEnd": change["year"],
                "yValue": area_end
            },
            {
                "year": change["year"],
                "xStart": change["year"],
                "xEnd": change["year"] + 0.25,
                "yValue": yield_end
            }
        ])
        
        cumulative_start = mix_end
    
    # Calculate statistics
    if production_by_year:
        first_year = min(p["year"] for p in production_by_year)
        last_year = max(p["year"] for p in production_by_year)
        first_production = next(p["value"] for p in production_by_year if p["year"] == first_year)
        last_production = next(p["value"] for p in production_by_year if p["year"] == last_year)
        
        production_2025 = last_production
        production_2025_million = round(production_2025 / 1000000, 1)
        production_ratio = round(production_2025 / first_production, 1) if first_production > 0 else 0
        production_multiplier = production_2025 / first_production if first_production > 0 else 0
    else:
        first_year = last_year = 1908
        production_2025_million = 0
        production_ratio = 0
        production_multiplier = 0
    
    if area_by_year:
        area_first_year = min(a["year"] for a in area_by_year)
        area_last_year = max(a["year"] for a in area_by_year)
        area_early = next(a["value"] for a in area_by_year if a["year"] == area_first_year)
        area_current = next(a["value"] for a in area_by_year if a["year"] == area_last_year)
        area_ratio = area_current / area_early if area_early > 0 else 0
        
        if area_ratio >= 10:
            area_multiplier = "decupled"
        elif area_ratio >= 9:
            area_multiplier = "nonupled"
        elif area_ratio >= 8:
            area_multiplier = "octupled"
        elif area_ratio >= 7:
            area_multiplier = "septupled"
        elif area_ratio >= 6:
            area_multiplier = "sextupled"
        elif area_ratio >= 5:
            area_multiplier = "quintupled"
        elif area_ratio >= 4:
            area_multiplier = "quadrupled"
        elif area_ratio >= 3:
            area_multiplier = "tripled"
        else:
            area_multiplier = "doubled"
    else:
        area_first_year = area_last_year = 1908
        area_multiplier = "doubled"
    
    # Cumulative contributions
    cumulative_log_change_production = sum(c["delta_ln_p"] for c in log_changes) * 100
    cumulative_area = sum(c["delta_ln_a"] for c in log_changes) * 100
    cumulative_within = sum(c["within_effective_yield"] for c in log_changes) * 100
    cumulative_mix = sum(c["crop_mix"] for c in log_changes) * 100
    
    # Count years with extreme within-crop yield changes
    within_exceeds_15_pre_1960 = sum(
        1 for c in log_changes 
        if abs(c["within_effective_yield"]) > 0.15 and c["year"] < 1960
    )
    within_exceeds_15_post_1960 = sum(
        1 for c in log_changes 
        if abs(c["within_effective_yield"]) > 0.15 and c["year"] >= 1960
    )
    
    # Save JSON files
    stats = {
        "firstYear": first_year,
        "lastYear": last_year,
        "production2025MillionTonnes": production_2025_million,
        "productionRatio": production_ratio,
        "areaFirstYear": area_first_year,
        "areaLastYear": area_last_year,
        "areaMultiplier": area_multiplier,
        "cumulativeLogChangeProduction": round(cumulative_log_change_production, 0),
        "cumulativeArea": round(cumulative_area, 0),
        "cumulativeWithin": round(cumulative_within, 0),
        "cumulativeMix": round(cumulative_mix, 0),
        "productionMultiplier": round(production_multiplier, 1),
        "withinExceeds15Pre1960": within_exceeds_15_pre_1960,
        "withinExceeds15Post1960": within_exceeds_15_post_1960
    }
    
    with open(output_dir / "grain_statistics.json", 'w', encoding='utf-8') as f:
        json.dump(stats, f, indent=2)
    
    prod_breaks = year_breaks([p["year"] for p in production_by_year])
    with open(output_dir / "grain_production_by_year.json", 'w', encoding='utf-8') as f:
        json.dump({
            "data": production_by_year,
            "xAxisBreaks": prod_breaks
        }, f, indent=2)
    
    area_breaks = year_breaks([a["year"] for a in area_by_year])
    with open(output_dir / "grain_area_by_year.json", 'w', encoding='utf-8') as f:
        json.dump({
            "data": area_by_year,
            "xAxisBreaks": area_breaks
        }, f, indent=2)
    
    crop_breaks = year_breaks([c["year"] for c in crop_components])
    unique_crops = sorted(set(c["crop"] for c in crop_components))
    measure_colours = {
        "Effective yield (t/ha seeded)": "#c87941",
        "Seeded area (hectares)": "#4a7c7a",
        "Production (tonnes)": "#000000"
    }
    
    with open(output_dir / "grain_crop_components.json", 'w', encoding='utf-8') as f:
        json.dump({
            "crops": unique_crops,
            "data": crop_components,
            "xAxisBreaks": crop_breaks,
            "measureColours": measure_colours
        }, f, indent=2)
    
    decomp_breaks = year_breaks([d["year"] for d in cumulative_data])
    unique_years = sorted(set(d["year"] for d in cumulative_data))
    colour_palette = {
        "Seeded Area": "#4a7c7a",
        "Within-Crop Effective Yield": "#c87941",
        "Crop Mix": "#4b3d60"
    }
    
    with open(output_dir / "grain_decomposition.json", 'w', encoding='utf-8') as f:
        json.dump({
            "cumulativeData": cumulative_data,
            "connectingSegments": connecting_segments,
            "componentConnectors": component_connectors,
            "xAxisBreaks": decomp_breaks,
            "colours": colour_palette,
            "uniqueYears": unique_years
        }, f, indent=2)
    
    logger.info("✓ Successfully generated all JSON files")


def main():
    """Main function to fetch and process grain production data."""
    project_root = Path(__file__).parent.parent
    output_dir = project_root / "public" / "data"
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        csv_content = fetch_statcan_table(GRAIN_PRODUCTION_TABLE)
        process_grain_data(csv_content, output_dir)
        logger.info("✓ Grain production data processing complete")
    except Exception as e:
        logger.error(f"✗ Error: {e}")
        raise


if __name__ == "__main__":
    main()
