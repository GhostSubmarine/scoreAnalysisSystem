<script setup>
import { RouterView } from 'vue-router'
const quit = () => {
  window.sessionStorage.removeItem('juese')
  window.location.reload()
}
const juese = window.sessionStorage.getItem('juese')
</script>
<template>
  <el-container style="width: 100vw; height: 100vh;">
    <el-aside width="200px" height="100%">
      <el-menu
        style="height: 100%;"
        default-active="1"
      >
        <el-menu-item index="1" v-if="juese === 'admin'">
          <RouterLink to="/main/messageManager">信息管理</RouterLink>
        </el-menu-item>
        <el-menu-item index="2" v-if="juese !== 'admin'">
          <RouterLink to="/main/gradeOperate">成绩操作</RouterLink>
        </el-menu-item>
        <el-menu-item index="3" v-if="juese !== 'admin'">
          <RouterLink to="/main/dataAnalysisSystem">数据分析</RouterLink>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header style="display: flex; height: 60px; align-items: center; padding-left: 40%;">分数分析系统<el-button @click="quit" style="margin-left: auto;">退出</el-button></el-header>
      <RouterView />
    </el-container>
  </el-container>
</template>

<style lang="scss" scoped>
a {
  width: 100%;
}
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
