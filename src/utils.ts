import { TSESTree } from "@typescript-eslint/utils";

import type { TSESLint } from "@typescript-eslint/utils";

export const findTypeDefinition = (
  sourceCode: TSESLint.SourceCode,
  node: TSESTree.TSTypeReference,
) => {
  if (node.typeName.type !== TSESTree.AST_NODE_TYPES.Identifier) {
    return;
  }

  let currentScope: TSESLint.Scope.Scope | null = sourceCode.getScope(node);

  while (currentScope) {
    const variable = currentScope.set.get(node.typeName.name);

    if (variable && variable.defs && variable.defs.length > 0) {
      return variable.defs[0]?.node;
    }

    currentScope = currentScope.upper;
  }
};

export const getPropertySignatureName = (
  sourceCode: TSESLint.SourceCode,
  node: TSESTree.TSPropertySignature,
) => {
  switch (node.key.type) {
    case TSESTree.AST_NODE_TYPES.Identifier:
      return node.key.name;

    case TSESTree.AST_NODE_TYPES.Literal:
      return String(node.key.value);

    default:
      return sourceCode.getText(node.key);
  }
};
