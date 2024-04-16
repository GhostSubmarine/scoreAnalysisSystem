<script setup>
import axios from 'axios'
import { ref } from 'vue'
//雷达图
const getRadar = () => {
  const url = '/achievementanalysis_stu/radar'
  const params = {}
  axios.get(url)
    .then(res => {

    })
    .catch(err => {

    })
}
//散点图
const getSubscore = () => {
  const url = '/achievementanalysis_stu/subscore'
  const params = {}
  axios.get(url)
    .then(res => {

    })
    .catch(err => {

    })
}
// 折线图
const getScoreAnystage = () => {
  const url = '/achievementanalysis_stu/score-anystage'
  const params = {}
  axios.get(url)
    .then(res => {

    })
    .catch(err => {

    })
}
// 折线图
// const getScoreAnystage = () => {
//   const url = '/achievementanalysis_stu/score-anystage'
//   const params = {}
//   axios.get(url)
//     .then(res => {

//     })
//     .catch(err => {

//     })
// }
const option1 = ref({
  title: {
    // text: 'Basic Radar Chart'
  },
  legend: {
    data: ['Allocated Budget', 'Actual Spending']
  },
  radar: {
    // shape: 'circle',
    indicator: [
      { name: '数学', max: 100 },
      { name: '英语', max: 100 },
      { name: '生物', max: 100 },
      { name: '历史', max: 100 },
      { name: '地理', max: 100 },
      { name: '语文', max: 100 },
      { name: '政治', max: 100 }
    ]
  },
  series: [
    {
      name: '7个学科',
      type: 'radar',
      data: [
        {
          value: [80, 70, 60, 40, 80, 60, 90],
          name: '一年级'
        }
      ]
    }
  ]
})
const option2 = ref({
  xAxis: {},
  yAxis: {},
  series: [
    {
      symbolSize: 20,
      data: [
        [69, 80, 54, 67, 76, 65],
        [65, 80, 45, 65, 98, 45]
      ],
      type: 'scatter'
    }
  ]
})
const option3 = ref({
  xAxis: {
    type: 'category',
    // data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [1829, 1018],
      type: 'line'
    }
  ]
})
const option4 = ref({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [120, 200, 150, 80, 70, 110, 130],
      type: 'bar'
    }
  ]
})
</script>

<template>
  <el-main>
    <div class="echarts-block">
      <h6>纵向分析</h6>
      <div class="echart-group">
        <v-chart :option="option1" ref="ref1" class="echart-item" />
        <v-chart :option="option2" ref="ref2" class="echart-item" />
        <v-chart :option="option3" ref="ref3" class="echart-item" />
      </div>
    </div>
    <div class="echarts-block">
      <h6>横向分析</h6>
      <div class="echart-group">
        <v-chart :option="option4" ref="ref4" class="echart-item" />
        <v-chart :option="option4" ref="ref5" class="echart-item" />
      </div>
    </div>
    <div class="echarts-block">
      <h6>综合分析</h6>
      <div class="echart-group">
        <v-chart :option="option4" ref="ref6" class="echart-item" />
        <v-chart :option="option4" ref="ref7" class="echart-item" />
        <v-chart :option="option4" ref="ref8" class="echart-item" />
        <v-chart :option="option4" ref="ref9" class="echart-item" />
      </div>
    </div>
    <el-descriptions title="综合建议" border :label-width="90" :column="2">
      <el-descriptions-item label="女">女性别学生几个比例偏高，暂无需关注。</el-descriptions-item>
      <el-descriptions-item label="男">男性别学生几个比例偏低，需特别关注，及时采取应对措施。</el-descriptions-item>
      <el-descriptions-item label="后优生">后优生阶段学生及格率偏低，需特别关注，及时采取措施。</el-descriptions-item>
      <el-descriptions-item label="中等生">中等生阶段学生及格率偏低，需特别关注，及时采取措施。</el-descriptions-item>
      <el-descriptions-item label="优生">优生阶段学生及格率偏低，需特别关注，及时采取措施。</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="个体建议">
      <el-descriptions-item label="女" :column="3">女性别学生几个比例偏高，暂无需关注。</el-descriptions-item>
      <el-descriptions-item label="男" :column="3">男性别学生几个比例偏低，需特别关注，及时采取应对措施。</el-descriptions-item>
      <el-descriptions-item></el-descriptions-item>
      <el-descriptions-item label="后优生" :column="2">后优生阶段学生及格率偏低，需特别关注，及时采取措施。</el-descriptions-item>
      <el-descriptions-item label="中等生" :column="2">中等生阶段学生及格率偏低，需特别关注，及时采取措施。</el-descriptions-item>
      <el-descriptions-item label="优生" :column="2">优生阶段学生及格率偏低，需特别关注，及时采取措施。</el-descriptions-item>
    </el-descriptions>
  </el-main>
</template>

<style lang="scss" scoped>
.echarts-block {
  h6 {
    font-size: 16px;
    font-weight: bold;
  }
}
.echart-group {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  .echart-item {
    width: 399px;
    height: 300px;
  }
}
</style>