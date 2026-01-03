"""
Script to calculate percentage point contributions of Food subcategories to Food inflation.
"""

import json
from pathlib import Path
from datetime import datetime
from typing import Dict, List, Tuple, Optional

def calculate_percentage_change(start_value: float, end_value: float) -> float:
    """
    Calculate percentage change between two CPI values.
    
    Args:
        start_value: CPI value at start date
        end_value: CPI value at end date
        
    Returns:
        Percentage change as a decimal (e.g., 0.04 for 4%)
    """
    if start_value == 0:
        return 0.0
    return (end_value / start_value - 1) * 100


def calculate_contribution(weight: float, percentage_change: float) -> float:
    """
    Calculate percentage point contribution.
    
    Args:
        weight: Basket weight as decimal (e.g., 0.647 for 64.7% within Food category)
        percentage_change: Percentage change (e.g., 4.67 for 4.67%)
        
    Returns:
        Contribution in percentage points
    """
    # Weight is already a decimal (0.647), percentage_change is in percent (4.67)
    # Contribution = weight × percentage_change
    # Example: 0.647 × 4.67 = 3.02 percentage points
    return weight * percentage_change


def get_cpi_value(series_data: List[Dict], date: str) -> Optional[float]:
    """
    Get CPI value for a specific date from series data.
    
    Args:
        series_data: List of data points with 'date' and 'value' keys
        date: Date string in 'YYYY-MM' format
        
    Returns:
        CPI value or None if not found
    """
    for point in series_data:
        if point['date'] == date:
            return point['value']
    return None


def calculate_food_contributions(
    food_data_path: Path,
    weights_path: Path,
    start_date: str,
    end_date: str,
    use_link_month_weights: bool = True
) -> Dict:
    """
    Calculate percentage point contributions of Food subcategories.
    
    Args:
        food_data_path: Path to food_subcategories.json
        weights_path: Path to basket_weights.json
        start_date: Start date in 'YYYY-MM' format
        end_date: End date in 'YYYY-MM' format
        use_link_month_weights: If True, use link month weights; else use reference period weights
        
    Returns:
        Dictionary with contribution analysis results
    """
    # Load food subcategory data
    with open(food_data_path, 'r', encoding='utf-8') as f:
        food_data = json.load(f)
    
    # Load basket weights
    with open(weights_path, 'r', encoding='utf-8') as f:
        weights_data = json.load(f)
    
    # Select which weights to use
    weights_key = 'link_month_weights' if use_link_month_weights else 'reference_period_weights'
    weights = weights_data.get(weights_key, {})
    
    # Calculate contributions for each subcategory
    contributions = []
    total_contribution = 0.0
    total_food_inflation = 0.0
    
    # Find the main Food category for overall inflation calculation
    food_series = None
    for series in food_data['series']:
        if series['category'] == 'Food':
            food_series = series
            break
    
    if food_series:
        food_start = get_cpi_value(food_series['data'], start_date)
        food_end = get_cpi_value(food_series['data'], end_date)
        if food_start and food_end:
            total_food_inflation = calculate_percentage_change(food_start, food_end)
    
    # Calculate contributions for each subcategory
    for series in food_data['series']:
        category = series['category']
        
        # Skip the main "Food" category (we'll use it for validation)
        if category == 'Food':
            continue
        
        # Get weight for this category
        weight = weights.get(category, 0.0)
        
        if weight == 0:
            print(f"⚠ Warning: No weight found for {category}")
            continue
        
        # Get CPI values
        start_value = get_cpi_value(series['data'], start_date)
        end_value = get_cpi_value(series['data'], end_date)
        
        if start_value is None or end_value is None:
            print(f"⚠ Warning: Missing data for {category} at {start_date} or {end_date}")
            continue
        
        # Calculate percentage change
        pct_change = calculate_percentage_change(start_value, end_value)
        
        # Calculate contribution
        contribution = calculate_contribution(weight, pct_change)
        total_contribution += contribution
        
        contributions.append({
            'category': category,
            'weight': weight,
            'start_value': start_value,
            'end_value': end_value,
            'percentage_change': pct_change,
            'contribution_pp': contribution
        })
    
    # Sort by absolute contribution (descending)
    contributions.sort(key=lambda x: abs(x['contribution_pp']), reverse=True)
    
    return {
        'start_date': start_date,
        'end_date': end_date,
        'use_link_month_weights': use_link_month_weights,
        'total_food_inflation_pct': total_food_inflation,
        'total_contribution_pp': total_contribution,
        'contributions': contributions,
        'validation': {
            'difference_pp': abs(total_food_inflation - total_contribution),
            'within_tolerance': abs(total_food_inflation - total_contribution) < 0.1
        }
    }


def format_contribution_report(results: Dict) -> str:
    """
    Format contribution results as a readable report.
    """
    report = []
    report.append(f"Food Inflation Contribution Analysis")
    report.append(f"{'=' * 60}")
    report.append(f"Period: {results['start_date']} to {results['end_date']}")
    report.append(f"Weights: {'Link Month' if results['use_link_month_weights'] else 'Reference Period'}")
    report.append(f"")
    report.append(f"Total Food Inflation: {results['total_food_inflation_pct']:.2f}%")
    report.append(f"Total Contribution (sum of subcategories): {results['total_contribution_pp']:.2f} percentage points")
    report.append(f"")
    report.append(f"Subcategory Contributions:")
    report.append(f"{'Category':<30} {'Weight':<10} {'% Change':<10} {'Contribution (pp)':<15}")
    report.append(f"{'-' * 65}")
    
    for contrib in results['contributions']:
        report.append(
            f"{contrib['category']:<30} "
            f"{contrib['weight']*100:>6.2f}%  "
            f"{contrib['percentage_change']:>7.2f}%  "
            f"{contrib['contribution_pp']:>12.2f} pp"
        )
    
    report.append(f"")
    report.append(f"Validation: Difference = {results['validation']['difference_pp']:.2f} percentage points")
    report.append(f"Within tolerance: {results['validation']['within_tolerance']}")
    
    return "\n".join(report)


if __name__ == "__main__":
    project_root = Path(__file__).parent.parent
    food_data_path = project_root / "data" / "food_subcategories.json"
    weights_path = project_root / "data" / "basket_weights.json"
    
    # Example: Calculate contributions for last year
    # You can modify these dates as needed
    # Use 2024-11 to 2025-11 as example (year-over-year)
    end_date_str = "2025-11"
    start_date_str = "2024-11"
    
    print(f"Calculating contributions from {start_date_str} to {end_date_str}...")
    
    try:
        results = calculate_food_contributions(
            food_data_path,
            weights_path,
            start_date_str,
            end_date_str,
            use_link_month_weights=True
        )
        
        print("\n" + format_contribution_report(results))
        
        # Save results
        output_path = project_root / "data" / "contribution_results.json"
        with open(output_path, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2)
        print(f"\n✓ Results saved to {output_path}")
        
    except FileNotFoundError as e:
        print(f"✗ Error: {e}")
        print("Please ensure food_subcategories.json and basket_weights.json exist")
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()

