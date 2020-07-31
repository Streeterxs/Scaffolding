const babelJest = require('babel-jest');

console.log('server transformer');

module.exports = babelJest.createTransformer({
    ...require('./babel.config'),
    rootMode: 'upward'
});
