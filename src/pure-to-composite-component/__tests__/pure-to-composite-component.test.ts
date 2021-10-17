import { defineInlineTest } from 'jscodeshift/src/testUtils'
import transform from '../pure-to-composite-component'

jest.autoMockOff()

describe('pure-to-composite-component', () => {
  defineInlineTest(
    transform,
    {},
    `
let HistoryItem = (props) => {
  const {
    item
  } = props;
  return <li>{item}</li>;
};
    `,
    `
class HistoryItem extends Component {
  render() {
    const {
      item
    } = this.props;

    return <li>{item}</li>;
  }
}
    `
  )

  defineInlineTest(
    transform,
    {},
    `
let X = (props) => <div>foo</div>;
    `,
    `
class X extends Component {
  render() {
    return <div>foo</div>;
  }
}
    `
  )
})
