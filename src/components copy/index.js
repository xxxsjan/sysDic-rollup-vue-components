const requireComponent = require.context('.', true, /\.vue$/)

const components = {}

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace(/^.*\/([^/]+)\.vue$/, '$1')
  components[componentName] = componentConfig.default || componentConfig
})

// 动态导出所有组件
export const componentExports = { ...components };

// 为了保持向后兼容，单独导出每个组件
Object.keys(componentExports).forEach(name => {
  exports[name] = componentExports[name];
});

// 保留 install 方法用于 Vue.use()
export function install(Vue) {
  Object.entries(components).forEach(([name, component]) => {
    Vue.component(name, component)
  })
}

export default { install }