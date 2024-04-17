<script setup>
import axios from 'axios'
import { reactive } from 'vue'
const formObj = reactive({

})
//登录
const loginIn = () => {
  const url = '/login/login-in'
  const params = {
    phone: "12345678909", 
    password: "12345" 
  }
  axios.post(url, params, {
    'Content-Type': 'application/json'
  })
    .then(res => {

    })
    .catch(err => {

    })
}
</script>

<template>
  <main>
    <el-card style="width: 480px; position: absolute; top: 50%; right: 50%; transform: translate(50%, -50%);" shadow="hover" title="登录">
      <!-- <template #header>
        <p style="text-align: center">登录</p>
      </template> -->
      <el-form
        ref="loginForm"
        style="max-width: 100%"
        :model="formObj"
        label-width="auto"
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
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <!-- <el-button type="primary" @click="submitForm(formRef)">Submit</el-button> -->
          <el-button @click="resetForm(formRef)" style="margin: 0 auto;">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </main>
</template>

<style lang="scss">
</style>