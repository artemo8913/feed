import {TsconfigPathsPlugin} from 'tsconfig-paths-webpack-plugin';
import CircularDependencyPlugin from  'circular-dependency-plugin';
import withTM from 'next-transpile-modules';
import { i18n } from './next-i18next.config.mjs';

const plugins = [withTM([
    '@feed/ui',
    '@feed/core',
    '@feed/api'
])];

export default plugins.reduce((acc, next) => next(acc, {silent: true }, {
    experimental: {
        newNextLinkBehavior: true,
    },
    i18n: i18n.i18n,
    webpack: (
        config,
        {buildId, dev, isServer, defaultLoaders, nextRuntime, webpack}
    ) => {
        config.resolve.plugins = [...(config.resolve.plugins || []), new TsconfigPathsPlugin()];

        config.output.webassemblyModuleFilename = 'static/wasm/[modulehash].wasm'
        config.experiments = { ...config.experiments, asyncWebAssembly: true }

        if (isServer && dev) {
            new CircularDependencyPlugin({
                exclude: /a\.js|node_modules/,
                include: /src/,
                failOnError: true,
                allowAsyncCycles: false,
                cwd: process.cwd()
            });
        }

        return config
    },
}));

