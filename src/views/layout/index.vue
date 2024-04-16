<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>
<template>
  <el-container style="width: 100vw; height: 100vh;">
    <el-aside width="200px" height="100%">
      <el-menu
        style="height: 100%;"
        default-active="1"
      >
        <el-menu-item index="1">
          <RouterLink to="/main/dataAnalysisSystem">信息管理</RouterLink>
        </el-menu-item>
        <el-menu-item index="2">
          <RouterLink to="/main/dataAnalysisSystem">成绩操作</RouterLink>
        </el-menu-item>
        <el-menu-item index="3">
          <RouterLink to="/main/dataAnalysisSystem">数据分析</RouterLink>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <RouterView />
  </el-container>
</template>

<style>
@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
  }
}
</style>
