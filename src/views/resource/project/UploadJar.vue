<template>
  <div class="upload-file">
    <el-upload
      ref="uploadRef"
      name="file"
      v-model="modelValue"
      v-model:file-list="fileList"
      :action="updateUrl"
      :headers="uploadHeaders"
      :drag="true"
      :show-file-list="true"
      :auto-upload="true"
      :limit="1"
      :before-upload="beforeUpload"
      :on-success="handleFileSuccess"
      :on-error="excelUploadError"
      :on-exceed="handleExceed"
      :on-remove="handleRemove"
      class="upload-file-uploader"
    >
      <el-button type="primary"><Icon icon="ep:upload-filled" />选取文件</el-button>
      <template #tip>
        <div style="font-size: 8px">
          大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>, 格式为
          <b style="color: #f56c6c">{{ fileTypes.join('/') }}</b> 的文件
        </div>
      </template>
    </el-upload>
  </div>
</template>
<script setup lang="ts" name="UploadFile">
import { getAccessToken } from '@/utils/auth'
import { getUploadPath } from '@/api/infra/file'
import type { UploadInstance, UploadUserFile, UploadProps, UploadRawFile } from 'element-plus'
import { propTypes } from '@/utils/propTypes'

const message = useMessage() // 消息弹窗

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: propTypes.number // fileId
})
// ========== 上传相关 ==========
const updateUrl = getUploadPath()
const fileTypes = ['jar', 'zip']
const fileSize = 500
const modelValue = ref(props.modelValue)

const uploadRef = ref<UploadInstance>()
const fileList = ref<UploadUserFile[]>([])
if (props.modelValue) fileList.value = [props.modelValue]
const uploadHeaders = ref({
  Authorization: 'Bearer ' + getAccessToken()
})
// 文件上传之前判断
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  let fileExtension = ''
  if (file.name.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
  }
  if (fileTypes.indexOf(fileExtension) < 0) {
    message.error(`文件格式不正确, 请上传${fileTypes.join('/')}格式!`)
    return false
  }
  if (file.size >= fileSize * 1024 * 1024) {
    message.error(`上传文件大小不能超过${fileSize}MB!`)
    return false
  }
  message.success('正在上传文件，请稍候...')
}

// 文件上传成功
const handleFileSuccess: UploadProps['onSuccess'] = (res: any): void => {
  message.success('上传成功')
  fileList.value = [res.data]
  emit('update:modelValue', res.data)
}

// 处理文件替换
const handleExceed: UploadProps['onExceed'] = (files) => {
  uploadRef.value!.clearFiles()
  const file = files[0] as UploadRawFile
  uploadRef.value!.handleStart(file)
}

// 上传错误提示
const excelUploadError: UploadProps['onError'] = (): void => {
  message.error('上传失败，请您重新上传！')
}

// 删除上传文件
const handleRemove = () => {
  emit('update:modelValue', null)
}
</script>
<style scoped lang="scss">
.upload-file-uploader {
  margin-bottom: 5px;
}
:deep(.upload-file-list .el-upload-list__item) {
  border: 1px solid #e4e7ed;
  line-height: 2;
  margin-bottom: 10px;
  position: relative;
}
:deep(.el-upload-list__item-file-name) {
  max-width: 250px;
}
:deep(.upload-file-list .ele-upload-list__item-content) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: inherit;
}
:deep(.ele-upload-list__item-content-action .el-link) {
  margin-right: 10px;
}
</style>
