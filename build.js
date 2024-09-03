const rollup = require('rollup');
const vuePlugin = require('rollup-plugin-vue');
const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const babel = require('@rollup/plugin-babel').default;

// 配置文件
const config = {
  input: [
    './src/components/MyComponent1.vue',
    './src/components/MyComponent2.vue',
    './src/components/MyComponent3.vue'
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
    })
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
