module.exports = {
  extends: [require.resolve('@sprice237/accounting-eslint-config')],
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
