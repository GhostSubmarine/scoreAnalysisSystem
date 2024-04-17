<script setup lang="ts">
import { ref, reactive } from 'vue'
import axios from 'axios'
import type { UploadProps, UploadUserFile } from 'element-plus'
const formObj = reactive({

})
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
  <el-form :inline="true" :model="formObj">
    <el-form-item label="年级">
      <el-select
        style="width: 150px;"
        v-model="formObj.gradeName"
        placeholder="年级"
        @change="changeGrage()"
        clearable
      >
        <el-option v-for="item in gradeData" :label="item.label" :value="item.value" :key="item.value" />
      </el-select>
    </el-form-item>
    <el-form-item label="班级">
      <el-select
        style="width: 150px;"
        v-model="formObj.className"
        placeholder="班级"
        @change="getAllData()"
        clearable
      >
        <el-option v-for="item in classData" :label="item.label" :value="item.value" :key="item.value" />
      </el-select>
    </el-form-item>
  </el-form>
</template>