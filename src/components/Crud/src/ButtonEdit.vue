<template>
  <el-button link type="primary" v-hasPermi="permi">
    <Icon icon="ep:edit" class="mr-5px" /> {{ text }}
  </el-button>
</template>
<script setup lang="ts" name="ButtonEdit">
import { propTypes } from '@/utils/propTypes'

defineProps({
  text: propTypes.string.def('编辑'),
  permi: propTypes.string
})
</script>
