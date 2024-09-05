import Vue from 'vue'
import App from './App.vue'
import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';

// import sysDict from '../../dist/index.js'
const sysDict = require('../../dist/index.common.js')

Vue.use(Element)
Vue.use(sysDict)
Vue.config.productionTip = false

new Vue({
  render: function (h) { return h(App) },
}).$mount('#app')
