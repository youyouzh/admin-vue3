import request from '@/config/axios'

export type DictDataVO = {
  id: number | undefined
  sort: number | undefined
  label: string
  value: string
  dictType: string
  status: number
  colorType: string
  cssClass: string
  remark: string
  createdAt: Date
}

// 查询字典数据（精简)列表
export const listSimpleDictData = () => {
  return [
    { dictType: 'common_state', value: 'ENABLED', label: '开启', colorType: '', cssClass: '' },
    { dictType: 'common_state', value: 'DISABLED', label: '关闭', colorType: '', cssClass: '' },
    {
      dictType: 'deploy_project_state',
      value: 'ONLINE',
      label: '线上运行中',
      colorType: '',
      cssClass: ''
    },
    {
      dictType: 'deploy_project_state',
      value: 'OFFLINE',
      label: '暂时下线',
      colorType: '',
      cssClass: ''
    },
    {
      dictType: 'deploy_project_state',
      value: 'DISCARD',
      label: '废弃',
      colorType: '',
      cssClass: ''
    }
  ]
  // return request.get({ url: '/system/dict-data/list-all-simple' })
}

// 查询字典数据列表
export const getDictDataPage = (params: PageParam) => {
  return request.get({ url: '/system/dict-data/page', params })
}

// 查询字典数据详情
export const getDictData = (id: number) => {
  return request.get({ url: '/system/dict-data/get?id=' + id })
}

// 新增字典数据
export const createDictData = (data: DictDataVO) => {
  return request.post({ url: '/system/dict-data/create', data })
}

// 修改字典数据
export const updateDictData = (data: DictDataVO) => {
  return request.put({ url: '/system/dict-data/update', data })
}

// 删除字典数据
export const deleteDictData = (id: number) => {
  return request.delete({ url: '/system/dict-data/delete?id=' + id })
}

// 导出字典类型数据
export const exportDictData = (params) => {
  return request.get({ url: '/system/dict-data/export', params })
}
