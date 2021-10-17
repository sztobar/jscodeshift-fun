/** For when you've gone too pure and want to go back. **/
/** Converts
 * let HistoryItem = (props) => {
 *   const {
 *     item
 *   } = props;
 *   return <li>{item}</li>;
 * };
 *
 * let X = (props) => <div>foo</div>;
 *
 * to
 *
 * class HistoryItem extends Component {
 *   render() {
 *     const {
 *       item
 *     } = this.props;
 *     return <li>{item}</li>;
 *   }
 * }
 *
 * class X extends Component {
 *   render() {
 *     return <div>foo</div>;
 *   }
 * }
 */

import { BlockStatement, Transform, VariableDeclarator } from 'jscodeshift';
import { ExpressionKind } from 'ast-types/gen/kinds';

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;
  const { statement } = j.template;

  function hasJSXElement(ast: BlockStatement | ExpressionKind) {
    return j(ast).find(j.JSXElement).size() > 0;
  }

  return j(file.source)
    .find(j.VariableDeclaration)
    .filter((p) => p.value.declarations.length == 1)
    .replaceWith((p) => {
      const decl = p.value.declarations[0] as VariableDeclarator;
      if (
        decl.init?.type !== 'ArrowFunctionExpression' ||
        (!hasJSXElement(decl.init.body) && decl.init.body.type !== 'JSXElement')
      )
        return p.value;

      const declarationBody = decl.init.body;
      const body =
        declarationBody.type == 'JSXElement'
          ? j.returnStatement(declarationBody)
          : (declarationBody as BlockStatement).body;

      j(body)
        .find(j.Identifier, { name: 'props' })
        .replaceWith((p) =>
          j.memberExpression(j.thisExpression(), j.identifier('props'))
        );

      return statement`class ${decl.id} extends Component {
  render() { ${body} }
}`;
    })
    .toSource();
};

export default transform;
