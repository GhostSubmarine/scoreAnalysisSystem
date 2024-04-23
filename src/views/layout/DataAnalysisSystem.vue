<script setup>
import axios from 'axios'
import { ref, onMounted, reactive } from 'vue'
import { ElLoading, ElMessage } from 'element-plus'
import * as echarts from 'echarts'
import ecStat from 'echarts-stat'
echarts.registerTransform(ecStat.transform.regression)
const juese = window.sessionStorage.getItem('juese')
const jsid = window.sessionStorage.getItem('jsid')
const kstimeData = ref([])
const gradeData = ref([])
const classData = ref([])
const rankingMsg = ref('本次考试与上次考试成绩排名相比上升了2名')
const dispersionMsgMap = ref([
  {label: '政治', value: '本次考试高于班级平均水平:1.144'},
  {label: '生物', value: '本次考试高于班级平均水平:1.771'},
  {label: '历史', value: '本次考试高于班级平均水平:1.566'},
  {label: '数学', value: '本次考试高于班级平均水平:1.054'},
  {label: '语文', value: '本次考试高于班级平均水平:0.988'},
  {label: '英语', value: '本次考试高于班级平均水平:1.727'},
  {label: '地理', value: '本次考试高于班级平均水平:1.034'}
])
const stability = reactive({
  "unstabilizationsubjectName": "历史",
  "stabilizationsubiectame": "政治"
})
const mapMsg = reactive([
  {label: "女", value: "女性别学生及格比例偏高，暂无需关注"},
  {label: "男", value: "男性别学生及格比例偏低，需特别关注，及时采取应对措施"},
  {label: "后优生", value: "后优生阶段学生及格率偏低，需特别关注，及时采取应对措施"},
  {label: "中等生", value: "中等生阶段学生及格率偏低，需特别关注，及时采取应对措施"},
  {label: "优生", value: "优生阶段学生及格率偏低，需特别关注，及时采取应对措施"}
])
const avgForTotalpointsSomeoneStudent = ref(78)
const standardDeviationForTotalpointsAllStudent = ref(67.011)
const formObj = reactive({
  gradeName: '',
  lastKstime: '',
  kstime: '',
  className: ''
})
onMounted(() => {
  getAllData()
})
const getAllData = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '数据请求中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (juese === 'student') {
    Promise.all([
      getRadar(), 
      getSubscore(), 
      getScoreAnystage(), 
      getPassrate(), 
      getRegression(), 
      getEntitySuggest(),
      getKstime(),
      getGrade()
    ])
    .finally(() => {
      loading.close()
    })
  }
  else {
    Promise.all([
      getClasspassrateForTea(), 
      getClasspassrateForTeaBySex(), 
      getClasspassrateForTeaByScore(), 
      getClasspassrateForTeaByScoreRange(), 
      getTotalSuggest(),
      getKstime(),
      getGrade()
    ])
    .finally(() => {
      loading.close()
    })
  }
}
//获取考试时间
const getKstime = () => {
  const url = '/api/data/getKstime'
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        kstimeData.value = res.data.data.map(val => ({
          value: val,
          label: val
        }))
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
//获取年级
const getGrade = () => {
  const url = '/api/data/getGrade'
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        gradeData.value = res.data.data.map(val => ({
          value: val,
          label: val
        }))
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
//获取班级
const getClass = () => {
  if (!formObj.gradeName) {
    return 
  }
  const url = `/api/data/getClass?gradeName=${formObj.gradeName}`
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        classData.value = res.data.data.map(val => ({
          value: val,
          label: val
        }))
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
//雷达图
const getRadar = () => {
  const url = '/api/achievementanalysis_stu/radar'
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        const max = Math.max(...res.data.data.map(obj => obj.value))
        option1.value = {
          radar: {
            indicator: res.data.data.map(obj => ({name: obj.name, max}))
          },
          series: [{
            name: '7个学科',
            type: 'radar',
            data: [{
              value: res.data.data.map(obj => obj.value),
              name: '年级'
            }] 
          }]
        }
        console.log(option1.value)
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
//散点图
const getSubscore = () => {
  const url = '/api/achievementanalysis_stu/subscore'
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        const data = res.data.data
        const title = []
        const singleAxis = []
        const series = []
        const subjects = data.map(obj => obj.name)
        const seriesData = []
        data.forEach((el, idx) => {
          !seriesData[idx] && (seriesData[idx] = [])
          const values = el.value
          for (let i = 0; i <= 5; i++) {
            let length
            if (i === 5) {
              length = values.filter(val => val <= (i + 1) * 20 && val >= i * 20).length
            }
            else {
              length = values.filter(val => val < (i + 1) * 20 && val >= i * 20).length
            }
            seriesData[idx].push([i, length])
          }
        })
        data.forEach((el, idx) => {
          title.push({
            textBaseline: 'middle',
            top: ((idx + 0.5) * 100) / 7 + '%',
            text: subjects[idx]
          })
          singleAxis.push({
            left: 150,
            type: 'category',
            boundaryGap: false,
            data: new Array(6).fill(1).map((_, idx) => `${idx * 20}`),
            top: (idx * 100) / 7 + 5 + '%',
            height: 100 / 7 - 10 + '%',
            axisLabel: {
              interval: 0
            }
          })
          series.push({
            singleAxisIndex: idx,
            coordinateSystem: 'singleAxis',
            type: 'scatter',
            data: seriesData[idx],
            symbolSize: function (dataItem) {
              return dataItem[1] * 4;
            }
          })
        });
        // series
        option2.value = {
          ...option2.value,
          title,
          singleAxis,
          series
        }
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
// 折线图
const getScoreAnystage = () => {
  const url = '/api/achievementanalysis_stu/score-anystage'
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        option3.value = {
          ...option3.value,
          xAxis: {
            type: 'category',
            data: res.data.data.map(obj => obj.name)
          },
          series: [
            {
              data: res.data.data,
              type: 'line'
            }
          ]
        }
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
// 平均分/标准差分析法
const getPassrate = () => {
  if (!formObj.kstime || !formObj.className || !formObj.gradeName) {
    return
  }
  const url = `/api/achievementanalysis_stu/passrate?jsid=${jsid}&gradeName=${formObj.gradeName}&className=${formObj.className}&kstime=${formObj.kstime}`
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        const avgForsubjectsomeonestudent = res.data.data.avgForsubjectsomeonestudent
        const avgForTotalpointsAllstudent = res.data.data.avgForTotalpointsAllstudent
        const standardDeviationForTotalpointsAllStudentOneSubject = res.data.data.standardDeviationForTotalpointsAllStudentOneSubject
        avgForTotalpointsSomeoneStudent.value = res.data.data.avgForTotalpointsSomeoneStudent[0]       
        standardDeviationForTotalpointsAllStudent.value = res.data.data.standardDeviationForTotalpointsAllStudent
        const data4 = []
        const xAxisData = []
        const data10 = []
        const data11 = []
        for (let key in avgForsubjectsomeonestudent) {
          data4.push({
            name: key,
            value: avgForsubjectsomeonestudent[key]
          })
          xAxisData.push(key)
        }
        for (let key in avgForTotalpointsAllstudent) {
          data10.push({
            name: key,
            value: avgForTotalpointsAllstudent[key]
          })
        }
        for (let key in standardDeviationForTotalpointsAllStudentOneSubject) {
          data11.push({
            name: key,
            value: standardDeviationForTotalpointsAllStudentOneSubject[key]
          })
        }
        option4.value = {
          xAxis: {
            data: xAxisData,
            type: 'category'
          },
          yAxis: {
            type: 'value'
          },
          series: [
            {
              data: data4,
              type: 'pie'
            }
          ]
        }
        option10.value = {
          title: {
            text: '所有人总成绩平均分',
            left: 'center',
          },
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: '分数',
              type: 'pie',
              radius: '50%',
              data: data10,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        option11.value = {
          title: {
            text: '所有学生单科成绩标准差',
            left: 'center',
          },
          tooltip: {
            trigger: 'item'
          },
          series: [
            {
              name: '标准差',
              type: 'pie',
              radius: '50%',
              data: data11,
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        }
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
// 成绩预测相关
const getRegression = () => {
  if (!formObj.gradeName || !formObj.className || formObj.kstime) {
    return
  }
  const url = `/api/achievementanalysis_stu/regression?jsid=${jsid}&gradeName=${formObj.gradeName}&className=${formObj.className}&kstime=${formObj.kstime}`
  return new Promise((resolve, reject) => {
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code === 200) {
        const data = res.data.data
        const seriesData = []
        const xAxisData = []
        data.forEach((el, idx) => {
          xAxisData.push(el.name)
          el.scoresums.forEach(val => seriesData.push([idx, val]))
        })
        option5.value = {
          dataset: [
          {
            source: seriesData
          },
          {
            transform: {
              type: 'ecStat:regression',
              config: { method: 'polynomial', order: 3 }
            }
          }
        ],
        title: {
          text: '成绩预测',
          subtext: '',
          left: 'center'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          }
        },
        xAxis: {
          type: 'category',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          data: xAxisData
        },
        yAxis: {
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          }
        },
        series: [
          {
            name: 'scatter',
            type: 'scatter',
            datasetIndex: 0
          },
          {
            name: 'line',
            type: 'line',
            smooth: true,
            datasetIndex: 1,
            symbolSize: 0.1,
            symbol: 'circle',
            label: { show: true, fontSize: 16 },
            labelLayout: { dx: -20 },
            encode: { label: 2, tooltip: 1 }
          }
        ]}
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  })
  
}
// 相同年级 学科分析 及格率
const getClasspassrateForTea = () => {
  const url = '/api/achievementanalysis_tea/classpassrateForTea'
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        const data = []
        for (let key in res.data.data) {
          data.push({
            name: key,
            value: res.data.data[key]
          })
        }
        option6.value = {
          ...option6.value,
          series: [
            ...option6.series[0],
            data
          ]
        }
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
// 相同学科同班不同性别 及格率
const getClasspassrateForTeaBySex = () => {
  const url = '/api/achievementanalysis_tea/classpassrateForTeaBySex'
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        const data = []
        for (let key in res.data.data) {
          data.push({
            name: key,
            value: res.data.data[key] * 100
          })
        }
        option7.value = {
          ...option7.value,
          series: [
            ...option7.series[0],
            data
          ]
        }
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
// 不同学科同一年级 及格率
const getClasspassrateForTeaByScore = () => {
  if (!formObj.gradeName) {
    return
  }
  const url = `/api/achievementanalysis_tea/classpassrateForTeaByScore?gradeName=${formObj.gradeName}`
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        const data = []
        for (let key in res.data.data) {
          data.push({
            name: key,
            value: res.data.data[key] * 100
          })
        }
        option8.value = {
          ...option8.value,
          series: [
            ...option8.series[0],
            data
          ]
        }
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
// 按分数排名段分析：不同分数排名段，同一学期
const getClasspassrateForTeaByScoreRange = () => {
  if (!formObj.kstime) {
    return
  }
  const url = `/api/achievementanalysis_tea/classpassrateForTeaByScoreRange?kstime=${formObj.kstime}`
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        const data = []
        for (let key in res.data.data) {
          data.push({
            name: key,
            value: res.data.data[key] * 100
          })
        }
        option9.value = {
          ...option9.value,
          series: [
            ...option9.series[0],
            data
          ]
        }
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
// 个体建议
const getEntitySuggest = () => {
  if (!formObj.kstime || !formObj.lastKstime || !formObj.className || !formObj.gradeName) {
    return
  }
  const url = `/api/suggest/entitySuggest?kstime=${formObj.kstime}&lastKstime=${formObj.lastKstime}&className=${formObj.className}&gradeName=${formObj.gradeName}`
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code === 200) {
        rankingMsg.value = res.data.data.rankingMsg
        const obj = res.data.data.dispersionMsgMap
        const arr = []
        for (let key in obj) {
          arr.push({
            value: obj[key],
            label: key
          })
        }
        dispersionMsgMap.value = arr
        stability.value = res.data.data.stability
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
  
}
// 综合建议
const getTotalSuggest = () => {
  if (!formObj.kstime || !formObj.lastKstime || !formObj.className || !formObj.gradeName) {
    return
  }
  const url = `/api/suggest/totalSuggest?kstime=${formObj.kstime}&lastKstime=${formObj.lastKstime}&className=${formObj.className}&gradeName=${formObj.gradeName}`
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code === 200) {
        const map1 = {
          ...res.ds_sxMapMsg,
          ...ds_ssMapMsg
        }
        const arr = []
        for (let key in map1) {
          arr.push({
            label: key,
            value: map1[key]
          })
        }
        mapMsg.value = arr
        resolve(res)
      }
      else {
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      ElMessage(err)
      reject(err)
    })
  )
}
const option1 = ref({
  legend: {
    data: ['Allocated Budget', 'Actual Spending']
  },
  radar: {
    // shape: 'circle',
    indicator: [
      { name: '数学', max: 18.723128893311493 },
      { name: '英语', max: 18.723128893311493 },
      { name: '生物', max: 18.723128893311493 },
      { name: '历史', max: 18.723128893311493 },
      { name: '地理', max: 18.723128893311493 },
      { name: '语文', max: 18.723128893311493 },
      { name: '政治', max: 18.723128893311493 }
    ]
  },
  series: [
    {
      name: '7个学科',
      type: 'radar',
      data: [
        {
          value: [
            8.137703743822469, 
            10.714735440296954, 
            8.301606270274847, 
            16.72074559741082, 
            11.437025642865175, 
            18.723128893311493, 
            15.660459763365825
          ],
          name: '一年级'
        }
      ]
    }
  ]
})
const option2 = ref({
  tooltip: {
    position: 'top'
  },
  title: ['语文', '数学', '英语', '政治', '地理', '历史', '生物']
    .map((val, idx) => ({
      textBaseline: 'middle',
      top: ((idx + 0.5) * 100) / 7 + '%',
      text: val
    })),
  singleAxis: ['语文', '数学', '英语', '政治', '地理', '历史', '生物']
    .map((_, idx) => ({
      left: 150,
      type: 'category',
      boundaryGap: false,
      data: new Array(6).fill(1).map((_, idx) => `${idx * 20}`),
      top: (idx * 100) / 7 + 5 + '%',
      height: 100 / 7 - 10 + '%',
      axisLabel: {
        interval: 0
      }
    })),
  series: ['语文', '数学', '英语', '政治', '地理', '历史', '生物']
    .map((_, idx) => ({
      singleAxisIndex: idx,
      coordinateSystem: 'singleAxis',
      type: 'scatter',
      data: ['语文', '数学', '英语', '政治', '地理', '历史', '生物'].map((_, index) => [
        index,
        Math.random() * 100
      ]),
      symbolSize: function (dataItem) {
        return dataItem[1] * 0.4;
      }
    }))
  // title: title,
  // singleAxis: singleAxis,
  // series: series
})
const option3 = ref({
  xAxis: {
    type: 'category',
    data: ['一年级', '二年级']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [{
        name: '一年级',
        value: 1829
      },{
        name: '二年级',
        value: 1018
      }],
      type: 'line'
    }
  ]
})
const option4 = ref({
  xAxis: {
    type: 'category',
    data: ['政治', '生物', '历史', '数学', '语文', '英语', '地理']
  },
  yAxis: {
    type: 'value',
    max: 100
  },
  series: [
    {
      data: [{value: 76, name: '政治'},
      {value: 86, name: '生物'},
      {value: 56, name: '历史'},
      {value: 88, name: '数学'},
      {value: 89, name: '语文'},
      {value: 67, name: '英语'},
      {value: 74, name: '地理'}],
      type: 'bar'
    }
  ]
})
const option5 = ref({
  dataset: [
    {
      source: [
        [0, 473],
        [1, 507],
        [2, 367],
        [3, 482],
        [4, 536],
        [5, 482]
      ]
    },
    {
      transform: {
        type: 'ecStat:regression',
        config: { method: 'polynomial', order: 3 }
      }
    }
  ],
  title: {
    text: '成绩预测',
    subtext: '',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross'
    }
  },
  xAxis: {
    // type: 'category',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    },
    // data: ['一年级', '二年级']
  },
  yAxis: {
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  series: [
    {
      name: 'scatter',
      type: 'scatter',
      datasetIndex: 0
    },
    {
      name: 'line',
      type: 'line',
      smooth: true,
      datasetIndex: 1,
      symbolSize: 0.1,
      symbol: 'circle',
      label: { show: true, fontSize: 16 },
      labelLayout: { dx: -20 },
      encode: { label: 2, tooltip: 1 }
    }
  ]
})
const option6 = ref({
  title: {
    text: '相同年级 学科分析 及格率',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '及格率',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 58.33, name: '五班' },
        { value: 41.667, name: '二班' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
const option7 = ref({
  title: {
    text: '相同学科同班不同性别 及格率',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '及格率',
      type: 'pie',
      radius: '50%',
      data: [
        { value: 0.4, name: '女' },
        { value: 0.6, name: '男' }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
const option8 = ref({
  title: {
    text: '不同学科同一年级 及格率',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '及格率',
      type: 'pie',
      radius: '50%',
      data: [
        { name: '数学', value: 0.196 },
        { name: '英语', value: 0.157 },
        { name: '生物', value: 0.118 },
        { name: '历史', value: 0.118 },
        { name: '地理', value: 0.157 },
        { name: '语文', value: 0.118 },
        { name: '政治', value: 0.118 }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
const option9 = ref({
  title: {
    text: '按分数排名段分析：不同分数排名段，同一学期',
    left: 'center',
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '及格率',
      type: 'pie',
      radius: '50%',
      data: [
        { name: '后优生', value: 0.231 },
        { name: '中等生', value: 0.308 },
        { name: '优生', value: 0.462 }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
const option10 = ref({
  title: {
    text: '所有人总成绩平均分',
    left: 'center',
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '分数',
      type: 'pie',
      radius: '50%',
      data: [
        { name: '1520000', value: 50.2 },
        { name: '150030222', value: 60.1 },
        { name: '150239293', value: 72 },
        { name: '151111111', value: 57 },
        { name: '1511111112', value: 59 },
        { name: '1511111343', value: 60.2 }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
const option11 = ref({
  title: {
    text: '所有学生单科成绩标准差',
    left: 'center',
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '分数',
      type: 'pie',
      radius: '50%',
      data: [{value: 11.4406, name: '政治'},
        {value: 17.714, name: '生物'},
        {value: 15.66, name: '历史'},
        {value: 10.54224, name: '数学'},
        {value: 9.877011, name: '语文'},
        {value: 17.234243424, name: '英语'},
        {value: 10.234213443, name: '地理'},
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
const option12 = ref({
  title: {
    text: '所有人总成绩平均分',
    left: 'center',
  },
  tooltip: {
    trigger: 'item'
  },
  series: [
    {
      name: '分数',
      type: 'pie',
      radius: '50%',
      data: [
        { name: '1520000', value: 50.2 },
        { name: '150030222', value: 60.1 },
        { name: '150239293', value: 72 },
        { name: '151111111', value: 57 },
        { name: '1511111112', value: 59 },
        { name: '1511111343', value: 60.2 }
      ],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})
const changeGrage = () => {
  formObj.className = ''
  getClass()
  getAllData()
}
</script>

<template>
  <el-main>
    <el-form :inline="true" :model="formObj">
      <el-form-item label="考试时间">
        <el-select
          style="width: 150px;"
          v-model="formObj.kstime"
          placeholder="考试时间"
          clearable
          @change="getAllData()"
        >
          <el-option  v-for="item in kstimeData" :label="item.label" :value="item.value" :key="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="上次考试时间">
        <el-select
          style="width: 150px;"
          v-model="formObj.lastKstime"
          placeholder="上次考试时间"
          clearable
          @change="getAllData()"
        >
          <el-option v-for="item in kstimeData" :label="item.label" :value="item.value" :key="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="年级">
        <el-select
          style="width: 150px;"
          v-model="formObj.gradeName"
          placeholder="年级"
          clearable
          @change="changeGrage()"
        >
          <el-option v-for="item in gradeData" :label="item.label" :value="item.value" :key="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select
          style="width: 150px;"
          v-model="formObj.className"
          placeholder="班级"
          clearable
          @change="getAllData()"
        >
          <el-option v-for="item in classData" :label="item.label" :value="item.value" :key="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button @click="getAllData()" type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="echarts-block" v-if="juese === 'student'">
      <h6>纵向分析</h6>
      <div class="echart-group">
        <v-chart :option="option1" ref="ref1" class="echart" />
        <v-chart :option="option2" ref="ref2" class="echart" />
        <v-chart :option="option3" ref="ref3" class="echart" />
      </div>
    </div>
    <div class="echarts-block" v-if="juese === 'student'">
      <h6>横向分析</h6>
      <div class="echart-group">
        <el-card style="width: 300px; height: 300px;margin: auto 0;">
          <div style="display: flex; flex-direction: column">
            <p>当前学生的总分平均分</p>
            <h1 style="margin: 50px auto; font-size: 64px; font-weight: bold;">{{avgForTotalpointsSomeoneStudent}}</h1>
            <p style="margin: 0 auto;">某学生的总分平均分</p>
          </div>
        </el-card>
        <el-card style="width: 300px; height: 300px;margin: auto 0;">
          <div style="display: flex; flex-direction: column">
            <p>整体学生某学段每次考试成绩标准差</p>
            <h1 style="margin: 50px auto; font-size: 64px; font-weight: bold;">{{standardDeviationForTotalpointsAllStudent}}</h1>
            <p style="margin: 0 auto;">整体学生某学段每次考试成绩标准差</p>
          </div>
        </el-card>
        <v-chart :option="option4" ref="ref4" class="echart" />
        <v-chart :option="option10" ref="ref10" class="echart" />
        <v-chart :option="option11" ref="ref11" class="echart" />
        <v-chart :option="option5" ref="ref5" class="echart" />
      </div>
    </div>
    <div class="echarts-block" v-if="juese === 'teacher'">
      <h6>综合分析</h6>
      <div class="echart-group">
        <v-chart :option="option6" ref="ref6" class="echart" />
        <v-chart :option="option7" ref="ref7" class="echart" />
        <v-chart :option="option8" ref="ref8" class="echart" />
        <v-chart :option="option9" ref="ref9" class="echart" />
      </div>
    </div>
    <el-descriptions title="综合建议" border :label-width="90" :column="2" v-if="juese === 'teacher'">
      <el-descriptions-item :key="index + ''" v-for="(item, index) in mapMsg" :label="item.label">{{item.value}}</el-descriptions-item>
    </el-descriptions>
    <el-descriptions title="个体建议" :column="3" border style="margin-top: 20px;" v-if="juese === 'student'">
      <el-descriptions-item label="排名信息" >{{rankingMsg}}</el-descriptions-item>
      <el-descriptions-item :label="item.label" v-for="(item, index) in dispersionMsgMap" :key="index + ''">
        {{item.value}}
      </el-descriptions-item>
      <el-descriptions-item label="不稳定发挥的学科" >{{stability.unstabilizationsubjectName}}</el-descriptions-item>
      <el-descriptions-item label="稳定发挥的学科" >{{stability.stabilizationsubiectame}}</el-descriptions-item>
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
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .echart {
    width: 399px;
    height: 400px;
  }
}
</style>