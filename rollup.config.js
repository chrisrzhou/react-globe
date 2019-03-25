import babel from 'rollup-plugin-babel';
import image from 'rollup-plugin-image';
import typescript from 'rollup-plugin-typescript';

export default [
  {
    plugins: [
      babel({
        exclude: 'node_modules/**',
      }),
      image(),
      typescript(),
    ],
    input: 'src/index.ts',
    external: ['react', 'tippy.js'],
    output: [
      {
        exports: 'named',
        file: 'dist/index.js',
        format: 'cjs',
      },
      {
        file: 'dist/index.module.js',
        format: 'esm',
      },
    ],
  },
];
