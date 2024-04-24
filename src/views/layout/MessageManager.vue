<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
const juese = window.sessionStorage.getItem('juese')
const jsid = window.sessionStorage.getItem('jsid')
const fileList = ref([])
const delForm = ref(null)
const delDialogVisible = ref(false)
const delFormObj = reactive({
  gradeName: '',
  className: ''
})
const loading = ref(false)
const rules = reactive({
  radio1: [
    { required: true, message: '请选择类型！', trigger: 'blur' }
  ],
  jid: [
    { required: true, message: '请输入唯一号！', trigger: 'blur' }
  ],
  className: [
    { required: true, message: '请输入班级！', trigger: 'blur' }
  ],
  gradeName: [
    { required: true, message: '请输入年级！', trigger: 'blur' }
  ]
})
const handleChange = (uploadFile) => {
  fileload(uploadFile)
}
const fileload = (file) => {
  const url = '/api/account/fileload'
  const formData = new FormData()
  formData.append('f', file)
  axios.put(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      juese,
      jsid
    }
  })
  .then(res => {
    if (res.data.code === 200) {
      ElMessage(res.data.msg)
    }
    else if (res.data.code === 401) {
      ElMessage('登录失效！')
      window.sessionStorage.removeItem('juese')
      window.location.reload()
    }
    else {
      ElMessage(res.data.msg)
    }
  })
  .catch(err => {
    ElMessage(err)
  })
}
const deleteAccount = () => {
  loading.value = true
  const url = `/api/account/delete?jid=${delFormObj.radio1}-${delFormObj.jid}&className=${delFormObj.className}&gradeName=${delFormObj.gradeName}`
  axios.delete(url, {
    headers: {
      juese,
      jsid
    }
  })
  .then(res => {
    if (res.data.code === 200) {
      ElMessage(res.data.msg)
      delDialogVisible.value = false
    }
    else if (res.data.code === 401) {
      ElMessage('登录失效！')
      window.sessionStorage.removeItem('juese')
      window.location.reload()
    }
    else {
      ElMessage(res.data.msg)
    }
  })
  .catch(err => {
    ElMessage(err)
  })
  .finally(() => loading.value = false)
}

const delAccount = () => {
  for (let key in delFormObj) {
    delFormObj[key] = ''
  }
  delDialogVisible.value = true
}
const delConfirm = (delForm) => {
  delForm.validate(valid => {
    if (valid) {
      deleteAccount()
    }
  })
}
const handleClose = () => {
  delDialogVisible.value = false
}
</script>

<template>
  <el-main>
    <el-space alignment="flex-start">
      <el-upload
        v-model:file-list="fileList"
        multiple
        :limit="1"
        :before-upload="handleChange"
      >
        <el-button type="primary">上传文件</el-button>
      </el-upload>
      <el-button type="primary" @click="delAccount()">删除账号</el-button>
    </el-space>
    <el-dialog
      v-model="delDialogVisible"
      title="删除账号"
      width="500"
      :before-close="handleClose"
    >
      <el-form ref="delForm" :model="delFormObj" :inline="true" :rules="rules">
        <el-form-item label="类型" prop="radio1">
          <el-radio-group v-model="delFormObj.radio1">
            <el-radio value="xs" size="large">学生</el-radio>
            <el-radio value="ls" size="large">老师</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="唯一号" prop="jid">
          <el-input v-model="delFormObj.jid" style="width: 150px;" placeholder="请输入唯一号" />
        </el-form-item>
        <el-form-item label="年级">
          <el-input v-model="delFormObj.gradeName" style="width: 150px;" placeholder="请输入年级" />
        </el-form-item>
        <el-form-item label="班级">
          <el-input v-model="delFormObj.className" style="width: 150px;" placeholder="请输入班级" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-space>
          <el-button @click="delDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="delConfirm(delForm)" :loading="loading">
            提交
          </el-button>
        </el-space>
      </template>
    </el-dialog>
  </el-main>
</template>

<style lang="scss" scoped>
</style>