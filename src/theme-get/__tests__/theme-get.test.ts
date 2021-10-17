import { defineTest, defineInlineTest } from 'jscodeshift/dist/testUtils'
import transform from '../theme-get'

jest.autoMockOff()
// defineTest(__dirname, 'theme-get')

// defineTest(__dirname, 'theme-get', null, 'typescript/theme-get', {
//   parser: 'ts',
// })

describe('theme-get', () => {
  defineInlineTest(
    transform,
    {},
    `
import { a, themeGet, b } from 'styled-system';
    `,
    `
import { a, b } from 'styled-system';
import { themeGet } from '@styled-system/theme-get';
    `
  )
  defineInlineTest(
    transform,
    {},
    `
import { themeGet } from 'styled-system';
    `,
    `
import { themeGet } from '@styled-system/theme-get';
    `,
    'Removes empty import line'
  )
  defineInlineTest(
    transform,
    {},
    `
import { a, b, c } from 'styled-system';
    `,
    `
import { a, b, c } from 'styled-system';
    `,
    'Should not transform styled-system module import if there is no themeGet in it'
  )
  defineInlineTest(
    transform,
    {},
    `
import { themeGet } from 'not-styled-system';
    `,
    `
import { themeGet } from 'not-styled-system';
    `,
    'Should not transform themeGet import if it is not from styled-system module'
  )
})
