// See: https://rollupjs.org/introduction/

import commonjs from '@rollup/plugin-commonjs'
import nodeResolve from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import license from 'rollup-plugin-license'
import json from '@rollup/plugin-json'

const config = {
  input: ['src/index.ts', 'src/cache/save.ts'],
  output: {
    esModule: true,
    dir: 'dist',
    entryFileNames: '[name].js',
    format: 'es',
    sourcemap: true
  },
  plugins: [
    typescript(),
    json(),
    nodeResolve({ preferBuiltins: true }),
    commonjs(),
    license({
      thirdParty: {
        includeSelf: true,
        output: 'dist/licenses.txt'
      }
    })
  ]
}

export default config
