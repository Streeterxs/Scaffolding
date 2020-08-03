const log = require('debug')('root:babel');
log('root babel config');

module.exports = {
    presets: [ 
        ['@babel/preset-env', {targets: {node: 'current'}}],
        '@babel/preset-typescript'
    ],
    babelrcRoots: ["./projects/*"]
};