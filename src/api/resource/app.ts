import request from '@/config/axios'

export interface AppVO {
  id?: number
  name: string
  code: string
  description: string
  state: string
  createdAt: Date
}

const basePath = '/resources/apps'

export const api = {
  getAll: async () => {
    const data = await request.get({ url: basePath, pageNo: 1, pageSize: 500 })
    return data.list
  },
  getPage: async (params: PageParam) => {
    return await request.get({ url: basePath, params })
  },
  getDetail: async (id: number) => {
    return await request.get({ url: `${basePath}/${id}` })
  },
  create: async (data: AppVO) => {
    return await request.post({ url: basePath, data: data })
  },
  update: async (params: AppVO) => {
    return await request.put({ url: basePath, data: params })
  },
  delete: async (id: number) => {
    return await request.delete({ url: `${basePath}/${id}` })
  }
}
