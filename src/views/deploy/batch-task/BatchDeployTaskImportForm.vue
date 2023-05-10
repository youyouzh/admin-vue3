<template>
  <Dialog v-model="dialogVisible" title="导入批量部署任务" width="1000">
    <el-form
      ref="formRef"
      v-loading="formLoading"
      :model="formData"
      :rules="formRules"
      label-width="100px"
    >
      <el-form-item label="任务标题" prop="title">
        <el-input v-model="formData.title" placeholder="请输入任务标题" />
      </el-form-item>
      <el-form-item label="修改日志" prop="changeLog">
        <el-input
          v-model="formData.changeLog"
          type="textarea"
          placeholder="请输入修改日志"
          :autosize="{ minRows: 2 }"
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
      <el-form-item label="批量部署包" prop="deployFileId">
        <UploadInfraFile v-model="formData.deployFileId" />
      </el-form-item>
      <el-form-item label="部署服务" props="deployTasks">
        <el-button type="success" @click="handleAddDeployTask">添 加</el-button>
        <el-table :data="formData.deployTasks">
          <el-table-column label="项目" align="center" prop="projectId">
            <template #default="scope">
              <ProjectSelect v-model="scope.row.projectId" />
            </template>
          </el-table-column>
          <el-table-column label="部署机器" align="center" prop="agentId">
            <template #default="scope">
              <AgentSelect v-model="scope.row.agentId" />
            </template>
          </el-table-column>
          <el-table-column label="部署版本" align="center" prop="projectVersionId">
            <template #default="scope">
              <ProjectVersionSelect v-model="scope.row.projectVersionId" />
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center" fixed="right" width="80">
            <template #default="scope">
              <el-button
                link
                type="danger"
                @click="handleRemoveDeployTask(scope.row)"
                v-hasPermi="['resource:project:delete']"
              >
                <Icon icon="ep:close" />
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script lang="ts" name="BatchDeployTaskImportForm" setup>
import { cloneDeep } from '@/utils'
import { api } from '@/api/deploy/batch-task'
import UploadInfraFile from '@/views/infra/file/UploadInfraFile.vue'
import ProjectSelect from '@/views/resource/project/ProjectSelect.vue'
import AgentSelect from '@/views/resource/agent/AgentSelect.vue'
import ProjectVersionSelect from '@/views/resource/project/ProjectVersionSelect.vue'

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const defaultFormData = {
  id: undefined,
  title: undefined,
  changeLog: undefined,
  deployTasks: [],
  deployStartTime: new Date()
}
const formRef = ref()
const formData = ref(cloneDeep(defaultFormData))
const formRules = reactive({
  title: [{ required: true, message: '任务标题不能为空', trigger: 'blur' }],
  changeLog: [{ required: false, message: '部署版本不能为空', trigger: 'blur' }],
  deployTasks: [{ required: true, message: '部署服务不能为空', trigger: 'blur' }],
  deployStartTime: [{ required: true, message: '部署时间不能为空', trigger: 'blur' }]
})

/** 打开弹窗 */
const openForm = async () => {
  dialogVisible.value = true
}

const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
defineExpose({ openForm }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const submitForm = async () => {
  // 校验表单
  if (!formRef) return
  const valid = await formRef.value.validate()
  if (!valid) return
  // 提交请求
  formLoading.value = true
  console.log(formData.value)
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

/** 新增部署服务 */
const handleAddDeployTask = () => {
  formData.value.deployTasks.push({})
}

/** 移除部署服务 */
const handleRemoveDeployTask = (row: any) => {
  const index = formData.value.deployTasks.indexOf(row)
  if (index >= 0) {
    formData.value.deployTasks.splice(index, 1)
  }
}
</script>
