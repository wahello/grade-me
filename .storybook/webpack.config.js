const genDefaultConfig = require('@storybook/react/dist/server/config/defaults/webpack.config');
const pollingOptions = {
    aggregateTimeout: 500,
    ignored: /node_modules/,
    poll: 1300
};

module.exports = function(baseConfig, env) {
    let config = genDefaultConfig(baseConfig, env);
    config.devtool = 'sourcemap';
    config.watchOptions = pollingOptions;
    config.module.rules.push({
        parser: {
            amd: false
        }
    });
    config.module.rules.push({
        test: /\.ts(x)?/,
        exclude: /node_modules/,
        loaders: ['awesome-typescript-loader']
    });
    config.module.rules.push({
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader?modules']
    });
    config.resolve.extensions.push('.tsx');
    config.resolve.extensions.push('.ts');
    return config;
}

