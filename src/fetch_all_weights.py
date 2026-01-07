"""
Fetch complete CPI basket weights from Statistics Canada.
Table 18-10-0007-01: Consumer Price Index basket weights, Canada

This script fetches weights for ALL categories and subcategories.
"""

import requests
import zipfile
import io
import csv
from pathlib import Path
import json
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

STATCAN_BASE_URL = "https://www150.statcan.gc.ca/t1/wds/rest"
BASKET_WEIGHTS_TABLE = "18100007"


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
            # Use utf-8-sig to handle BOM
            return f.read().decode('utf-8-sig')


def parse_all_weights(csv_content: str) -> dict:
    """Parse all weights from the CSV and build a comprehensive hierarchy."""
    
    reader = csv.DictReader(io.StringIO(csv_content))
    
    weights_by_year = {}
    
    for row in reader:
        ref_date = row.get('REF_DATE', '')
        geo = row.get('GEO', '')
        product = row.get('Products and product groups', '')
        price_period = row.get('Price period of weight', '')
        geo_dist = row.get('Geographic distribution of weight', '')
        value = row.get('VALUE', '')
        
        # Filter for Canada, link month prices, distribution to selected geographies
        if geo != 'Canada':
            continue
        if 'link month' not in price_period.lower():
            continue
        if 'selected geographies' not in geo_dist.lower():
            continue
        if not value or value == '':
            continue
            
        try:
            weight = float(value)
        except ValueError:
            continue
        
        if ref_date not in weights_by_year:
            weights_by_year[ref_date] = {}
        weights_by_year[ref_date][product] = weight
    
    return weights_by_year


def build_hierarchy(weights: dict) -> dict:
    """Build hierarchical structure of weights for use in charts."""
    
    # Main CPI categories
    main_categories = {
        "Food": weights.get("Food", 0),
        "Shelter": weights.get("Shelter", 0),
        "Household operations, furnishings and equipment": weights.get("Household operations, furnishings and equipment", 0),
        "Clothing and footwear": weights.get("Clothing and footwear", 0),
        "Transportation": weights.get("Transportation", 0),
        "Health and personal care": weights.get("Health and personal care", 0),
        "Recreation, education and reading": weights.get("Recreation, education and reading", 0),
        "Alcoholic beverages, tobacco products and recreational cannabis": weights.get("Alcoholic beverages, tobacco products and recreational cannabis", 0),
    }
    
    # Food subcategories with deep hierarchy
    food_hierarchy = {
        "Food purchased from stores": {
            "weight": weights.get("Food purchased from stores", 0),
            "children": {
                "Meat": {
                    "weight": weights.get("Meat", 0),
                    "children": {
                        "Fresh or frozen meat (excluding poultry)": {
                            "weight": weights.get("Fresh or frozen meat (excluding poultry)", 0),
                            "children": {
                                "Fresh or frozen beef": weights.get("Fresh or frozen beef", 0),
                                "Fresh or frozen pork": weights.get("Fresh or frozen pork", 0),
                                "Other fresh or frozen meat (excluding poultry)": weights.get("Other fresh or frozen meat (excluding poultry)", 0),
                            }
                        },
                        "Fresh or frozen poultry": {
                            "weight": weights.get("Fresh or frozen poultry", 0),
                            "children": {
                                "Fresh or frozen chicken": weights.get("Fresh or frozen chicken", 0),
                                "Other fresh or frozen poultry": weights.get("Other fresh or frozen poultry", 0),
                            }
                        },
                        "Processed meat": {
                            "weight": weights.get("Processed meat", 0),
                            "children": {
                                "Ham and bacon": weights.get("Ham and bacon", 0),
                                "Other processed meat": weights.get("Other processed meat", 0),
                            }
                        }
                    }
                },
                "Fish, seafood and other marine products": {
                    "weight": weights.get("Fish, seafood and other marine products", 0),
                    "children": {
                        "Fish": weights.get("Fish", 0),
                        "Seafood and other marine products": weights.get("Seafood and other marine products", 0),
                    }
                },
                "Dairy products and eggs": {
                    "weight": weights.get("Dairy products and eggs", 0),
                    "children": {
                        "Dairy products": {
                            "weight": weights.get("Dairy products", 0),
                            "children": {
                                "Fresh milk": weights.get("Fresh milk", 0),
                                "Butter": weights.get("Butter", 0),
                                "Cheese": weights.get("Cheese", 0),
                                "Ice cream and related products": weights.get("Ice cream and related products", 0),
                                "Other dairy products": weights.get("Other dairy products", 0),
                            }
                        },
                        "Eggs": weights.get("Eggs", 0),
                    }
                },
                "Bakery and cereal products (excluding baby food)": {
                    "weight": weights.get("Bakery and cereal products (excluding baby food)", 0),
                    "children": {
                        "Bakery products": weights.get("Bakery products", 0),
                        "Cereal products (excluding baby food)": weights.get("Cereal products (excluding baby food)", 0),
                    }
                },
                "Fruit, fruit preparations and nuts": {
                    "weight": weights.get("Fruit, fruit preparations and nuts", 0),
                    "children": {
                        "Fresh fruit": weights.get("Fresh fruit", 0),
                        "Preserved fruit and fruit preparations": weights.get("Preserved fruit and fruit preparations", 0),
                        "Nuts and seeds": weights.get("Nuts and seeds", 0),
                    }
                },
                "Vegetables and vegetable preparations": {
                    "weight": weights.get("Vegetables and vegetable preparations", 0),
                    "children": {
                        "Fresh vegetables": weights.get("Fresh vegetables", 0),
                        "Preserved vegetables and vegetable preparations": weights.get("Preserved vegetables and vegetable preparations", 0),
                    }
                },
                "Other food products and non-alcoholic beverages": {
                    "weight": weights.get("Other food products and non-alcoholic beverages", 0),
                    "children": {
                        "Sugar and confectionery": weights.get("Sugar and confectionery", 0),
                        "Edible fats and oils": weights.get("Edible fats and oils", 0),
                        "Coffee and tea": weights.get("Coffee and tea", 0),
                        "Non-alcoholic beverages": weights.get("Non-alcoholic beverages", 0),
                        "Condiments, spices and vinegars": weights.get("Condiments, spices and vinegars", 0),
                        "Other food preparations": weights.get("Other food preparations", 0),
                    }
                }
            }
        },
        "Food purchased from restaurants": {
            "weight": weights.get("Food purchased from restaurants", 0),
            "children": {
                "Food purchased from fast food and take-out restaurants": weights.get("Food purchased from fast food and take-out restaurants", 0),
                "Food purchased from table-service restaurants": weights.get("Food purchased from table-service restaurants", 0),
                "Food purchased from cafeterias and other restaurants": weights.get("Food purchased from cafeterias and other restaurants", 0),
            }
        }
    }
    
    # Shelter subcategories
    shelter_hierarchy = {
        "Rented accommodation": {
            "weight": weights.get("Rented accommodation", 0),
            "children": {
                "Rent": weights.get("Rent", 0),
                "Tenants' insurance premiums": weights.get("Tenants' insurance premiums", 0),
                "Tenants' maintenance, repairs and other expenses": weights.get("Tenants' maintenance, repairs and other expenses", 0),
            }
        },
        "Owned accommodation": {
            "weight": weights.get("Owned accommodation", 0),
            "children": {
                "Mortgage interest cost": weights.get("Mortgage interest cost", 0),
                "Homeowners' replacement cost": weights.get("Homeowners' replacement cost", 0),
                "Property taxes and other special charges": weights.get("Property taxes and other special charges", 0),
                "Homeowners' home and mortgage insurance": weights.get("Homeowners' home and mortgage insurance", 0),
                "Homeowners' maintenance and repairs": weights.get("Homeowners' maintenance and repairs", 0),
                "Other owned accommodation expenses": weights.get("Other owned accommodation expenses", 0),
            }
        },
        "Water, fuel and electricity": {
            "weight": weights.get("Water, fuel and electricity", 0),
            "children": {
                "Water": weights.get("Water", 0),
                "Electricity": weights.get("Electricity", 0),
                "Natural gas": weights.get("Natural gas", 0),
                "Fuel oil and other fuels": weights.get("Fuel oil and other fuels", 0),
            }
        }
    }
    
    # Transportation subcategories
    transport_hierarchy = {
        "Private transportation": {
            "weight": weights.get("Private transportation", 0),
            "children": {
                "Purchase, leasing and rental of passenger vehicles": weights.get("Purchase, leasing and rental of passenger vehicles", 0),
                "Gasoline": weights.get("Gasoline", 0),
                "Operation of passenger vehicles": {
                    "weight": weights.get("Operation of passenger vehicles", 0),
                    "children": {
                        "Passenger vehicle parts, maintenance and repairs": weights.get("Passenger vehicle parts, maintenance and repairs", 0),
                        "Passenger vehicle insurance premiums": weights.get("Passenger vehicle insurance premiums", 0),
                        "Passenger vehicle registration fees": weights.get("Passenger vehicle registration fees", 0),
                        "Drivers' licences": weights.get("Drivers' licences", 0),
                        "Parking fees": weights.get("Parking fees", 0),
                        "Other passenger vehicle operating expenses": weights.get("Other passenger vehicle operating expenses", 0),
                    }
                }
            }
        },
        "Public transportation": {
            "weight": weights.get("Public transportation", 0),
            "children": {
                "Local and commuter transportation": weights.get("Local and commuter transportation", 0),
                "Inter-city transportation": weights.get("Inter-city transportation", 0),
            }
        }
    }
    
    return {
        "main_categories": main_categories,
        "food": food_hierarchy,
        "shelter": shelter_hierarchy,
        "transportation": transport_hierarchy,
        "all_weights": weights  # Keep the complete flat list too
    }


def save_weights(data: dict, output_path: Path, latest_year: str):
    """Save weights to JSON file."""
    
    output = {
        "year": latest_year,
        "source": "Statistics Canada Table 18-10-0007-01",
        "main_categories": data["main_categories"],
        "food_subcategories": data["food"],
        "shelter_subcategories": data["shelter"],
        "transportation_subcategories": data["transportation"],
        "all_weights_pct": data["all_weights"]  # Complete flat list in percent
    }
    
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w') as f:
        json.dump(output, f, indent=2)
    
    logger.info(f"Saved weights to {output_path}")
    return output


def main():
    project_root = Path(__file__).parent.parent
    output_path = project_root / "data" / "basket_weights.json"
    
    try:
        # Fetch the data
        csv_content = fetch_statcan_table(BASKET_WEIGHTS_TABLE)
        
        # Parse all weights by year
        weights_by_year = parse_all_weights(csv_content)
        
        # Get latest year
        latest_year = max(weights_by_year.keys())
        latest_weights = weights_by_year[latest_year]
        
        logger.info(f"Using latest year: {latest_year}")
        
        # Build hierarchy
        hierarchy = build_hierarchy(latest_weights)
        
        # Save
        output = save_weights(hierarchy, output_path, latest_year)
        
        print("\n" + "="*70)
        print(f"CPI BASKET WEIGHTS - {latest_year}")
        print("="*70)
        
        print("\n📊 MAIN CATEGORIES:")
        for cat, weight in sorted(output['main_categories'].items(), key=lambda x: -x[1]):
            print(f"  {weight:6.2f}%  {cat}")
        
        print("\n🍔 FOOD BREAKDOWN:")
        food_total = output['main_categories'].get('Food', 0)
        print(f"  Total Food: {food_total:.2f}%")
        
        stores = latest_weights.get("Food purchased from stores", 0)
        restaurants = latest_weights.get("Food purchased from restaurants", 0)
        print(f"    ├─ Food from stores: {stores:.2f}%")
        print(f"    └─ Food from restaurants: {restaurants:.2f}%")
        
        # Show some food subcategories
        food_items = [
            ("Meat", latest_weights.get("Meat", 0)),
            ("Dairy products and eggs", latest_weights.get("Dairy products and eggs", 0)),
            ("Fresh fruit and vegetables", latest_weights.get("Fresh fruit and vegetables", 0)),
            ("Bakery and cereal products", latest_weights.get("Bakery and cereal products (excluding baby food)", 0)),
            ("Fast food & take-out", latest_weights.get("Food purchased from fast food and take-out restaurants", 0)),
            ("Table-service restaurants", latest_weights.get("Food purchased from table-service restaurants", 0)),
        ]
        print("\n  Key food items:")
        for name, weight in sorted(food_items, key=lambda x: -x[1]):
            print(f"    {weight:5.2f}%  {name}")
        
        print("\n🏠 SHELTER BREAKDOWN:")
        shelter_total = output['main_categories'].get('Shelter', 0)
        print(f"  Total Shelter: {shelter_total:.2f}%")
        
        shelter_items = [
            ("Owned accommodation", latest_weights.get("Owned accommodation", 0)),
            ("Rented accommodation", latest_weights.get("Rented accommodation", 0)),
            ("Mortgage interest cost", latest_weights.get("Mortgage interest cost", 0)),
            ("Rent", latest_weights.get("Rent", 0)),
            ("Utilities", latest_weights.get("Water, fuel and electricity", 0)),
        ]
        for name, weight in sorted(shelter_items, key=lambda x: -x[1]):
            print(f"    {weight:5.2f}%  {name}")
        
        print("\n🚗 TRANSPORTATION BREAKDOWN:")
        transport_total = output['main_categories'].get('Transportation', 0)
        print(f"  Total Transportation: {transport_total:.2f}%")
        
        transport_items = [
            ("Private transportation", latest_weights.get("Private transportation", 0)),
            ("Gasoline", latest_weights.get("Gasoline", 0)),
            ("Public transportation", latest_weights.get("Public transportation", 0)),
            ("Vehicle insurance", latest_weights.get("Passenger vehicle insurance premiums", 0)),
        ]
        for name, weight in sorted(transport_items, key=lambda x: -x[1]):
            print(f"    {weight:5.2f}%  {name}")
        
        print(f"\n✓ Complete weights saved to: {output_path}")
        print(f"  Total items: {len(output['all_weights_pct'])} categories")
        
    except Exception as e:
        logger.error(f"Error: {e}")
        print(f"\n✗ Failed to fetch weights: {e}")
        print("\nManual download available at:")
        print("https://www150.statcan.gc.ca/t1/tbl1/en/tv.action?pid=1810000701")
        raise


if __name__ == "__main__":
    main()
