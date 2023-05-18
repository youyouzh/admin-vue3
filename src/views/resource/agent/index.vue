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
      <el-form-item label="名称" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入agent名称"
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
          v-hasPermi="['resource:agent:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <ButtonAdd permi="resource:agent:create" @click="openForm('create')" />
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" width="60" />
      <el-table-column label="名称" align="center" prop="name" width="150" />
      <el-table-column label="ip地址" align="center" prop="ip" width="150" />
      <el-table-column label="描述" align="center" prop="description" width="200" />
      <el-table-column label="是否可用" align="center" width="150">
        <template #default="scope">
          <p v-if="scope.row.active" style="color: green">是</p>
          <p v-else style="color: gray">否</p>
        </template>
      </el-table-column>
      <el-table-column
        label="上次心跳"
        align="center"
        prop="lastHeartbeatTime"
        width="180"
        :formatter="dateFormatter"
      />
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
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['resource:agent:update']"
          >
            编辑
          </el-button>
          <ButtonDelete permi="resource:agent:delete" :api="api.delete" :id="scope.row.id" />
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
  <AgentForm ref="formRef" @success="getList" />
</template>
<script setup lang="tsx">
import { dateFormatter } from '@/utils/formatTime'
import { api } from '@/api/resource/agent'
import AgentForm from './AgentForm.vue'
import { ButtonAdd, ButtonDelete } from '@/components/Crud'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  name: undefined
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

/** 初始化 **/
onMounted(() => {
  getList()
})

/** 打开弹窗 */
const formRef = ref()
const openForm = async (type: string, id?: number) => {
  formRef.value.openForm(type, id)
}
</script>
