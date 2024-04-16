<script setup>
import axios from 'axios'
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
    <el-card style="width: 480px" shadow="hover" title="登录">
      <el-form
        ref="loginForm"
        style="max-width: 100%"
        :model="loginForm"
        label-width="auto"
      >
        <el-form-item
          label="age"
          prop="age"
          :rules="[
            { required: true, message: 'age is required' },
            { type: 'number', message: 'age must be a number' },
          ]"
        >
          <el-input
            v-model.number="numberValidateForm.age"
            type="text"
            autocomplete="off"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm(formRef)">Submit</el-button>
          <el-button @click="resetForm(formRef)">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </main>
</template>

<style lang="scss">
</style>