<script setup>
import { ref } from 'vue'
import axios from 'axios'
const fileList = ref([])
const handleChange = (uploadFile, uploadFiles) => {
  fileload(uploadFile.raw)
  // fileList.value = fileList.value.slice(-3)
}
const fileload = () => {
  const url = '/account/fileload'
  const formData = new FormData()
  formData.append('f', file)
  axios.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
    .then(res => {
      if (res.code === 200) {
        
      }
      else {

      }
    })
}
</script>

<template>
  <el-main style="display: flex; height: 100%;">
    <el-upload
      style="margin: auto;"
      v-model:file-list="fileList"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
      :limit="1"
      :on-change="handleChange"
    >
      <el-button type="primary">上传文件</el-button>
    </el-upload>
  </el-main>
</template>

<style lang="scss" scoped>
</style>