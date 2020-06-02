import ts from 'rollup-plugin-typescript2'
import node from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { env } from './rollup.base'
import browsersync from 'rollup-plugin-browsersync'
import html from '@rollup/plugin-html'
import fs from 'fs'

export default [
    {
        input: 'src/index.ts',
        output: [
            {
                name: 'Recorder',
                format: 'iife',
                file: 'dist/recorder.min.js'
            }
        ],
        plugins: [
            ts(),
            node({
                browser: true
            }),
            commonjs(),
            ...env(),
            html({
                template: () => fs.readFileSync('examples/index.html', 'utf8')
            }),
            browsersync({ codeSync: false, server: 'dist', port: 54321, notify: false, open: false })
        ]
    }
]
