const requireComponent = require.context('.', true, /\.vue$/)

const components = {}

requireComponent.keys().forEach(fileName => {
  const componentConfig = requireComponent(fileName)
  const componentName = fileName.replace(/^.*\/([^/]+)\.vue$/, '$1')
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