import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../store/auth'

const routes = [
  {
    path: '/',
    redirect: () => {
      const auth = useAuthStore()
      if (!auth.isAuthenticated) return '/login'
      return auth.isEmployee ? '/employee/dashboard' : '/employer/dashboard'
    },
  },
  { path: '/login', component: () => import('../views/LoginView.vue'), meta: { guest: true } },
  { path: '/signup', component: () => import('../views/SignupView.vue'), meta: { guest: true } },
  {
    path: '/employee',
    component: () => import('../views/employee/EmployeeLayout.vue'),
    meta: { requiresAuth: true, role: 'employee' },
    children: [
      { path: 'dashboard', component: () => import('../views/employee/DashboardView.vue') },
      { path: 'apply', component: () => import('../views/employee/ApplyLeaveView.vue') },
      { path: 'my-leaves', component: () => import('../views/employee/MyLeavesView.vue') },
    ],
  },
  {
    path: '/employer',
    component: () => import('../views/employer/EmployerLayout.vue'),
    meta: { requiresAuth: true, role: 'employer' },
    children: [
      { path: 'dashboard', component: () => import('../views/employer/DashboardView.vue') },
      { path: 'requests', component: () => import('../views/employer/LeaveRequestsView.vue') },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return next('/login')
  }
  if (to.meta.guest && auth.isAuthenticated) {
    return next('/')
  }
  if (to.meta.role && auth.user?.role !== to.meta.role) {
    return next('/')
  }
  next()
})

export default router
