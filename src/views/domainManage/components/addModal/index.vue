<template>
  <a-modal v-model:visible="openModal" :title="title" @ok="onSave" :confirmLoading="state.loading" :maskClosable="false" :centered="true" width="600px" :bodyStyle="{ minHeight: '250px' }">
    <div>
      <a-form id="formLogin" ref="formRef" :model="formData" :rules="formRules" :label-col="{ span: 4 }">
        <a-form-item name="topName" label="域名">
          <a-input v-model:value="formData.topName" placeholder="https://开头" style="width: 80%" />
        </a-form-item>
        <a-form-item name="isPublic" label="是否公开">
          <a-switch v-model:checked="formData.isPublic" />
        </a-form-item>
        <a-form-item name="status" label="域名状态">
          <a-space direction="vertical">
            <a-radio-group v-model:value="formData.status" :options="state.options" />
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script lang="ts" setup>
import { ref, defineProps, onMounted, computed, reactive, watch } from 'vue'
import { message as Message } from 'ant-design-vue'
import type { Rule } from 'ant-design-vue/es/form'
import { DomainApi } from '@/webapi'
const emits = defineEmits(['update:modelValue', 'refesh'])

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: true
  },
  title: {
    type: String,
    default: '批量新增卡号'
  },
  actionType: {
    type: String,
    default: 'add' // edit
  },
  editData: {
    type: Object,
    default: () => {}
  }
})
const openModal = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emits('update:modelValue', val)
  }
})
watch(
  () => props.modelValue,
  (val) => {
    if (val) {
      initEditor()
    }
  }
)

const formRef: any = ref('')

const formData = reactive({
  topName: '', // 卡号类型
  status: 1,
  isPublic: true // 数量
})

const state = reactive({
  loading: false,
  options: [
    { label: '正常', value: 1 },
    { label: '禁用', value: 2 }
  ]
})

// 表单校验
const formRules: Record<string, Rule[]> = {
  topName: [{ required: true, message: '请输入' }],
  status: [{ required: true, message: '请输入' }],
  isPublic: [{ required: true, message: '请输入' }]
}
const onSubmit = async () => {
  let params = {
    ...formData
  }
  state.loading = true
  let { code, data = {}, message }: any = await DomainApi.addDomain(params)
  state.loading = false
  if (code === 200) {
    Message.success('添加成功')
    emits('refesh')
    emits('update:modelValue', false)
  } else {
    Message.error(message || '请求失败')
  }
}

const onSave = () => {
  formRef.value
    .validate()
    .then(() => {
      onSubmit()
    })
    .catch((err) => {
      console.log(err)
    })
}

// 重置数据
const resetData = () => {
  formRef.value && formRef.value.resetFields()
}
// 数据回显
const initEditor = () => {
  resetData()
}
</script>

<style lang="less" scoped>
.tip {
  color: #666;
  font-size: 12px;
}
.text-body {
  display: flex;
  padding-top: 8px;
}
.title-body {
  display: flex;
  padding-bottom: 8px;
}
</style>
