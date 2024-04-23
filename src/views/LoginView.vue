<script setup>
import axios from 'axios'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus'
const router = useRouter()
const loginForm = ref()
const rules = reactive({
  phone: [
    { required: true, message: '请输入手机号！', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码！', trigger: 'blur' }
  ]
})
const formObj = reactive({
  phone: '',
  password: ''
})
//登录
const loginIn = () => {
  const url = '/api/login/login-in'
  const params = {
    ...formObj
  }
  axios.post(url, params, {
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => {
      if (res.data.code === 200) {
        ElMessage(res.data.msg)
        window.sessionStorage.setItem('juese', res.data.data.juese)
        window.sessionStorage.setItem('jsid', res.data.data.jsid)
        if (res.data.data.juese === '管理员') {
          router.push({
            path: '/main/MessageManager'
          })
        }
        else {
          router.push({
            path: '/main/dataAnalysisSystem'
          })
        }
        
      }
      else {
        ElMessage(res.data.msg)
      }
    })
    .catch(err => ElMessage(err.data.msg))
}
const submit = (loginForm) => {
  loginForm.validate((valid, field) => {
    if (valid) {
      loginIn()
    }
    else {

    }
  })
}
</script>

<template>
  <main style="background-color: black; height: 100%;">
    <el-card style="width: 360px; position: absolute; top: 50%; right: 50%; transform: translate(50%, -50%);" shadow="hover" title="登录">
      <template #header>
        <p style="text-align: center">密码登录</p>
      </template>
      <el-form
        ref="loginForm"
        style="max-width: 100%"
        :model="formObj"
        label-width="auto"
        :rules="rules"
      >
        <el-form-item
          label="手机号"
          prop="phone"
        >
          <el-input
            v-model="formObj.phone"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input
            v-model="formObj.password"
            type="password"
          />
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="submitForm(formRef)">Submit</el-button> -->
          <el-button @click="submit(loginForm)" style="margin: 0 auto;">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </main>
</template>

<style lang="scss">
</style>