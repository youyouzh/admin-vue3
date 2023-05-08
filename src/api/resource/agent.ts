import request from '@/config/axios'

export interface AgentVO {
  id?: number
  name: string
  ip: string
  remark: string
  createdAt: Date
}

const basePath = '/resources/agents'

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
  create: async (data: AgentVO) => {
    return await request.post({ url: basePath, data: data })
  },
  update: async (params: AgentVO) => {
    return await request.put({ url: basePath, data: params })
  },
  delete: async (id: number) => {
    return await request.delete({ url: `${basePath}/${id}` })
  }
}
