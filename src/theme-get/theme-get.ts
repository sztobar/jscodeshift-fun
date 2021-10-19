import {
  Transform,
  ImportSpecifier,
  ImportNamespaceSpecifier,
  ImportDefaultSpecifier,
} from 'jscodeshift';

const transform: Transform = (fileInfo, api, options) => {
  const printOptions = options.printOptions || { quote: 'single' };
  const { jscodeshift: j } = api;

  const themeGetImportDeclation = j.importDeclaration(
    [j.importSpecifier(j.identifier('themeGet'))],
    j.literal('@styled-system/theme-get')
  );

  const root = j(fileInfo.source);
  root
    // .find(j.ImportDeclaration, (node: ImportDeclaration) => (
    //   node.source.value === 'styled-system' &&
    //   node.specifiers?.some(isThemeGetImportSpecifier)
    // ))
    .find(j.ImportDeclaration, {
      source: { value: 'styled-system' },
      specifiers: (specifiers) => specifiers?.some(isThemeGetImportSpecifier),
    })
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
    .insertAfter(themeGetImportDeclation);

  let namespaceIdentifierName: string | undefined = undefined;
  root
    .find(j.ImportDeclaration, {
      source: { value: 'styled-system' },
      specifiers: (specifiers) =>
        specifiers?.some(
          (specifier) => specifier.type === 'ImportNamespaceSpecifier'
        ),
    })
    .forEach((path) => {
      const namespaceSpecifier = path.node.specifiers?.find(
        (specifier) => specifier.type === 'ImportNamespaceSpecifier'
      );
      namespaceIdentifierName = namespaceSpecifier?.local?.name;
    })
    .insertAfter(themeGetImportDeclation);

  if (namespaceIdentifierName !== undefined) {
    root
      .find(j.MemberExpression, {
        object: { type: 'Identifier', name: namespaceIdentifierName },
        property: { type: 'Identifier', name: 'themeGet' },
      })
      .replaceWith(() => j.identifier('themeGet'));
  }

  return root.toSource(printOptions);
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
