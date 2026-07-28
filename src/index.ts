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
import isVueProject from "./is-vue-project.js";

const vueConfig = [
  ...pluginVue.configs["flat/recommended"],
  ...pluginVueA11y.configs["flat/recommended"],

  vueTsConfigs.recommendedTypeChecked,

  {
    name: "sq11y/vue",
    files: ["**/*.vue"],

    plugins: {
      sq11y: {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-assignment */
        rules: requireComment,
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

      "sq11y/require-emit-comment": "error",
      "sq11y/require-slot-comment": "error",
    } satisfies Linter.RulesRecord,
  },
];

const config = (isVueProject?: boolean) => [
  globalIgnores(["**/dist/**", "**/node_modules/**", "**/.cache/**", ".git"]),

  pluginStylistic.configs.recommended,
  jslint.configs.recommended,

  jsdoc({ config: "flat/recommended" }),

  ...tslint.configs.recommendedTypeChecked,
  ...pluginOxlint.buildFromOxlintConfigFile(".oxlintrc.json"),

  ...(isVueProject ? vueConfig : []),

  skipFormatting,

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

      "@typescript-eslint/consistent-type-imports": ["error"],
      "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],

      "@stylistic/spaced-comment": "error",
      "@typescript-eslint/unbound-method": "off",
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-redundant-type-constituents": "off",

      "jsdoc/tag-lines": "off",
      "jsdoc/require-param": "off",
      "jsdoc/require-returns": "off",
      "jsdoc/check-tag-names": "off",
    } satisfies Linter.RulesRecord,
  },
];

export default isVueProject
  ? defineConfigWithVueTs(...config(true))
  : /* eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-explicit-any */
    defineConfig(...(config(false) as any[]));
