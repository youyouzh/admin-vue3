<template>
  <el-form
    ref="formRef"
    v-loading="formLoading"
    :model="formData"
    :rules="formRules"
    label-width="80px"
  >
    <el-form-item label="编号" prop="code">
      <el-input v-model="formData.code" placeholder="请输入服务编号" />
    </el-form-item>
    <el-form-item label="名称" prop="name">
      <el-input v-model="formData.name" placeholder="请输入服务名称" />
    </el-form-item>
    <el-form-item label="服务状态" prop="projectState">
      <el-select v-model="formData.projectState" placeholder="请选择服务状态">
        <el-option
          v-for="item in getDictOptions(DICT_TYPE.DEPLOY_PROJECT_STATE)"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item label="备注" prop="remark">
      <el-input v-model="formData.remark" placeholder="请输入服务备注" type="textarea" />
    </el-form-item>
    <el-form-item>
      <XButton :title="t('common.save')" type="primary" @click="submitForm()" />
    </el-form-item>
  </el-form>
</template>
<script setup lang="tsx">
import { api, FormReqVO } from '@/api/resource/project'
import { propTypes } from '@/utils/propTypes'
import { DICT_TYPE, getDictOptions } from '@/utils/dict'

const { t } = useI18n()
const message = useMessage()

const props = defineProps({
  projectDetail: propTypes.object
})

const formLoading = ref(false)
const formRef = ref()
const formData = ref(props.projectDetail)
const formRules = reactive({
  code: [{ required: true, message: '服务编号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
  projectState: [{ required: true, message: '服务状态不能为空', trigger: 'change' }],
  remark: [{ required: false, message: '服务备注不能为空', trigger: 'blur' }]
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
    const data = formData.value as unknown as FormReqVO
    await api.update(data)
    message.success(t('common.updateSuccess'))
  } finally {
    formLoading.value = false
  }
}
</script>
