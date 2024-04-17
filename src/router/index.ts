import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/layout/index.vue'
import DataAnalysisSystem from '../views/layout/DataAnalysisSystem.vue'
import MessageManager from '../views/layout/MessageManager.vue'
import GradeOperate from '../views/layout/GradeOperate.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // {
    //   path: '/',
    //   redirect: '/login',
    // },
    {
      path: '/',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: Layout,
      children: [
        {
          path: '/main/messageManager',
          name: 'MessageManager',
          component: MessageManager
        },
        {
          path: '/main/gradeOperate',
          name: 'GradeOperate',
          component: GradeOperate
        },
        {
          path: '/main/dataAnalysisSystem',
          name: 'dataAnalysisSystem',
          component: DataAnalysisSystem
        }
      ]
    }
  ]
})
// router.beforeEach((to, from, next) => {
//   // 在导航前执行操作，例如身份验证检查
//   const userInfo = window.sessionStorage.getItem('userInfo')
//   debugger
//   if (!userInfo) {
//     next('/'); // 重定向到登录页
//   } else {
//     next(); // 继续导航
//   }
// })
export default router
