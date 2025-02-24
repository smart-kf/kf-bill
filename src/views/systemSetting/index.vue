<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <a-spin :spinning="state.loading">
      <div class="max-containter" style="margin: auto">
        <div class="base-info">
          <div class="title mt0">套餐设置</div>
          <a-form name="basic" ref="formRef1" :model="formData" autocomplete="off" :label-col="{ span: 4 }" :rules="rules" labelAlign="right">
            <a-form-item label="日卡" name="dailyPackagePrice" require>
              <a-input-number v-model:value="formData.dailyPackagePrice" placeholder="请输入" :min="1" :max="999" addon-after="$" style="width: 50%"></a-input-number>
            </a-form-item>
            <a-form-item label="周卡" name="weeklyPackagePrice" require>
              <a-input-number v-model:value="formData.weeklyPackagePrice" placeholder="请输入" :min="1" :max="999" addon-after="$" style="width: 50%"></a-input-number>
            </a-form-item>
            <a-form-item label="月卡" name="monthlyPackagePrice" require>
              <a-input-number v-model:value="formData.monthlyPackagePrice" placeholder="请输入" :min="1" :max="999" addon-after="$" style="width: 50%"></a-input-number>
            </a-form-item>
          </a-form>
          <div class="title">支付配置</div>
          <a-form name="basic" ref="formRef2" :model="formData" autocomplete="off" :label-col="{ span: 4 }" :rules="rules" labelAlign="right">
            <a-form-item label="appId" name="appId"> {{ formData.appId }}</a-form-item>
            <a-form-item label="邮箱" name="email" require>
              <a-input v-model:value="formData.email" placeholder="请输入邮箱" style="width: 80%" />
            </a-form-item>
            <a-form-item label="支付地址" name="payUrl" require>
              <a-input v-model:value="formData.payUrl" placeholder="支付地址域名(带https)" style="width: 80%" />
            </a-form-item>
            <a-form-item label="订单过期时间" name="expire" require>
              <a-input-number v-model:value="formData.expire" placeholder="请输入" :min="0" :max="999" addon-after="分钟" style="width: 50%"></a-input-number>
            </a-form-item>
            <a-form-item label="token" name="token" require>
              <a-textarea v-model:value="formData.token" placeholder="token" allowClear :maxlength="255" show-count :rows="2" style="width: 80%" />
            </a-form-item>
          </a-form>
          <div class="title">公告设置</div>
          <a-form name="basic" ref="formRef3" :model="formData" autocomplete="off" :label-col="{ span: 4 }" :rules="rules" labelAlign="right">
            <a-form-item name="enable" label="系统公告">
              <a-textarea v-model:value="formData.content" placeholder="请输入公告" allowClear :maxlength="255" show-count :rows="2" style="width: 80%" />
            </a-form-item>
            <a-form-item name="enable" label="是否在客服后台登录时展示" :label-col="{ span: 7 }">
              <a-switch v-model:checked="formData.enable" />
            </a-form-item>
          </a-form>
          <div class="title">其他设置</div>
          <a-form name="basic" ref="formRef4" :model="formData" autocomplete="off" :label-col="{ span: 4 }" :rules="rules" labelAlign="right">
            <a-form-item label="测试卡过期时间" name="testingCardMinute" require :label-col="{ span: 5 }">
              <a-input-number v-model:value="formData.testingCardMinute" placeholder="请输入" :min="0" :max="999" addon-after="分钟" style="width: 50%"></a-input-number>
            </a-form-item>
          </a-form>
          <div class="bottom-btn">
            <a-button type="primary" @click="onSave">保存</a-button>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { message as Message } from 'ant-design-vue'
import { useUserStore } from '@/store/modules'
import { SystemApi } from '@/webapi/index'
import ls from '@/utils/Storage'

const { userInfo }: any = useUserStore()

const formRef1: any = ref('')
const formRef2: any = ref('')
const formRef3: any = ref('')
const formRef4: any = ref('')

const formData: any = reactive({
  content: '', // 公告
  enable: false, // 是否显示公告
  appId: '',
  email: '',
  payUrl: '',
  token: '',
  expire: null, // 订单过期时间
  dailyPackagePrice: null,
  monthlyPackagePrice: null,
  weeklyPackagePrice: null,
  testingCardMinute: null // 测试卡过期时间
})
const state = reactive({
  loading: false,
  editData: {} as any
})

const rules = {
  dailyPackagePrice: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  monthlyPackagePrice: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  weeklyPackagePrice: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  email: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  payUrl: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  token: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  expire: [{ required: true, message: '必填项不能为空', trigger: 'blur' }]
}

// 保存数据
const saveData = async () => {
  state.loading = true
  let params = {
    dailyPackage: {
      id: 'daily',
      days: 0,
      price: formData.dailyPackagePrice
    },
    weeklyPackage: {
      id: 'weekly',
      days: 0,
      price: formData.weeklyPackagePrice
    },
    monthlyPackage: {
      id: 'monthly',
      days: 0,
      price: formData.monthlyPackagePrice
    },
    testingCardMinute: formData.testingCardMinute,
    payment: {
      payUrl: formData.payUrl,
      token: formData.token,
      appId: formData.appId,
      email: formData.email,
      expire: formData.expire
    },
    notice: {
      content: formData.content,
      enable: formData.enable
    }
  }
  let { code, data, message }: any = await SystemApi.setSysConfig(params)
  state.loading = false
  if (code === 200) {
    Message.success('保存成功')
  } else {
    Message.error(message)
  }
}
const onSave = () => {
  // 同时校验所有表单
  const formRef1Val = formRef1.value.validate()
  const formRef2Val = formRef2.value.validate()
  const formRef3Val = formRef3.value.validate()
  const formRef4Val = formRef4.value.validate()
  // 使用 Promise.all 来并行验证多个表单
  Promise.all([formRef1Val, formRef2Val, formRef3Val, formRef4Val])
    .then(() => {
      saveData()
    })
    .catch((err) => {
      console.log(err)
    })
}

const initData = async () => {
  state.loading = true
  let { code, data, message }: any = await SystemApi.getSysConfig({})
  state.loading = false
  if (code === 200) {
    console.log(data)
    formData.dailyPackagePrice = (data.dailyPackage && data.dailyPackage.price) || 0
    formData.weeklyPackagePrice = (data.weeklyPackage && data.weeklyPackage.price) || 0
    formData.monthlyPackagePrice = (data.monthlyPackage && data.monthlyPackage.price) || 0
    formData.content = (data.notice && data.notice.content) || ''
    formData.enable = (data.notice && data.notice.enable) || false
    formData.testingCardMinute = data.testingCardMinute || 0
    formData.appId = (data.payment && data.payment.appId) || ''
    formData.email = (data.payment && data.payment.email) || ''
    formData.expire = (data.payment && data.payment.expire) || 0
    formData.payUrl = (data.payment && data.payment.payUrl) || ''
    formData.token = (data.payment && data.payment.token) || ''
  } else {
    Message.error(message)
  }
}

onMounted(() => {
  initData()
})
</script>
<style lang="less" scoped>
.base-info {
  position: relative;
  box-sizing: border-box;
  width: 650px;
  margin: auto;
  overflow-x: auto;
  :deep(.ant-form-item) {
    margin-bottom: 16px;
  }
  .avatar {
    position: absolute;
    right: 5%;
    top: 32px;
  }
}
.bottom-btn {
  width: 100%;
  text-align: center;
  padding-bottom: 20px;
}
.red-tip {
  color: #ff4d4f;
}
.title {
  background: #4a90e2;
  width: 80px;
  color: #fff;
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  font-weight: 600;
  padding-left: 8px;
  border-radius: 4px;
  margin-bottom: 24px;
  margin-top: 36px;
}
.mt0 {
  margin-top: 0;
}
</style>
