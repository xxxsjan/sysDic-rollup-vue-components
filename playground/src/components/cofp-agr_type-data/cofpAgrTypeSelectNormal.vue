<template>
  <el-select
    :value="codVal"
    v-bind="$attrs"
    v-on="$listeners"
    :placeholder="translatedPlaceholder"
  >
    <el-option
      v-for="item in options"
      :key="item.value"
      :label="item.label"
      :value="item.value"
    >
    </el-option>
  </el-select>
</template>
<script>
import { dictOptions } from './config.js'
export default {
  name: 'select',
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
        return '输入'
      }
    }
  },
  data() {
    return {
      codVal: this.value
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
    options() {
      return dictOptions
    },
  },
  mounted() {}
}
</script>