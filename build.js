

const glob = require('glob');
const path = require('path');
const rollup = require('rollup');
const vuePlugin = require('rollup-plugin-vue');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel').default;
const postcss = require("rollup-plugin-postcss");
const autoprefixer = require("autoprefixer");
const clear = require("rollup-plugin-clear");

const config = {
  plugins: [
    vuePlugin(),
    resolve(),
    commonjs(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**'
    }),
    postcss({
      plugins: [
        autoprefixer()
      ]
    }),
    clear({
      targets: ["dist"],
    }),
  ]
};
const outputOptions = {
  dir: 'dist',
  format: 'es',
  entryFileNames: `[name].js`
};

async function build(input, outputFileName) {
  console.log('input, outputFileName: ', input, outputFileName);
  const bundle = await rollup.rollup({
    ...config,
    input
  });
  const entryFileNames = `${outputFileName}.js`
  await bundle.write({
    ...outputOptions,
    entryFileNames
  });

  console.log(`打包完成:  -> ${entryFileNames}`);
}

glob('src/components/*/**/index.js', {
  cwd: process.cwd,
},
  (err, files) => {
    if (err) {
      console.error(err);
      return;
    }
    files.forEach(file => {
      console.log('file: ', file);
      const folderName = path.basename(path.dirname(file));
      // const fileName = path.basename(file, '.js');
      const _p = path.resolve(__dirname, file)
      build(_p, `${folderName}`);
    });
  });