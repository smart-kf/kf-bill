<template>
  <div class="user-wrapper">
    <a-popover placement="right">
      <template #content>
        <a-button type="link" @click="loginOut">退出登录</a-button>
      </template>
      <a-avatar :size="60" :src="userInfo.avatar"> </a-avatar>
    </a-popover>
    <div class="point"></div>
  </div>
</template>

<script lang="ts" setup>
import { Modal } from 'ant-design-vue'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useUserStore } from '@/store/modules'
import { useRouter } from 'vue-router'
import { clearUserInfo } from '@/utils/util'
import ls from '@/utils/Storage'

const router = useRouter()
const { userInfo }: any = useUserStore()

// 登出
const loginOut = () => {
  Modal.confirm({
    title: '提示',
    content: '退出登录',
    onOk: () => {
      ls.clear()
      router.replace('/user/login')
    },
    onCancel() {}
  })
}
</script>
<style lang="less">
.user-wrapper {
  width: 100%;
  height: 80px;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ant-avatar {
  cursor: pointer;
}
.point {
  height: 80px;
  position: relative;
  display: inline-block; /* 或其他适合你的布局的display属性 */
}

.point::after {
  content: '';
  position: absolute;
  bottom: 7px;
  right: -2px;
  width: 8px;
  height: 8px;
  background-color: #52c41a;
  border-radius: 50%;
  border: 1px solid #fff;
}
</style>
