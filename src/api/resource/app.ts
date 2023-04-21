import request from '@/config/axios'

export interface AppVO {
  id?: number
  name: string
  code: string
  description: string
  status: number
  createTime: Date
}

// 查询部门（精简)列表
export const getSimpleAppList = async (): Promise<AppVO[]> => {
  return await request.get({ url: '/resource/app/list-all-simple' })
}

// 查询部门列表
export const getAppPage = async (params: PageParam) => {
  return await request.get({ url: '/resource/app/list', params })
}

// 查询部门详情
export const getApp = async (id: number) => {
  return await request.get({ url: '/resource/app/get?id=' + id })
}

// 新增部门
export const createApp = async (data: AppVO) => {
  return await request.post({ url: '/resource/app/create', data: data })
}

// 修改部门
export const updateApp = async (params: AppVO) => {
  return await request.put({ url: '/system/app/update', data: params })
}

// 删除部门
export const deleteApp = async (id: number) => {
  return await request.delete({ url: '/system/app/delete?id=' + id })
}
