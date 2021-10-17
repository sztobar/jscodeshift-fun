import {
  ImportDeclaration,
  Transform,
  ImportSpecifier,
  ImportNamespaceSpecifier,
  ImportDefaultSpecifier,
} from 'jscodeshift';

const transform: Transform = (fileInfo, api, options) => {
  const printOptions = options.printOptions || { quote: 'single' };
  const { jscodeshift: j } = api;

  const collection = j(fileInfo.source)
  // .find(j.ImportDeclaration, (node: ImportDeclaration) => (
  //   node.source.value === 'styled-system' &&
  //   node.specifiers?.some(isThemeGetImportSpecifier)
  // ))
    .find(j.ImportDeclaration, {source: {value: 'styled-system'}, specifiers: (specifiers: ImportSpecifier[]) => specifiers.some(isThemeGetImportSpecifier) })
    .replaceWith((path) => {
      const specifiersExceptThemeGet =
        path.node.specifiers?.filter(
          (specifier) => !isThemeGetImportSpecifier(specifier)
        ) ?? [];

      return specifiersExceptThemeGet.length > 0
        ? j.importDeclaration(
            specifiersExceptThemeGet,
            path.node.source,
            path.node.importKind
          )
        : null;
    })
    .insertAfter(
      j.importDeclaration(
        [j.importSpecifier(j.identifier('themeGet'))],
        j.literal('@styled-system/theme-get')
      )
    );
    collection.find(j.ImportDeclaration, (node: ImportDeclaration) => 
      node.source.value === 'styled-system' &&
      node.specifiers?.some((specifier) => specifier.type === 'ImportNamespaceSpecifier')
    )

  return collection.toSource(printOptions);
};

const isThemeGetImportSpecifier = (
  specifier: ImportSpecifier | ImportDefaultSpecifier | ImportNamespaceSpecifier
) => {
  if (specifier.type === 'ImportSpecifier') {
    return specifier.imported.name === 'themeGet';
  }
  return false;
};

export default transform;
