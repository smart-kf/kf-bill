<template>
  <a-modal v-model:visible="openModal" :title="title" @ok="onSave" :confirmLoading="state.loading" :maskClosable="false" :centered="true" width="600px" :bodyStyle="{ minHeight: '250px' }">
    <div>
      <a-form id="formLogin" ref="formRef" :model="formData" :rules="formRules">
        <a-form-item name="cardType" label="卡号类型">
          <a-select v-model:value="formData.cardType" placeholder="请选择卡号类型" style="width: 80%" :options="state.typeOptions"> </a-select>
        </a-form-item>
        <a-form-item name="days" label="有效天数">
          <div>
            <a-space>
              <a-input-number v-model:value="formData.days" :min="1" :max="100" style="width: 100%" />
              <a-button @click="setValue('days', 7)">7天</a-button>
              <a-button @click="setValue('days', 30)">30天</a-button>
            </a-space>
          </div>
        </a-form-item>
        <a-form-item name="num" label="生成数量">
          <a-space>
            <a-input-number v-model:value="formData.num" :min="1" :max="200" style="width: 100%" />
            <a-button @click="setValue('num', 50)">50</a-button>
            <a-button @click="setValue('num', 100)">100</a-button>
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
import { CardApi } from '@/webapi'
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
  cardType: '', // 卡号类型
  days: null, // 有效天数
  num: null // 数量
})

const state = reactive({
  loading: false,
  typeOptions: [
    {
      value: 1,
      label: '正式卡'
    },
    {
      value: 2,
      label: '测试卡'
    }
  ]
})

// 表单校验
const formRules: Record<string, Rule[]> = {
  cardType: [{ required: true, message: '请选择' }],
  days: [{ required: true, message: '请输入' }],
  num: [{ required: true, message: '请输入' }]
}
const onSubmit = async () => {
  let params = {
    ...formData
  }
  state.loading = true
  let { code, data = {}, message }: any = await CardApi.addCard(params)
  state.loading = false
  if (code === 200) {
    Message.success('添加成功')
    emits('refesh')
    emits('update:modelValue', false)
  } else {
    Message.error(message || '请求失败')
  }
}
const setValue = (type, num) => {
  formData[type] = num
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
