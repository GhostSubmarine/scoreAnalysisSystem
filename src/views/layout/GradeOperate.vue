<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
const juese = window.sessionStorage.getItem('juese')
const jsid = window.sessionStorage.getItem('jsid')
const gradeData = ref([{label: '1', value: '1'}])
const classData = ref([])
const kstimeData = ref([])
const dialogVisible = ref(false)
const addFormObj = reactive({})
const rules = reactive({
  name: [
    { required: true, message: 'Please input Activity name', trigger: 'blur' },
    { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
  ]
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
  const loading = ElLoading.service({
    lock: true,
    text: '数据请求中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  Promise.all([
    getGrade(),
    getKstime()
  ])
  .finally(() => {
    loading.close()
  })
})
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
//老师根据班级信息和学生学号查询成绩
const selectscorebystu = () => {
  const url = `/api/score/selectscorebystu?className=${formObj.className}&gradeName=${formObj.gradeName}&sid=${formObj.sid}`
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
      .then(res => {
        if (res.data.code == 200) {
          tableData.value = res.data.data
          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(err => {
        ElMessage(err)
        reject(err)
      })
  )
}
//单个成绩添加
const addscore = () => {
  const url = `/api/score/addscore`
  const params = {
    ...addFormObj
  }
  return new Promise((resolve, reject) => 
    axios.post(url, params, {
      headers: {
        'Content-Type': 'application/json',
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
//老师根据班级信息查询所有人成绩
const selectscoreall = () => {
  const url = `/api/score/selectscoreall?className=${formObj.className}&gradeName=${formObj.gradeName}`
  const params = {
    ...formObj,
    sgcid: ''
  }
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
      .then(res => {
        if (res.data.code == 200) {
          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(err => {
        ElMessage(err)
        reject(err)
      })
  )
}
//老师文件上传解析成绩接口
const fileload = (file) => {
  const url = `/api/score/fileload`
  const formData = new FormData()
  formData.append('f', file)
  return new Promise((resolve, reject) => 
    axios.put(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        jsid,
        juese
      }
    })
    .then(res => {
      if (res.data.code == 200) {
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
//学生自己查询过往成绩
const myscore = () => {
  const url = `/api/score/myscore`
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
      .then(res => {
        if (res.data.code == 200) {
          resolve(res)
        }
        else {
          reject(res)
        }
      })
      .catch(err => {
        ElMessage(err)
        reject(err)
      })
  )
}
//学生自己获取过往指定某年级班级成绩
const myscoreByclassandgrade = () => {
  const url = `/api/score/myscoreByclassandgrade?className=${formObj.className}&gradeName=${formObj.gradeName}`
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        tableData.value = res.data.data
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
const getAllData = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '数据请求中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (juese === 'teacher') {
    Promise.all([
      selectscorebystu()
    ])
    .finally(() => {
      loading.close()
    })
  }
  else {
    Promise.all([
      myscoreByclassandgrade()
    ])
    .finally(() => {
      loading.close()
    })
  }
}
const fileList = ref([])
const handleChange = (uploadFile) => {
  fileload(uploadFile)
}
const changeGrage = () => {
  const loading = ElLoading.service({
    lock: true,
    text: '数据请求中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  formObj.className = ''
  Promise.all([
    getClass()
  ])
  .finally(() => {
    loading.close()
  })
}
const showForm = () => {
  dialogVisible.value = true
}
const handleClose = (done) => {
  ElMessageBox.confirm('确认关闭?')
    .then(() => {
      done()
    })
    .catch(() => {
      // catch error
    })
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
        >
          <el-option v-for="item in classData" :label="item.label" :value="item.value" :key="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item label="学号" v-if="juese === 'teacher'">
        <el-input v-model="formObj.sid" style="width: 150px;" placeholder="请输入学号" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getAllData()">查询</el-button>
      </el-form-item>
    </el-form>
    <el-space alignment="flex-start" v-if="juese === 'teacher'">
      <el-upload
        v-model:file-list="fileList"
        multiple
        :limit="1"
        :before-upload="handleChange"
      >
        <el-button type="primary">上传文件</el-button>
      </el-upload>
      <el-button type="primary" v-if="juese === 'teacher'" @click="showForm">手动添加成绩</el-button>
    </el-space>
    <el-table :data="tableData" stripe style="width: 100%" v-if="tableData.length > 0">
      <el-table-column prop="学生号" label="学生号"  />
      <el-table-column prop="语文" label="语文"  />
      <el-table-column prop="数学" label="数学"  />
      <el-table-column prop="英语"  label="英语" />
      <el-table-column prop="历史"  label="历史" />
      <el-table-column prop="地理"  label="地理" />
      <el-table-column prop="生物"  label="生物" />
      <el-table-column prop="政治"  label="政治" />
    </el-table>
    <el-empty description="暂无数据" v-else />
    <el-dialog
      v-model="dialogVisible"
      title="上传成绩"
      width="500"
      :before-close="handleClose"
    >
      <el-form :inline="true" :model="addFormObj">
        <el-form-item label="年级">
          <el-select
            style="width: 150px;"
            v-model="addFormObj.gradeName"
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
            v-model="addFormObj.className"
            placeholder="班级"
            clearable
          >
            <el-option v-for="item in classData" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="时间">
          <el-select
            style="width: 150px;"
            v-model="addFormObj.kstime"
            placeholder="时间"
            clearable>
            <el-option v-for="item in kstimeData" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="addFormObj.sid" style="width: 150px;" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="语文">
          <el-input v-model="addFormObj.yuwen" style="width: 150px;" placeholder="请输入语文" />
        </el-form-item>
        <el-form-item label="数学">
          <el-input v-model="addFormObj.shuxue" style="width: 150px;" placeholder="请输入数学" />
        </el-form-item>
        <el-form-item label="英语">
          <el-input v-model="addFormObj.yingyu" style="width: 150px;" placeholder="请输入英语" />
        </el-form-item>
        <el-form-item label="地理">
          <el-input v-model="addFormObj.dili" style="width: 150px;" placeholder="请输入地理" />
        </el-form-item>
        <el-form-item label="政治">
          <el-input v-model="addFormObj.zhengzhi" style="width: 150px;" placeholder="请输入政治" />
        </el-form-item>
        <el-form-item label="历史">
          <el-input v-model="addFormObj.lishi" style="width: 150px;" placeholder="请输入历史" />
        </el-form-item>
        <el-form-item label="生物">
          <el-input v-model="addFormObj.shengwu" style="width: 150px;" placeholder="请输入生物" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-space>
          <el-button @click="dialogVisible = false">Cancel</el-button>
          <el-button type="primary" @click="addscore">
            提交
          </el-button>
        </el-space>
      </template>
    </el-dialog>
  </el-main>
</template>