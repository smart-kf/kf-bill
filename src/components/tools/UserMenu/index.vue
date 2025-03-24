<template>
  <div class="user-wrapper">
    <a-popover placement="right">
      <template #content>
        <div>
          <a-button type="link" @click="changePassowrd">修改密码</a-button>
        </div>
        <div>
          <a-button type="link" @click="loginOut">退出登录</a-button>
        </div>
      </template>
      <a-avatar :size="60" :src="userInfo.avatar"> </a-avatar>
    </a-popover>
      <!-- 修改密码对话框 -->
  <a-modal
    title="修改密码"
    v-model:visible="visible"
    :confirmLoading="confirmLoading"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :form="form" layout="vertical">
      <a-form-item label="原密码" name="oldPassword" >
        <a-input v-model:value="oldPassword" type="password"/>
      </a-form-item>
      <a-form-item label="新密码" name="newPassword" >
        <a-input v-model:value="newPassword" type="password" />
      </a-form-item>
      <a-form-item label="确认密码" name="confirmPassword">
        <a-input v-model:value="confirmPassword" type="password" />
      </a-form-item>
    </a-form>
  </a-modal>
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
import { ref } from 'vue'
import { UserApi } from '@/webapi'
import { message } from 'ant-design-vue';


const router = useRouter()
const { userInfo }: any = useUserStore()

const visible = ref(false)
const confirmLoading = ref(false)
const form = ref<any>(null)
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
// 修改密码
const changePassowrd = () => {
  visible.value = true
}
// 确认修改密码
const handleOk = async () => {
  confirmLoading.value = true
  let data = {old_password: oldPassword.value,new_password:newPassword.value,repeat_password:confirmPassword.value}
  UserApi.updatePassword(data).then(res => {
    if (res.code === 200) {
      message.info('修改成功,即将退出登录');
      setTimeout(() => {
        ls.clear()
        router.replace('/user/login')
      }, 2000)
    }
  }).finally(() => {
    confirmLoading.value = false
  })
}
// 取消修改密码
const handleCancel = () => {
  visible.value = false
}

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
