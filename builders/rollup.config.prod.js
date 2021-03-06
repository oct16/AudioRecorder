import ts from 'rollup-plugin-typescript2'
import node from '@rollup/plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'
import { env } from './rollup.base'
import ttypescript from 'ttypescript'

export default {
    input: 'src/index.ts',
    output: [
        {
            name: 'Recorder',
            format: 'iife',
            file: 'dist/recorder.min.js'
        },
        {
            name: 'Recorder',
            format: 'cjs',
            file: 'dist/recorder.cjs.js'
        },
        {
            name: 'Recorder',
            format: 'esm',
            file: 'dist/recorder.esm.js'
        }
    ],
    plugins: [
        ts({
            typescript: ttypescript,
            tsconfigOverride: {
                compilerOptions: {
                    plugins: [
                        {
                            transform: '@zerollup/ts-transform-paths',
                            exclude: ['*']
                        }
                    ]
                }
            }
        }),
        node({
            browser: true
        }),
        commonjs(),
        ...env(),
        terser()
    ]
}
