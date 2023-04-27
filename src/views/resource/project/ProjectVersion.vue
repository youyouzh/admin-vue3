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
          @click="openDialog('create')"
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
      <el-table-column label="项目编号" align="center" prop="projectCode" width="150" />
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
            @click="openDialog('update', scope.row.id)"
            v-hasPermi="['resource:project:update']"
          >
            编辑
          </el-button>
          <el-button link type="success" @click="openDeployDialog(scope)">部署</el-button>
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
  <Dialog v-model="dialogVisible" :title="dialogTitle" width="500">
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
        <el-input v-model="formData.referenceVersion" placeholder="请输入参考版本" />
      </el-form-item>
      <el-form-item label="变更日志" prop="changeLog">
        <el-input v-model="formData.changeLog" placeholder="请输入变更日志" type="textarea" />
      </el-form-item>
      <el-form-item label="部署包" prop="deployFileUrl">
        <UploadFile
          v-model="formData.deployFileUrl"
          title="上传部署包"
          :isShowTip="false"
          :fileSize="500"
          :limit="1"
          :drag="true"
          :fileType="['zip', 'jar']"
        />
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
import { api, FormReqVO } from '@/api/resource/project-version'
import { propTypes } from '@/utils/propTypes'
import { cloneDeep } from '@/utils'

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const props = defineProps({
  projectDetail: propTypes.object
})

const loading = ref(true) // 列表的加载中
const total = ref(0) // 列表的总页数
const list = ref([]) // 列表的数据
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
    const data = await api.getList(queryParams)
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
  projectId: props.projectDetail.id,
  version: undefined,
  referenceVersion: undefined,
  changeLog: undefined,
  deployFileUrl: undefined
}
const formRef = ref()
const formData = ref(cloneDeep(defaultFormData))
const formRules = reactive({
  version: [{ required: true, message: '服务编号不能为空', trigger: 'blur' }],
  referenceVersion: [{ required: true, message: '服务编号不能为空', trigger: 'blur' }],
  changeLog: [{ required: true, message: '服务名称不能为空', trigger: 'blur' }],
  remark: [{ required: false }]
})

const openDeployDialog = async (project: any) => {
  console.log(project)
}

/** 打开弹窗 */
const openDialog = async (type: string, id?: number) => {
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
    const data = formData.value as unknown as FormReqVO
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
