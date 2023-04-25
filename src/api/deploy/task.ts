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
    return await request.get({ url: '/deploy/tasks', params })
  },
  getDetail: async (id: number) => {
    return await request.get({ url: '/deploy/tasks/' + id })
  },
  create: async (data: FormReqVO) => {
    return await request.post({ url: '/deploy/tasks', data: data })
  },
  update: async (params: FormReqVO) => {
    return await request.put({ url: '/deploy/tasks', data: params })
  },
  delete: async (id: number) => {
    return await request.delete({ url: '/deploy/tasks/' + id })
  }
}
