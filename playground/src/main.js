import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// import sysDict from './components/index.js'
import sysDict from '../../dist/index.js'

Vue.use(Element)
// Vue.use(sysDict)
Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
