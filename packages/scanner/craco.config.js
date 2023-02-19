const path = require('path');
const {CracoAliasPlugin} = require('react-app-alias-ex')
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const CracoSwcPlugin = require('craco-swc');
const BabelRcPlugin = require('@jackwilsdon/craco-use-babelrc');

module.exports = {
    babel: {
        loaderOptions: (babelLoaderOptions) => {
            const origBabelPresetCRAIndex = babelLoaderOptions.presets.findIndex((preset) => {
                return preset[0].includes('babel-preset-react-app');
            });

            const origBabelPresetCRA = babelLoaderOptions.presets[origBabelPresetCRAIndex];

            babelLoaderOptions.presets[origBabelPresetCRAIndex] = function overridenPresetCRA(api, opts, env) {
                const babelPresetCRAResult = require(
                    origBabelPresetCRA[0]
                )(api, origBabelPresetCRA[1], env);

                babelPresetCRAResult.presets.forEach(preset => {
                    // detect @babel/preset-react with {development: true, runtime: 'automatic'}
                    const isReactPreset = (
                        preset && preset[1] &&
                        preset[1].runtime === 'automatic' &&
                        preset[1].development === true
                    );
                    if (isReactPreset) {
                        preset[1].importSource = '@welldone-software/why-did-you-render';
                    }
                })

                return babelPresetCRAResult;
            };

            return babelLoaderOptions;
        },
    },
    // if you want to track react-redux selectors
    webpack: {
        mode: 'extends',
        plugins: [
            new CopyWebpackPlugin(
                {
                    patterns: [{
                        from: '../../pwa-ver.txt',
                        to: 'public'
                    }]
                }
            )
        ],
        configure: function (webackConfig) {
            webackConfig.module.rules[1].oneOf.unshift({
                test: /\.txt$/i,
                use: [{
                    loader: 'raw-loader',
                    options: {
                        esModule: false,
                    },
                }]
            });
            // https://github.com/facebook/react/issues/20235
            webackConfig.resolve.alias["react/jsx-runtime"] = require.resolve("react/jsx-runtime");
            webackConfig.resolve.alias["react/jsx-dev-runtime"] = require.resolve("react/jsx-dev-runtime");
            console.debug(webackConfig.resolve.alias);

            return webackConfig;
        }
    },
    eslint: {
        mode: 'file'
    },
    style: {
        postcss: {
            mode: 'file',
            loaderOptions: (postcssLoaderOptions, {env, paths}) => {
                delete postcssLoaderOptions['ident']; // TODO check if fixed in craco
                console.log(postcssLoaderOptions);
                return postcssLoaderOptions;
            }
        },
    },
    plugins: [
        {plugin: BabelRcPlugin},
        {
            plugin: CracoAliasPlugin,
            options: {
                alias: {
                    '~': path.resolve(__dirname, "./src"),
                    'pwa-ver.txt': path.resolve(__dirname, "../../pwa-ver.txt"),
                    "react/jsx-runtime": require.resolve("react/jsx-runtime"),
                    "react/jsx-dev-runtime": require.resolve("react/jsx-dev-runtime")
                }
            }
        },
        // {plugin: require("craco-preact")}
    ]
};
