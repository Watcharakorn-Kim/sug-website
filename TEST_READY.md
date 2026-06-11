# Test Ready Report

This document outlines the current test coverage summary, execution instructions, and findings from the test run of the SUG Fasteners New Website.

## Coverage Summary

The integration test suite implements **20+ test cases** across **4 tiers**:

| Tier | Area | Test Cases | Status / Expected Result | Notes |
| --- | --- | --- | --- | --- |
| **Tier 1** | Search Feature | 5 cases (EN keyword, TH keyword, Standard, SKU, Non-matching) | **PASS** | Tests search logic against simulated data |
| | Brand Filter | 5 cases (SUG, TITAN, LIO, Multiple, Non-existent) | **PASS** | Validates brand filtering outputs |
| | Category Filter | 5 cases (Bolts, Screws, SDS, Nuts, Tools) | **PASS** | Validates subcategory key matching |
| | Standard Filter | 5 cases (DIN 933, DIN 931, etc.) | **PASS** | Validates backend query standard filtering |
| | Size Filter | 5 cases (M6, M8, M12, etc.) | **PASS** | Validates backend query size filtering |
| **Tier 2** | Empty Queries | 4 cases (Whitespace, omitted, URL spaces) | **PASS** | Validates query parameter trimming |
| | Very Long Queries | 2 cases (256 chars, 1024 chars) | **PASS** | Gracefully returns empty results for overflows |
| | Special Characters | 3 cases (Regex chars, SQLi patterns, HTML/XSS tags) | **PASS** | Sanitizes or handles metacharacters safely |
| | Max Paging | 3 cases (Out-of-bound pages, page limit bounds) | **PASS** | Validates backend query pagination limits |
| | Incorrect IDs | 2 cases (Non-existent product ID, path traversal) | **PASS** | Correctly returns 404 for invalid detail route lookups |
| **Tier 3** | Cross-Feature | 3 cases (Search + Brand, Brand + Category, Triple match) | **PASS** | Checks logical intersection filtering |
| **Tier 4** | Real-World Scenario A | Competitor SKU Cross-Ref (Hilti S-WH 15 -> sds-screw) | **PASS** | Resolves external SKUs to equivalent SUG product |
| | Real-World Scenario B | Gold Dealer pricing for parametric Hex Bolt M12x50 | **PASS** | Verifies list price, Gold discount mult (0.82), box-to-pcs unit conversion, and 500 pcs volume break (0.85) |
| | Real-World Scenario C | Silver Dealer SDS Screw ordering & Chiang Mai stock | **PASS** | Verifies stock level check, crate-to-pcs conversion, Silver discount mult (0.82), and 1200 pcs volume break (0.8) |
| | Real-World Scenario D | Bronze Dealer Credit Limit validation | **PASS** | Validates that orders exceeding available credit limits are flagged as exceeded |

---

## How to Run the Tests

To run the lightweight Node-based integration test suite:

```bash
npm test
```

*Note:* If you want to check the Playwright E2E configuration, you can view `playwright.config.ts` and run browser tests with `npx playwright test` (once internet access is restored to install Playwright browser binaries).

---

## Notable Findings

The test run successfully executes and passes all test cases, indicating that the backend API implementation is highly robust and compliant with the following specs:

1. **Standard (`std`) & Size (`size`) Filtering**:
   - The API endpoint `/api/products` correctly processes standard and size parameters, returning only matching products. All integration test checks pass.

2. **Pagination and Limits**:
   - The API endpoint `/api/products` correctly slices results based on the `page` and `limit` query parameters, ensuring page boundary checks pass.
