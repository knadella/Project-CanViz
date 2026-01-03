"""
Script to fetch CPI basket weights from Statistics Canada.
Statistics Canada provides basket weights at reference period prices and link month prices.
"""

import requests
import zipfile
import io
import csv
from pathlib import Path
import logging
import json

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Statistics Canada API base URL
STATCAN_BASE_URL = "https://www150.statcan.gc.ca/t1/wds/rest"

# CPI Basket Weights product ID - need to verify this is correct
# Common product IDs for basket weights might be different
# This may need to be updated based on actual StatCan API documentation
BASKET_WEIGHTS_PRODUCT_ID = "18100005"  # This is a placeholder - may need adjustment


def fetch_statcan_data(product_id: str, language: str = "en") -> str:
    """
    Fetch data from Statistics Canada API using getFullTableDownloadCSV.
    Returns the CSV content as a string.
    """
    url = f"{STATCAN_BASE_URL}/getFullTableDownloadCSV/{product_id}/{language}"
    
    logger.info(f"Fetching StatCan data from: {url}")
    
    try:
        # Step 1: Get the CSV download URL
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        result = response.json()
        
        # Extract download URL
        if not isinstance(result, dict) or 'object' not in result:
            raise ValueError(f"Unexpected API response format: {result}")
        
        download_url = result.get('object')
        logger.info(f"Download URL: {download_url}")
        
        # Step 2: Download the ZIP file
        logger.info("Downloading ZIP file...")
        zip_response = requests.get(download_url, timeout=60)
        zip_response.raise_for_status()
        
        # Step 3: Extract CSV from ZIP
        logger.info("Extracting CSV from ZIP...")
        with zipfile.ZipFile(io.BytesIO(zip_response.content)) as z:
            # Find CSV file (should be {PID}.csv, exclude metadata files)
            csv_files = [f for f in z.namelist() if f.endswith('.csv') and not f.endswith('_MetaData.csv')]
            
            if not csv_files:
                raise ValueError("No CSV file found in ZIP archive")
            
            csv_file = csv_files[0]
            logger.info(f"Reading CSV file: {csv_file}")
            
            # Read CSV content
            with z.open(csv_file) as f:
                csv_content = f.read().decode('utf-8')
        
        logger.info(f"Successfully extracted {len(csv_content)} characters of CSV data")
        return csv_content
        
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching StatCan data: {e}")
        raise
    except Exception as e:
        logger.error(f"Error processing StatCan data: {e}")
        raise


def extract_basket_weights_from_csv(csv_content: str, output_path: Path = None):
    """
    Extract basket weights from CSV content and save as JSON.
    This function needs to be customized based on the actual structure
    of the basket weights CSV from Statistics Canada.
    """
    if output_path is None:
        project_root = Path(__file__).parent.parent
        output_path = project_root / "data" / "basket_weights.json"
    
    # Parse CSV and extract weights
    # Note: This structure will need to be adjusted based on actual CSV format
    weights_data = {
        'reference_period_weights': {},
        'link_month_weights': {},
        'last_updated': None
    }
    
    reader = csv.DictReader(io.StringIO(csv_content))
    
    # Food category mapping
    food_categories = {
        'Food': 'Food',
        'Food purchased from stores': 'Food from Stores',
        'Food purchased from restaurants': 'Food from Restaurants',
        'Food purchased from fast food and take-out restaurants': 'Fast Food & Take-out',
        'Food purchased from table-service restaurants': 'Table-Service Restaurants',
        'Food purchased from cafeterias and other restaurants': 'Cafeterias & Other',
    }
    
    for row in reader:
        # This parsing logic will need to be adjusted based on actual CSV structure
        # The CSV might have columns like: Category, Weight (Reference), Weight (Link Month), etc.
        product = row.get('Products and product groups', '').strip('"')
        
        if product in food_categories:
            display_name = food_categories[product]
            
            # Try to extract weights - column names may vary
            # Common column names might be: 'Weight', 'Basket weight', 'Reference weight', etc.
            weight_ref = row.get('Weight (Reference)', '').strip('"')
            weight_link = row.get('Weight (Link Month)', '').strip('"')
            
            if weight_ref:
                try:
                    weights_data['reference_period_weights'][display_name] = float(weight_ref)
                except ValueError:
                    pass
            
            if weight_link:
                try:
                    weights_data['link_month_weights'][display_name] = float(weight_link)
                except ValueError:
                    pass
    
    # Save to JSON
    output_path.parent.mkdir(parents=True, exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(weights_data, f, indent=2)
    
    logger.info(f"✓ Saved basket weights to {output_path}")
    return output_path


def save_basket_weights(output_dir: Path = None, product_id: str = None):
    """
    Fetch basket weights from Statistics Canada and save to JSON file.
    
    Args:
        output_dir: Directory to save the JSON file (defaults to project root/data/)
        product_id: Statistics Canada product ID for basket weights
    """
    # Default to project root/data/ directory
    if output_dir is None:
        project_root = Path(__file__).parent.parent
        output_dir = project_root / "data"
    
    # Use provided product ID or default
    if product_id is None:
        product_id = BASKET_WEIGHTS_PRODUCT_ID
    
    logger.info(f"Fetching basket weights (Product ID: {product_id})...")
    logger.warning("Note: Product ID may need to be verified/updated based on StatCan API")
    
    try:
        # Fetch the data
        csv_content = fetch_statcan_data(product_id, language="en")
        
        # Extract and save weights
        output_file = output_dir / "basket_weights.json"
        extract_basket_weights_from_csv(csv_content, output_file)
        
        logger.info(f"✓ Successfully saved basket weights to {output_file}")
        return output_file
        
    except Exception as e:
        logger.error(f"Failed to fetch and save basket weights: {e}")
        logger.info("You may need to manually download basket weights from Statistics Canada")
        logger.info("or update the product ID if it's incorrect")
        raise


if __name__ == "__main__":
    try:
        output_file = save_basket_weights()
        print(f"\n✓ Basket weights saved to: {output_file}")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        print("\nNote: You may need to:")
        print("1. Verify the correct Statistics Canada product ID for basket weights")
        print("2. Manually download basket weights from Statistics Canada website")
        print("3. Or provide basket weights manually in data/basket_weights.json")
        exit(1)

