module.exports = {
  root: true,
  env:  {
    node: true,
    es6:  true
  },
  extends: [`@vue/eslint-config-airbnb`, `plugin:vue/recommended`, `plugin:vue-scoped-css/recommended`],
  globals: {
    // Prevent errors showing on bound 'log' calls (see script in `public/index.html`)
    log:   true,
    error: true
  },
  plugins: [`arca`],
  rules:   {
    // 0: `off`   - disables the lint rule and ignores errors
    // 1: `warn`  - warns about rule, but does not throw error
    // 2: `error` - throws error and attempts to fix if rule is broken
    'arca/import-align': [2, {
      collapseExtraSpaces: true
    }],
    'array-bracket-newline':        [0, `consistent`],
    'arrow-parens':                 [2, `as-needed`],
    'brace-style':                  [2, `1tbs`, { allowSingleLine: true }],
    'comma-dangle':                 [2, `only-multiline`],
    'implicit-arrow-linebreak':     0,
    'import/no-unresolved':         0,
    'import/no-unassigned-import':  0,
    'import/prefer-default-export': 0,
    'import/extensions':            [2, `always`, {
      js:  `never`,
      mjs: `never`,
      jsx: `never`,
      ts:  `never`,
      tsx: `never`,
      vue: `never`
    }],
    indent: [2, 2, {
      FunctionExpression: {
        body:       1,
        parameters: `first`
      },
      VariableDeclarator: {
        var:   2,
        let:   2,
        const: 3
      },
      MemberExpression: 1,
      ArrayExpression:  `first`
    }],
    // 'key-spacing': 0,
    // 'key-spacing': [`error`, { mode: `strict` }],
    'key-spacing': [2, {
      singleLine: { beforeColon: false, afterColon: true },
      multiLine:  { beforeColon: false, afterColon: true, align: `value` },
    }],
    'linebreak-style':    0,
    'max-len':            0,
    'multiline-ternary':  [2, `always-multiline`],
    'no-alert':           0,
    'no-confusing-arrow': 0,
    'no-console':         0,
    'no-multi-spaces':    [2, {
      exceptions: {
        Property:           true,
        VariableDeclarator: true,
        ObjectExpression:   true,
        ImportDeclaration:  true
      }
    }],
    'no-nested-ternary':    0,
    'no-shadow':            0,
    'no-underscore-dangle': 0,
    'no-use-before-define': [2, { functions: false }],
    'no-unused-vars':       0,
    'object-curly-newline': [2, {
      ObjectExpression:  { multiline: true, consistent: true },
      ObjectPattern:     { minProperties: 4, multiline: true, consistent: true },
      ImportDeclaration: { minProperties: 4, multiline: true, consistent: true },
      ExportDeclaration: { minProperties: 4, multiline: true, consistent: true }
    }],
    'object-property-newline': [2, {
      allowAllPropertiesOnSameLine: true
    }],
    "prefer-destructuring":        [`error`, { object: true, array: false }],
    quotes:                        [2, `backtick`],
    semi:                          [2, `never`],
    'space-before-function-paren': [2, `always`],
    'vue/attributes-order':        [2, {
      order: [
        `DEFINITION`,
        `LIST_RENDERING`,
        `CONDITIONALS`,
        `RENDER_MODIFIERS`,
        `GLOBAL`,
        `UNIQUE`,
        `TWO_WAY_BINDING`,
        `OTHER_DIRECTIVES`,
        `OTHER_ATTR`,
        `EVENTS`,
        `CONTENT`
      ]
    }],
    'vue/component-name-in-template-casing': 0,
    'vue/html-self-closing':                 [2, {
      html: { normal: `always`, component: `always` },
      svg:  `always`,
      math: `always`
    }],
    'vue/max-attributes-per-line':                 0,
    'vue/name-property-casing':                    0,
    'vue/no-unused-components':                    1,
    'vue/no-unused-vars':                          0,
    'vue/require-prop-types':                      0,
    'vue/singleline-html-element-content-newline': 0,
    'vue-scoped-css/require-scoped':               0,
    'vue-scoped-css/no-parsing-error':             0,
    'vue-scoped-css/no-unused-selector':           0,
    // 'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger':                                 process.env.NODE_ENV === `production` ? 2 : 0
  },
  parserOptions: {
    parser:     `babel-eslint`,
    sourceType: `module`
    // ecmaVersion: 7
  }
}
