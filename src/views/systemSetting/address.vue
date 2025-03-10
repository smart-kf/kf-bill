<!-- 二维码页面 -->
<template>
    <div class="kf-body">
      <div>
        <a-form :model="searchParams" class="search-form">
          <a-form-item>
            <a-space>
              <a-button type="primary" @click="onCreate">新增</a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      <a-table bordered :data-source="state.dataSource" :loading="state.loading" :columns="columns" size="middle" :scroll="{ x: 'max-content' }" :pagination="false">
        <template #bodyCell="{ column, text, record }"> 
            <template v-if="column.dataIndex === 'enable'">
                <a-tag v-if="record.enable" color="green">启用</a-tag>
                <a-tag v-if="!record.enable" color="red">停用</a-tag>
            </template>
            <template v-if="column.dataIndex === 'operation'">
                <a-space>
                    <span class="table-link-action" @click="onEdit(record)"> 编辑 </span>
                    <a-popconfirm title="确认删除吗？" ok-text="是" cancel-text="否" @confirm="onDelete(record)">
                        <span class="table-link-action" color="danger"> 删除 </span>
                    </a-popconfirm>
                </a-space>
            </template>
        </template>
        
      </a-table>
      <AddModal v-model:model-value="state.showDia" :action-type="state.actionType" :edit-data="state.editData" @refesh="onSearch"></AddModal>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { computed, ref, onMounted, reactive } from 'vue'
  import { h } from 'vue'
  import { ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
  import { message as Message } from 'ant-design-vue'
  import { SystemApi } from '@/webapi'
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
    pageSize: 10,
    fromAddress: '',
    orderNo: '',
    status: 2,
    toAddress: '',
    tradeId: ''
  })
  
  const statusList = [{
    label: '创建',
    value: 1
  }, {
    label: '支付成功',
    value: 2
  }, {
    label: '失败',
    value: 3
  }]
  
  const columns = [
    {
      title: 'id',
      key: 'id',
      fixed: 'left',
      align: 'center',
      dataIndex: 'id',
      width: 120
    },
    {
      title: '地址',
      key: 'address',
      align: 'center',
      dataIndex: 'address',
      width: 150
    },
    {
      title: '是否启用',
      key: 'enable',
      align: 'center',
      dataIndex: 'enable',
      width: 150
    },
    {
      title: '备注',
      align: 'center',
      dataIndex: 'remark',
      key: 'remark',
      width: 120
    },
    {
      title: '操作',
      align: 'center',
      fixed: 'right',
      dataIndex: 'operation',
      width: 200,
    }
  ]
  
  const onReset = () => {
    searchParams.page = 1
    searchParams.pageSize = 10
    searchParams.fromAddress = ''
    searchParams.orderNo = ''
    searchParams.status = null
    searchParams.tradeId = ''
    getTableList()
  }
  
  const onSearch = () => {
    searchParams.page = 1
    getTableList()
  }

  const onCreate = () => {
    state.actionType = 'add'
    state.showDia = true
  }

  const onDelete = async (record) => {
    let res = await SystemApi.deleteAddress({id: record.id})
    console.log(res);
    if (res.code === 0) {
      Message.success('删除成功')
      getTableList()
    } else {
      Message.error(res.message || '请求失败')
    }
  }

  const onEdit = (record) => {
    state.actionType = 'edit'
    state.showDia = true
    state.editData = record
  }
  
  const onPageChange = (page, pageSize) => {
    searchParams.page = page
    searchParams.pageSize = pageSize
    getTableList()
  }
  const getTableList = async () => {
    let params = { 
    }
    state.loading = true
    let { code, data = {}, message }: any = await SystemApi.getAddressList(params)
    state.loading = false
    if (code === 0) {
      state.dataSource = data 
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
  