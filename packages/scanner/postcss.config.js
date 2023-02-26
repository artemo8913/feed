const path = require('path');
const fs = require('fs');

const DEV = process.env.NODE_ENV !== 'production';

module.exports = (ctx) => {
    const context = ctx.webpackLoaderContext._compiler.context;
    const rebuildColors = context.includes('packages/account');
    const stripVars = context.includes('packages/embed');

    return {
        syntax: 'postcss-scss',
        parser: 'postcss-scss',
        plugins: {
            'postcss-clamp': {},
            autoprefixer: {
                flexbox: true,
                grid: 'no-autoplace',
                overrideBrowserslist: ['ie >= 11', 'last 2 versions']
            },
            // [path.resolve(__dirname, './packages/common/webpack/postcss-ie11-pseudo-class.js')]: {},
            'postcss-import': {
                path: [path.resolve(__dirname, 'node_modules'), 'src'],
                plugins: DEV ? [require('stylelint')({})] : []
            },
            'postcss-modules': ctx.options.modules
                ? {
                    getJSON: ctx.extractModules || (() => {
                    }),
                    generateScopedName: 'ui__[local]___[hash:base64:7]'
                }
                : false,
            'postcss-mixins': {
                mixinsFiles: path.resolve(__dirname, 'packages/common/assets/styles/mixins.css')
            },
            'postcss-nested': {},
            'postcss-media-minmax': {},
            'postcss-custom-media': {
                importFrom: path.resolve(__dirname, 'src/common/media.css')
            },
            'postcss-custom-properties': {
                preserve: !stripVars,
                // preserve: false,
                disableDeprecationNotice: true,
                importFrom: [
                    path.resolve(__dirname, 'src/common/vars.css'),
                    path.resolve(__dirname, 'src/common/colors.css')
                ],
                exportTo: DEV
                    ? [
                        (customProperties) => {
                            if (!rebuildColors) return;

                            let contentJson = '{\n';
                            let contentTs = '// @ts-ignore\n';

                            contentTs += 'export type Colors = {\n';

                            for ([c, v] of Object.entries(customProperties)) {
                                if (c.startsWith('--c-')) {
                                    contentTs += `    '${c.substr(4)}': '${v}';\n`;
                                    contentJson += `    "${c}": "${v}",\n`;
                                }
                            }

                            contentTs += '};\n';
                            contentJson = contentJson.slice(0, -2) + '\n}\n';

                            fs.writeFileSync(
                                path.resolve(__dirname, 'src/common/colors.json'),
                                contentJson
                            );

                            fs.writeFileSync(
                                path.resolve(__dirname, 'src/common/colors.ts'),
                                contentTs
                            );
                        }
                    ]
                    : []
            }
            // 'postcss-hexrgba': {},
        }
    };
};
