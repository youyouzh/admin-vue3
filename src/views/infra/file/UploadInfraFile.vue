<template>
  <el-upload
    ref="uploadRef"
    v-model:file-list="fileList"
    :action="getUploadPath()"
    :auto-upload="false"
    :disabled="uploadDisabled"
    :headers="uploadHeaders"
    :limit="1"
    :drag="false"
    :accept="fileTypes.map((v) => (v = '.' + v)).join(',')"
    :before-upload="beforeUpload"
    :on-success="handleFileSuccess"
    :on-error="excelUploadError"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
  >
    <template #trigger>
      <el-button type="primary" class="ml-3"><Icon icon="ep:select" />选择文件</el-button>
    </template>
    <el-button
      type="success"
      class="ml-3"
      v-if="fileList.length >= 1"
      @click="submitUpload"
      style="vertical-align: top"
      ><Icon icon="ep:upload-filled" />上传</el-button
    >
    <el-button
      type="info"
      class="ml-3"
      v-if="fileId"
      @click="handleDownload"
      style="vertical-align: top"
      ><Icon icon="ep:download" />下载</el-button
    >
    <template #tip>
      <div style="font-size: 8px; color: red">
        大小不超过 <b style="color: #f56c6c">{{ fileSize }}MB</b>, 格式为
        <b style="color: #f56c6c">{{ fileTypes.join('/') }}</b> 的文件
      </div>
    </template>
  </el-upload>
</template>
<script lang="ts" name="InfraFileForm" setup>
import { getAccessToken } from '@/utils/auth'
import { api, getUploadPath } from '@/api/infra/file'
import { propTypes } from '@/utils/propTypes'
import { downloadByData } from '@/utils/download'
import type { UploadInstance, UploadUserFile, UploadProps, UploadRawFile } from 'element-plus'

const message = useMessage() // 消息弹窗

const emit = defineEmits(['update:modelValue'])
const props = defineProps({
  modelValue: propTypes.number,
  overload: propTypes.bool.def(true),
  fileTypes: propTypes.array.def(['jar', 'zip']), // 文件类型, 例如['png', 'jpg', 'jpeg']
  fileSize: propTypes.number.def(500) // 大小限制(MB)
})

const fileId = ref(props.modelValue) // 文件id
const uploadDisabled = ref(false) // 表单的加载中
const uploadHeaders = ref({ Authorization: 'Bearer ' + getAccessToken() })
const fileList = ref<UploadUserFile[]>([]) // 文件列表
const uploadRef = ref<UploadInstance>()

// 文件上传之前判断
const beforeUpload: UploadProps['beforeUpload'] = (file: UploadRawFile) => {
  let fileExtension = ''
  if (file.name.lastIndexOf('.') > -1) {
    fileExtension = file.name.slice(file.name.lastIndexOf('.') + 1)
  }
  if (props.fileTypes.indexOf(fileExtension) < 0) {
    message.error(`文件格式不正确, 请上传${props.fileTypes.join('/')}格式!`)
    return false
  }
  if (file.size >= props.fileSize * 1024 * 1024) {
    message.error(`上传文件大小不能超过${props.fileSize}MB!`)
    return false
  }
  message.success('正在上传文件，请稍候...')
}

// 文件上传成功
const handleFileSuccess: UploadProps['onSuccess'] = (res: any): void => {
  message.success('上传成功')
  fileId.value = res.data.id
  fileList.value = [res.data as unknown as UploadUserFile]
  emit('update:modelValue', res.data.id)
}

// 处理文件替换
const handleExceed: UploadProps['onExceed'] = (files) => {
  if (props.overload) {
    uploadRef.value!.clearFiles()
    const file = files[0] as UploadRawFile
    uploadRef.value!.handleStart(file)
  } else {
    // 不能文件替换
    message.warning('一次只能上传一个文件，请删除后重新上传')
  }
}

// 上传错误提示
const excelUploadError: UploadProps['onError'] = (): void => {
  message.error('上传失败，请您重新上传！')
}

// 删除上传文件
const handleRemove = () => {
  emit('update:modelValue', null)
}

const submitUpload = () => {
  uploadRef.value!.submit()
}

// 下载文件
const handleDownload = async () => {
  if (fileList.value.length == 0 || !fileId.value) {
    message.warning('没有可下载文件')
    return
  }
  const downloadFile = fileList.value[0]
  const data = await api.download(fileId.value)
  downloadByData(data, downloadFile.name)
}

/** 初始化文件信息 */
const initFileInfo = async (fileIdParam?: number, clear?: boolean) => {
  if (fileIdParam) {
    try {
      uploadDisabled.value = true
      const data = await api.getDetail(fileIdParam)
      fileList.value = [data as unknown as UploadUserFile]
    } finally {
      uploadDisabled.value = false
    }
  }
  if (clear) {
    // 清空文件列表，处理先编辑后新增
    fileList.value = []
    fileId.value = undefined
  }
}

defineExpose({ initFileInfo })

onMounted(() => {
  initFileInfo(fileId.value)
})
</script>
