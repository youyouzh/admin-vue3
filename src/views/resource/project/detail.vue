<template>
  <el-alert :title="`服务详情：${projectDetail.code} (id: ${projectDetail.id})`" type="success" />
  <el-tabs type="border-card" v-if="dataLoadFinish">
    <el-tab-pane label="基本信息">
      <BaseForm :project-detail="projectDetail" />
    </el-tab-pane>
    <el-tab-pane label="配置文件">
      <ConfigFileForm :project-detail="projectDetail" />
    </el-tab-pane>
    <el-tab-pane label="部署配置">
      <DeployConfigForm :project-detail="projectDetail" />
    </el-tab-pane>
    <el-tab-pane label="部署包管理">
      <ProjectVersion :project-detail="projectDetail" />
    </el-tab-pane>
    <el-tab-pane label="部署任务详情">
      <DeployTask :project-detail="projectDetail" />
    </el-tab-pane>
  </el-tabs>
</template>
<script setup lang="tsx">
import { useRoute } from 'vue-router'
import BaseForm from './BaseForm.vue'
import { api } from '@/api/resource/project'
import ConfigFileForm from './ConfigFileForm.vue'
import DeployConfigForm from './DeployConfigForm.vue'
import ProjectVersion from './ProjectVersion.vue'
import DeployTask from './DeployTask.vue'

// 从路由中获取项目id参数
const projectId = parseInt(useRoute().params.id + '')

const projectDetail = ref({
  id: 0,
  code: ''
})
// 保证数据加载完成后再渲染子tab
const dataLoadFinish = ref(false)

// 初始化表单数据
const initProjectDetail = async () => {
  try {
    dataLoadFinish.value = false
    projectDetail.value = await api.getDetail(projectId)
  } finally {
    dataLoadFinish.value = true
  }
}

/** 初始化 **/
onMounted(() => {
  initProjectDetail()
})
</script>
<style lang="css">
.el-alert {
  margin-bottom: 10px;
}
</style>
