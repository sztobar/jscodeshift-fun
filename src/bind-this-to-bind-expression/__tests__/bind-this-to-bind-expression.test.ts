import { defineInlineTest } from 'jscodeshift/src/testUtils';
import transform from '../bind-this-to-bind-expression';

jest.autoMockOff();

describe('bind-this-to-bind-expression', () => {
  defineInlineTest(
    transform,
    {},
    `
let x = this.foo.bind(this);
    `,
    `
let x = ::this.foo;
    `
  );
});
