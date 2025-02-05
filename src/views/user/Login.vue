<template>
  <div class="main">
    <div class="login-title">
      <img src="@/assets/login-logo.png" />
    </div>
    <div class="user-layout-login">
      <div class="title">云客服后台管理系统登录</div>
      <a-form id="formLogin" ref="loginFormRef" :model="formData" :rules="loginRules">
        <a-form-item name="userNum">
          <a-input type="text" placeholder="请输入账号" allowClear :maxlength="150" v-model:value="formData.userNum" />
        </a-form-item>
        <a-form-item name="password">
          <a-input-password placeholder="请输入密码" allowClear :maxlength="150" v-model:value="formData.password" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" class="login-button" :loading="state.loading" :disabled="state.loading" @click="loginSubmit">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script lang="ts" setup name="Login">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { UserApi } from '@/webapi/index'
import type { Rule } from 'ant-design-vue/es/form'
import ls from '@/utils/Storage'
import { message as Message } from 'ant-design-vue'

const router = useRouter()

const state = reactive({
  loading: false
})
const loginFormRef: any = ref(null)

// 表单信息
const formData: any = reactive({
  userNum: '',
  password: ''
})

// 表单校验
const loginRules: Record<string, Rule[]> = {
  userNum: [{ required: true, message: '请输入账号' }],
  password: [{ required: true, message: '请输入密码' }]
}

const loginHandle = async () => {
  let params = {
    captchaCode: '',
    captchaId: '',
    cardID: formData.cardID,
    password: ''
  }
  state.loading = true
  let { code, data, message }: any = await UserApi.userLogin(params)
  state.loading = false
  if (code === 200) {
    ls.set('token', data.token)
    ls.set('cdnDomain', data.cdnDomain)
    router.push({ path: '/' })
  } else {
    Message.error(message || '请求失败')
  }
}
const loginSubmit = () => {
  ls.set('token', 'data.token')
  ls.set('cdnDomain', 'data.cdnDomain')
  router.push({ path: '/' })
  // loginFormRef.value
  //   .validate()
  //   .then(() => {
  //     loginHandle()
  //   })
  //   .catch((err) => {
  //     console.log(err)
  //   })
}

onMounted(() => {})
</script>

<style lang="less" scoped>
@import '@/style/index.less';
.main {
  position: relative;
}
.login-title {
  position: absolute;
  top: -40px;
  padding: 3px;
  border-radius: 50%;
  background-color: #fff;
  left: 50%;
  transform: translateX(-50%);
  img {
    width: 86px;
    height: 86px;
  }
}
.title {
  font-size: 22px;
  text-align: center;
  padding: 16px 0 32px 0;
}
.user-layout-login {
  background: #fff;
  border-radius: 16px;
  padding: 40px;
  box-shadow: 0 2px 11px 1px #cbbdf075;
  min-width: 260px;
  width: 460px;
  margin: 0 auto;

  button.login-button {
    padding: 0 15px;
    font-size: 16px;
    height: 40px;
    width: 100%;
  }
}
.login-tab {
  :deep(.ant-tabs-nav-list) {
    width: 100%;
    .ant-tabs-tab {
      margin: 0;
      justify-content: center;
      width: 33.33%;
    }
  }
}
.other-btn {
  padding-bottom: 12px;
  button {
    width: 100%;
  }
}
.agreement-content {
  height: 60vh;
  overflow-y: auto;
  p {
    margin: 0;
  }
}
</style>
