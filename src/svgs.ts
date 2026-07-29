import type { TSESLint, TSESTree } from "@typescript-eslint/utils";

type MessageIds = "default";

type VElement = TSESTree.Node & {
  rawName: string;
  startTag: { attributes: { key: TSESTree.Identifier; value: TSESTree.JSXAttribute }[] };
};

const consistentSvgImports: TSESLint.RuleModule<MessageIds> = {
  name: "consistent-svg-imports",

  meta: {
    type: "suggestion",

    schema: [],

    docs: {
      description: `Enforce 'Svg' suffix for SVG imports`,
    },

    messages: {
      default: `"{{ name }}" should be "{{ name }}Svg".`,
    },
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        const source = node.source.value;

        if (source.endsWith(".svg") || source.endsWith(".svg?component")) {
          const importName = node.specifiers[0]?.local.name;

          if (!importName?.endsWith("Svg")) {
            context.report({
              node: node,
              messageId: "default",

              data: {
                name: importName,
              },
            });
          }
        }
      },
    };
  },
};

const svgLabels: TSESLint.RuleModule<MessageIds> = {
  name: "svg-labels",

  meta: {
    type: "problem",

    schema: [],

    docs: {
      description: "Ensure SVGs have an accessible label or a hidden from the accessibility tree.",
    },

    messages: {
      default: "The SVG should have an accessible label or be hidden from the accessibility tree.",
    },
  },

  create(context) {
    /* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access */
    return (context.sourceCode.parserServices as any)?.defineTemplateBodyVisitor({
      VElement(node: VElement) {
        if (!node.rawName.endsWith("Svg")) {
          return;
        }

        const hasAccessibleLabelOrIsHidden = node.startTag.attributes.some((attr) => {
          return (
            (attr.key.name === "aria-label" && !!attr.value.value) ||
            (attr.key.name === "aria-hidden" && !!attr.value.value)
          );
        });

        if (!hasAccessibleLabelOrIsHidden) {
          context.report({
            node,
            messageId: "default",
          });
        }
      },
    });
  },
};

export default {
  "consistent-svg-imports": consistentSvgImports,
  "svg-labels": svgLabels,
} as any;
