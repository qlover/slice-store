import tsJestConfig from '@qlover/fe-standard/config/jest.esm.js';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // ...tsJestConfig,
  testEnvironment: 'jest-environment-jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  projects: [
    // {
    //   ...tsJestConfig,
    //   displayName: 'slice-store',
    //   testMatch: tsJestConfig.testMatch.map(
    //     (item) => '<rootDir>/packages/slice-store/' + item
    //   )
    // },
    {
      ...tsJestConfig,
      displayName: 'slice-store-react',
      testEnvironment: 'jest-environment-jsdom',
      extensionsToTreatAsEsm: ['.ts', '.tsx'],
      testMatch: tsJestConfig.testMatch.map(
        (item) => '<rootDir>/packages/slice-store-react/' + item
      )
    }
  ]
};
