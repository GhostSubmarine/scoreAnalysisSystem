<script setup>
import { ref, reactive, onMounted } from 'vue'
import axios from 'axios'
import { ElLoading, ElMessage, ElMessageBox } from 'element-plus'
import moment from 'moment'
const juese = window.sessionStorage.getItem('juese')
const jsid = window.sessionStorage.getItem('jsid')
const gradeData = ref([{label: '1', value: '1'}])
const classData = ref([])
const kstimeData = ref([])
const dialogVisible = ref(false)
const addFormObj = reactive({})
const addForm = ref(null)
const delFormObj = reactive({})
const delForm = ref(null)
const delDialogVisible = ref(false)
const editFormObj = reactive({})
const editForm = ref(null)
const editDialogVisible = ref(false)
const loading  = ref(false)
const rules = reactive({
  kstime: [
    { required: true, message: '请选择时间！', trigger: 'change' }
  ],
  stuid: [
    { required: true, message: '请输入学号！', trigger: 'blur' }
  ]
})
const tableData = ref([])
const formObj = reactive({
  gradeName: '',
  className: ''
})
const deletescorebykstime = () => {
  loading.value = true
  const url = `/api/score/deletescorebykstime?stuid=${delFormObj.stuid}&kstime=${moment(delFormObj.kstime).format('YYYY-MM-DD')}`
  axios.delete(url, {
    headers: {
      juese,
      jsid
    }
  })
  .then(res => {
    if (res.data.code === 200) {
      ElMessage(res.data.msg)
      delDialogVisible.value = false
      getAllData()
    }
    else if (res.data.code === 401) {
      ElMessage('登录失效！')
      window.sessionStorage.removeItem('juese')
      window.location.reload()
    }
    else {
      ElMessage(res.data.msg)
    }
  })
  .catch(err => {
    ElMessage(err)
  })
  .finally(() => loading.value = false)
}
const updateByKstime = () => {
  loading.value = true
  const url = `/api/score/updateByKstime?stuid=${editFormObj.stuid}&kstime=${moment(editFormObj.kstime).format('YYYY-MM-DD')}`
  const params = {
    ...editFormObj
  }
  axios.post(url, params, {
    data: params,
    headers: {
      juese,
      jsid
    }
  })
  .then(res => {
    if (res.data.code === 200) {
      ElMessage(res.data.msg)
      editDialogVisible.value = false
      getAllData()
    }
    else if (res.data.code === 401) {
      ElMessage('登录失效！')
      window.sessionStorage.removeItem('juese')
      window.location.reload()
    }
    else {
      ElMessage(res.data.msg)
    }
  })
  .catch(err => {
    ElMessage(err)
  })
  .finally(() => loading.value = false)
}
onMounted(async () => {
  const loading = ElLoading.service({
    lock: true,
    text: '数据请求中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (juese === 'teacher') {
    try {
      await getClassGradeForTea()
      await selectscoreall()
      await getKstime()
      loading.close()
    }
    catch(e) {
      loading.close()
    }
  }
  else {
    Promise.all([
      getGrade(),
      getKstime(),
      myscore()
    ])
    .finally(() => {
      loading.close()
    })
  }
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
      else if (res.data.code === 401) {
        ElMessage('登录失效！')
        window.sessionStorage.removeItem('juese')
        window.location.reload()
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
      else if (res.data.code === 401) {
        ElMessage('登录失效！')
        window.sessionStorage.removeItem('juese')
        window.location.reload()
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
      else if (res.data.code === 401) {
        ElMessage('登录失效！')
        window.sessionStorage.removeItem('juese')
        window.location.reload()
      }
      else {
        classData.value = []
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      classData.value = []
      ElMessage(err)
      reject(err)
    })
  )
}
//老师获取班级
const getClassGradeForTea = () => {
  const url = `/api/data/getClassGradeForTea`
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        formObj.gradeName = res.data.data.gradeName
        formObj.className = res.data.data.className
        resolve(res)
      }
      else if (res.data.code === 401) {
        ElMessage('登录失效！')
        window.sessionStorage.removeItem('juese')
        window.location.reload()
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
  let url = `/api/score/selectscorebystu?className=${formObj.className}&gradeName=${formObj.gradeName}`
  if (formObj.sid) {
    url += `&idinfo=${formObj.sid}`
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
          tableData.value = res.data.data
          resolve(res)
        }
        else if (res.data.code === 401) {
          ElMessage('登录失效！')
          window.sessionStorage.removeItem('juese')
          window.location.reload()
        }
        else {
          tableData.value = []
          reject(res)
        }
      })
      .catch(err => {
        tableData.value = []
        ElMessage(err)
        reject(err)
      })
  )
}
//单个成绩添加
const addscore = () => {
  const url = `/api/score/addscore`
  const params = {
    ...addFormObj,
    kstime: moment(addFormObj.kstime).format('YYYY-MM-DD'),
    ...formObj
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
        dialogVisible.value = false
        ElMessage(res.data.msg)
        getAllData()
        resolve(res)
      }
      else if (res.data.code === 401) {
        ElMessage('登录失效！')
        window.sessionStorage.removeItem('juese')
        window.location.reload()
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
  return new Promise((resolve, reject) => 
    axios.get(url, {
      headers: {
        juese,
        jsid
      }
    })
    .then(res => {
      if (res.data.code == 200) {
        tableData.value = []
        res.data.data.forEach(obj1 => {
          obj1.scores.forEach(obj2 => {
            tableData.value.push({
              ...obj2, 
              stuname: obj1.stuname
            })
          })
        })
        resolve(res)
      }
      else if (res.data.code === 401) {
        ElMessage('登录失效！')
        window.sessionStorage.removeItem('juese')
        window.location.reload()
      }
      else {
        tableData.value = []
        reject(res)
      }
    })
    .catch(err => {
      tableData.value = []
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
        ElMessage(res.data.msg)
        resolve(res)
      }
      else if (res.data.code === 401) {
        ElMessage('登录失效！')
        window.sessionStorage.removeItem('juese')
        window.location.reload()
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
        tableData.value = []
        res.data.data.forEach(obj1 => {
          obj1.scores.forEach(obj2 => {
            tableData.value.push({
              ...obj2, 
              cName: obj1.cName,
              gName: obj1.gName
            })
          })
        })
        resolve(res)
      }
      else if (res.data.code === 401) {
        ElMessage('登录失效！')
        window.sessionStorage.removeItem('juese')
        window.location.reload()
      }
      else {
        tableData.value = []
        reject(res)
      }
    })
    .catch(err => {
      tableData.value = []
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
        tableData.value = res.data.data.map(val => ({
          ...val,
          gName: formObj.gradeName,
          cName: formObj.className
        }))
        resolve(res)
      }
      else if (res.data.code === 401) {
        ElMessage('登录失效！')
        window.sessionStorage.removeItem('juese')
        window.location.reload()
      }
      else {
        tableData.value = []
        ElMessage(res.data.msg)
        reject(res)
      }
    })
    .catch(err => {
      tableData.value = []
      ElMessage(err)
      reject(err)
    })
  )
}
const getAllData = (all = false) => {
  const loading = ElLoading.service({
    lock: true,
    text: '数据请求中',
    background: 'rgba(0, 0, 0, 0.7)',
  })
  if (juese === 'teacher') {
    Promise.all([
      formObj.sid && !all ? selectscorebystu() : selectscoreall()
    ])
    .finally(() => {
      loading.close()
    })
  }
  else {
    Promise.all([
      (!!formObj.className && !!formObj.gradeName) ? myscoreByclassandgrade() : myscore()
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
  for (let key in addFormObj) {
    addFormObj[key] = ''
  }
}
const openDelForm = () => {
  delDialogVisible.value = true
  for (let key in delFormObj) {
    delFormObj[key] = ''
  }
}
const openEditForm = () => {
  editDialogVisible.value = true
  for (let key in editFormObj) {
    editFormObj[key] = ''
  }
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
const delConfirm = (delForm) => {
  delForm.validate(valid => {
    if (valid) {
      deletescorebykstime()
    }
  })
}
const editConfirm = (editForm) => {
  editForm.validate(valid => {
    if (valid) {
      updateByKstime()
    }
  })
}
const closeDelDialog = () => {
  delDialogVisible.value = false
}
const closeEditDialog = () => {
  editDialogVisible.value = false
}
</script>
<template>
  <el-main class="main">
    <el-form :inline="true" :model="formObj">
      <el-form-item label="年级" v-if="juese === 'student'">
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
      <el-form-item label="班级" v-if="juese === 'student'">
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
      <el-form-item v-if="juese === 'teacher'">
        <el-button type="primary" @click="getAllData(true)">查询所有学生</el-button>
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
      <el-button type="primary" v-if="juese === 'teacher'" @click="showForm()">手动添加成绩</el-button>
      <el-button type="primary" v-if="juese === 'teacher'" @click="openDelForm()">删除成绩</el-button>
      <el-button type="primary" v-if="juese === 'teacher'" @click="openEditForm()">修改成绩</el-button>
    </el-space>
    <el-table :data="tableData" stripe style="width: 100%; flex: 1; overflow: auto;" v-if="tableData.length > 0">
      <el-table-column prop="stuname" label="学生姓名" v-if="juese === 'teacher'" />
      <el-table-column prop="gName" label="年级" v-if="juese === 'student'" />
      <el-table-column prop="cName" label="班级" v-if="juese === 'student'" />
      <el-table-column prop="考试时间" label="考试时间" v-if="juese === 'student'" />
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
      <el-form :inline="true" ref="addForm" :model="addFormObj">
        <el-form-item label="时间">
          <el-date-picker
            v-model="addFormObj.kstime"
            type="date"
            placeholder="选择时间"
          />
        </el-form-item>
        <el-form-item label="学号">
          <el-input v-model="addFormObj.sgcid" style="width: 150px;" placeholder="请输入学号" />
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
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="addscore">
            提交
          </el-button>
        </el-space>
      </template>
    </el-dialog>
    <el-dialog
      v-model="delDialogVisible"
      title="删除成绩"
      width="500"
      :before-close="closeDelDialog"
    >
      <el-form :inline="true" ref="delForm" :model="delFormObj" :rules="rules">
        <el-form-item label="时间" prop="kstime">
          <el-select
            style="width: 150px;"
            v-model="formObj.kstime"
            placeholder="考试时间"
          >
            <el-option v-for="item in kstimeData" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="学号" prop="stuid">
          <el-input v-model="delFormObj.stuid" style="width: 150px;" placeholder="请输入学号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-space>
          <el-button @click="delDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="delConfirm(delForm)">
            提交
          </el-button>
        </el-space>
      </template>
    </el-dialog>
    <el-dialog
      v-model="editDialogVisible"
      title="修改成绩"
      width="500"
      :before-close="closeEditDialog"
    >
      <el-form :inline="true" ref="editForm" :model="editFormObj" :rules="rules">
        <el-form-item label="时间" prop="kstime">
          <el-select
            style="width: 150px;"
            v-model="formObj.kstime"
            placeholder="考试时间"
          >
            <el-option v-for="item in kstimeData" :label="item.label" :value="item.value" :key="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item label="学号" prop="stuid">
          <el-input v-model="editFormObj.stuid" style="width: 150px;" placeholder="请输入学号" />
        </el-form-item>
        <el-form-item label="语文">
          <el-input v-model="editFormObj.yuwen" style="width: 150px;" placeholder="请输入语文" />
        </el-form-item>
        <el-form-item label="数学">
          <el-input v-model="editFormObj.shuxue" style="width: 150px;" placeholder="请输入数学" />
        </el-form-item>
        <el-form-item label="英语">
          <el-input v-model="editFormObj.yingyu" style="width: 150px;" placeholder="请输入英语" />
        </el-form-item>
        <el-form-item label="地理">
          <el-input v-model="editFormObj.dili" style="width: 150px;" placeholder="请输入地理" />
        </el-form-item>
        <el-form-item label="政治">
          <el-input v-model="editFormObj.zhengzhi" style="width: 150px;" placeholder="请输入政治" />
        </el-form-item>
        <el-form-item label="历史">
          <el-input v-model="editFormObj.lishi" style="width: 150px;" placeholder="请输入历史" />
        </el-form-item>
        <el-form-item label="生物">
          <el-input v-model="editFormObj.shengwu" style="width: 150px;" placeholder="请输入生物" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-space>
          <el-button @click="editDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="editConfirm(editForm)">
            提交
          </el-button>
        </el-space>
      </template>
    </el-dialog>
  </el-main>
</template>
<style lang="scss" scoped>
.main {
  display: flex;
  flex-direction: column;

}
</style>