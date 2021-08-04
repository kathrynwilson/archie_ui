module.exports = {
  presets: [`@vue/cli-plugin-babel/preset`],
  plugins: [[`transform-imports`, {
    quasar: {
      transform: `quasar/dist/babel-transforms/imports.js`,
      extras:    [`mdi-v4`],
      framework: {
        all:     `auto`,
        iconSet: `mdi-v4`
      }
    }
  }]]
}
