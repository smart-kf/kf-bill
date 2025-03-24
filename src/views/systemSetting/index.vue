<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <a-spin :spinning="state.loading">
      <div class="max-containter" style="margin: auto">
        <a-tabs v-model:activeKey="activeKey">
          <a-tab-pane key="1" tab="基础设置">
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

              <div class="title">域名价格设置</div>
              <a-form name="basic" ref="formRef6" :model="formData" autocomplete="off" :label-col="{ span: 4 }" :rules="rules" labelAlign="right">
                <a-form-item label="价格(U)" name="domainPrice" require>
                  <a-input-number v-model:value="formData.domainPrice" placeholder="请输入" :min="0" :max="999" addon-after="U" style="width: 50%"></a-input-number>
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

          </a-tab-pane>
          <a-tab-pane key="3" tab="支付网络设置">
            <div class="base-info"> 
              <div class="title">支付网络设置</div>
                <a-form name="basic" ref="formRef5" :model="formData" autocomplete="off" :label-col="{ span: 4 }" :rules="rules" labelAlign="right">
                  <a-form-item name="apiKey" label="ApiKey">
                    <a-textarea v-model:value="formData.apiKey" placeholder="请输入trongid的APIKEY,多个以英文,分割" allowClear show-count :rows="4" style="width: 80%" />
                  </a-form-item>
                  <a-form-item name="proxy" label="代理">
                    <a-input v-model:value="formData.proxy" placeholder="请输入查询代理，国内必须填写，国外可不填写，仅只支持http协议代理" style="width: 80%" />
                  </a-form-item>
                  <a-form-item name="timeout" label="查询超时时间(秒): ">
                    <a-input-number v-model:value="formData.timeout" placeholder="最少为5s" max="60" min="5" style="width: 80%" />
                  </a-form-item>
                  <a-form-item name="cron_second" label="轮训查询间隔">
                    <a-input-number v-model:value="formData.cron_second" placeholder="最少为5s" max="60" min="5" style="width: 80%" />
                  </a-form-item>
                  <a-form-item name="tron_network" label="网络选择">
                    <a-select v-model:value="formData.tron_network" placeholder="请选择网络" style="width: 80%" @change="onNetworkChange">
                      <a-option value="nile">Nile测试网络</a-option>
                      <a-option value="main">主网</a-option>
                    </a-select>
                  </a-form-item>
                  <a-form-item name="timeout" label="合约地址">
                    <a-input disabled v-model:value="formData.usdtContractAddress" max="60" min="5" style="width: 80%" />
                  </a-form-item>
                  <div class="bottom-btn">
                    <a-button type="primary" @click="saveNetwork">保存</a-button>
                  </div>
                </a-form>
            </div>
            
            </a-tab-pane>
        </a-tabs> 
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
const formRef5: any = ref('')
const formRef6: any = ref('')

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
  testingCardMinute: null, // 测试卡过期时间

  apiKey: '',
  proxy: '',
  timeout: 5,
  cron_second: 5,
  tron_network: 'nile',
  usdtContractAddress: 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf',

  domainPrice: 0, 
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
  expire: [{ required: true, message: '必填项不能为空', trigger: 'blur' }],
  domainPrice: [{ required: true, message: '域名价格不能为空', trigger: 'blur' }]
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
    },
    domainPrice: formData.domainPrice,
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
    formData.domainPrice = data.domainPrice || 0
  } else {
    Message.error(message)
  }
  state.loading = true
  let res = await SystemApi.getTron()
  state.loading = false
  formData.apiKey = res.data?.apiKey
  formData.proxy = res.data?.proxy
  formData.timeout = res.data?.timeout
  formData.cron_second = res.data?.cron_second
  formData.tron_network = res.data?.tron_network
  if(res.data.tron_network === 'nile') {
    formData.usdtContractAddress = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'
  } else {
    formData.usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  }
}

const onNetworkChange = (e) => {
  if(e === 'nile') {
    formData.usdtContractAddress = 'TXYZopYRdj2D9XRtbG411XZZ3kM5VkAeBf'
  } else {
    formData.usdtContractAddress = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
  }
}

const saveNetwork = (e) => {
  state.loading = true
  let params = {
    apiKey: formData.apiKey,
    proxy: formData.proxy,
    timeout: formData.timeout,
    tron_network: formData.tron_network,
    cron_second: formData.cron_second,
  }
  SystemApi.updateTron(params).then(res => {
    state.loading = false
    if(res.code === 0) {
      Message.success('保存成功')
    } else {
      Message.error(res.message)
    }
  })
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
  width: 120px;
  text-align: center;
  color: #fff;
  height: 32px;
  line-height: 32px;
  font-size: 16px;
  font-weight: 600;
  border-radius: 4px;
  margin-bottom: 24px;
  margin-top: 36px;
}
.mt0 {
  margin-top: 0;
}
</style>
