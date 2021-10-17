import { defineTest } from 'jscodeshift/dist/testUtils';

jest.autoMockOff();
defineTest(__dirname, 'call-expression-bind-this-to-arrow-function-expression')