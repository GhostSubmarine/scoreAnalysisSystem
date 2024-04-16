<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="2"
        text-color="#fff"
        @open="handleOpen"
        @close="handleClose"
      >
        <el-menu-item index="1">
          <router-link>信息管理</router-link>
        </el-menu-item>
        <el-menu-item index="2">
          <router-link>成绩操作</router-link>
        </el-menu-item>
        <el-menu-item index="3">
          <router-link>数据分析</router-link>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <RouterView />
  </el-container>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style lang="scss" scoped>
</style>