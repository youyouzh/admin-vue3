<template>
  <el-select
    v-model="modelValue"
    clearable
    filterable
    placeholder="请选择部署机器"
    :loading="optionLoading"
    :multiple="props.multi"
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
  multi: propTypes.bool.def(true)
})

const modelValue = ref(props.modelValue)
const emit = defineEmits(['update:modelValue'])

const optionLoading = ref(false)
const options = ref<AgentVO[]>([])

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
