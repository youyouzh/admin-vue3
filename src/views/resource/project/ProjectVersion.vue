<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="关键词" prop="keyword">
        <el-input
          v-model="queryParams.keyword"
          placeholder="请输入关键词"
          clearable
          @keyup.enter="handleQuery"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['resource:project:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" min-width="60" />
      <el-table-column label="项目编号" align="center" min-width="150">
        <template #default>{{ props.projectDetail.code }}</template>
      </el-table-column>
      <el-table-column label="版本号" align="center" prop="version" width="150" />
      <el-table-column label="参考版本" align="center" prop="referenceVersion" width="150" />
      <el-table-column label="变更日志" align="center" prop="changeLog" width="200" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row)"
            v-hasPermi="['resource:project:update']"
          >
            编辑
          </el-button>
          <el-button link type="success" @click="handleRunDeploy(scope.row)" @success="getList"
            >部署</el-button
          >
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['resource:project:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <ProjectVersionForm ref="formRef" @success="getList" :project-id="props.projectDetail.id" />

  <DeployTaskForm ref="runDeployFormRef" @success="getList" />
</template>
<script setup lang="tsx">
import { dateFormatter } from '@/utils/formatTime'
import { api, ProjectVersionVO } from '@/api/resource/project-version'
import { propTypes } from '@/utils/propTypes'
import ProjectVersionForm from './ProjectVersionForm.vue'
import DeployTaskForm from '@/views/deploy/task/DeployTaskForm.vue'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const props = defineProps({
  projectDetail: propTypes.object
})

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref<ProjectVersionVO[]>([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  keyword: undefined,
  projectId: props.projectDetail.id
})
const queryFormRef = ref() // 搜索的表单

const getList = async () => {
  loading.value = true
  try {
    const data = await api.getPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await api.delete(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const runDeployFormRef = ref()
const handleRunDeploy = (row: ProjectVersionVO) => {
  runDeployFormRef.value.openForm('create', {
    projectId: row.projectId,
    projectVersionId: row.id,
    agentId: props.projectDetail.deployAgentIds,
    deployStartTime: new Date()
  })
}

const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.openForm(type, id)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>

<style scoped lang="scss">
:deep(.el-upload-dragger) {
  padding: 2px;
}
</style>
