export interface TestCase {
  name: string;
  fn: () => void | Promise<void>;
}

export class TestSuite {
  name: string;
  cases: TestCase[] = [];

  constructor(name: string) {
    this.name = name;
  }

  it(name: string, fn: () => void | Promise<void>) {
    this.cases.push({ name, fn });
  }
}

const suites: TestSuite[] = [];
let currentSuite: TestSuite | null = null;

export function describe(name: string, fn: () => void) {
  const suite = new TestSuite(name);
  currentSuite = suite;
  suites.push(suite);
  fn();
  currentSuite = null;
}

export function it(name: string, fn: () => void | Promise<void>) {
  if (currentSuite) {
    currentSuite.it(name, fn);
  } else {
    let defaultSuite = suites.find(s => s.name === 'Default');
    if (!defaultSuite) {
      defaultSuite = new TestSuite('Default');
      suites.push(defaultSuite);
    }
    defaultSuite.it(name, fn);
  }
}

export const expect = (val: any) => {
  return {
    toBe: (expected: any) => {
      if (val !== expected) {
        throw new Error(`Expected ${val} to be ${expected}`);
      }
    },
    toEqual: (expected: any) => {
      const isObject = (object: any) => {
        return object != null && typeof object === 'object';
      };
      const deepEqual = (obj1: any, obj2: any): boolean => {
        if (obj1 === obj2) {
          return true;
        }
        if (obj1 instanceof Date && obj2 instanceof Date) {
          return obj1.getTime() === obj2.getTime();
        }
        if (obj1 instanceof RegExp && obj2 instanceof RegExp) {
          return obj1.toString() === obj2.toString();
        }
        if (!isObject(obj1) || !isObject(obj2)) {
          if (typeof obj1 === 'number' && typeof obj2 === 'number' && isNaN(obj1) && isNaN(obj2)) {
            return true;
          }
          return obj1 === obj2;
        }
        if (Array.isArray(obj1) !== Array.isArray(obj2)) {
          return false;
        }
        const keys1 = Object.keys(obj1);
        const keys2 = Object.keys(obj2);
        if (keys1.length !== keys2.length) {
          return false;
        }
        for (const key of keys1) {
          if (!keys2.includes(key)) {
            return false;
          }
          if (!deepEqual(obj1[key], obj2[key])) {
            return false;
          }
        }
        return true;
      };

      if (!deepEqual(val, expected)) {
        // WARNING: JSON.stringify is order-sensitive for object keys. If two objects have the same
        // keys but in different order, they are deep-equal (as verified by deepEqual), but their
        // stringified representation in the error output will differ and may show differing key orders.
        let printedVal, printedExp;
        try {
          printedVal = JSON.stringify(val);
        } catch {
          printedVal = String(val);
        }
        try {
          printedExp = JSON.stringify(expected);
        } catch {
          printedExp = String(expected);
        }
        throw new Error(`Expected ${printedVal} to equal ${printedExp}`);
      }
    },
    toBeGreaterThan: (expected: number) => {
      if (typeof val !== 'number' || val <= expected) {
        throw new Error(`Expected ${val} to be greater than ${expected}`);
      }
    },
    toBeGreaterThanOrEqual: (expected: number) => {
      if (typeof val !== 'number' || val < expected) {
        throw new Error(`Expected ${val} to be greater than or equal to ${expected}`);
      }
    },
    toBeLessThan: (expected: number) => {
      if (typeof val !== 'number' || val >= expected) {
        throw new Error(`Expected ${val} to be less than ${expected}`);
      }
    },
    toBeLessThanOrEqual: (expected: number) => {
      if (typeof val !== 'number' || val > expected) {
        throw new Error(`Expected ${val} to be less than or equal to ${expected}`);
      }
    },
    toBeNull: () => {
      if (val !== null) {
        throw new Error(`Expected ${val} to be null`);
      }
    },
    toBeDefined: () => {
      if (val === undefined) {
        throw new Error(`Expected value to be defined`);
      }
    },
    toContain: (sub: any) => {
      if (Array.isArray(val)) {
        if (!val.includes(sub)) {
          throw new Error(`Expected array to contain ${sub}`);
        }
      } else if (typeof val === 'string') {
        if (!val.includes(sub)) {
          throw new Error(`Expected string "${val}" to contain "${sub}"`);
        }
      } else {
        throw new Error(`Cannot use toContain on type ${typeof val}`);
      }
    },
    toThrow: () => {
      let threw = false;
      try {
        val();
      } catch {
        threw = true;
      }
      if (!threw) {
        throw new Error(`Expected function to throw`);
      }
    }
  };
};

export async function runAllTests() {
  console.log('=== SUG Website E2E & Integration Test Suite ===\n');
  let total = 0;
  let passed = 0;
  let failed = 0;
  const failures: { suite: string; test: string; error: any }[] = [];

  for (const suite of suites) {
    console.log(`Suite: ${suite.name}`);
    for (const tc of suite.cases) {
      total++;
      try {
        await tc.fn();
        console.log(`  ✓ ${tc.name}`);
        passed++;
      } catch (err: any) {
        console.log(`  ✗ ${tc.name}`);
        console.log(`    Error: ${err.message || err}`);
        failed++;
        failures.push({ suite: suite.name, test: tc.name, error: err });
      }
    }
    console.log('');
  }

  console.log('=== Test Execution Summary ===');
  console.log(`Total:  ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);
  console.log('==============================');

  if (failed > 0) {
    console.log('\nFailed Tests Detail:');
    failures.forEach((f, idx) => {
      console.log(`\n${idx + 1}) [${f.suite}] ${f.test}`);
      console.log(`   ${f.error.stack || f.error.message || f.error}`);
    });
    process.exit(1);
  } else {
    process.exit(0);
  }
}

// Global class helper for standard API testing Request object if node environment doesn't define it
export function createMockRequest(url: string, init?: any): Request {
  if (typeof Request !== 'undefined') {
    return new Request(url, init);
  }
  
  // Custom mock Request implementation if running in an older Node version
  const mockUrl = new URL(url);
  return {
    url,
    method: init?.method || 'GET',
    headers: new Map(Object.entries(init?.headers || {})),
    json: async () => JSON.parse(init?.body || '{}'),
    text: async () => init?.body || '',
  } as any;
}
