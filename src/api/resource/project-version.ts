import request from '@/config/axios'

export interface ProjectVersionVO {
  id?: number
  projectId: number
  version: string
  referenceVersion: string
  changeLog: string
  deployFileUrl: string
  createdAt: Date
}

const basePath = '/resources/project-versions'

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
  create: async (data: ProjectVersionVO) => {
    return await request.post({ url: basePath, data: data })
  },
  update: async (params: ProjectVersionVO) => {
    return await request.put({ url: basePath, data: params })
  },
  delete: async (id: number) => {
    return await request.delete({ url: `${basePath}/${id}` })
  }
}
