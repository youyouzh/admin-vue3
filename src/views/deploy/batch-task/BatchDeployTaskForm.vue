<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="800">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="任务标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入任务标题" />
      </el-form-item>
      <el-form-item label="修改日志" prop="changeLog">
        <el-input
          v-model="formData.changeLog"
          type="textarea"
          placeholder="请输入修改日志"
          :autosize="{ minRows: 5 }"
        />
      </el-form-item>
      <el-form-item label="部署时间" prop="deployStartTime">
        <el-date-picker
          v-model="formData.deployStartTime"
          placeholder="请输入部署时间"
          type="datetime"
          :default-time="new Date()"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" name="SystemDeptForm" setup>
import { cloneDeep } from '@/utils'
import { api } from '@/api/deploy/task'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const defaultFormData = {
  id: undefined,
  projectId: undefined,
  projectVersionId: undefined,
  agentId: undefined,
  changeLog: undefined,
  deployStartTime: new Date()
}
const formRef = ref()
const formData = ref(cloneDeep(defaultFormData))
const formRules = reactive({
  projectId: [{ required: true, message: '部署项目不能为空', trigger: 'blur' }],
  projectVersionId: [{ required: true, message: '部署版本不能为空', trigger: 'blur' }],
  agentId: [{ required: true, message: '部署机器不能为空', trigger: 'blur' }],
  deployStartTime: [{ required: true, message: '部署时间不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const openForm = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await api.getDetail(id)
    } finally {
      formLoading.value = false
    }
  }
}

defineExpose({ openForm }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value
    if (formType.value === 'create') {
      await api.create(data)
      message.success(t('common.createSuccess'))
    } else {
      await api.update(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = cloneDeep(defaultFormData)
  formRef.value?.resetFields()
}
</script>
