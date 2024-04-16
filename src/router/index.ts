import { createRouter, createWebHistory } from 'vue-router'
import Layout from '../views/layout/index.vue'
import DataAnalysisSystem from '../views/layout/DataAnalysisSystem.vue'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/main',
      name: 'main',
      component: Layout,
      children: [
        {
          path: '/main/dataAnalysisSystem',
          name: 'dataAnalysisSystem',
          component: DataAnalysisSystem
        }
      ]
    }
  ]
})

export default router
