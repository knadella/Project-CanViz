"""
Script to fetch inflation (CPI) data from Statistics Canada API.
Based on the data fetcher pattern from macro_kpi_update project.
"""

import requests
import zipfile
import io
from pathlib import Path
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Statistics Canada API base URL
STATCAN_BASE_URL = "https://www150.statcan.gc.ca/t1/wds/rest"

# Consumer Price Index (CPI) product ID - 18100004 is the main CPI table
CPI_PRODUCT_ID = "18100004"


def fetch_statcan_data(product_id: str, language: str = "en") -> str:
    """
    Fetch data from Statistics Canada API using getFullTableDownloadCSV.
    Returns the CSV content as a string.
    
    Args:
        product_id: Statistics Canada product ID (PID) - must be 8 digits
        language: Language code (en or fr)
        
    Returns:
        CSV content as string
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


def save_inflation_data(output_dir: Path = Path("data")):
    """
    Fetch inflation (CPI) data from Statistics Canada and save to CSV file.
    
    Args:
        output_dir: Directory to save the CSV file
    """
    # Create output directory if it doesn't exist
    output_dir.mkdir(exist_ok=True)
    
    # Output file path
    output_file = output_dir / "inflation_data.csv"
    
    logger.info(f"Fetching inflation data (Product ID: {CPI_PRODUCT_ID})...")
    
    try:
        # Fetch the data
        csv_content = fetch_statcan_data(CPI_PRODUCT_ID, language="en")
        
        # Save to file
        logger.info(f"Saving data to {output_file}...")
        with open(output_file, 'w', encoding='utf-8') as f:
            f.write(csv_content)
        
        logger.info(f"✓ Successfully saved inflation data to {output_file}")
        logger.info(f"  File size: {len(csv_content)} characters")
        
        return output_file
        
    except Exception as e:
        logger.error(f"Failed to fetch and save inflation data: {e}")
        raise


if __name__ == "__main__":
    try:
        output_file = save_inflation_data()
        print(f"\n✓ Inflation data saved to: {output_file}")
    except Exception as e:
        print(f"\n✗ Error: {e}")
        exit(1)

