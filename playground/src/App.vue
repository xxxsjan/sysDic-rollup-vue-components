<template>
  <div id="app">
    <!-- <cofp-agr_type-select-normal v-model="val" multiple></cofp-agr_type-select-normal> -->
    <!-- <cofp-bank_no-tree-select v-model="val"></cofp-bank_no-tree-select> -->
    <!-- <CofpCofp0001TreeSelect v-model="val"></CofpCofp0001TreeSelect> -->
     <!-- <cofpAgrTypeSelectNormal></cofpAgrTypeSelectNormal> -->
  </div>
</template>

<script>
// import {cofpAgrTypeSelectNormal} from '@/components/index.js'
// import * as components from '@/components/index.js'
// console.log('components: ', components);
import {MyComponent1} from '@/components/index.js'
console.log('MyComponent1: ', MyComponent1);
 
// import cofpAgrTypeSelectNormal from '../../dist/cofpAgrTypeSelectNormal.js'
export default {
  components: {
    // cofpAgrTypeSelectNormal
  },
  data() {
    return {
      val: ['dictType1', 'dictType2'],
    }
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

