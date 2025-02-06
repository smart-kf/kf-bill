<!-- 二维码页面 -->
<template>
  <div class="kf-body">
    <div class="top-action">
      <a-button type="primary" @click="onAddMsg">批量新增卡号</a-button>
      <div @click="onRefesh">
        <span class="refesh">
          <ReloadOutlined />
        </span>
      </div>
    </div>
    <a-table bordered :data-source="state.dataSource" :columns="columns" size="middle">
      <template #bodyCell="{ column, text, record }">
        <template v-if="column.dataIndex === 'operation'">
          <a-space>
            <span class="table-link-action" @click="onEdit(record)"> 回收 </span>
          </a-space>
        </template>
      </template>
    </a-table>
    <AddModal v-model:model-value="state.showDia" :action-type="state.actionType"></AddModal>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref, onMounted, reactive } from 'vue'
import { h } from 'vue'
import { ReloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons-vue'
import { message as Message } from 'ant-design-vue'
import AddModal from './components/addModal/index.vue'
import logo from '@/assets/defaultUser.png'

const state = reactive({
  dataSource: [],
  editableData: {},
  editData: {},
  actionType: 'add',
  showDia: false
})

const columns = [
  {
    title: '卡密ID',
    key: 'cardId',
    fixed: 'left',
    align: 'center',
    dataIndex: 'cardId'
  },
  {
    title: '类型',
    key: 'cardType',
    align: 'center',
    dataIndex: 'cardType'
  },
  {
    title: '有效天数',
    align: 'center',
    dataIndex: 'expireTime',
    key: 'expireTime'
  },
  {
    title: '过期时间',
    align: 'center',
    dataIndex: 'day',
    key: 'day'
  },
  {
    title: '上次登录时间',
    align: 'center',
    dataIndex: 'lastLoginTime',
    key: 'lastLoginTime'
  },
  {
    title: '登录状态',
    align: 'center',
    dataIndex: 'loginStatus',
    key: 'loginStatus'
  },
  {
    title: '密码',
    align: 'center',
    dataIndex: 'password',
    key: 'password'
  },
  {
    title: '销售状态',
    align: 'center',
    dataIndex: 'saleStatus',
    key: 'saleStatus'
  },
  {
    title: '操作',
    align: 'center',
    fixed: 'right',
    dataIndex: 'operation',
    width: 100
  }
]

const onRefesh = () => {
  console.log(222)
}
// 新增卡密ID
const onAddMsg = () => {
  state.actionType = 'add'
  state.showDia = true
}
const onOK = () => {}
const onEdit = (item) => {
  state.actionType = 'edit'
  state.editData = item
  state.showDia = true
}

const onDelete = (item) => {
  state.dataSource = state.dataSource.filter((el) => el.id !== item.id)
}

const initData = () => {
  // state.dataSource = [
  //   {
  //     id: 1,
  //     content: '文本',
  //     sendSort: 1,
  //     contentType: 'text',
  //     status: true,
  //     updateTime: '2024-13-13 13:13:13'
  //   },
  //   {
  //     id: 2,
  //     content: logo,
  //     sendSort: 2,
  //     contentType: 'image',
  //     status: true,
  //     updateTime: '2024-13-13 13:13:13'
  //   },
  //   {
  //     id: 3,
  //     content: '视频',
  //     sendSort: 3,
  //     contentType: 'video',
  //     status: false,
  //     updateTime: '2024-13-13 13:13:13'
  //   }
  // ]
}

onMounted(() => {
  initData()
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
</style>
