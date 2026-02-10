/**
 * Mathematical operations service
 * Contains implementations for Fibonacci, Prime, LCM, and HCF operations
 */

/**
 * Generates Fibonacci series up to n terms
 * @param n - Number of terms in the Fibonacci series
 * @returns Array of Fibonacci numbers
 */
export function generateFibonacci(n: number): number[] {
    if (n <= 0) {
        return [];
    }

    if (n === 1) {
        return [0];
    }

    if (n === 2) {
        return [0, 1];
    }

    const fibonacci: number[] = [0, 1];

    for (let i = 2; i < n; i++) {
        fibonacci.push(fibonacci[i - 1] + fibonacci[i - 2]);
    }

    return fibonacci;
}

/**
 * Checks if a number is prime
 * @param num - Number to check
 * @returns True if prime, false otherwise
 */
function isPrime(num: number): boolean {
    if (num <= 1) {
        return false;
    }

    if (num === 2) {
        return true;
    }

    if (num % 2 === 0) {
        return false;
    }

    // Check odd numbers up to sqrt(num)
    const sqrt = Math.sqrt(num);
    for (let i = 3; i <= sqrt; i += 2) {
        if (num % i === 0) {
            return false;
        }
    }

    return true;
}

/**
 * Filters prime numbers from an array
 * @param numbers - Array of numbers to filter
 * @returns Array containing only prime numbers
 */
export function filterPrimes(numbers: number[]): number[] {
    return numbers.filter(isPrime);
}

/**
 * Calculates the Greatest Common Divisor (GCD) of two numbers using Euclidean algorithm
 * @param a - First number
 * @param b - Second number
 * @returns GCD of a and b
 */
function gcd(a: number, b: number): number {
    // Make sure we work with positive numbers
    a = Math.abs(a);
    b = Math.abs(b);

    while (b !== 0) {
        const temp = b;
        b = a % b;
        a = temp;
    }

    return a;
}

/**
 * Calculates the Least Common Multiple (LCM) of two numbers
 * @param a - First number
 * @param b - Second number
 * @returns LCM of a and b
 */
function lcm(a: number, b: number): number {
    if (a === 0 || b === 0) {
        return 0;
    }

    return Math.abs(a * b) / gcd(a, b);
}

/**
 * Calculates the LCM of an array of numbers
 * @param numbers - Array of numbers
 * @returns LCM of all numbers
 */
export function calculateLCM(numbers: number[]): number {
    if (numbers.length === 0) {
        throw new Error('Cannot calculate LCM of empty array');
    }

    if (numbers.length === 1) {
        return Math.abs(numbers[0]);
    }

    return numbers.reduce((acc, num) => lcm(acc, num));
}

/**
 * Calculates the HCF (GCD) of an array of numbers
 * @param numbers - Array of numbers
 * @returns HCF of all numbers
 */
export function calculateHCF(numbers: number[]): number {
    if (numbers.length === 0) {
        throw new Error('Cannot calculate HCF of empty array');
    }

    if (numbers.length === 1) {
        return Math.abs(numbers[0]);
    }

    return numbers.reduce((acc, num) => gcd(acc, num));
}

/**
 * Validates that a number is a valid integer
 * @param num - Number to validate
 * @returns True if valid integer, false otherwise
 */
export function isValidInteger(num: number): boolean {
    return Number.isInteger(num) && Number.isFinite(num);
}

/**
 * Validates an array of numbers
 * @param numbers - Array to validate
 * @returns True if all elements are valid integers, false otherwise
 */
export function validateNumberArray(numbers: number[]): boolean {
    return numbers.every(isValidInteger);
}
