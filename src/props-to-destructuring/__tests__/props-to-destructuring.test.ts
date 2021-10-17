import { defineInlineTest } from 'jscodeshift/src/testUtils';
import transform from '../props-to-destructuring';

jest.autoMockOff();

describe('props-to-destructuring', () => {
//   defineInlineTest(
//     transform,
//     {},
//     `
// class C extends React.Component() {
//   render() {
//     return <div foo={this.props.foo} bar={this.props.bar} />
//   }
// }
//     `,
//     `
// class C extends React.Component() {
//   render() {
//     const {
//       bar,
//       foo
//     } = this.props;
//     return <div foo={foo} bar={bar} />;
//   }
// }
//     `
//   );

  defineInlineTest(
    transform,
    {},
    `
class C extends React.Component() {
  render() {
    const foo = this.props.foo;
    return <div foo={foo} bar={this.props.bar} />
  }
}
    `,
    `
class C extends React.Component() {
  render() {
    const { bar } = this.props;
    const foo = this.props.foo;
    return <div foo={foo} bar={bar} />;
  }
}
    `
  );
});