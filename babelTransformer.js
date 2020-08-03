const log = require('debug')('root:jestConfig:babelTransformer');
const babelJest = require('babel-jest');

log('root transformer!');

module.exports = babelJest.createTransformer(require('./babel.config'));
