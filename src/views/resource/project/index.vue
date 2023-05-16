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
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['resource:project:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list">
      <el-table-column label="ID" align="center" prop="id" width="60" />
      <el-table-column label="编号" align="center" prop="code" width="150" />
      <el-table-column label="名称" align="center" prop="name" width="150" />
      <el-table-column label="备注" align="center" prop="remark" width="200" />
      <el-table-column label="状态" align="center" prop="projectState" width="150">
        <template #default="scope">
          <dict-tag :type="DICT_TYPE.DEPLOY_PROJECT_STATE" :value="scope.row.projectState" />
        </template>
      </el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="createdAt"
        width="180"
        :formatter="dateFormatter"
      />
      <el-table-column label="操作" align="center" fixed="right" width="150">
        <template #default="scope">
          <router-link
            :to="`/resource/project-detail/${scope.row.id}`"
            v-hasPermi="['resource:project:update']"
          >
            <el-button link type="primary">编辑详情</el-button>
          </router-link>
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

  <!-- 表单弹窗：添加 -->
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="500">
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
        <el-input v-model="formData.name" placeholder="请输入名称" />
      </el-form-item>
      <el-form-item label="服务状态" prop="projectState">
        <el-select v-model="formData.projectState" placeholder="请选择服务状态">
          <el-option
            v-for="item in getStrDictOptions(DICT_TYPE.DEPLOY_PROJECT_STATE)"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" placeholder="请输入服务备注" type="textarea" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button :disabled="formLoading" type="primary" @click="submitForm">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="tsx">
import { dateFormatter } from '@/utils/formatTime'
import { api, ProjectVO } from '@/api/resource/project'
import { DeployProjectState } from '@/utils/constants'
import { DICT_TYPE, getStrDictOptions } from '@/utils/dict'
import { cloneDeep } from '@/utils'
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
const exportLoading = ref(false) // 导出的加载中

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

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    // const data = await AppApi.export(queryParams)
    // download.excel(data, '岗位列表.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改

const defaultFormData = {
  id: undefined,
  code: undefined,
  name: undefined,
  remark: undefined,
  projectState: DeployProjectState.ONLINE
}
const formRef = ref()
const formData = ref(cloneDeep(defaultFormData))
const formRules = reactive({
  code: [{ required: true, message: '服务编号不能为空', trigger: 'blur' }],
  name: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
  projectState: [{ required: true, message: '服务状态不能为空', trigger: 'change' }],
  remark: [{ required: false, message: '服务备注不能为空', trigger: 'blur' }]
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
    if (formType.value === 'create') {
      await api.create(data)
      message.success(t('common.createSuccess'))
    } else {
      await api.update(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 更新列表
    await getList()
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
