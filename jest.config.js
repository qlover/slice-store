import tsJestConfig from '@qlover/fe-standard/config/jest.esm.js';

/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  // ...tsJestConfig,
  testEnvironment: 'jest-environment-jsdom',
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  projects: [
    {
      ...tsJestConfig,
      displayName: 'pack-app-browser',
      testMatch: tsJestConfig.testMatch.map(
        (item) => '<rootDir>/packages/slice-store/' + item
      )
    },
    {
      ...tsJestConfig,
      displayName: 'pack-app-react',
      testEnvironment: 'jest-environment-jsdom',
      extensionsToTreatAsEsm: ['.ts', '.tsx'],
      testMatch: [
        '<rootDir>/packages/slice-store-react/__tests__/**/*.test.tsx'
      ]
    }
  ]
};
