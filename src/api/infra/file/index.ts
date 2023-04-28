import request from '@/config/axios'
import { config } from '@/config/axios/config'

export interface FilePageReqVO extends PageParam {
  path?: string
  type?: string
  createdAt?: Date[]
}

export const getUploadPath = (): string => {
  return config.base_url + '/infra/file/upload'
}

export const api = {
  getPage: (params: FilePageReqVO) => {
    return request.get({ url: '/infra/file/page', params })
  },
  download: (id: number) => {
    return request.download({ url: '/infra/file/download/' + id })
  },
  delete: (id: number) => {
    return request.delete({ url: '/infra/file/delete?id=' + id })
  }
}
