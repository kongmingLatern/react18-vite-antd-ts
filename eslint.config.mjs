import antfu from '@antfu/eslint-config'

export default antfu({
  // stylistic: {
  //   maxLineLength: 80,
  // },
  react: true,
  jsx: true,
  typescript: true,
  // unocss: true,
  rules: {
    'react/no-array-index-key': 'off',
  },
})
