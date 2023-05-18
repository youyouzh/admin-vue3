<template>
  <el-button link type="danger" @click="handleDelete" v-hasPermi="permi">
    <Icon icon="ep:delete" class="mr-5px" /> {{ text }}
  </el-button>
</template>
<script setup lang="ts" name="ButtonDelete">
import { propTypes } from '@/utils/propTypes'
const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const props = defineProps({
  text: propTypes.string.def('删除'),
  id: propTypes.number,
  api: propTypes.func,
  permi: propTypes.string
})

const emit = defineEmits(['success'])

const handleDelete = async () => {
  // 删除的二次确认
  await message.delConfirm()
  if (props.api) {
    // 发起删除
    await props.api(props.id)
    message.success(t('common.delSuccess'))
    emit('success')
  }
}
</script>
