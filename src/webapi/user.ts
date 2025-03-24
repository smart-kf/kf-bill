import baseService from '@/utils/http/axios'

// 用户登录
export const userLogin = (data: any) => {
  return baseService.post(`api/bill/login`, data)
}

// 修改密码 
export const updatePassword = (data: any) => {
  return baseService.post(`api/bill/setting/change-password`, data)
}