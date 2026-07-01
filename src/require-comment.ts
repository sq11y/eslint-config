import { TSESTree } from "@typescript-eslint/utils";

import type { TSESLint } from "@typescript-eslint/utils";

import { getPropertySignatureName, findTypeDefinition } from "./utils.js";

type MessageIds = "default";
type Options = [];

const requireCommentRule = (
  signature: string,
  prop: string,
): TSESLint.RuleModule<MessageIds, Options> => ({
  name: `require-${prop}-comment`,

  meta: {
    type: "suggestion",

    schema: [],

    docs: {
      description: `Enforce comments for each ${prop}.`,
    },

    messages: {
      default: `The ${prop} "{{ name }}" should have a JSDoc comment`,
    },
  },

  create(context) {
    const { sourceCode } = context;

    const checkForComments = (node: TSESTree.TSPropertySignature) => {
      const comments = sourceCode.getCommentsBefore(node);

      if (comments.length === 0) {
        context.report({
          node: node.key,
          messageId: "default",

          data: {
            name: getPropertySignatureName(sourceCode, node),
          },
        });
      }
    };

    const PropertySignature = `CallExpression[callee.name="${signature}"] > TSTypeParameterInstantiation > TSTypeLiteral > TSPropertySignature`;
    const TypeReference = `CallExpression[callee.name="${signature}"] > TSTypeParameterInstantiation > TSTypeReference`;

    return {
      [PropertySignature](node: TSESTree.TSPropertySignature) {
        checkForComments(node);
      },

      [TypeReference](node: TSESTree.TSTypeReference) {
        const typeDefinition = findTypeDefinition(sourceCode, node);

        if (!typeDefinition) {
          return;
        }

        let typeElements: TSESTree.TypeElement[] = [];

        if (typeDefinition.type === TSESTree.AST_NODE_TYPES.TSInterfaceDeclaration) {
          typeElements = typeDefinition.body.body;
        } else if (
          typeDefinition.type === TSESTree.AST_NODE_TYPES.TSTypeAliasDeclaration &&
          typeDefinition.typeAnnotation.type === TSESTree.AST_NODE_TYPES.TSTypeLiteral
        ) {
          typeElements = typeDefinition.typeAnnotation.members;
        }

        typeElements.forEach((typeElement) => {
          if (typeElement.type === TSESTree.AST_NODE_TYPES.TSPropertySignature) {
            checkForComments(typeElement);
          }
        });
      },
    };
  },
});

export default {
  "require-emit-comment": requireCommentRule("defineEmits", "emit"),
  "require-slot-comment": requireCommentRule("defineSlots", "slot"),
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
} as any;
