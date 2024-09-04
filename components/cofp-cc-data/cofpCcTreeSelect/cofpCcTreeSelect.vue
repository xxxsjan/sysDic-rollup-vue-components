<template>
  <el-cascader
    :value="codVal"
    :options="options"
    :placeholder="translatedPlaceholder"
    v-bind="$attrs"
    v-on="$listeners"
    >
  </el-cascader>
</template>
<script>
import { dictOptions } from '../config.js'
function buildTree(data, parentId = 0) {
  return data
    .filter(item => item.parentId === parentId)
    .map(item => {
      const children = buildTree(data, item.detailId);
      return children.length ? { ...item, children } : item;
    });
}
export default {
  name: 'cofpCcTreeSelect',
  components: {},
  props: {
    value: {
      type: [String, Number, Array],
      default: () => {
        return ''
      }
    },
    placeholder: {
      type: String,
      default: () => {
        return ''
      }
    }
  },
  data() {
    return {
      codVal: this.value,
      options: buildTree(dictOptions)
    }
  },
  watch: {
    value: {
      handler(newValue) {
        this.codVal = newValue
      },
      deep: true
    },
    codVal: {
      handler(newValue) {
        this.$emit('input', newValue)
      },
      deep: true
    }
  },
  computed: {
    translatedPlaceholder() {
      return this.placeholder
    },
    // options() {
    //   const res = buildTree(dictOptions)
    //   console.log(res)
    //   return res
    // },
  },
  mounted() {}
}
</script>