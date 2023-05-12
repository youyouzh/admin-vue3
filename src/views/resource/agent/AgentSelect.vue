<template>
  <el-select
    v-model="modelValue"
    clearable
    filterable
    placeholder="请选择部署机器"
    :loading="optionLoading"
    :multiple="multi"
    @change="handleChangeEvent"
  >
    <el-option
      v-for="item in options"
      :key="item.id"
      :label="`${item.ip}(${item.name})`"
      :value="item.id"
    />
  </el-select>
</template>
<script setup lang="tsx" name="AgentSelect">
import { propTypes } from '@/utils/propTypes'
import { api, AgentVO } from '@/api/resource/agent'

const props = defineProps({
  modelValue: propTypes.oneOfType([Number, Array<Number>]),
  projectId: propTypes.number,
  multi: propTypes.bool.def(true)
})

const modelValue = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])

const optionLoading = ref(false)
const options = ref<AgentVO[]>([])

const initSelectOptions = async () => {
  try {
    optionLoading.value = true
    options.value = await api.getOptions(props.projectId)
    if (props.projectId) {
      modelValue.value = options.value.filter((v) => v.recommendSelect).map((v) => v.id)
    }
  } finally {
    optionLoading.value = false
  }
}

const handleChangeEvent = () => {
  emit('update:modelValue', modelValue)
}

/** projectId变化则更新选项，重置值 */
watch(
  () => props.projectId,
  () => {
    initSelectOptions()
    emit('update:modelValue', modelValue)
  }
)

onMounted(() => {
  initSelectOptions()
})
</script>
