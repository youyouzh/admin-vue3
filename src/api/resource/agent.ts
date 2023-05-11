import request from '@/config/axios'

export interface AgentVO {
  id: number
  name: string
  ip: string
  remark: string
  recommendSelect: boolean
  createdAt: Date
}

const basePath = '/resources/agents'

export const api = {
  getAll: async (projectId?: number) => {
    const params = {
      pageNo: 1,
      pageSize: 500,
      projectId: projectId
    }
    const data = await request.get({ url: basePath, params })
    return data.list
  },
  getOptions: async (projectId?: number) => {
    const params = {
      projectId: projectId
    }
    return await request.get({ url: `${basePath}/options`, params })
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
