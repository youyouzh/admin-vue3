import request from '@/config/axios'

export interface OAuth2TokenVO {
  id: number
  accessToken: string
  refreshToken: string
  userId: number
  userType: number
  clientId: string
  createdAt: Date
  expiresTime: Date
}

// 查询 token列表
export const getAccessTokenPage = (params: PageParam) => {
  return request.get({ url: '/system/oauth2-token/page', params })
}

// 删除 token
export const deleteAccessToken = (accessToken: number) => {
  return request.delete({ url: '/system/oauth2-token/delete?accessToken=' + accessToken })
}
