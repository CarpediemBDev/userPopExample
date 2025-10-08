import { createRouter, createWebHistory } from 'vue-router'
import UserPage from '../pages/UserPage.vue'

const routes = [
  { path: '/', name: 'Users', component: UserPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
