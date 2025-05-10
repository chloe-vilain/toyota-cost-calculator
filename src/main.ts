// ESM syntax is supported.
export {}; 

import { totalLifetimeCost, amortizedAnnualCosts, monthlyCostCalculator } from './totalCostEstimator.js';
import { parse } from 'csv-parse/sync';
import { stringify } from 'csv-stringify/sync';
import fs from 'fs';

// ... existing interfaces and functions ...

interface CarData {
    label: string;
    stickerPrice: number;
    currentMileage: number;
    currentYearsSinceManufacturing: number;
    isPlugIn: boolean;
    isNew: boolean;
}

interface CostCalculation {
    totalLifetimeCost: number;
    amortizedAnnualCost: number;
    monthlyCosts: {
        year0?: number;
        year3?: number;
        year6?: number;
        year10?: number;
        year15?: number;
    };
}

/**
 * Reads car data from CSV file
 * @param filePath - Path to the CSV file
 * @returns Array of car data objects
 */
function readCarData(filePath: string): CarData[] {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const records = parse(fileContent, {
        columns: true,
        skip_empty_lines: true
    });

    return records.map((record: any) => ({
        label: record.Label,
        stickerPrice: Number(record['Sticker price'].replace(/[^0-9.-]+/g, '')),
        currentMileage: Number(record.Mileage.replace(/[^0-9.-]+/g, '')),
        currentYearsSinceManufacturing: Number(record['Years since manufacture']),
        isPlugIn: record['Plug-in'] === 'TRUE',
        isNew: record.New === 'TRUE'
    }));
}

/**
 * Calculates costs for a car with given lifetime mileage
 * @param car - Car data
 * @param lifetimeMileage - Expected lifetime mileage
 * @returns Cost calculations
 */
function calculateCostsForLifetimeMileage(car: CarData, lifetimeMileage: number): CostCalculation {
    const ANNUAL_MILEAGE = 15000;
    const remainingMileage = lifetimeMileage - car.currentMileage;
    const remainingYears = Math.ceil(remainingMileage / ANNUAL_MILEAGE);

    const monthlyCosts: CostCalculation['monthlyCosts'] = {};
    const yearsToCalculate = [0, 3, 6, 10, 15] as const;

    yearsToCalculate.forEach(year => {
        if (year < remainingYears) {
            const yearKey = `year${year}` as keyof CostCalculation['monthlyCosts'];
            monthlyCosts[yearKey] = monthlyCostCalculator(
                car.stickerPrice,
                year,
                car.currentYearsSinceManufacturing + year,
                car.isPlugIn
            );
        }
    });

    return {
        totalLifetimeCost: totalLifetimeCost(
            car.stickerPrice,
            car.currentYearsSinceManufacturing,
            car.currentMileage,
            lifetimeMileage,
            car.isPlugIn
        ),
        amortizedAnnualCost: amortizedAnnualCosts(
            car.stickerPrice,
            car.currentYearsSinceManufacturing,
            car.currentMileage,
            lifetimeMileage,
            car.isPlugIn
        ),
        monthlyCosts
    };
}

/**
 * Generates CSV output for cost calculations
 * @param cars - Array of car data
 * @param lifetimeMileage - Expected lifetime mileage
 * @param outputPath - Path to save the output CSV
 */
function generateCostOutput(cars: CarData[], lifetimeMileage: number, outputPath: string) {
    const output = cars.map(car => {
        const costs = calculateCostsForLifetimeMileage(car, lifetimeMileage);
        return {
            label: car.label,
            stickerPrice: car.stickerPrice,
            currentYearsSinceManufacturing: car.currentYearsSinceManufacturing,
            currentMileage: car.currentMileage,
            isPlugIn: car.isPlugIn,
            isNew: car.isNew,
            totalLifetimeCost: costs.totalLifetimeCost,
            amortizedAnnualCost: costs.amortizedAnnualCost,
            monthlyCostYear0: costs.monthlyCosts.year0,
            monthlyCostYear3: costs.monthlyCosts.year3,
            monthlyCostYear6: costs.monthlyCosts.year6,
            monthlyCostYear10: costs.monthlyCosts.year10,
            monthlyCostYear15: costs.monthlyCosts.year15
        };
    });

    const csv = stringify(output, { header: true });
    fs.writeFileSync(outputPath, csv);
}

// Process cars for different lifetime mileages
const lifetimeMileages = [150000, 200000, 250000, 300000];
const cars = readCarData('rav4CarExamples.csv');

lifetimeMileages.forEach(mileage => {
    const outputPath = `cost_calculations_${mileage}.csv`;
    generateCostOutput(cars, mileage, outputPath);
    console.log(`Generated cost calculations for ${mileage} miles in ${outputPath}`);
}); 