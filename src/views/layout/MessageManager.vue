<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { ElMessage } from 'element-plus'
const juese = window.sessionStorage.getItem('juese')
const jsid = window.sessionStorage.getItem('jsid')
const fileList = ref([])
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
    else {
      ElMessage(res.data.msg)
    }
  })
  .catch(err => {
    ElMessage(err)
    reject(err)
  })
}
</script>

<template>
  <el-main style="display: flex; height: 100%;">
    <el-upload
      style="margin: auto;"
      v-model:file-list="fileList"
      multiple
      :limit="1"
      :before-upload="handleChange"
    >
      <el-button type="primary">上传文件</el-button>
    </el-upload>
  </el-main>
</template>

<style lang="scss" scoped>
</style>