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
      <el-form-item label="部署项目" prop="projectId">
        <ProjectSelect v-model="queryParams.projectId" />
      </el-form-item>
      <el-form-item label="部署机器" prop="agentId">
        <AgentSelect v-model="queryParams.agentId" :multi="false" />
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
      <el-table-column label="ID" align="center" prop="id" width="60" />
      <el-table-column label="项目" align="center" prop="deployProject.code" width="150" />
      <el-table-column label="部署机器" align="center" prop="deployAgent" width="200">
        <template #default="scope">
          <el-text>{{ `${scope.row.deployAgent.name}(${scope.row.deployAgent.ip}))` }}</el-text>
        </template>
      </el-table-column>
      <el-table-column
        label="部署版本"
        align="center"
        prop="deployProjectVersion.version"
        width="150"
      />
      <el-table-column
        label="部署开始时间"
        align="center"
        prop="deployStartTime"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="部署进度" align="center" width="150">
        <template #default="scope">
          <el-progress
            :percentage="scope.row.progress"
            :stroke-width="15"
            :status="scope.row.deployState === 'FAILURE' ? 'exception' : 'success'"
            striped
            striped-flow
            :duration="10"
          />
        </template>
      </el-table-column>
      <el-table-column label="备注" align="center" prop="remark" width="150" />
      <el-table-column label="操作" align="center" fixed="right" width="200">
        <template #default="scope">
          <!-- <el-button
            link
            type="primary"
            @click="openForm('update', scope.row)"
            v-hasPermi="['resource:project:update']"
          >
            编辑
          </el-button> -->
          <el-button
            link
            type="primary"
            v-hasPermi="['resource:project:update']"
            @click="handleRunDeploy(scope.row.id)"
          >
            重新部署
          </el-button>
          <el-button link type="primary" @click="handleDeployLog(scope.row.id)"> 日志 </el-button>
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
  <DeployTaskForm ref="formRef" @success="getList" />
</template>
<script setup lang="tsx">
import { dateFormatter } from '@/utils/formatTime'
import { api } from '@/api/deploy/task'
import DeployTaskForm from './DeployTaskForm.vue'
import ProjectSelect from '@/views/resource/project/ProjectSelect.vue'
import AgentSelect from '@/views/resource/agent/AgentSelect.vue'
import { propTypes } from '@/utils/propTypes'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const props = defineProps({
  projectId: propTypes.number,
  agentId: propTypes.number,
  batchTaskId: propTypes.number
})

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  projectId: ref(props.projectId),
  agentId: ref(props.agentId),
  batchTaskId: ref(props.batchTaskId)
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

const formRef = ref()
const openForm = (type: string, row?: any) => {
  formRef.value.openForm(type, {
    id: row?.id,
    projectId: row?.deployProject.id,
    projectVersionId: row?.deployProjectVersion.id,
    agentId: row?.deployAgent.id,
    deployStartTime: new Date()
  })
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

const handleRunDeploy = async (id: number) => {
  try {
    // 二次确认
    await message.confirm('确认立即重新部署吗？')
    await api.runDeploy(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

const handleDeployLog = async (id: number) => {
  console.log(id)
}

// 轮询刷新部署列表
let listRefreshTimer = ref()

/** 初始化 **/
onMounted(() => {
  getList()
  listRefreshTimer.value = setInterval(() => {
    getList()
  }, 1000 * 10)
  clearInterval(listRefreshTimer.value)
})

onDeactivated(() => {
  listRefreshTimer && clearInterval(listRefreshTimer.value)
})
</script>
