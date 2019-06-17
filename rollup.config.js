import pkg from './package.json';
import babel from 'rollup-plugin-babel';
import typescript from 'rollup-plugin-typescript2';

export default [
  {
    input: 'src/index.ts',
    plugins: [
      typescript({
        clean: true,
      }),
      babel({
        exclude: 'node_modules/**',
      }),
    ],
    output: [
      {
        exports: 'named',
        file: pkg.main,
        format: 'cjs',
      },
      {
        file: pkg.module,
        format: 'esm',
      },
    ],
    external: [
      'd3-array',
      'd3-scale',
      'es6-tween',
      'react',
      'react-cached-callback',
      'resize-observer-polyfill',
      'three',
      'three-glow-mesh',
      'three-orbitcontrols',
      'three.interaction',
      'tippy.js',
    ],
  },
];
