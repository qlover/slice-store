module.exports = {
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    },
    // work root
    {
      ...require('./packages/_work/eslintrc.json'),
      files: ['./packages/_work/*.js']
    },
    // core
    {
      ...require('./config/eslint/eslintrc.base.json'),
      files: ['./packages/core/*.js', './packages/core/*.ts']
    },
    // react
    {
      ...require('./config/eslint/eslintrc.base.json'),
      files: ['./packages/react/*.js', './packages/react/*.ts']
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
    tsconfigRootDir: __dirname
  }
};
