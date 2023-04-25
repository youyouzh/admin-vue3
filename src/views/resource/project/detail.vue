<template>
  <el-tabs type="border-card">
    <el-tab-pane label="基本信息">
      <el-form
        ref="formRef"
        v-loading="formLoading"
        :model="formData"
        :rules="formRules"
        label-width="80px"
      >
        <el-form-item label="编号" prop="code">
          <el-input v-model="formData.code" placeholder="请输入项目编号" />
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入名称" />
        </el-form-item>
        <el-form-item label="项目状态" prop="projectState">
          <el-select v-model="formData.projectState" placeholder="请选择项目状态">
            <el-option
              v-for="item in getStrDictOptions(DICT_TYPE.DEPLOY_PROJECT_STATE)"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input v-model="formData.remark" placeholder="请输入项目备注" type="textarea" />
        </el-form-item>
      </el-form>
    </el-tab-pane>
    <el-tab-pane label="部署配置" />
    <el-tab-pane label="配置文件" />
    <el-tab-pane label="版本管理" />
    <el-tab-pane label="部署详情" />
  </el-tabs>
</template>
<script setup lang="tsx"></script>
