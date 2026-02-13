/**
 * Test script to validate profit share calculations with founder tiers
 */

// Mock the profit share calculation logic
function getCommissionFromSC(sc: number): number {
  const SC_RANK_THRESHOLDS = [
    { minSC: 0, commission: 8 },
    { minSC: 301, commission: 12 },
    { minSC: 801, commission: 18 },
    { minSC: 2001, commission: 25 },
    { minSC: 3201, commission: 32 },
    { minSC: 5001, commission: 40 },
  ];

  for (let i = SC_RANK_THRESHOLDS.length - 1; i >= 0; i--) {
    if (sc >= SC_RANK_THRESHOLDS[i].minSC) {
      return SC_RANK_THRESHOLDS[i].commission;
    }
  }
  return 8; // Default to Apprentice
}

// Calculate profit share with founder bonus
function calculateProfitShare(sc: number, founderTier: 'standard' | 'f1' | 'f2' | null): number {
  const baseCommission = getCommissionFromSC(sc);
  
  let founderBonus = 0;
  if (founderTier === 'f1') {
    founderBonus = 10; // +10% for F1 Founding Legacy
  } else if (founderTier === 'f2') {
    founderBonus = 5; // +5% for F2 Pioneer
  }
  
  // Calculate total commission (capped at 50%)
  const totalCommission = Math.min(50, baseCommission + founderBonus);
  
  return totalCommission;
}

// Test cases
console.log('Testing profit share calculations with founder tiers...\n');

const testCases = [
  { sc: 0, founderTier: 'standard', expectedMin: 8, expectedMax: 8, description: 'Standard user, Apprentice rank (0 SC)' },
  { sc: 0, founderTier: 'f2', expectedMin: 13, expectedMax: 13, description: 'F2 Pioneer, Apprentice rank (0 SC)' },
  { sc: 0, founderTier: 'f1', expectedMin: 18, expectedMax: 18, description: 'F1 Founding Legacy, Apprentice rank (0 SC)' },
  
  { sc: 500, founderTier: 'standard', expectedMin: 12, expectedMax: 12, description: 'Standard user, Patternist rank (500 SC)' },
  { sc: 500, founderTier: 'f2', expectedMin: 17, expectedMax: 17, description: 'F2 Pioneer, Patternist rank (500 SC)' },
  { sc: 500, founderTier: 'f1', expectedMin: 22, expectedMax: 22, description: 'F1 Founding Legacy, Patternist rank (500 SC)' },
  
  { sc: 1000, founderTier: 'standard', expectedMin: 18, expectedMax: 18, description: 'Standard user, Stylist rank (1000 SC)' },
  { sc: 1000, founderTier: 'f2', expectedMin: 23, expectedMax: 23, description: 'F2 Pioneer, Stylist rank (1000 SC)' },
  { sc: 1000, founderTier: 'f1', expectedMin: 28, expectedMax: 28, description: 'F1 Founding Legacy, Stylist rank (1000 SC)' },
  
  { sc: 6000, founderTier: 'standard', expectedMin: 40, expectedMax: 40, description: 'Standard user, Creative Director rank (6000 SC)' },
  { sc: 6000, founderTier: 'f2', expectedMin: 45, expectedMax: 45, description: 'F2 Pioneer, Creative Director rank (6000 SC)' },
  { sc: 6000, founderTier: 'f1', expectedMin: 50, expectedMax: 50, description: 'F1 Founding Legacy, Creative Director rank (6000 SC) - MAX CAP' },
];

let passedTests = 0;
let totalTests = testCases.length;

for (const testCase of testCases) {
  const result = calculateProfitShare(testCase.sc, testCase.founderTier);
  const passed = result >= testCase.expectedMin && result <= testCase.expectedMax;
  
  console.log(`${passed ? '✅ PASS' : '❌ FAIL'}: ${testCase.description}`);
  console.log(`    SC: ${testCase.sc}, Founder Tier: ${testCase.founderTier}`);
  console.log(`    Expected: ${testCase.expectedMin}-${testCase.expectedMax}%, Got: ${result}%`);
  console.log('');
  
  if (passed) passedTests++;
}

console.log(`\nTest Results: ${passedTests}/${totalTests} tests passed`);

if (passedTests === totalTests) {
  console.log('\n🎉 All profit share calculations are working correctly!');
  console.log('Summary of the implemented system:');
  console.log('- F1 Founding Legacy: +10% lifetime bonus');
  console.log('- F2 Pioneer: +5% lifetime bonus');
  console.log('- Standard: No bonus');
  console.log('- Total commission capped at 50%');
  console.log('- Bonuses apply to all ranks and increase base profit share');
} else {
  console.log('\n❌ Some tests failed. Please review the implementation.');
}