import type { Linter } from "eslint";

import { defineConfig, globalIgnores } from "eslint/config";
import { defineConfigWithVueTs, vueTsConfigs } from "@vue/eslint-config-typescript";

import { jsdoc } from "eslint-plugin-jsdoc";

import pluginVue from "eslint-plugin-vue";
import pluginOxlint from "eslint-plugin-oxlint";
import pluginStylistic from "@stylistic/eslint-plugin";
import pluginVueA11y from "eslint-plugin-vuejs-accessibility";

import skipFormatting from "eslint-config-prettier/flat";
import jslint from "@eslint/js";
import tslint from "typescript-eslint";

import requireComment from "./require-comment.js";
import svgs from "./svgs.js";
import isVueProject from "./is-vue-project.js";

const tsConfig = [
  {
    name: "sq11y/ts",
    files: ["**/*.{ts,js}"],
    extends: [jslint.configs.recommended, ...tslint.configs.strictTypeChecked],

    languageOptions: {
      parserOptions: {
        projectService: {
          allowDefaultProject: ["*.js"],
        },
      },
    },
  },
];

const vueConfig = [
  ...pluginVue.configs["flat/recommended-error"],
  ...pluginVueA11y.configs["flat/recommended"],

  vueTsConfigs.strictTypeChecked,

  {
    name: "sq11y/vue",
    files: ["**/*.vue"],

    plugins: {
      sq11y: {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
        rules: {
          ...requireComment,
          ...svgs,
        },
      },
    },

    rules: {
      "vue/multi-word-component-names": "off",
      "vue/attributes-order": "error",
      "vue/require-explicit-slots": "error",
      "vue/define-emits-declaration": ["error", "type-based"],
      "vue/require-prop-comment": "error",
      "vue/block-order": ["error", { order: [["template", "script[setup]", "style"]] }],
      "vue/no-boolean-default": ["error", "default-false"],

      "vue/max-attributes-per-line": "off",
      "vue/html-self-closing": "off",
      "vue/singleline-html-element-content-newline": "off",

      "sq11y/require-emit-comment": "error",
      "sq11y/require-slot-comment": "error",
      "sq11y/consistent-svg-imports": "error",
      "sq11y/svg-labels": "error",
    } satisfies Linter.RulesRecord,
  },
];

const config = (isVueProject?: boolean) => [
  globalIgnores(["**/dist/**", "**/node_modules/**", "**/.cache/**", ".git"]),

  jsdoc({ config: "flat/recommended" }),

  ...pluginOxlint.buildFromOxlintConfigFile(".oxlintrc.json"),

  pluginStylistic.configs.recommended,
  skipFormatting,

  tsConfig,

  ...(isVueProject ? vueConfig : []),

  {
    name: "sq11y/shared",
    files: ["**/*.{vue,ts}"],

    plugins: {
      "@stylistic": pluginStylistic,
    },

    rules: {
      "default-case": "error",
      "default-case-last": "error",
      "max-lines-per-function": ["error", { max: 100, skipComments: true }],
      "prefer-destructuring": "error",

      "no-dupe-class-members": "error",
      "no-duplicate-case": "error",
      "no-useless-assignment": "off",

      "@stylistic/spaced-comment": "error",

      "@typescript-eslint/consistent-type-imports": ["error"],
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/restrict-template-expressions": "off",

      /* prettier-ignore */
      "@typescript-eslint/no-unused-vars": ["error", { destructuredArrayIgnorePattern: "^_", argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",
      "@typescript-eslint/no-unnecessary-type-parameters": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-confusing-void-expression": "off",

      "jsdoc/tag-lines": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/check-tag-names": "off",
    } satisfies Linter.RulesRecord,
  },
];

export default isVueProject
  ? defineConfigWithVueTs(...config(true))
  : /* eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unsafe-argument */
    defineConfig(...(config(false) as any[]));
