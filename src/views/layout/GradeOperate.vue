<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElLoading, ElMessage } from 'element-plus'
const juese = '老师'
const userInfo = window.sessionStorage.getItem('userInfo')
const gradeData = ref([])
const classData = ref([])
const rules = reactive({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ],
  region: [
    {
      required: true,
      message: 'Please select Activity zone',
      trigger: 'change',
    },
  ],
  count: [
    {
      required: true,
      message: 'Please select Activity count',
      trigger: 'change',
    },
  ],
  date1: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a date',
      trigger: 'change',
    },
  ],
  date2: [
    {
      type: 'date',
      required: true,
      message: 'Please pick a time',
      trigger: 'change',
    },
  ],
  location: [
    {
      required: true,
      message: 'Please select a location',
      trigger: 'change',
    },
  ],
  type: [
    {
      type: 'array',
      required: true,
      message: 'Please select at least one activity type',
      trigger: 'change',
    },
  ],
  resource: [
    {
      required: true,
      message: 'Please select activity resource',
      trigger: 'change',
    },
  ],
  desc: [
    { required: true, message: 'Please input activity form', trigger: 'blur' },
  ],
})
const tableData = ref([
  {
    '学生号': (Math.random() * 10000).toFixed(0),
    '语文': (Math.random() * 100).toFixed(0),
    '数学': (Math.random() * 100).toFixed(0),
    '英语': (Math.random() * 100).toFixed(0),
    '政治': (Math.random() * 100).toFixed(0),
    '地理': (Math.random() * 100).toFixed(0),
    '生物': (Math.random() * 100).toFixed(0),
    '历史': (Math.random() * 100).toFixed(0)
  },
  {
    '学生号': (Math.random() * 10000).toFixed(0),
    '语文': (Math.random() * 100).toFixed(0),
    '数学': (Math.random() * 100).toFixed(0),
    '英语': (Math.random() * 100).toFixed(0),
    '政治': (Math.random() * 100).toFixed(0),
    '地理': (Math.random() * 100).toFixed(0),
    '生物': (Math.random() * 100).toFixed(0),
    '历史': (Math.random() * 100).toFixed(0)
  },
  {
    '学生号': (Math.random() * 10000).toFixed(0),
    '语文': (Math.random() * 100).toFixed(0),
    '数学': (Math.random() * 100).toFixed(0),
    '英语': (Math.random() * 100).toFixed(0),
    '政治': (Math.random() * 100).toFixed(0),
    '地理': (Math.random() * 100).toFixed(0),
    '生物': (Math.random() * 100).toFixed(0),
    '历史': (Math.random() * 100).toFixed(0)
  },
  {
    '学生号': (Math.random() * 10000).toFixed(0),
    '语文': (Math.random() * 100).toFixed(0),
    '数学': (Math.random() * 100).toFixed(0),
    '英语': (Math.random() * 100).toFixed(0),
    '政治': (Math.random() * 100).toFixed(0),
    '地理': (Math.random() * 100).toFixed(0),
    '生物': (Math.random() * 100).toFixed(0),
    '历史': (Math.random() * 100).toFixed(0)
  },
  {
    '学生号': (Math.random() * 10000).toFixed(0),
    '语文': (Math.random() * 100).toFixed(0),
    '数学': (Math.random() * 100).toFixed(0),
    '英语': (Math.random() * 100).toFixed(0),
    '政治': (Math.random() * 100).toFixed(0),
    '地理': (Math.random() * 100).toFixed(0),
    '生物': (Math.random() * 100).toFixed(0),
    '历史': (Math.random() * 100).toFixed(0)
  },
  {
    '学生号': (Math.random() * 10000).toFixed(0),
    '语文': (Math.random() * 100).toFixed(0),
    '数学': (Math.random() * 100).toFixed(0),
    '英语': (Math.random() * 100).toFixed(0),
    '政治': (Math.random() * 100).toFixed(0),
    '地理': (Math.random() * 100).toFixed(0),
    '生物': (Math.random() * 100).toFixed(0),
    '历史': (Math.random() * 100).toFixed(0)
  }
])
const formObj = reactive({
  gradeName: '',
  className: ''
})
onMounted(() => {
  // getAllData()
})
//获取年级
const getGrade = () => {
  const url = '/data/getGrade'
  return new Promise((resolve, reject) => 
    axios.get(url)
      .then(res => {
        if (res.code == 200) {
          gradeData.value = res.data.map(val => ({
            value: val,
            label: val
          }))
          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(reject)
  )
}
//获取班级
const getClass = () => {
  const url = `data/getClass?gradeName=${formObj.gradeName}`
  return new Promise((resolve, reject) => 
    axios.get(url)
      .then(res => {
        if (res.code == 200) {
          classData.value = res.data.map(val => ({
            value: val,
            label: val
          }))
          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(reject)
  )
}
//老师根据班级信息和学生学号查询成绩
const selectscorebystu = () => {
  const url = `/score/selectscorebystu?className=${formObj.className}&gradeName=${formObj.gradeName}&sid=${formObj.sid}`
  return new Promise((resolve, reject) => 
    axios.get(url)
      .then(res => {
        if (res.code == 200) {
          this.tableData = res.data
          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(reject)
  )
}
//单个成绩添加
const addscore = () => {
  const url = `score/addscore`
  const params = {
    ...addFormObj,
    sgcid: ''
  }
  return new Promise((resolve, reject) => 
    axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.code == 200) {
          classData.value = res.data.map(val => ({
            value: val,
            label: val
          }))
          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(reject)
  )
}
//老师根据班级信息查询所有人成绩
const selectscoreall = () => {
  const url = `/score/selectscoreall?className=${formObj.className}&gradeName=${formObj.gradeName}`
  const params = {
    ...addFormObj,
    sgcid: ''
  }
  return new Promise((resolve, reject) => 
    axios.get(url)
      .then(res => {
        if (res.code == 200) {
          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(reject)
  )
}
//老师文件上传解析成绩接口
const fileload = (file) => {
  const url = `/score/fileload`
  const formData = new FormData()
  formData.append('f', file)
  return new Promise((resolve, reject) => 
    axios.post(url, formData, {
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.code == 200) {

          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(reject)
  )
}
//学生自己查询过往成绩
const myscore = () => {
  const url = `/score/myscore`
  return new Promise((resolve, reject) => 
    axios.get(url)
      .then(res => {
        if (res.code == 200) {
          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(reject)
  )
}
//学生自己获取过往指定某年级班级成绩
const myscoreByclassandgrade = () => {
  const url = `/score/myscoreByclassandgrade?className=${formObj.className}&gradeName=${formObj.gradeName}`
  return new Promise((resolve, reject) => 
    axios.get(url)
      .then(res => {
        if (res.code == 200) {
          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(reject)
  )
}
const getAllData = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '数据请求中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (juese === '老师') {
    Promise.all([
      getGrade
    ])
      .finally(() => {
        loading.close()
      })
  }
  else {
    Promise.all([
      getGrade
    ])
      .finally(() => {
          loading.close()
        })
  }
}
const goSearch = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '数据请求中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (juese === '老师') {
    Promise.all([
      myscoreByclassandgrade
    ])
      .finally(() => {
        loading.close()
      })
  }
  else {
    Promise.all([
      getGrade
    ])
      .finally(() => {
          loading.close()
        })
  }
}
const fileList = ref([])
const handleChange = (uploadFile, uploadFiles) => {
  fileload(uploadFile.raw)
  // fileList.value = fileList.value.slice(-3)
}
const changeGrage = () => {
  getClass()
  getAllData()
}
</script>
<template>
  <el-main>
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
      <el-form-item label="学号" v-if="juese === '老师'">
        <el-input v-model="formObj.sid" style="width: 150px;" placeholder="请输入学号" />
      </el-form-item>
      <el-form-item v-if="juese === '老师'">
        <el-button type="primary">查询</el-button>
      </el-form-item>
    </el-form>
    <el-space alignment="flex-start" v-if="juese === '老师'">
      <el-upload
        v-model:file-list="fileList"
        action="https://run.mocky.io/v3/9d059bf9-4660-45f2-925d-ce80ad6c4d15"
        multiple
        :limit="1"
        :on-change="handleChange"
      >
        <el-button type="primary">上传文件</el-button>
      </el-upload>
      <el-button type="primary" v-if="juese === '老师'">手动添加成绩</el-button>
    </el-space>
    <el-table :data="tableData" stripe style="width: 100%" v-if="tableData.length > 0">
      <el-table-column prop="学生号" label="学生号"  />
      <el-table-column prop="英语" label="英语"  />
      <el-table-column prop="数学" label="数学"  />
      <el-table-column prop="语文"  label="语文" />
      <el-table-column prop="政治"  label="政治" />
      <el-table-column prop="生物"  label="生物" />
      <el-table-column prop="历史"  label="历史" />
      <el-table-column prop="地理"  label="地理" />
    </el-table>
    <el-empty description="暂无数据" v-else />
  </el-main>
</template>