import { defineInlineTest } from 'jscodeshift/src/testUtils';
import transform from '../function-expression-to-arrow-function-expression';

jest.autoMockOff();

describe('function-expression-to-arrow-function-expression', () => {
  defineInlineTest(
    transform,
    {},
    `
var a = function(a, b) {
  return a + b;
}
    `,
    `
var a = (a, b) => a + b
    `
  );

  defineInlineTest(
    transform,
    {},
    `
var b = function(a, b) {
  var c = 0;
  return a + b + c;
}
    `,
    `
var b = (a, b) => {
  var c = 0;
  return a + b + c;
}
    `
  );

  defineInlineTest(
    transform,
    {},
    `
var a = function(a, b) {
  return a + b + this.c;
}
    `,
    `
var a = function(a, b) {
  return a + b + this.c;
}
    `,
    'Does not transform function with `this` keyword used inside'
  );
});