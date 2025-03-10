<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <div>
      <a-form :model="searchParams" class="search-form">
        <a-form-item label="卡密ID">
          <a-input v-model:value="searchParams.cardID" placeholder="请输入卡密ID" allowClear />
        </a-form-item>
        <a-form-item label="卡片类型">
          <a-select v-model:value="searchParams.cardType" placeholder="请选择卡片类型" :options="state.typeOptions" allowClear> </a-select>
        </a-form-item>
        <a-form-item label="登录状态">
          <a-select v-model:value="searchParams.loginStatus" placeholder="请选择登录状态" :options="state.loginOptions" allowClear> </a-select>
        </a-form-item>
        <a-form-item label="销售状态">
          <a-select v-model:value="searchParams.saleStatus" placeholder="请选择销售状态" :options="state.saleOptions" allowClear> </a-select>
        </a-form-item>
        <a-form-item label="上次登录时间">
          <a-range-picker v-model:value="searchParams.loginTime" />
        </a-form-item>
        <a-form-item label="过期时间">
          <a-range-picker v-model:value="searchParams.expireTime" />
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="onReset">重置</a-button>
            <a-button type="primary" @click="onSearch">查询</a-button>
            <a-button type="primary" @click="onAddMsg">批量新增卡号</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
    <a-table bordered :data-source="state.dataSource" :loading="state.loading" :columns="columns" size="middle" :scroll="{ x: 'max-content' }" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'saleStatusText'">
          <a-tag v-if="record.saleStatus === 1" color="blue">{{ record.saleStatusText }}</a-tag>
          <a-tag v-if="record.saleStatus === 2" color="gray">{{ record.saleStatusText }}</a-tag>
          <a-tag v-if="record.saleStatus === 3" color="#87d068">{{ record.saleStatusText }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'cardTypeText'">
          <a-tag v-if="record.cardType === 1" color="blue">{{ record.cardTypeText }}</a-tag>
          <a-tag v-if="record.cardType === 2" color="gray">{{ record.cardTypeText }}</a-tag>
        </template>
        <template v-if="column.dataIndex === 'loginStatusText'">
          <span v-if="record.loginStatus === 1" style="color: gray">{{ record.loginStatusText }}</span>
          <span v-if="record.loginStatus === 2" style="color: #87d068">{{ record.loginStatusText }}</span>
        </template>
        <template v-if="column.dataIndex === 'expireTimeText'">
          <a-space>
            <span :class="timeOutCheck(record)">{{ record.expireTimeText }}</span>
            <span v-if="record.expireTime > 0" class="table-link-action" @click="onEditTime(record)"> 更新 </span>
          </a-space>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <span class="table-link-action" @click="onEdit(record)"> 更新销售状态 </span>
          </a-space>
        </template>
      </template>
    </a-table>
    <a-pagination size="small" v-model:current="searchParams.page" :total="state.total" @change="onPageChange" show-size-changer show-quick-jumper :show-total="(total) => `共 ${total} 条`" />
    <a-modal v-model:visible="state.showStatusDia" title="更新销售状态" @ok="onStatusChangeOk">
      <div>
        <a-form>
          <a-form-item label="销售状态">
            <a-select v-model:value="state.editData.saleStatus" placeholder="请选择销售状态" :options="state.saleOptions"> </a-select>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <a-modal v-model:visible="state.showTimeDia" title="更新过期时间" @ok="onTimeChangeOk">
      <div>
        <a-form>
          <a-form-item label="过期时间">
            <a-date-picker show-time placeholder="请选择" style="width: 80%" v-model:value="state.updateTime" format="YYYY-MM-DD HH:mm:ss">
              <template #renderExtraFooter>
                <a-space>
                  <a-button type="primary" size="small" @click="setTime(1)">1天</a-button>
                  <a-button type="primary" size="small" @click="setTime(7)">7天</a-button>
                  <a-button type="primary" size="small" @click="setTime(30)">30天</a-button>
                </a-space>
              </template>
            </a-date-picker>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <AddModal v-model:model-value="state.showDia" :action-type="state.actionType" @refesh="onSearch"></AddModal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from 'vue'
import { h } from 'vue'
import { message as Message } from 'ant-design-vue'
import { CardApi } from '@/webapi'
import AddModal from './components/addModal/index.vue'
import dayjs, { Dayjs } from 'dayjs'
type RangeValue = [Dayjs, Dayjs]
const state = reactive({
  dataSource: [],
  editableData: {},
  editData: {} as any,
  actionType: 'add',
  showDia: false,
  loading: false,
  showStatusDia: false,
  showTimeDia: false,
  updateTime: null as any,
  total: 0,
  nowTime: 0, // 当前时间，用于计算是否过期
  typeOptions: [
    {
      value: 1,
      label: '正式卡'
    },
    {
      value: 2,
      label: '测试卡'
    }
  ],
  loginOptions: [
    {
      value: 1,
      label: '未登录过'
    },
    {
      value: 2,
      label: '登录过'
    }
  ],
  saleOptions: [
    {
      value: 1,
      label: '销售中'
    },
    {
      value: 2,
      label: '下架'
    },
    {
      value: 3,
      label: '已出售'
    }
  ]
})

const searchParams = reactive({
  page: 1,
  pageSize: 10,
  expireTime: [],
  loginTime: [],
  cardID: '',
  cardType: 1,
  loginStatus: null,
  saleStatus: null
})

const columns = [
  {
    title: '卡密ID',
    key: 'cardId',
    fixed: 'left',
    align: 'center',
    dataIndex: 'cardId',
    width: 150
  },
  {
    title: '类型',
    key: 'cardTypeText',
    align: 'center',
    dataIndex: 'cardTypeText',
    width: 100
  },
  {
    title: '有效天数',
    align: 'center',
    dataIndex: 'day',
    key: 'day',
    width: 100
  },

  {
    title: '上次登录时间',
    align: 'center',
    dataIndex: 'lastLoginTimeText',
    key: 'lastLoginTimeText',
    width: 180
  },
  {
    title: '登录状态',
    align: 'center',
    dataIndex: 'loginStatusText',
    key: 'loginStatusText',
    width: 100
  },
  {
    title: '过期时间',
    align: 'center',
    dataIndex: 'expireTimeText',
    key: 'expireTimeText',
    width: 200
  },
  {
    title: '销售状态',
    align: 'center',
    dataIndex: 'saleStatusText',
    key: 'saleStatusText',
    width: 120
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    dataIndex: 'operation',
    width: 200
  }
]

const timeOutCheck = (record: any) => {
  const { expireTime } = record
  if (expireTime === 0) return ''
  return state.nowTime > expireTime ? 'red-time' : 'green-time'
}

const onReset = () => {
  searchParams.page = 1
  searchParams.expireTime = []
  searchParams.loginTime = []
  searchParams.cardID = ''
  searchParams.cardType = 1
  searchParams.loginStatus = null
  searchParams.saleStatus = null
  searchParams.pageSize = 10
  getTableList()
}

const onSearch = () => {
  searchParams.page = 1
  getTableList()
}

// 新增卡密ID
const onAddMsg = () => {
  state.actionType = 'add'
  state.showDia = true
}

const setTime = (num: number) => {
  state.updateTime = dayjs().add(num, 'day')
}

// 更新过期时间
const onEditTime = (item) => {
  state.actionType = 'edit'
  state.editData = { ...item }
  console.log(dayjs(item.expireTimeText))
  state.updateTime = dayjs(item.expireTimeText)
  state.showTimeDia = true
}
const onEdit = (item) => {
  state.actionType = 'edit'
  state.editData = { ...item }
  state.showStatusDia = true
}

const onStatusChangeOk = async () => {
  let params = {
    id: state.editData.id,
    status: state.editData.saleStatus
  }
  state.loading = true
  let { code, data = {}, message }: any = await CardApi.updateStatus(params)
  state.loading = false
  if (code === 200) {
    Message.success('更新成功')
    state.showStatusDia = false
    getTableList()
  } else {
    state.showStatusDia = false
    Message.error(message || '请求失败')
  }
}

const onTimeChangeOk = async () => {
  if (!state.updateTime) {
    Message.error('请选择时间')
    return
  }
  let expireTime = Math.floor(dayjs(state.updateTime).valueOf() / 1000)
  let params = {
    id: state.editData.id,
    expireTime: expireTime
  }
  state.loading = true
  let { code, data = {}, message }: any = await CardApi.updateCardExpire(params)
  state.loading = false
  if (code === 200) {
    Message.success('更新成功')
    state.showTimeDia = false
    getTableList()
  } else {
    state.showTimeDia = false
    Message.error(message || '请求失败')
  }
}

const onPageChange = (page, pageSize) => {
  searchParams.page = page
  searchParams.pageSize = pageSize
  getTableList()
}
const getTableList = async () => {
  let params: any = {
    ...searchParams
  }
  if (params.loginTime && params.loginTime.length) {
    params.lastLoginTimeEnd = dayjs(params.loginTime[1]).valueOf()
    params.lastLoginTimeStart = dayjs(params.loginTime[0]).valueOf()
  }
  if (params.expireTime && params.expireTime.length) {
    params.expireEndTime = dayjs(params.expireTime[1]).valueOf()
    params.expireStartTime = dayjs(params.expireTime[0]).valueOf()
  }
  state.loading = true
  let { code, data = {}, message }: any = await CardApi.getCardList(params)
  state.loading = false
  if (code === 200) {
    state.dataSource = (data.list || []).map((el) => {
      el.expireTime = el.expireTime * 1000
      el.expireTimeText = el.expireTime === 0 ? '--' : dayjs(el.expireTime).format('YYYY-MM-DD HH:mm:ss')
      el.lastLoginTimeText = el.lastLoginTime === 0 ? '--' : dayjs(el.lastLoginTime * 1000).format('YYYY-MM-DD HH:mm:ss')
      let cardItem = state.typeOptions.find((v) => v.value === el.cardType)
      el.cardTypeText = (cardItem && cardItem.label) || '-'
      let loginItem = state.loginOptions.find((v) => v.value === el.loginStatus)
      el.loginStatusText = (loginItem && loginItem.label) || '-'
      let saleItem = state.saleOptions.find((v) => v.value === el.saleStatus)
      el.saleStatusText = (saleItem && saleItem.label) || '-'
      return el
    })
    state.nowTime = dayjs().valueOf()
    state.total = data.total || 0
  } else {
    Message.error(message || '请求失败')
  }
}

onMounted(() => {
  getTableList()
})
</script>
<style lang="less" scoped>
.top-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
}
.refesh {
  cursor: pointer;
  width: 27px;
  height: 27px;
  line-height: 24px;
  text-align: center;
  display: inline-block;
  border-radius: 50%;
  border: 1px solid #eee;
  background-color: #fff;
  &:hover {
    background-color: #eee;
  }
}
.anticon-edit span {
  margin-inline-start: 0;
}
.search-form {
  display: flex;
  flex-wrap: wrap;
  .ant-form-item {
    width: 30%;
    padding-right: 3%;
    .ant-form-item-label {
      width: 120px;
    }
  }
}
.search-btn {
  text-align: center;
  padding-bottom: 12px;
}
.green-time {
  color: #87d068;
}
.red-time {
  color: #ff4d4f;
}
</style>
