import { Options, Transform } from 'jscodeshift';
import * as Collection from 'jscodeshift/src/Collection';
import * as types from 'ast-types/lib/types';

declare module 'jscodeshift/src/testUtils' {

  type DefineTestOptions = Options;

  type Parser = string;

  interface TestOptions {
    parser?: Parser | string | undefined;
  }

  export function defineTest(dirName: string, transformName: string, options?: DefineTestOptions | null, testFilePrefix?: string, testOptions?: TestOptions): void;

  export function defineInlineTest(module: Transform, options: TestOptions, input: string, expectedOutput: string, testName?: string): void;

  export function defineSnapshotTest(module: Transform, options: TestOptions, input: string, testName?: string): void;
}

declare module 'jscodeshift/src/collections/Node' {

  type RecursiveMatchNode<T extends object> = {
    [K in keyof T]?: RecursiveMatchNode<T[K]> | ((value: T[K]) => boolean);
  }
  type ASTNode = types.ASTNode;

  type MatchNode<T> = ((value: T) => boolean) | RecursiveMatchNode<T>;

  export interface TraversalMethods {
    /**
     * Find nodes of a specific type within the nodes of this collection.
     */
    find<T extends ASTNode>(type: types.Type<T>, filter?: MatchNode<T>): Collection.Collection<T>;
    
    /**
     * Traverse the AST up and finds the closest node of the provided type.
     */
     closest<T extends ASTNode>(type: types.Type<T>, filter?: MatchNode<T>): Collection.Collection<T>;
  }
}