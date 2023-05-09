<template>
  <el-form
    ref="formRef"
    v-loading="formLoading"
    :model="formData"
    :rules="formRules"
    label-width="80px"
  >
    <el-form-item label="文件名" prop="configFilename">
      <el-input v-model="formData.code" placeholder="请输入配置文件名" />
    </el-form-item>
    <el-form-item label="文件类型" prop="configFileType">
      <el-radio-group v-model="formData.configFileType">
        <el-radio label="YAML" size="large">yaml</el-radio>
        <el-radio label="PROPERTY" size="large">property</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="文件内容" prop="configFileContent">
      <el-input
        v-model="formData.configFileContent"
        placeholder="请输入配置文件内容"
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
import { api, ProjectVO } from '@/api/resource/project'
import { propTypes } from '@/utils/propTypes'

const { t } = useI18n()
const message = useMessage()

const props = defineProps({
  projectDetail: propTypes.object
})

const formLoading = ref(false)
const formRef = ref()
const formData = ref(props.projectDetail)
const formRules = reactive({
  configFilename: [{ required: true, message: '配置文件名不能为空', trigger: 'blur' }],
  configFileType: [{ required: true, message: '配置文件类型不能为空', trigger: 'blur' }],
  configFileContent: [{ required: true, message: '配置文件内容不能为空', trigger: 'change' }]
})

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as ProjectVO
    await api.update(data)
    message.success(t('common.updateSuccess'))
  } finally {
    formLoading.value = false
  }
}
</script>
