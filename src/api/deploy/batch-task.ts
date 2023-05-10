import request from '@/config/axios'

export interface BatchDeployTaskVO {
  id?: number
  title: string
  changeLog: String
  deployTaskIds: number[]
  deployStartTime: Date
  deployEndTime: Date
  createdAt: Date
}

const basePath = '/deploy/batch-tasks'

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
  create: async (data: object) => {
    return await request.post({ url: basePath, data: data })
  },
  update: async (params: object) => {
    return await request.put({ url: basePath, data: params })
  },
  delete: async (id: number) => {
    return await request.delete({ url: `${basePath}/${id}` })
  },
  runDeploy: async (id: number) => {
    return await request.post({ url: `${basePath}/${id}/run` })
  }
}
