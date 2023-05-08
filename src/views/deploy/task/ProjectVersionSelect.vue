<template>
  <el-select
    v-model="modelValue"
    clearable
    placeholder="请选择部署版本"
    :loading="optionLoading"
    :multiple="props.multi"
    @change="handleChangeEvent"
  >
    <el-option v-for="item in options" :key="item.id" :label="item.version" :value="item.id" />
  </el-select>
</template>
<script setup lang="tsx">
import { propTypes } from '@/utils/propTypes'
import { api, ProjectVersionVO } from '@/api/resource/project-version'

const props = defineProps({
  modelValue: propTypes.number,
  multi: propTypes.bool.def(false)
})

const modelValue = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])

const optionLoading = ref(false)
const options = ref<ProjectVersionVO[]>([])

const initSelectOptions = async () => {
  try {
    optionLoading.value = true
    options.value = await api.getAll()
  } finally {
    optionLoading.value = false
  }
}

const handleChangeEvent = () => {
  emit('update:modelValue', modelValue)
}

onMounted(() => {
  initSelectOptions()
})
</script>
