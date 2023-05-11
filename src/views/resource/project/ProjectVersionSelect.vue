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
  modelValue: propTypes.oneOfType([Number, Array<Number>]),
  projectId: propTypes.number,
  multi: propTypes.bool.def(false)
})

const modelValue = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])

const optionLoading = ref(false)
const options = ref<ProjectVersionVO[]>([])

const initSelectOptions = async () => {
  try {
    optionLoading.value = true
    options.value = await api.getAll(props.projectId)
  } finally {
    optionLoading.value = false
  }
}

/** projectId变化则更新选项，重置值 */
watch(
  () => props.projectId,
  () => {
    initSelectOptions()
    modelValue.value = undefined
    emit('update:modelValue', modelValue)
  }
)

const handleChangeEvent = () => {
  emit('update:modelValue', modelValue)
}

onMounted(() => {
  initSelectOptions()
})
</script>
