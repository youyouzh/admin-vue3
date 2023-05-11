<template>
  <el-table :data="deployTasks">
    <el-table-column label="项目" align="center" prop="projectId">
      <template #default="scope">
        <el-select
          v-model="scope.row.projectId"
          clearable
          filterable
          placeholder="请先选择部署项目"
        >
          <el-option
            v-for="item in projectOptions"
            :key="item.id"
            :label="`${item.code}(${item.name})`"
            :value="item.id"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="部署机器" align="center" prop="agentId">
      <template #default="scope">
        <el-select v-model="scope.row.agentId" clearable filterable placeholder="请选择部署机器">
          <el-option
            v-for="item in agentOptions"
            :key="item.id"
            :label="`${item.ip}(${item.name})`"
            :value="item.id"
          />
        </el-select>
      </template>
    </el-table-column>
    <el-table-column label="部署版本" align="center" prop="projectVersionId">
      <template #default="scope">
        <el-select
          v-model="scope.row.projectVersionId"
          clearable
          filterable
          placeholder="请选择部署版本"
        >
          <el-option
            v-for="item in projectVersionOptions"
            :key="item.id"
            :label="item.version"
            :value="item.id"
          />
        </el-select>
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
</template>
<script lang="ts" name="BatchDeployTaskForm" setup></script>
