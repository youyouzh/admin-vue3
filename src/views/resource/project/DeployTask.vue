<template>
  <!-- 搜索工作栏 -->
  <ContentWrap>
    <Search :schema="allSchemas.searchSchema" @search="setSearchParams" @reset="setSearchParams">
      <!-- 新增等操作按钮 -->
      <template #actionMore>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['system:resource:project:version:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
      </template>
    </Search>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <Table :columns="allSchemas.tableColumns" @register="register">
      <template #action="{ row }">
        <el-button
          link
          type="primary"
          @click="openForm('update', row.id)"
          v-hasPermi="['system:mail-account:update']"
        >
          编辑
        </el-button>
        <el-button
          link
          type="primary"
          @click="openDetail(row.id)"
          v-hasPermi="['system:mail-account:query']"
        >
          详情
        </el-button>
        <el-button
          link
          type="danger"
          v-hasPermi="['system:mail-account:delete']"
          @click="handleDelete(row.id)"
        >
          删除
        </el-button>
      </template>
    </Table>
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <MailAccountForm ref="formRef" @success="getList" />
</template>
<script setup lang="ts" name="SystemMailAccount">
import { api } from '@/api/resource/project-version'
import { dateFormatter } from '@/utils/formatTime'
import type { CrudSchema } from '@/hooks/web/useCrudSchemas'

const crudSchemas = reactive<CrudSchema[]>([
  {
    label: '版本',
    field: 'version',
    isSearch: true
  },
  {
    label: '参考版本',
    field: 'referenceVersion'
  },
  {
    label: '密码',
    field: 'password',
    isTable: false
  },
  {
    label: '修改日志',
    field: 'changeLog'
  },
  {
    label: '部署文件下载地址',
    field: 'deployFileUrl',
    form: {
      component: 'InputNumber',
      value: 465
    }
  },
  {
    label: '创建时间',
    field: 'createdAt',
    isForm: false,
    formatter: dateFormatter,
    detail: {
      dateFormat: 'YYYY-MM-DD HH:mm:ss'
    }
  },
  {
    label: '操作',
    field: 'action',
    isForm: false,
    isDetail: false
  }
])
const { allSchemas } = useCrudSchemas(crudSchemas)

const { register, tableMethods } = useTable({
  getListApi: api.getList, // 分页接口
  delListApi: api.delete // 删除接口
})
// 获得表格的各种操作
const { getList, setSearchParams } = tableMethods

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 详情操作 */
const detailRef = ref()
const openDetail = (id: number) => {
  detailRef.value.open(id)
}

/** 删除按钮操作 */
const handleDelete = (id: number) => {
  tableMethods.delList(id, false)
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>
