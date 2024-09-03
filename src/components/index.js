

const rollup = require('rollup');
const vuePlugin = require('rollup-plugin-vue');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel').default;

const postcss = require("rollup-plugin-postcss");
const autoprefixer = require("autoprefixer");
const clear = require("rollup-plugin-clear");
// 配置文件
const config = {
  input: [
    // './app.js',
    './group1/ButtonOne/index.js',
    // './src/components/MyComponent2.vue',
  ],
  output: {
    dir: 'dist',
    format: 'esm',
    entryFileNames: '[name].js'
  },
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

// 创建打包任务
async function build() {
  for (const input of config.input) {
    const bundle = await rollup.rollup({
      ...config,
      input
    });

    await bundle.write(config.output);

    console.log(`打包完成: ${input} -> ${config.output.dir}/${input.replace('./src/', '')}.js`);
  }
}

// 执行打包
build();
// const glob = require('glob');

// glob('*/**/index.js', {
//   cwd: __dirname, // 指定当前目录
// }, (err, files) => {
//   if (err) {
//     console.error(err);
//     return;
//   }
//   console.log(files);
// });