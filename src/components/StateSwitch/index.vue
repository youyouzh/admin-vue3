<template>
  <el-switch :model-value="state"
             :active-value="'ENABLED'"
             :inactive-value="'DISABLED'"
  />
</template>
<script setup lang="tsx" name="StateSwitch">
import { propTypes } from '@/utils/propTypes'

const props = defineProps({
  state: propTypes.string
})
</script>
