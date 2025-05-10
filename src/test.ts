import { totalCostCalculator } from './purchaseCosts.js';
import { repairCostByYear, insuranceCostsByYear, calculateCurrentValue, calculateTotalCostsPerYear } from './variableOngoingCosts.js';

// Test purchase costs
console.log('Total Cost Calculator Test Results:');
console.log('----------------------------------');

const testPrices = [25000, 30000, 35000, 40000, 50000];

testPrices.forEach(price => {
    const total = totalCostCalculator(price);
    console.log(`Sticker Price: $${price.toLocaleString()}`);
    console.log(`Total Cost: $${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    console.log('----------------------------------');
});

// Test repair costs
console.log('\nRepair Cost Calculator Test Results:');
console.log('----------------------------------');

// Test years 0-14 to show both actual data and projections
for (let year = 0; year <= 14; year++) {
    const cost = repairCostByYear(year);
    console.log(`Year ${year + 1}: $${cost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
}

// Test insurance costs
console.log('\nInsurance Cost Calculator Test Results:');
console.log('----------------------------------');

// Test different scenarios
const scenarios = [
    { stickerPrice: 35000, annualMileage: 15000, years: 5 },
    { stickerPrice: 35000, annualMileage: 20000, years: 5 },
    { stickerPrice: 45000, annualMileage: 15000, years: 5 }
];

scenarios.forEach(scenario => {
    console.log(`\nScenario: $${scenario.stickerPrice.toLocaleString()} car, ${scenario.annualMileage.toLocaleString()} miles/year`);
    console.log('----------------------------------');
    
    for (let year = 0; year < scenario.years; year++) {
        const insuranceCost = insuranceCostsByYear(
            scenario.stickerPrice,
            scenario.annualMileage,
            year
        );
        console.log(`Year ${year + 1}: $${insuranceCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    }
});

// Test current value calculations
console.log('\nCurrent Value Calculator Test Results:');
console.log('----------------------------------');

// Test different scenarios for value calculation
const valueScenarios = [
    { stickerPrice: 35000, annualMileage: 15000, years: 5 },
    { stickerPrice: 35000, annualMileage: 20000, years: 5 },
    { stickerPrice: 45000, annualMileage: 15000, years: 5 }
];

valueScenarios.forEach(scenario => {
    console.log(`\nScenario: $${scenario.stickerPrice.toLocaleString()} car, ${scenario.annualMileage.toLocaleString()} miles/year`);
    console.log('----------------------------------');
    
    for (let year = 0; year < scenario.years; year++) {
        const currentValue = calculateCurrentValue(
            scenario.stickerPrice,
            year,
            scenario.annualMileage
        );
        console.log(`Year ${year + 1}: $${currentValue.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    }
});

// Test total costs per year
console.log('\nTotal Costs Per Year Calculator Test Results:');
console.log('----------------------------------');

// Test different scenarios for total costs
const totalCostScenarios = [
    { stickerPrice: 35000, years: 5, manufacturingYear: 0 }, // New car 35k
    { stickerPrice: 35000, years: 5, manufacturingYear: 3 }, // 3-year-old car
    { stickerPrice: 45000, years: 5, manufacturingYear: 0 }  // New expensive car
];

totalCostScenarios.forEach(scenario => {
    console.log(`\nScenario: $${scenario.stickerPrice.toLocaleString()} car, ${scenario.manufacturingYear} years since manufacturing`);
    console.log('----------------------------------');
    
    for (let year = 0; year < scenario.years; year++) {
        const totalCost = calculateTotalCostsPerYear(
            scenario.stickerPrice,
            year,
            scenario.manufacturingYear + year
        );
        console.log(`Year ${year + 1}: $${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    }
}); 