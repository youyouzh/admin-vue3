<template>
  <Dialog v-model="dialogVisible" :title="dialogTitle + '部署包版本'" width="500">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="80px"
    >
      <el-form-item label="版本号" prop="version">
        <el-input v-model="formData.version" placeholder="请输入版本号" />
      </el-form-item>
      <el-form-item label="参考版本" prop="referenceVersion">
        <el-select v-model="formData.referenceVersion" clearable placeholder="请选择参考版本">
          <el-option
            v-for="item in versionOptions"
            :key="item.version"
            :label="item.version"
            :value="item.version"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="变更日志" prop="changeLog">
        <el-input v-model="formData.changeLog" placeholder="请输入变更日志" type="textarea" />
      </el-form-item>
      <el-form-item label="部署包" prop="deployFileId">
        <UploadInfraFile v-model="formData.deployFileId" ref="uploadFileRef" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="tsx">
import { api, ProjectVersionVO } from '@/api/resource/project-version'
import { cloneDeep } from '@/utils'
import { propTypes } from '@/utils/propTypes'
import UploadInfraFile from '@/views/infra/file/UploadInfraFile.vue'

const { t } = useI18n()
const message = useMessage()

const versionOptions = ref<ProjectVersionVO[]>([])

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const props = defineProps({
  projectId: propTypes.number
})

const defaultFormData: ProjectVersionVO = {
  projectId: props.projectId
} as unknown as ProjectVersionVO
const formRef = ref()
const formData = ref<ProjectVersionVO>(cloneDeep(defaultFormData))
const formRules = reactive({
  version: [{ required: true, message: '版本号不能为空', trigger: 'blur' }],
  deployFileId: [{ required: true, message: '部署包不能为空', trigger: 'blur' }],
  referenceVersion: [{ required: false, message: '参考版本不能为空', trigger: 'blur' }],
  changeLog: [{ required: false, message: '修改日志不能为空', trigger: 'blur' }],
  remark: [{ required: false }]
})

const uploadFileRef = ref()
/** 打开弹窗 */
const openForm = async (type: string, row?: ProjectVersionVO) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  versionOptions.value = await api.getAll(props.projectId)
  resetForm()
  // 修改时，设置数据
  if (row) formData.value = row
  // 需要手动触发文件初始化，否则首次不能促使和
  await uploadFileRef.value.initFileInfo(row?.deployFileId)
}

defineExpose({ openForm }) // 提供 open 方法，用于打开弹窗
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
    const data = formData.value as unknown as ProjectVersionVO
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
  uploadFileRef.value.initFileInfo(null, true)
  formRef.value?.resetFields()
}
</script>
