const glob = require("glob");
const fs = require("fs");
const path = require("path");
const rollup = require("rollup");
const vuePlugin = require("rollup-plugin-vue");
const commonjs = require("@rollup/plugin-commonjs");
const resolve = require("@rollup/plugin-node-resolve");
const babel = require("@rollup/plugin-babel").default;
const postcss = require("rollup-plugin-postcss");
const autoprefixer = require("autoprefixer");
const clear = require("rollup-plugin-clear");

const config = {
  plugins: [
    vuePlugin(),
    resolve(),
    commonjs(),
    babel({
      babelHelpers: "bundled",
      exclude: "node_modules/**",
    }),
    postcss({
      plugins: [autoprefixer()],
    }),
    clear({
      targets: ["dist"],
    }),
  ],
};

const buildList = [
  {
    dir: "dist",
    format: "es",
    entryFileNames: `[name].js`,
  },
  {
    dir: "dist/cjs",
    format: "cjs",
    entryFileNames: `[name].js`,
  },
]

main();

async function build(input, outputFileName, outputOptions) {
  const bundle = await rollup.rollup({
    ...config,
    input,
  });
  const entryFileNames = `${outputFileName}.js`;
  await bundle.write({
    ...outputOptions,
    entryFileNames,
  });

  console.log(`打包完成:  -> ${entryFileNames}`);
}
function main() {
  buildEsm()
  buildCjs()
}

function createOutputIndexJs(comNameList) {
  const importStr = comNameList.map((name, index) => `import ${name} from './${name}.js'`).join('\n')
  const componentsStr = comNameList.map(name => `  ${name},`).join('\n')
  const content = `${importStr}
const components = [
${componentsStr}
]

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export {
${componentsStr}
}

export default {
  install,
${componentsStr}
}
  `
  fs.writeFileSync(path.resolve(process.cwd(), 'dist/index.js'), content)
}


function createComponentsIndexJs(comNameList, files) {
  const importStr = comNameList.map((name, index) => `export { default as ${name} } from '${files[index].replace(/\/components/g, '')}'`).join('\n')
  const content = `${importStr}

const requireComponent = require.context('.', true, /\\.vue$/)

const components = {}

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace(/^.*\\/([^/]+)\\.vue$/, '$1')
  components[componentName] = componentConfig.default || componentConfig
})
  
// 保留 install 方法用于 Vue.use()
function install(Vue) {
  Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component)
  })
}

export default { 
  install,
}
    `
  fs.writeFileSync(path.resolve(process.cwd(), 'components/index.js'), content)
}

function buildCjs() {
  glob(
    "./components/*/**/index.js",
    {
      cwd: process.cwd(),
    },
    async (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      const comNameList = []
      await Promise.all(
        files.map((file) => {
          const comName = path.basename(path.dirname(file));
          comNameList.push(comName)
          const _p = path.resolve(__dirname, file);
          return build(_p, comName, buildList[1]);
        })
      );
      const requireStr = comNameList.map((name, index) => `const ${name} = require('./${name}.js')`).join('\n')

      const content = `${requireStr}
const components = {
  ${comNameList.join(',\n  ')}
}
function install(Vue) {
  Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component)
  })
}
module.exports = {
  ...components,
  install
}`
      const cjsIndexFileName = `index.common.js`
      const cjsCacheDir = path.resolve(process.cwd(), buildList[1].dir)
      const cjsIndexCachePath = path.resolve(process.cwd(), buildList[1].dir, cjsIndexFileName)
      fs.writeFileSync(cjsIndexCachePath, content)
      const fileNameWithoutExtension = path.basename(cjsIndexFileName, path.extname(cjsIndexFileName));
      await build(cjsIndexCachePath, fileNameWithoutExtension, {
        dir: "dist",
        format: "cjs",
      },);
      fs.rmSync(cjsCacheDir, { recursive: true, force: true })
    }
  );
}

function buildEsm() {
  glob(
    "./components/*/**/index.js",
    {
      cwd: process.cwd(),
    },
    async (err, files) => {
      if (err) {
        console.error(err);
        return;
      }
      const comNameList = []
      await Promise.all(
        files.map((file) => {
          const comName = path.basename(path.dirname(file));
          comNameList.push(comName)
          // const fileName = path.basename(file, '.js');
          const _p = path.resolve(__dirname, file);
          return build(_p, comName, buildList[0]);
        })
      );
      createOutputIndexJs(comNameList)
      createComponentsIndexJs(comNameList, files)
    }
  );
}