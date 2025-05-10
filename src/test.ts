import { purchaseCostCalculator } from './purchaseCosts.js';
import { repairCostByYear, insuranceCostsByYear, calculateCurrentValue, calculateUpkeepCostsPerYear, annualFuelCosts } from './variableOngoingCosts.js';
import { totalLifetimeCost, amortizedAnnualCosts, monthlyCostCalculator } from './totalCostEstimator.js';

interface FuelScenario {
    label: string;
    isPlugIn: boolean;
    gasPricePerGallon: number;
    electricPricePerKwh: number;
    percentageElectricDriven?: number;
}

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
console.log("\nTotal Costs Per Year Calculator Test Results:");
console.log("----------------------------------");

const testScenarios = [
    {
        label: "$35,000 car, 0 years since manufacturing",
        stickerPrice: 35000,
        yearSinceManufacturing: 0,
        isPlugIn: true
    },
    {
        label: "$35,000 car, 3 years since manufacturing",
        stickerPrice: 35000,
        yearSinceManufacturing: 3,
        isPlugIn: true
    },
    {
        label: "$45,000 car, 0 years since manufacturing",
        stickerPrice: 45000,
        yearSinceManufacturing: 0,
        isPlugIn: true
    }
];

testScenarios.forEach(scenario => {
    console.log(`\nScenario: ${scenario.label}`);
    console.log("----------------------------------");
    
    for (let year = 0; year < 5; year++) {
        const totalCost = calculateUpkeepCostsPerYear(
            scenario.stickerPrice,
            year,
            scenario.yearSinceManufacturing + year,
            scenario.isPlugIn
        );
        console.log(`Year ${year + 1}: $${totalCost.toFixed(2)}`);
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
        lifetimeMileage: 150000,
        isPlugIn: true
    },
    { 
        stickerPrice: 35000,
        currentYearsSinceManufacturing: 3,
        currentMileage: 45000,
        lifetimeMileage: 150000,
        isPlugIn: true
    },
    { 
        stickerPrice: 45000,
        currentYearsSinceManufacturing: 0,
        currentMileage: 0,
        lifetimeMileage: 200000,
        isPlugIn: true
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
        scenario.lifetimeMileage,
        scenario.isPlugIn
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
        lifetimeMileage: 150000,
        isPlugIn: true
    },
    { 
        stickerPrice: 35000,
        currentYearsSinceManufacturing: 3,
        currentMileage: 45000,
        lifetimeMileage: 150000,
        isPlugIn: true
    },
    { 
        stickerPrice: 45000,
        currentYearsSinceManufacturing: 0,
        currentMileage: 0,
        lifetimeMileage: 200000,
        isPlugIn: true
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
        scenario.lifetimeMileage,
        scenario.isPlugIn
    );
    
    console.log(`Amortized Annual Cost: $${annualCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
});

// Test monthly costs
console.log('\nMonthly Cost Calculator Test Results:');
console.log('----------------------------------');

const monthlyScenarios = [
    { 
        stickerPrice: 35000,
        yearsOfOwnership: 0,
        yearsSinceManufacturing: 0,
        isPlugIn: true
    },
    { 
        stickerPrice: 35000,
        yearsOfOwnership: 3,
        yearsSinceManufacturing: 3,
        isPlugIn: true
    },
    { 
        stickerPrice: 35000,
        yearsOfOwnership: 6,
        yearsSinceManufacturing: 6,
        isPlugIn: true
    },
    { 
        stickerPrice: 45000,
        yearsOfOwnership: 0,
        yearsSinceManufacturing: 0,
        isPlugIn: true
    },
    { 
        stickerPrice: 35000,
        yearsOfOwnership: 2,
        yearsSinceManufacturing: 4,  // Car was manufactured 2 years before purchase
        isPlugIn: true
    }
];

monthlyScenarios.forEach(scenario => {
    console.log(`\nScenario: $${scenario.stickerPrice.toLocaleString()} car`);
    console.log(`Years of Ownership: ${scenario.yearsOfOwnership}`);
    console.log(`Years Since Manufacturing: ${scenario.yearsSinceManufacturing}`);
    console.log('----------------------------------');
    
    const monthlyCost = monthlyCostCalculator(
        scenario.stickerPrice,
        scenario.yearsOfOwnership,
        scenario.yearsSinceManufacturing,
        scenario.isPlugIn   
    );
    
    console.log(`Monthly Cost: $${monthlyCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
});

// Test fuel costs
console.log('\nAnnual Fuel Costs Calculator Test Results:');
console.log('----------------------------------');

const fuelScenarios: FuelScenario[] = [
    {
        label: 'Regular Hybrid',
        isPlugIn: false,
        gasPricePerGallon: 3.50,
        electricPricePerKwh: 0.15
    },
    {
        label: 'Plug-in Hybrid (50% electric)',
        isPlugIn: true,
        gasPricePerGallon: 3.50,
        electricPricePerKwh: 0.15,
        percentageElectricDriven: 0.5
    },
    {
        label: 'Plug-in Hybrid (75% electric)',
        isPlugIn: true,
        gasPricePerGallon: 3.50,
        electricPricePerKwh: 0.15,
        percentageElectricDriven: 0.75
    },
    {
        label: 'Plug-in Hybrid (25% electric)',
        isPlugIn: true,
        gasPricePerGallon: 3.50,
        electricPricePerKwh: 0.15,
        percentageElectricDriven: 0.25
    }
];

fuelScenarios.forEach(scenario => {
    console.log(`\nScenario: ${scenario.label}`);
    console.log(`Gas Price: $${scenario.gasPricePerGallon}/gallon`);
    console.log(`Electric Price: $${scenario.electricPricePerKwh}/kWh`);
    if (scenario.isPlugIn && scenario.percentageElectricDriven !== undefined) {
        console.log(`Percentage Electric Driven: ${scenario.percentageElectricDriven * 100}%`);
    }
    console.log('----------------------------------');
    
    const annualCost = annualFuelCosts(
        scenario.isPlugIn,
        scenario.gasPricePerGallon,
        scenario.electricPricePerKwh,
        scenario.percentageElectricDriven
    );
    
    console.log(`Annual Fuel Cost: $${annualCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
}); 