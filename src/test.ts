import { totalCostCalculator } from './purchaseCosts.js';

const testPrices = [25000, 30000, 35000, 40000, 50000];

console.log('Total Cost Calculator Test Results:');
console.log('----------------------------------');

testPrices.forEach(price => {
    const total = totalCostCalculator(price);
    console.log(`Sticker Price: $${price.toLocaleString()}`);
    console.log(`Total Cost: $${total.toLocaleString(undefined, { maximumFractionDigits: 2 })}`);
    console.log('----------------------------------');
}); 