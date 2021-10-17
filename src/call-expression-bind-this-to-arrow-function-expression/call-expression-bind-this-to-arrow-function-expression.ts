/** Converts
 * onClick(function(a, b) {
 *   return a + b;
 * }.bind(this),
 * function(b, c) {
 *   return 1;
 * }.bind(this));
 *
 * onClick(function(a) {
 *   var a = 1;
 *   return a;
 * }.bind(this));
 *
 * var a = function(c) { return c; }.bind(this);
 *
 ** to
 * onClick((a, b) => a + b,
 * (b, c) => 1);
 *
 * onClick(a => {
 *   var a = 1;
 *   return a;
 * });
 *
 * var a = c => c;
 *
 */

import {
  FunctionExpression,
  MemberExpression,
  ReturnStatement,
  Transform,
} from 'jscodeshift';
import { ExpressionKind, BlockStatementKind } from 'ast-types/gen/kinds';

const transform: Transform = (file, api) => {
  const j = api.jscodeshift;

  return (
    j(file.source)
      // We're looking for a CallExpression that's calling .bind() onto a FunctionExpression.
      .find(j.CallExpression, {
        callee: {
          property: { name: 'bind' },
          object: { type: 'FunctionExpression' },
        },
      })
      // Verify that .bind() is only being called with `this` as it's sole arguments.
      .filter(
        (p) =>
          p.value.arguments.length == 1 &&
          p.value.arguments[0].type == 'ThisExpression'
      )
      .replaceWith((p) => {
        // Grab the function body. Since we looked for the CallExpression originally, the "callee.object" would refer
        // to the FunctionExpression that's being called .bind(this) on. We need the body of that function
        // to transform into an ArrowFunctionExpression.
        const callee = p.value.callee as MemberExpression;
        const functionExpression = callee.object as FunctionExpression;

        let body: BlockStatementKind | ExpressionKind = functionExpression.body;

        // We can get a bit clever here. If we have a function that consists of a single return statement in it's body,
        // we can transform it to the more compact arrowFunctionExpression (a, b) => a + b, vs (a + b) => { return a + b }
        const useExpression =
          body.type == 'BlockStatement' &&
          body.body.length == 1 &&
          body.body[0].type == 'ReturnStatement';

        body = useExpression
          ? ((body.body[0] as ReturnStatement).argument as ExpressionKind)
          : body;

        return j.arrowFunctionExpression(
          functionExpression.params,
          body,
          useExpression
        );
      })
      .toSource()
  );
};

export default transform;
