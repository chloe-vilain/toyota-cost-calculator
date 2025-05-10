// Constants for purchase cost calculations
export const expectedAPR = 0.055; // 5.5% APR
export const salesTaxMA = 0.0625; // 6.25% MA sales tax
export const depositAmountExpected = 20000; // $20,000 deposit
export const expectedLoanYears = 5; // 5 year loan term

/**
 * Calculates the total cost of a vehicle including sales tax and interest
 * @param stickerPrice - The base price of the vehicle
 * @returns The total cost including sales tax and interest
 */
export function totalCostCalculator(stickerPrice: number): number {
    // Calculate cost with sales tax
    const costWithTax = stickerPrice * (1 + salesTaxMA);
    
    // Calculate interest on the total cost with tax
    const totalInterest = interestCalculator(costWithTax);
    
    // Total cost is the cost with tax plus the interest
    const totalCost = costWithTax + totalInterest;
    
    return totalCost;
}

/**
 * Calculates the total interest paid over the loan term
 * @param dealerPrice - The price of the vehicle from the dealer
 * @param depositAmount - The amount of money put down as deposit (defaults to 20000)
 * @param interestRate - The annual interest rate (APR) (defaults to 0.055)
 * @param loanYears - The number of years for the loan term (defaults to 5)
 * @returns The total interest to be paid
 */
export function interestCalculator(
    dealerPrice: number,
    depositAmount: number = depositAmountExpected,
    interestRate: number = expectedAPR,
    loanYears: number = expectedLoanYears
): number {
    const loanAmount = dealerPrice - depositAmount;
    const monthlyRate = interestRate / 12;
    const numberOfPayments = loanYears * 12;
    
    // Calculate monthly payment using the loan payment formula
    const monthlyPayment = (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) / 
                          (Math.pow(1 + monthlyRate, numberOfPayments) - 1);
    
    // Calculate total amount paid over the loan term
    const totalAmountPaid = monthlyPayment * numberOfPayments;
    
    // Calculate total interest by subtracting the loan amount from total amount paid
    const totalInterest = totalAmountPaid - loanAmount;
    
    return totalInterest;
} 