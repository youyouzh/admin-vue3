import request from '@/config/axios'

export interface FormReqVO {
  id?: number
  name: string
  code: string
  description: string
  state: string
  createdAt: Date
}

export const api = {
  getPage: async (params: PageParam) => {
    return await request.get({ url: '/resources/apps', params })
  },
  getDetail: async (id: number) => {
    return await request.get({ url: '/resources/apps/' + id })
  },
  create: async (data: FormReqVO) => {
    return await request.post({ url: '/resources/apps', data: data })
  },
  update: async (params: FormReqVO) => {
    return await request.put({ url: '/resources/apps', data: params })
  },
  delete: async (id: number) => {
    return await request.delete({ url: '/resources/apps/' + id })
  }
}
