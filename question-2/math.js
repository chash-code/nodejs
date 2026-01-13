// Function to check if a number is prime
export function checkPrime(num) {
  // Handle edge cases
  if (num <= 1) {
    return false;
  }
  
  if (num === 2) {
    return true;
  }
  
  // Check if number is divisible by 2
  if (num % 2 === 0) {
    return false;
  }
  
  // Check odd divisors up to square root of num
  for (let i = 3; i <= Math.sqrt(num); i += 2) {
    if (num % i === 0) {
      return false;
    }
  }
  
  return true;
}
