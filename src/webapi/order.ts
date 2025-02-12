import baseService from '@/utils/http/axios'

// 获取订单列表
export const getOrderList = (data: any) => {
  return baseService.post(`api/bill/order/list`, data)
}
