<script setup lang="ts">
import { ref } from 'vue'
import axios from 'axios'
import type { UploadProps, UploadUserFile } from 'element-plus'
const fileList = ref([])
const handleChange: UploadProps['onChange'] = (uploadFile, uploadFiles) => {
  fileload(uploadFile.raw)
  // fileList.value = fileList.value.slice(-3)
}
const fileload = () => {
  const url = '/account/fileload'
  const formData = new FormData()
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
  <main style="display: flex; height: 100%;">
    <el-upload
      style="margin: auto;"
      v-model:file-list="fileList"
      action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
      multiple
      :limit="1"
      :on-change="handleChange"
    >
      <el-button type="primary">上传文件</el-button>
      <!-- <template #tip>
        <div class="el-upload__tip">
          jpg/png files with a size less than 500KB.
        </div>
      </template> -->
    </el-upload>
  </main>
</template>

<style lang="scss" scoped>
</style>