const pkg = require('./package.json');

import commonjs from '@rollup/plugin-commonjs';
import cleanup from 'rollup-plugin-cleanup';

const getBanner = () => `
/**
 * (c) ${new Date().getFullYear()} ${pkg.description} v${pkg.version}
 * See https://developers.digi.me for more information
 */
`

export default {
    input: './src/index.js',
    output: {
        dir: './dist/',
        intro: getBanner(),
        exports: 'auto',
        preferConst: true,
        //compact: true,
    },
    //treeshaking: "smallest",
    plugins: [
        commonjs(),
        cleanup({
            comments: "jsdoc"
        })
    ]
}