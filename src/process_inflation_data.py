"""
Script to process inflation data for the index chart visualization.
Extracts the last 10 years of monthly Canada All-items CPI data.
"""

import csv
from pathlib import Path
from datetime import datetime
import json

def process_inflation_data_for_index_chart(csv_path: Path, output_path: Path = None, years: int = 10):
    """
    Process inflation data to extract the last N years of monthly Canada All-items CPI data.
    
    Args:
        csv_path: Path to the inflation_data.csv file
        output_path: Path to save the processed JSON file (defaults to data/inflation_index_data.json)
        years: Number of years of data to extract (default 10)
    """
    if output_path is None:
        project_root = Path(__file__).parent.parent
        output_path = project_root / "data" / "inflation_index_data.json"
    
    # Read and filter data
    data_points = []
    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:  # utf-8-sig handles BOM
        reader = csv.DictReader(f)
        
        for row in reader:
            # Filter for Canada, All-items, 2002=100
            # Keys may have quotes, so try both
            geo = row.get('GEO', '').strip('"')
            product = row.get('Products and product groups', '').strip('"')
            uom = row.get('UOM', '').strip('"')
            
            if (geo == 'Canada' and 
                product == 'All-items' and
                uom == '2002=100'):
                
                # Parse date
                ref_date = row.get('REF_DATE', '').strip('"')
                value_str = row.get('VALUE', '').strip('"')
                try:
                    date_obj = datetime.strptime(ref_date, '%Y-%m')
                    value = float(value_str)
                    
                    data_points.append({
                        'date': ref_date,
                        'year': date_obj.year,
                        'month': date_obj.month,
                        'value': value
                    })
                except (ValueError, KeyError) as e:
                    continue
    
    # Sort by date
    data_points.sort(key=lambda x: x['date'])
    
    # Get the last N years
    if data_points:
        latest_date = data_points[-1]['date']
        latest_year = int(latest_date.split('-')[0])
        cutoff_year = latest_year - years
        
        filtered_data = [
            dp for dp in data_points 
            if int(dp['date'].split('-')[0]) >= cutoff_year
        ]
        
        # Normalize to index (first value = 100)
        if filtered_data:
            base_value = filtered_data[0]['value']
            
            indexed_data = [
                {
                    'date': dp['date'],
                    'year': dp['year'],
                    'month': dp['month'],
                    'value': dp['value'],
                    'index': (dp['value'] / base_value) * 100
                }
                for dp in filtered_data
            ]
            
            # Save to JSON
            output_path.parent.mkdir(parents=True, exist_ok=True)
            with open(output_path, 'w', encoding='utf-8') as f:
                json.dump({
                    'base_date': filtered_data[0]['date'],
                    'base_value': base_value,
                    'data': indexed_data
                }, f, indent=2)
            
            print(f"✓ Processed {len(indexed_data)} data points")
            print(f"  Date range: {indexed_data[0]['date']} to {indexed_data[-1]['date']}")
            print(f"  Base value: {base_value}")
            print(f"  Saved to: {output_path}")
            
            return output_path
        else:
            print("No data found in the specified range")
            return None
    else:
        print("No data points found")
        return None


if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    csv_path = project_root / "data" / "inflation_data.csv"
    output_path = project_root / "data" / "inflation_index_data.json"
    
    process_inflation_data_for_index_chart(csv_path, output_path, years=10)

