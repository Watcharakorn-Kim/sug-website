# SUG Website Test Infrastructure

This document describes the test infrastructure, configured test runners, test design methodology, and execution instructions for the SUG New Website project.

## Chosen Test Runner

To satisfy the sandboxed, offline (CODE_ONLY) execution constraints without requiring external downloads or heavy browser binaries (like Puppeteer/Playwright browser executables), the project implements a **dual-runner strategy**:

1. **Lightweight Native Node.js & TypeScript Compiler Runner (Primary)**
   - **How it works**: A custom integration test runner (`scripts/run-tests.js`) utilizes the locally installed `typescript` package to compile the TS test files programmatically into a temporary directory (`dist-tests`). It then runs them directly in Node.js using a custom, zero-dependency assertion and test execution engine (`tests/test-framework.ts`).
   - **Benefits**: 100% offline-ready, lightning-fast execution, no external package fetching, compatible with any modern Node.js version, and runs directly against actual server-side API handlers and core math helpers.
   
2. **Playwright E2E Test Suite (Configured for future UI testing)**
   - **Configuration**: A full Playwright configuration file is present at `playwright.config.ts`.
   - **Test cases**: Located in `tests/e2e/`, designed to verify catalog page renders and mock local storage B2B logins.
   - **Pre-requisite**: Requires installing `@playwright/test` and executing `npx playwright install` to download browser binaries (which requires internet access).

---

## Test Suite Structure

The test suite is structured into 4 distinct tiers to ensure comprehensive validation across all functional boundaries:

```
sug-website/
├── tests/
│   ├── test-framework.ts         # Custom zero-dependency describe/it/expect library
│   ├── integration.test.ts       # 4-tier integration & API test definitions
│   └── e2e/
│       └── catalog.spec.ts       # Playwright browser-based catalog & B2B UI tests
├── scripts/
│   └── run-tests.js              # Programmatic compiler & test executor script
├── playwright.config.ts          # Playwright E2E configuration file
└── package.json                  # Registers the 'npm test' script
```

### The 4 Testing Tiers

### Tier 1: Feature Coverage
Validates the fundamental features of the catalog API and helper systems (>=5 cases per feature):
- **Search**: Verifies English keywords, Thai keywords, standard code queries (e.g. `DIN 933`), precise SKU searches, and non-matching queries.
- **Brand**: Validates filtering for `SUG`, `TITAN`, `LIO`, multiple brand combinations (union selection), and non-existent brand filters.
- **Category**: Tests category filtering for `bolts`, `screws`, `sds`, `nuts`, and `tools`.
- **Standard**: Tests filtering by standard code (e.g. `DIN 933` / `ISO 4017`). Note that if the API route does not implement the `std` query parameter filter, this test is designed to fail, documenting the lack of backend implementation.
- **Size**: Tests filtering by thread size. Similar to standard, if size filtering is client-side only, this test checks API compatibility.

### Tier 2: Boundary & Corner Cases
Ensures safety, input sanitization, and robustness under anomalous inputs (>=5 cases per feature):
- **Empty Query**: Empty strings, whitespace-only, missing parameters, and percent-encoded whitespace characters.
- **Very Long Query**: Extreme length input checks (256-character, 1024-character strings) and long filter parameters.
- **Special Characters**: RegEx metacharacters (e.g., `.*+?^$()`), SQL injection patterns, HTML/XSS tag injections, and wildcards.
- **Max Paging**: Out-of-bounds page parameters (`page=99999`), negative page indices, zero index, and extreme limit values.
- **Incorrect IDs & Routes**: Non-existent product IDs, path traversal vectors (`../../etc/passwd`), and invalid UUID formats on details pages.

### Tier 3: Cross-Feature Combinations
Tests pairwise and multi-variable logic combinations (e.g., Search + Brand, Brand + Category, Search + Brand + Category) to ensure filters combine correctly to narrow down catalog results.

### Tier 4: Real-World Application Scenarios
Simulates complex business workflows and math calculations:
- **Scenario A**: Competitor SKU Cross-Reference search (cross-referencing Hilti SKU `S-WH 15` to SUG equivalent product `sds-screw`).
- **Scenario B**: Gold Dealer B2B calculations for `hex-bolt-933` (validates base price computation, Gold dealer discount multiplier, box-to-pcs quantity conversion, volume break discounts at 500 pcs, and cart total validation).
- **Scenario C**: Silver Dealer SDS Screw ordering (Chiang Mai stock verification, crate-to-pcs conversion, Silver dealer discount multiplier, and volume breaks).
- **Scenario D**: Bronze Dealer Credit Limit check (validates that orders under 45k are accepted, but orders exceeding the dealer's available credit limit are flagged).

---

## Offline Execution Instructions

To execute the lightweight Node-based integration test suite completely offline:

1. Open your terminal in the project root directory.
2. Run the following command:
   ```bash
   npm test
   ```
   *Alternative:*
   ```bash
   node scripts/run-tests.js
   ```

### Execution Behavior
- The script compiles all TypeScript test definitions and codebase dependencies programmatically via the local `typescript` library in `node_modules` without using any internet connections.
- It spins up a simulated client/server environment using mock standard Web API `Request` and `Response` handlers.
- It prints a detailed report for each test case grouped by tier.
- If any test fails, it prints a stack trace and exits with code `1`. If all tests pass, it exits with code `0`.
