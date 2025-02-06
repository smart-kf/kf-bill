<template>
  <a-modal v-model:visible="openModal" :title="title" @ok="onSave" :confirmLoading="state.loading" :maskClosable="false" :centered="true" width="600px" :bodyStyle="{ minHeight: '250px' }">
    <div>
      <a-form id="formLogin" ref="formRef" :model="formData" :rules="formRules">
        <a-form-item name="cardType" label="卡号类型">
          <a-select v-model:value="formData.cardType" placeholder="please select your zone" style="width: 80%">
            <a-select-option value="shanghai">类型1</a-select-option>
            <a-select-option value="beijing">类型2</a-select-option>
          </a-select>
        </a-form-item>
        <a-form-item name="days" label="有效天数">
          <div>
            <a-space>
              <a-input-number v-model:value="formData.days" :min="1" :max="100" style="width: 100%" />
              <a-button>7天</a-button>
              <a-button>30天</a-button>
            </a-space>
          </div>
        </a-form-item>
        <a-form-item name="num" label="生成数量">
          <a-space>
            <a-input-number v-model:value="formData.num" :min="1" :max="200" style="width: 100%" />
            <a-button>50</a-button>
            <a-button>100</a-button>
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

const emits = defineEmits(['update:modelValue'])

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
  days: 1, // 有效天数
  num: 1 // 数量
})

const state = reactive({
  loading: false
})

// 表单校验
const formRules: Record<string, Rule[]> = {
  cardType: [{ required: true, message: '请选择' }],
  days: [{ required: true, message: '请输入' }],
  num: [{ required: true, message: '请输入' }]
}
const onSubmit = async () => {
  console.log(formData)
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
