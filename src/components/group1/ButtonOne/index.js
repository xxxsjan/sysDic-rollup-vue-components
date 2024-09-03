import ButtonOne from './ButtonOne.vue'

ButtonOne.install = function(Vue) {
  Vue.component(ButtonOne.name, ButtonOne);
};

export default ButtonOne;