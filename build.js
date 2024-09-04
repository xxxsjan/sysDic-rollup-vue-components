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
const outputOptions = {
  dir: "dist",
  format: "es",
  entryFileNames: `[name].js`,
};

async function build(input, outputFileName) {
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
main();

function main() {
  glob(
    "./components/*/**/index.js",
    {
      cwd: process.cwd(),
    },
    async (err, files) => {
      console.log("files: ", files);
      if (err) {
        console.error(err);
        return;
      }
      const comNameList =[]
      await Promise.all(
        files.map((file) => {
          console.log('file: ', file);
          const comName = path.basename(path.dirname(file));
          comNameList.push(comName)
          // const fileName = path.basename(file, '.js');
          const _p = path.resolve(__dirname, file);
          return build(_p, comName);
        })
      );
      createOutputIndexJs(comNameList)
      createComponentsIndexJs(comNameList,files) 
    }
  );
}

function createOutputIndexJs(comNameList){
  const importStr = comNameList.map(name=>`import ${name} from './${name}.js'`).join('\n')
  const componentsStr = comNameList.map(name=>`${name},`).join('\n')
  const content = `${importStr}
const components = [
  ${componentsStr}
]

const install = function (Vue) {
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

export default {
  install
}
  `
  fs.writeFileSync(path.resolve(process.cwd(), 'dist/index.js'), content)
}


function createComponentsIndexJs(comNameList,files) {
  const importStr = comNameList.map((name,index)=>`export { default as ${name} } from '${files[index]}'`).join('\n')
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