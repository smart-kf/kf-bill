<template>
    <a-modal v-model:visible="openModal" :title="title" @ok="onSave" :confirmLoading="state.loading" :maskClosable="false" :centered="true" width="600px" :bodyStyle="{ minHeight: '250px' }">
      <div>
        <a-form id="formLogin" ref="formRef" :model="formData" :rules="formRules">
            <a-form-item name="address" label="地址">
            <a-input v-model:value="formData.address"style="width: 100%" />
          </a-form-item>
          <a-form-item name="remark" label="备注">
            <a-input v-model:value="formData.remark"style="width: 100%" />
          </a-form-item>
          <a-form-item name="remark" label="是否启用">
            <a-radio-group v-model:value="formData.enable" name="radioGroup">
              <a-radio v-for="item in enableOptions" :value="item.value">{{ item.label }}</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
  </template>
  
  <script lang="ts" setup>
  import { ref, defineProps, onMounted, computed, reactive, watch } from 'vue'
  import { message as Message } from 'ant-design-vue'
  import type { Rule } from 'ant-design-vue/es/form'
  import { SystemApi } from '@/webapi'
  const emits = defineEmits(['update:modelValue', 'refesh'])

  const enableOptions = [{
    'label': '是',
    'value': true
  }, {
    'label': '否',
    'value': false  
  }]
  
  const props = defineProps({
    modelValue: {
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: '地址管理'
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
    address: '', // 地址
    remark: '', // 备注
    enable: false, // 是否启用
    id: 0,
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
    let { code, data = {}, message }: any = await SystemApi.upsertAddress(params)
    state.loading = false
    if (code === 0) {
      Message.success('操作成功')
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
    if(props.actionType === 'edit') {
      formData.address = props.editData.address
      formData.remark = props.editData.remark
      formData.enable = props.editData.enable
      formData.id = props.editData.id
    } else {
      formData.address = ''
      formData.remark = ''
      formData.enable = false
    }
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
  