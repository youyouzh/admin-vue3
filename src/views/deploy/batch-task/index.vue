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
      <el-form-item label="关键词" prop="name">
        <el-input v-model="queryParams.keyword" placeholder="请输入关键词" clearable />
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
      <el-table-column label="部署标题" align="center" prop="title" width="150" />
      <el-table-column label="修改日志" align="center" prop="changeLog" width="200" />
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
          <el-button
            link
            type="primary"
            v-hasPermi="['resource:project:update']"
            @click="handleRunDeploy(scope.row.id)"
          >
            重新部署
          </el-button>
          <el-button
            link
            type="primary"
            v-hasPermi="['resource:project:update']"
            @click="handleRunDeploy(scope.row.id)"
          >
            部署详情
          </el-button>
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
  <BatchDeployTaskForm ref="formRef" @success="getList" />
</template>
<script setup lang="tsx">
import { dateFormatter } from '@/utils/formatTime'
import { api } from '@/api/deploy/batch-task'
import BatchDeployTaskForm from './BatchDeployTaskForm.vue'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  keyword: undefined
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
const openForm = (type: string, id?: number) => {
  formRef.value.openDialog(type, id)
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
    await message.confirm('确认立即重新部署吗？')
    await api.runDeploy(id)
    message.success(t('common.delSuccess'))
    await getList()
  } catch {}
}

/** 初始化 **/
onMounted(() => {
  getList()
})

// // 轮询刷新部署列表
// let listRefreshTimer = setInterval(() => {
//   getList()
// }, 1000 * 5)
// onBeforeUnmount(() => {
//   listRefreshTimer && clearInterval(listRefreshTimer)
// })
</script>
