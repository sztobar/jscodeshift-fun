// /** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
// module.exports = {
//   preset: 'ts-jest',
//   testEnvironment: 'node'
// };
import type { InitialOptionsTsJest } from 'ts-jest/dist/types'

const config: InitialOptionsTsJest = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.test.json',
    },
  },
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
}
export default config
// export const preset = 'ts-jest';
// export const testEnvironment = 'node';
