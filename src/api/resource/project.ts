import request from '@/config/axios'

export interface ProjectVO {
  id?: number
  code: string
  name: string
  remark: string
  appId?: number
  createdAt: Date
}

const basePath = '/resources/projects'

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
  create: async (data: ProjectVO) => {
    return await request.post({ url: basePath, data: data })
  },
  update: async (data: ProjectVO, refreshConfig?: boolean) => {
    return await request.put({ url: `basePath?refreshConfig=${refreshConfig}`, data: data })
  },
  delete: async (id: number) => {
    return await request.delete({ url: `${basePath}/${id}` })
  }
}
