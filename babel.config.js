console.log('root babel config');

module.exports = {
    presets: [ 
        ['@babel/preset-env', {targets: {node: 'current'}}],
        '@babel/preset-typescript'
    ],
    babelrcRoots: ["./projects/*"]
};