import { Options, Transform } from 'jscodeshift';

// declare module 'jscodeshift/src/testUtils' {

//   type DefineTestOptions = Options;

//   type Parser = string;

//   interface TestOptions {
//     parser: Parser;
//   }

//   export function defineTest(dirName: string, transformName: string, options?: DefineTestOptions | null, testFilePrefix?: string, testOptions?: TestOptions): void;

//   export function defineInlineTest(module: Transform, options: TestOptions, input: string, expectedOutput: string, testName?: string): void;

//   export function defineSnapshotTest(module: Transform, options: TestOptions, input: string, testName?: string): void;
// }