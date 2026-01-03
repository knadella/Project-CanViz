"""
Script to fetch Food subcategory CPI data from Statistics Canada.
Extracts Food and all Food subcategories for contribution analysis.
"""

import csv
from pathlib import Path
from datetime import datetime
import json

# Food subcategories to extract
# Note: We use only leaf categories to avoid double-counting
# "Food from Restaurants" is a parent of the other restaurant categories
FOOD_CATEGORIES = [
    ("Food", "Food"),  # Overall Food category for validation
    ("Food purchased from stores", "Food from Stores"),
    # Skip "Food purchased from restaurants" to avoid double-counting
    ("Food purchased from fast food and take-out restaurants", "Fast Food & Take-out"),
    ("Food purchased from table-service restaurants", "Table-Service Restaurants"),
    ("Food purchased from cafeterias and other restaurants", "Cafeterias & Other"),
]

def process_food_subcategory_data(csv_path: Path, output_path: Path = None, years: int = 10):
    """
    Process inflation data to extract Food subcategory CPI data.
    
    Args:
        csv_path: Path to the inflation_data.csv file
        output_path: Path to save the processed JSON file
        years: Number of years of data to extract (default 10)
    """
    if output_path is None:
        project_root = Path(__file__).parent.parent
        output_path = project_root / "data" / "food_subcategories.json"
    
    # Dictionary to store data for each category
    category_data = {display_name: [] for _, display_name in FOOD_CATEGORIES}
    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            geo = row.get('GEO', '').strip('"')
            product = row.get('Products and product groups', '').strip('"')
            uom = row.get('UOM', '').strip('"')
            
            # Filter for Canada, 2002=100
            if geo == 'Canada' and uom == '2002=100':
                # Check if this product matches any of our Food categories
                for category_name, display_name in FOOD_CATEGORIES:
                    if product == category_name:
                        # Parse date
                        ref_date = row.get('REF_DATE', '').strip('"')
                        value_str = row.get('VALUE', '').strip('"')
                        try:
                            date_obj = datetime.strptime(ref_date, '%Y-%m')
                            value = float(value_str)
                            
                            category_data[display_name].append({
                                'date': ref_date,
                                'year': date_obj.year,
                                'month': date_obj.month,
                                'value': value
                            })
                        except (ValueError, KeyError):
                            continue
                        break  # Found match, move to next row
    
    # Process each category
    series_data = []
    
    for display_name, data_points in category_data.items():
        if not data_points:
            print(f"⚠ Warning: No data found for {display_name}")
            continue
        
        # Sort by date
        data_points.sort(key=lambda x: x['date'])
        
        # Get the last N years
        latest_date = data_points[-1]['date']
        latest_year = int(latest_date.split('-')[0])
        cutoff_year = latest_year - years
        
        filtered_data = [
            dp for dp in data_points 
            if int(dp['date'].split('-')[0]) >= cutoff_year
        ]
        
        if filtered_data:
            series_data.append({
                'category': display_name,
                'data': filtered_data
            })
            print(f"✓ {display_name}: {len(filtered_data)} data points ({filtered_data[0]['date']} to {filtered_data[-1]['date']})")
        else:
            print(f"⚠ {display_name}: No data in the specified range")
    
    if series_data:
        # Save to JSON
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                'series': series_data,
                'date_range': {
                    'start': min(s['data'][0]['date'] for s in series_data),
                    'end': max(s['data'][-1]['date'] for s in series_data)
                }
            }, f, indent=2)
        
        print(f"\n✓ Saved {len(series_data)} Food subcategory series to {output_path}")
        return output_path
    else:
        print("✗ No series data to save")
        return None


if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    csv_path = project_root / "data" / "inflation_data.csv"
    output_path = project_root / "data" / "food_subcategories.json"
    
    process_food_subcategory_data(csv_path, output_path, years=10)

