<template>
  <el-form
    ref="formRef"
    v-loading="formLoading"
    :model="formData"
    :rules="formRules"
    label-width="120px"
  >
    <el-form-item label="部署机器" prop="deployAgentIds">
      <el-select
        v-model="formData.deployAgentIds"
        placeholder="请选择部署机器"
        clearable
        multiple
        fit-input-width
      >
        <el-option
          v-for="item in agentOptions"
          :key="item.id"
          :label="`${item.name}(${item.ip})`"
          :value="item.id + ''"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="部署根目录" prop="deployRootPath">
      <el-input v-model="formData.deployRootPath" placeholder="请输入部署根目录" />
    </el-form-item>
    <el-form-item label="日志根目录" prop="logRootPath">
      <el-input v-model="formData.logRootPath" placeholder="请输入日志根目录" />
    </el-form-item>
    <el-form-item label="自定义启动脚本" prop="customStartScript">
      <el-input
        v-model="formData.customStartScript"
        placeholder="请输入自定义启动脚本"
        type="textarea"
        :autosize="{ minRows: 5 }"
      />
    </el-form-item>
    <el-form-item label="自定义停止脚本" prop="customStopScript">
      <el-input
        v-model="formData.customStopScript"
        placeholder="请输入自定义停止脚本"
        type="textarea"
        :autosize="{ minRows: 5 }"
      />
    </el-form-item>
    <el-form-item>
      <XButton :title="t('common.save')" type="primary" @click="submitForm()" />
    </el-form-item>
  </el-form>
</template>
<script setup lang="tsx">
import { api, FormReqVO } from '@/api/resource/project'
import { api as agentApi, FormReqVO as AgentVO } from '@/api/resource/agent'
import { propTypes } from '@/utils/propTypes'

const { t } = useI18n()
const message = useMessage()

const props = defineProps({
  projectDetail: propTypes.object
})

const formLoading = ref(true)
const formRef = ref()
const formData = ref(props.projectDetail)
const formRules = reactive({
  deployRootPath: [{ required: true, message: '部署根目录不能为空', trigger: 'blur' }],
  logRootPath: [{ required: true, message: '日志根目录不能为空', trigger: 'blur' }]
})
const agentOptions = ref<AgentVO[]>([])

// 初始化表单数据
const initFormData = async () => {
  formLoading.value = true
  try {
    const data = await agentApi.getAll()
    agentOptions.value = data.list
  } finally {
    formLoading.value = false
  }
}

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as FormReqVO
    await api.update(data)
    message.success(t('common.updateSuccess'))
  } finally {
    formLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  initFormData()
})
</script>
