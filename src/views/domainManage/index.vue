<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <div class="top-action">
      <a-button type="primary" @click="onAddMsg">批量新增域名</a-button>
      <div @click="onSearch">
        <span class="refesh">
          <ReloadOutlined />
        </span>
      </div>
    </div>
    <!-- <div>
      <a-form :model="searchParams" class="search-form">
        <a-form-item label="订单号">
          <a-input v-model:value="searchParams.orderNo" placeholder="请输入订单号" allowClear />
        </a-form-item>
        <a-form-item label="支付地址">
          <a-input v-model:value="searchParams.fromAddress" placeholder="请输入支付地址" allowClear />
        </a-form-item>
        <a-form-item label="接收地址">
          <a-input v-model:value="searchParams.toAddress" placeholder="请输入接收地址" allowClear />
        </a-form-item>
        <a-form-item label="区块链交易ID">
          <a-input v-model:value="searchParams.tradeId" placeholder="请输入区块链交易ID" allowClear />
        </a-form-item>
        <a-form-item label="订单状态">
          <a-select v-model:value="searchParams.status" placeholder="请选择订单状态" allowClear>
            <a-select-option value="1">创建</a-select-option>
            <a-select-option value="2">支付成功</a-select-option>
            <a-select-option value="3">失败</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item>
          <a-space>
            <a-button @click="onReset">重置</a-button>
            <a-button type="primary" @click="onSearch">查询</a-button>
            <a-button type="primary" @click="onAddMsg">新增域名</a-button>
          </a-space>
        </a-form-item>
      </a-form>
    </div> -->
    <a-table bordered :data-source="state.dataSource" :loading="state.loading" :columns="columns" size="middle" :scroll="{ x: 'max-content' }" :pagination="false">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'status'">
          <a-tag v-if="record.status === 1" color="green">正常</a-tag>
          <a-tag v-if="record.status === 2" color="gray">禁用</a-tag>
        </template>
        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <a-popconfirm title="确定要删除吗？" @confirm="onDelete(record)">
              <span class="table-link-action"> <DeleteOutlined />删除 </span>
            </a-popconfirm>
          </a-space>
        </template>
      </template>
    </a-table>
    <a-pagination size="small" v-model:current="searchParams.page" :total="state.total" @change="onPageChange" show-size-changer show-quick-jumper :show-total="(total) => `共 ${total} 条`" />
  </div>
  <AddModal v-model:model-value="state.showDia" :action-type="state.actionType" @refesh="onSearch"></AddModal>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from 'vue'
import { h } from 'vue'
import { ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message as Message } from 'ant-design-vue'
import { DomainApi } from '@/webapi'
import AddModal from './components/addModal/index.vue'
import dayjs from 'dayjs'

const state = reactive({
  dataSource: [],
  editableData: {},
  editData: {},
  actionType: 'add',
  showDia: false,
  loading: false,
  total: 0
})

const searchParams = reactive({
  page: 1,
  pageSize: 10
})

const columns = [
  {
    title: '域名名称',
    key: 'topName',
    align: 'center',
    dataIndex: 'topName',
    width: 120
  },
  {
    title: '域名状态',
    key: 'status',
    align: 'center',
    dataIndex: 'status',
    width: 100
  },
  {
    title: '是否公共域名',
    key: 'isPublicText',
    align: 'center',
    dataIndex: 'isPublicText',
    width: 120
  },
  {
    title: '是否有卡密绑定',
    align: 'center',
    dataIndex: 'isBindText',
    key: 'isBindText',
    width: 120
  },
  {
    title: '创建时间',
    key: 'CreatedAtText',
    align: 'center',
    dataIndex: 'CreatedAtText',
    width: 180
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    dataIndex: 'operation',
    width: 100
  }
]

const onReset = () => {
  searchParams.page = 1
  searchParams.pageSize = 10
  getTableList()
}

const onSearch = () => {
  searchParams.page = 1
  getTableList()
}

const onDelete = async (record) => {
  let params = {
    id: record.id
  }
  let { code, data = {}, message }: any = await DomainApi.delDomain(params)
  if (code === 200) {
    Message.success('删除成功')
    getTableList()
  } else {
    Message.error(message || '请求失败')
  }
}
// 新增卡密ID
const onAddMsg = () => {
  state.actionType = 'add'
  state.showDia = true
}
const onPageChange = (page, pageSize) => {
  searchParams.page = page
  searchParams.pageSize = pageSize
  getTableList()
}
const getTableList = async () => {
  let params = {
    ...searchParams
  }
  state.loading = true
  let { code, data = {}, message }: any = await DomainApi.getDomainList(params)
  state.loading = false
  if (code === 200) {
    state.dataSource = (data.list || []).map((el) => {
      el.CreatedAtText = dayjs(el.createTime * 1000).format('YYYY-MM-DD HH:mm:ss')
      el.isBindText = el.isBind ? '是' : '否'
      el.isPublicText = el.isPublic ? '是' : '否'
      return el
    })
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
</style>
