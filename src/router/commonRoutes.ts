import { UserLayout } from '@/layouts'
import { h } from 'vue'
import { BasicLayout, RouteView } from '@/layouts'
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons-vue'
import { type Router } from './types'

// info:todo:1.如果使用服务端获取路由,path: '/',这块路由再写就会被覆盖
// 2.router.addRoute(parent, routeObj),添加parent,它就会自动加上/parent/xxx,直接写parent即可,就算嵌套多层也没事,自动变成/xxxx/xxxx/parent/xxxxx
// 3.以“/”开头的嵌套路径会被当作根路径，所以子路由上不用加“/”;
// 在生成路由时，主路由上的path会被自动添加到子路由之前，所以子路由上的path不用在重新声明主路由上的path了。
export default [
  {
    path: '/',
    name: 'index',
    component: BasicLayout,
    redirect: '/orderManage',
    children: [
      {
        path: '/orderManage',
        name: 'orderManage',
        meta: { title: '订单管理', icon: 'icon-erweima', keepAlive: false },
        component: () => import('@/views/orderManage/index.vue')
      },
      {
        path: '/cardManage',
        name: 'cardManage',
        component: () => import('@/views/cardManage/index.vue'),
        meta: { title: '卡密管理', icon: 'icon-xiaoxi1', keepAlive: false }
      },
      {
        path: '/domainManage',
        name: 'domainManage',
        meta: { title: '域名管理', icon: 'icon-huanyingyu', keepAlive: false },
        component: () => import('@/views/domainManage/index.vue')
      }
    ]
  },
  {
    path: '/user',
    name: 'user',
    component: UserLayout,
    redirect: '/user/login',
    hidden: true,
    children: [
      {
        path: 'login',
        name: 'login',
        component: () => import(/* webpackChunkName: "user" */ '@/views/user/Login.vue'),
        meta: { title: '登录' }
      }
    ]
  },
  {
    path: '/:path(.*)',
    name: 'NoMatch',
    component: () => import('@/views/exception/404.vue')
  }
] as Router[]
