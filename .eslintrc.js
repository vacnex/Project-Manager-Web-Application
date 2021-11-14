module.exports = {
  'env': {
    'browser': true,
    'commonjs': true,
    'es2021': true,
    'jquery': true,
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 13
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'always'
    ],
  },
  'globals': {
    'duDatepicker': true,
    'Notiflix': true,
    'isTouchDevice':true,
  }
};
