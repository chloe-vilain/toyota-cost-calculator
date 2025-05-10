import { purchaseCostCalculator } from './purchaseCosts.js';
import { calculateUpkeepCostsPerYear } from './variableOngoingCosts.js';

const ANNUAL_MILEAGE = 15000; // miles per year

/**
 * Calculates the remaining years of vehicle ownership based on current and expected lifetime mileage
 * @param currentMileage - Current mileage on the vehicle
 * @param lifetimeMileage - Expected total lifetime mileage of the vehicle
 * @returns The number of years remaining until the vehicle reaches its expected lifetime mileage
 */
function calculateRemainingYears(currentMileage: number, lifetimeMileage: number): number {
    const remainingMileage = lifetimeMileage - currentMileage;
    return Math.ceil(remainingMileage / ANNUAL_MILEAGE);
}

/**
 * Calculates the total lifetime cost of owning a vehicle, including purchase price and all ongoing costs
 * @param stickerPrice - The original sticker price of the vehicle
 * @param currentYearsSinceManufacturing - Number of years since the vehicle was manufactured
 * @param currentMileage - Current mileage on the vehicle
 * @param lifetimeMileage - Expected total lifetime mileage of the vehicle
 * @returns The total cost of ownership over the vehicle's lifetime
 */
export function totalLifetimeCost(
    stickerPrice: number,
    currentYearsSinceManufacturing: number,
    currentMileage: number,
    lifetimeMileage: number
): number {
    // Calculate initial purchase cost
    const purchaseCost = purchaseCostCalculator(stickerPrice);

    // Calculate remaining years of ownership based on mileage
    const remainingYears = calculateRemainingYears(currentMileage, lifetimeMileage);

    // Calculate ongoing costs for each remaining year
    let totalOngoingCosts = 0;
    for (let year = 0; year < remainingYears; year++) {
        const yearSinceManufacturing = currentYearsSinceManufacturing + year;
        const yearlyCost = calculateUpkeepCostsPerYear(
            stickerPrice,
            year,
            yearSinceManufacturing
        );
        totalOngoingCosts += yearlyCost;
    }

    // Return total lifetime cost (purchase + ongoing costs)
    return purchaseCost + totalOngoingCosts;
}

/**
 * Calculates the amortized annual cost of owning a vehicle
 * @param stickerPrice - The original sticker price of the vehicle
 * @param currentYearsSinceManufacturing - Number of years since the vehicle was manufactured
 * @param currentMileage - Current mileage on the vehicle
 * @param lifetimeMileage - Expected total lifetime mileage of the vehicle
 * @returns The average annual cost of ownership over the vehicle's lifetime
 */
export function amortizedAnnualCosts(
    stickerPrice: number,
    currentYearsSinceManufacturing: number,
    currentMileage: number,
    lifetimeMileage: number
): number {
    const remainingYears = calculateRemainingYears(currentMileage, lifetimeMileage);
    
    const totalCost = totalLifetimeCost(
        stickerPrice,
        currentYearsSinceManufacturing,
        currentMileage,
        lifetimeMileage
    );
    
    return totalCost / remainingYears;
}
