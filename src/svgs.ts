import type { TSESLint } from "@typescript-eslint/utils";

type MessageIds = "default";
type Options = [];

const consistentSvgImports: TSESLint.RuleModule<MessageIds, Options> = {
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

export default {
  "consistent-svg-imports": consistentSvgImports,
  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
} as any;
