"""
Fetch CPI index data for ALL categories and subcategories from Statistics Canada.
This creates a comprehensive dataset for the deep-drill icicle chart.
"""

import csv
from pathlib import Path
from datetime import datetime
import json

# Complete hierarchy mapping: StatCan name -> display name
# Organized by main category
ALL_CATEGORIES = {
    # FOOD - Main and all subcategories
    "Food": "Food",
    "Food purchased from stores": "Food from Stores",
    "Meat": "Meat",
    "Fresh or frozen meat (excluding poultry)": "Fresh/Frozen Meat",
    "Fresh or frozen beef": "Beef",
    "Fresh or frozen pork": "Pork",
    "Fresh or frozen poultry": "Poultry",
    "Fresh or frozen chicken": "Chicken",
    "Processed meat": "Processed Meat",
    "Fish, seafood and other marine products": "Fish & Seafood",
    "Dairy products and eggs": "Dairy & Eggs",
    "Dairy products": "Dairy Products",
    "Fresh milk": "Fresh Milk",
    "Butter": "Butter",
    "Cheese": "Cheese",
    "Eggs": "Eggs",
    "Bakery and cereal products (excluding baby food)": "Bakery & Cereals",
    "Bakery products": "Bakery Products",
    "Cereal products (excluding baby food)": "Cereal Products",
    "Fruit, fruit preparations and nuts": "Fruits & Nuts",
    "Fresh fruit": "Fresh Fruit",
    "Preserved fruit and fruit preparations": "Preserved Fruit",
    "Nuts and seeds": "Nuts & Seeds",
    "Vegetables and vegetable preparations": "Vegetables",
    "Fresh vegetables": "Fresh Vegetables",
    "Preserved vegetables and vegetable preparations": "Preserved Vegetables",
    "Other food products and non-alcoholic beverages": "Other Food & Beverages",
    "Sugar and confectionery": "Sugar & Candy",
    "Coffee and tea": "Coffee & Tea",
    "Non-alcoholic beverages": "Soft Drinks",
    "Other food preparations": "Other Prepared Foods",
    "Food purchased from restaurants": "Restaurants",
    "Food purchased from fast food and take-out restaurants": "Fast Food",
    "Food purchased from table-service restaurants": "Table Service",
    "Food purchased from cafeterias and other restaurants": "Cafeterias",
    
    # SHELTER
    "Shelter": "Shelter",
    "Rented accommodation": "Rented",
    "Rent": "Rent",
    "Tenants' insurance premiums": "Tenant Insurance",
    "Owned accommodation": "Owned",
    "Mortgage interest cost": "Mortgage Interest",
    "Homeowners' replacement cost": "Replacement Cost",
    "Property taxes and other special charges": "Property Taxes",
    "Homeowners' home and mortgage insurance": "Home Insurance",
    "Homeowners' maintenance and repairs": "Maintenance",
    "Water, fuel and electricity": "Utilities",
    "Electricity": "Electricity",
    "Natural gas": "Natural Gas",
    "Water": "Water",
    "Fuel oil and other fuels": "Fuel Oil",
    
    # TRANSPORTATION
    "Transportation": "Transportation",
    "Private transportation": "Private Transport",
    "Purchase, leasing and rental of passenger vehicles": "Vehicle Purchase",
    "Purchase of passenger vehicles": "New/Used Vehicles",
    "Leasing of passenger vehicles": "Vehicle Leasing",
    "Gasoline": "Gasoline",
    "Operation of passenger vehicles": "Vehicle Operation",
    "Passenger vehicle parts, maintenance and repairs": "Parts & Repairs",
    "Passenger vehicle insurance premiums": "Auto Insurance",
    "Public transportation": "Public Transport",
    "Local and commuter transportation": "Local Transit",
    "City bus and subway transportation": "Bus & Subway",
    "Inter-city transportation": "Inter-city",
    "Air transportation": "Air Travel",
    
    # HOUSEHOLD
    "Household operations, furnishings and equipment": "Household",
    "Household operations": "Operations",
    "Communications": "Communications",
    "Telephone services": "Phone",
    "Internet access services": "Internet",
    "Cellular services": "Cellular",
    "Child care and housekeeping services": "Childcare & Housekeeping",
    "Household cleaning products": "Cleaning Products",
    "Other household goods and services": "Other Services",
    "Financial services": "Financial Services",
    "Household furnishings and equipment": "Furnishings",
    "Furniture and household textiles": "Furniture",
    "Household equipment": "Equipment",
    "Household appliances": "Appliances",
    
    # CLOTHING
    "Clothing and footwear": "Clothing",
    "Clothing": "Apparel",
    "Women's clothing": "Women's",
    "Men's clothing": "Men's",
    "Children's clothing": "Children's",
    "Footwear": "Footwear",
    
    # HEALTH
    "Health and personal care": "Health & Care",
    "Health care": "Health Care",
    "Health care goods": "Health Goods",
    "Medicinal and pharmaceutical products": "Medicines",
    "Health care services": "Health Services",
    "Dental care services": "Dental",
    "Personal care": "Personal Care",
    "Personal care supplies and equipment": "Personal Products",
    "Personal care services": "Personal Services",
    
    # RECREATION
    "Recreation, education and reading": "Recreation & Education",
    "Recreation": "Recreation",
    "Recreational equipment and services (excluding recreational vehicles)": "Rec Equipment",
    "Purchase and operation of recreational vehicles": "Rec Vehicles",
    "Home entertainment equipment, parts and services": "Home Entertainment",
    "Travel services": "Travel",
    "Traveller accommodation": "Hotels",
    "Travel tours": "Tours",
    "Other cultural and recreational services": "Other Recreation",
    "Education and reading": "Education",
    "Education": "Schools",
    "Tuition fees": "Tuition",
    "Reading material (excluding textbooks)": "Reading",
    
    # ALCOHOL & TOBACCO
    "Alcoholic beverages, tobacco products and recreational cannabis": "Alcohol & Tobacco",
    "Alcoholic beverages": "Alcohol",
    "Alcoholic beverages served in licensed establishments": "Bars & Restaurants",
    "Alcoholic beverages purchased from stores": "Liquor Stores",
    "Tobacco products and smokers' supplies": "Tobacco",
    "Recreational cannabis": "Cannabis",
}

def process_all_subcategories(csv_path: Path, output_path: Path = None, years: int = 10):
    """
    Process CPI data for all categories and subcategories.
    """
    if output_path is None:
        project_root = Path(__file__).parent.parent
        output_path = project_root / "data" / "all_subcategories.json"
    
    # Dictionary to store data for each category
    category_data = {display_name: [] for display_name in ALL_CATEGORIES.values()}
    
    print(f"Reading CSV from: {csv_path}")
    
    with open(csv_path, 'r', encoding='utf-8-sig') as f:
        reader = csv.DictReader(f)
        
        for row in reader:
            geo = row.get('GEO', '').strip('"')
            product = row.get('Products and product groups', '').strip('"')
            uom = row.get('UOM', '').strip('"')
            
            # Filter for Canada, 2002=100 base
            if geo == 'Canada' and uom == '2002=100':
                # Check if this product matches any of our categories
                if product in ALL_CATEGORIES:
                    display_name = ALL_CATEGORIES[product]
                    
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
    
    # Process each category
    series_data = []
    found_count = 0
    missing = []
    
    for display_name, data_points in category_data.items():
        if not data_points:
            missing.append(display_name)
            continue
        
        found_count += 1
        
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
    
    print(f"\n✓ Found data for {found_count} categories")
    if missing:
        print(f"⚠ Missing data for {len(missing)} categories:")
        for m in missing[:10]:
            print(f"   - {m}")
        if len(missing) > 10:
            print(f"   ... and {len(missing) - 10} more")
    
    if series_data:
        # Save to JSON
        output_path.parent.mkdir(parents=True, exist_ok=True)
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump({
                'series': series_data,
                'date_range': {
                    'start': min(s['data'][0]['date'] for s in series_data),
                    'end': max(s['data'][-1]['date'] for s in series_data)
                },
                'category_count': len(series_data)
            }, f, indent=2)
        
        print(f"\n✓ Saved {len(series_data)} category series to {output_path}")
        return output_path
    else:
        print("✗ No series data to save")
        return None


if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    csv_path = project_root / "data" / "inflation_data.csv"
    output_path = project_root / "data" / "all_subcategories.json"
    
    process_all_subcategories(csv_path, output_path, years=10)


