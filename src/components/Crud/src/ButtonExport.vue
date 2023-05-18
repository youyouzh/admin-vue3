<template>
  <el-button type="success" plain v-hasPermi="permi" :loading="exportLoading" @click="handleExport">
    <Icon icon="ep:download" class="mr-5px" /> {{ text }}
  </el-button>
</template>
<script setup lang="ts" name="ButtonAdd">
import { propTypes } from '@/utils/propTypes'
import { downloadByData } from '@/utils/download'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const props = defineProps({
  text: propTypes.string.def('导出'),
  api: propTypes.func,
  queryParams: propTypes.object,
  filename: propTypes.string.def('导出.xlsx'),
  permi: propTypes.string
})

const exportLoading = ref(false) // 导出的加载中

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    if (props.api) {
      const data = await props.api(props.queryParams)
      downloadByData(data, props.filename)
      message.success(t('common.exportSuccess'))
    }
  } catch {
  } finally {
    exportLoading.value = false
  }
}
</script>
