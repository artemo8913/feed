const {loaderByName, addBeforeLoaders} = require('@craco/craco')

module.exports = {
    overrideWebpackConfig:
        ({webpackConfig, cracoConfig, pluginOptions, context: {env, paths}}) => {
            const rawLoader = {
                loader: require.resolve('raw-loader'),
                options: {
                    esModule: false
                }
            }

            const added = addBeforeLoaders(webpackConfig, loaderByName('file-loader'), rawLoader)

            console.log({added})

            // process.exit(1)

            return webpackConfig
        }
}