import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import TabsPage from '@/views/TabsPage.vue';
import Register from '@/views/Auth/Register.vue';
import PersonalInfo from '@/views/Auth/PersonalInfo.vue';
import Security from '@/views/Auth/Security.vue';
import Login from '@/views/Auth/Login.vue';
import Privacy from '@/views/Auth/Privacy.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/tabs/events'
  },
  {
    path: '/register',
    component: () => Register
  },
  {
    path: '/personalinfo',
    component: () => PersonalInfo
  },
  {
    path: '/security',
    component: () => Security
  },
  {
    path: '/login',
    component: () => Login
  },
  {
    path: '/privacy',
    component: () => Privacy
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/events'
      },
      {
        path: 'events',
        component: () => import('@/views/Events.vue')
      },
      {
        path: 'reservations',
        component: () => import('@/views/Reservations.vue')
      },
      {
        path: 'profile',
        component: () => import('@/views/Auth/Profile.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router
