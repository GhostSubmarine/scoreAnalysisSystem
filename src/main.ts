import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import App from './App.vue'
import router from './router'
import * as echarts from 'echarts'
import VueCharts from 'vue-echarts'

const app = createApp(App)
app.component('v-chart', VueCharts)

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

app.mount('#app')
