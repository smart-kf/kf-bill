import baseService from '@/utils/http/axios'

// 系统配置
export const getSysConfig = (data: any) => {
  return baseService.get(`api/bill/setting/get`, { params: data })
}

export const setSysConfig = (data: any) => {
  return baseService.post(`api/bill/setting/update`, data)
}
