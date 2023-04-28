import request from '@/config/axios'

export interface FileClientConfig {
  basePath: string
  host?: string
  port?: number
  username?: string
  password?: string
  mode?: string
  endpoint?: string
  bucket?: string
  accessKey?: string
  accessSecret?: string
  domain: string
}

export interface FileConfigVO {
  id: number
  name: string
  storage: string
  master: boolean
  visible: boolean
  config: FileClientConfig
  remark: string
  createdAt: Date
}

export const api = {
  getPage: (params: PageParam) => {
    return request.get({ url: '/infra/file-config/page', params })
  },
  getDetail: (id: number) => {
    return request.get({ url: '/infra/file-config/get?id=' + id })
  },
  create: (data: FileConfigVO) => {
    return request.post({ url: '/infra/file-config/create', data: data })
  },
  update: (data: FileConfigVO) => {
    return request.put({ url: '/infra/file-config/update', data: data })
  },
  updateMaster: (id: number) => {
    return request.put({ url: '/infra/file-config/update-master?id=' + id })
  },
  delete: (id: number) => {
    return request.delete({ url: '/infra/file-config/delete?id=' + id })
  },
  test: (id: number) => {
    return request.get({ url: '/infra/file-config/test?id=' + id })
  }
}
