import { defineTest } from 'jscodeshift/src/testUtils';

jest.autoMockOff();
defineTest(__dirname, 'call-expression-bind-this-to-arrow-function-expression')