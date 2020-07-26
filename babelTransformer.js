const babelJest = require('babel-jest');

console.log('root transformer!!!!!!!!!!!!!!!!!!!!!!!');

module.exports = babelJest.createTransformer(require('./babel.config'));
