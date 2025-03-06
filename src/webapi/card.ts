import baseService from '@/utils/http/axios'

// 获取卡密list
export const getCardList = (data: any) => {
  return baseService.post(`api/bill/card/list`, data)
}
// 更新状态
export const updateStatus = (data: any) => {
  return baseService.post(`api/bill/card/updateStatus`, data)
}
export const updateCardExpire = (data: any) => {
  return baseService.post(`api/bill/card/updateCardExpire`, data)
}
// 新增
export const addCard = (data: any) => {
  return baseService.post(`api/bill/card/batch-add`, data)
}
