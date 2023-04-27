import request from '@/config/axios'

export interface FormReqVO {
  id?: number
  projectId: number
  version: string
  referenceVersion: string
  changeLog: string
  deployFileUrl: string
  createdAt: Date
}

export const api = {
  getList: async (params: PageParam) => {
    return await request.get({ url: '/resources/project-versions', params })
  },
  getDetail: async (id: number) => {
    return await request.get({ url: '/resources/project-versions/' + id })
  },
  create: async (data: FormReqVO) => {
    return await request.post({ url: '/resources/project-versions', data: data })
  },
  update: async (params: FormReqVO) => {
    return await request.put({ url: '/resources/project-versions', data: params })
  },
  delete: async (id: number) => {
    return await request.delete({ url: '/resources/project-versions/' + id })
  }
}
