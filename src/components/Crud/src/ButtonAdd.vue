<template>
  <el-button type="primary" plain v-hasPermi="permi">
    <Icon icon="ep:plus" class="mr-5px" /> {{ text }}
  </el-button>
</template>
<script setup lang="ts" name="ButtonAdd">
import { propTypes } from '@/utils/propTypes'

defineProps({
  text: propTypes.string.def('新增'),
  permi: propTypes.string
})
</script>
