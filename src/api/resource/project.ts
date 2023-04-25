import request from '@/config/axios'

export interface FormReqVO {
  id?: number
  name: string
  ip: string
  remark: string
  createdAt: Date
}

export const api = {
  getPage: async (params: PageParam) => {
    return await request.get({ url: '/resources/projects', params })
  },
  getDetail: async (id: number) => {
    return await request.get({ url: '/resources/projects/' + id })
  },
  create: async (data: FormReqVO) => {
    return await request.post({ url: '/resources/projects', data: data })
  },
  update: async (params: FormReqVO) => {
    return await request.put({ url: '/resources/projects', data: params })
  },
  delete: async (id: number) => {
    return await request.delete({ url: '/resources/projects/' + id })
  }
}
