// This file will contain functions and constants for calculating variable ongoing costs. 

// Constants for calculations
const ANNUAL_DEPRECIATION_RATE = 0.04; // 4% annual depreciation
const MILEAGE_DEPRECIATION_RATE = 0.000003; // 0.0003% per mile
const EXPECTED_ANNUAL_MILEAGE = 15000; // Default annual mileage
// const BASE_INSURANCE_COST = 1900; // Not used in new formula

/**
 * Calculates the repair cost for a given year of the vehicle's life.
 * Based on actual Toyota RAV4 maintenance cost data from CarEdge.com
 * Returns 0 for years 0 and 1 due to warranty coverage.
 * @param year - The year of the vehicle's life (indexed at 0).
 * @returns The estimated repair cost for that year.
 */
export function repairCostByYear(year: number): number {
    // Return 0 for first two years due to warranty
    if (year === 0 || year === 1) {
        return 0;
    }

    // Data from CarEdge.com for RAV4 maintenance costs
    const maintenanceCosts = [
        261,  // Year 1
        297,  // Year 2
        368,  // Year 3
        462,  // Year 4
        552,  // Year 5
        714,  // Year 6
        787,  // Year 7
        823,  // Year 8
        856,  // Year 9
        887,  // Year 10
        946,  // Year 11
        1029  // Year 12
    ];

    // If year is within our data range, return the actual cost
    if (year >= 0 && year < maintenanceCosts.length) {
        return maintenanceCosts[year];
    }

    // For years beyond our data, use a linear projection based on the last 3 years
    // Calculate the average yearly increase from years 9-12
    const lastThreeYearsIncrease = (maintenanceCosts[11] - maintenanceCosts[8]) / 3;
    const lastKnownCost = maintenanceCosts[maintenanceCosts.length - 1];
    const yearsBeyondData = year - (maintenanceCosts.length - 1);
    
    return lastKnownCost + (lastThreeYearsIncrease * yearsBeyondData);
}

/**
 * Calculates the current value of the vehicle based on age and mileage
 * @param stickerPrice - Original price of the vehicle
 * @param year - Current year of the vehicle (0-based)
 * @param annualMileage - Annual mileage driven
 * @returns Current estimated value of the vehicle
 */
export function calculateCurrentValue(stickerPrice: number, year: number, annualMileage: number = EXPECTED_ANNUAL_MILEAGE): number {
    // Calculate age-based depreciation (compound)
    const ageDepreciation = Math.pow(1 - ANNUAL_DEPRECIATION_RATE, year);
    
    // Calculate mileage-based depreciation (linear)
    const totalMileage = annualMileage * (year + 1); // +1 because year is 0-based
    const mileageDepreciation = 1 - (totalMileage * MILEAGE_DEPRECIATION_RATE);
    
    // Apply both depreciation factors to get current value
    return stickerPrice * ageDepreciation * mileageDepreciation;
}

/**
 * Calculates the annual insurance cost for the vehicle
 * @param stickerPrice - Original price of the vehicle
 * @param annualMileage - Annual mileage driven
 * @param year - Current year of the vehicle (0-based)
 * @returns Estimated annual insurance cost
 */
export function insuranceCostsByYear(
    stickerPrice: number,
    year: number,
    annualMileage: number = EXPECTED_ANNUAL_MILEAGE
): number {
    // Calculate current value of the vehicle
    const currentValue = calculateCurrentValue(stickerPrice, year, annualMileage);
    
    // Linear formula based on two points:
    // - $50,000 car = $2,500/year insurance
    // - $5,000 car = $1,000/year insurance
    // Using exact numbers: (2500 - 1000) / (50000 - 5000) = 1500 / 45000 = 0.033333...
    const insuranceCost = (currentValue * 0.033333) + 833.33;
    
    // Round to nearest dollar
    return Math.round(insuranceCost);
}

/**
 * Calculates the total costs (repair + insurance) for a given year of ownership
 * @param stickerPrice - Original price of the vehicle
 * @param yearOfOwnership - Year of ownership (0-based)
 * @param yearSinceManufacturing - Year since the vehicle was manufactured (0-based)
 * @returns Total costs for the year
 */
export function calculateTotalCostsPerYear(
    stickerPrice: number,
    yearOfOwnership: number,
    yearSinceManufacturing: number
): number {
    // Calculate repair costs based on vehicle age
    const repairCost = repairCostByYear(yearSinceManufacturing);
    
    // Calculate insurance costs based on ownership duration
    const insuranceCost = insuranceCostsByYear(stickerPrice, yearOfOwnership);
    
    // Return total costs
    return repairCost + insuranceCost;
} 