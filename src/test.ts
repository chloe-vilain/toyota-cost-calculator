import { purchaseCostCalculator } from './purchaseCosts.js';
import { repairCostByYear, insuranceCostsByYear, calculateCurrentValue, calculateUpkeepCostsPerYear } from './variableOngoingCosts.js';
import { totalLifetimeCost, amortizedAnnualCosts } from './totalCostEstimator.js';

// Test purchase costs
console.log('Total Cost Calculator Test Results:');
console.log('----------------------------------');

const testPrices = [25000, 30000, 35000, 40000, 50000];

testPrices.forEach(price => {
    const total = purchaseCostCalculator(price);
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
        const totalCost = calculateUpkeepCostsPerYear(
            scenario.stickerPrice,
            year,
            scenario.manufacturingYear + year
        );
        console.log(`Year ${year + 1}: $${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    }
});

// Test total lifetime cost
console.log('\nTotal Lifetime Cost Calculator Test Results:');
console.log('----------------------------------');

const lifetimeScenarios = [
    { 
        stickerPrice: 35000,
        currentYearsSinceManufacturing: 0,
        currentMileage: 0,
        lifetimeMileage: 150000
    },
    { 
        stickerPrice: 35000,
        currentYearsSinceManufacturing: 3,
        currentMileage: 45000,
        lifetimeMileage: 150000
    },
    { 
        stickerPrice: 45000,
        currentYearsSinceManufacturing: 0,
        currentMileage: 0,
        lifetimeMileage: 200000
    }
];

lifetimeScenarios.forEach(scenario => {
    console.log(`\nScenario: $${scenario.stickerPrice.toLocaleString()} car`);
    console.log(`Current Years Since Manufacturing: ${scenario.currentYearsSinceManufacturing}`);
    console.log(`Current Mileage: ${scenario.currentMileage.toLocaleString()} miles`);
    console.log(`Expected Lifetime Mileage: ${scenario.lifetimeMileage.toLocaleString()} miles`);
    console.log('----------------------------------');
    
    const totalCost = totalLifetimeCost(
        scenario.stickerPrice,
        scenario.currentYearsSinceManufacturing,
        scenario.currentMileage,
        scenario.lifetimeMileage
    );
    
    console.log(`Total Lifetime Cost: $${totalCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
});

// Test amortized annual costs
console.log('\nAmortized Annual Costs Calculator Test Results:');
console.log('----------------------------------');

const amortizedScenarios = [
    { 
        stickerPrice: 35000,
        currentYearsSinceManufacturing: 0,
        currentMileage: 0,
        lifetimeMileage: 150000
    },
    { 
        stickerPrice: 35000,
        currentYearsSinceManufacturing: 3,
        currentMileage: 45000,
        lifetimeMileage: 150000
    },
    { 
        stickerPrice: 45000,
        currentYearsSinceManufacturing: 0,
        currentMileage: 0,
        lifetimeMileage: 200000
    }
];

amortizedScenarios.forEach(scenario => {
    console.log(`\nScenario: $${scenario.stickerPrice.toLocaleString()} car`);
    console.log(`Current Years Since Manufacturing: ${scenario.currentYearsSinceManufacturing}`);
    console.log(`Current Mileage: ${scenario.currentMileage.toLocaleString()} miles`);
    console.log(`Expected Lifetime Mileage: ${scenario.lifetimeMileage.toLocaleString()} miles`);
    console.log('----------------------------------');
    
    const annualCost = amortizedAnnualCosts(
        scenario.stickerPrice,
        scenario.currentYearsSinceManufacturing,
        scenario.currentMileage,
        scenario.lifetimeMileage
    );
    
    console.log(`Amortized Annual Cost: $${annualCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
}); 