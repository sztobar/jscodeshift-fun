import { Transform } from 'jscodeshift';

const transform: Transform = (fileInfo, api, options) => {
  const { jscodeshift } = api;
  return jscodeshift(fileInfo.source)
    .find(jscodeshift.Identifier)
    .replaceWith(
      p => jscodeshift.identifier(p.node.name.split('').reverse().join(''))
    )
    .toSource();
}

export default transform;