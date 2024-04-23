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
          path: 'messageManager',
          name: 'MessageManager',
          component: MessageManager
        },
        {
          path: 'gradeOperate',
          name: 'GradeOperate',
          component: GradeOperate
        },
        {
          path: 'dataAnalysisSystem',
          name: 'dataAnalysisSystem',
          component: DataAnalysisSystem
        }
      ]
    }
  ]
})
router.beforeEach(async (to, from) => {
  const juese = window.sessionStorage.getItem('juese')
  if (to.fullPath !== '/' && !juese) return '/'
})
export default router
