import { createRouter, createWebHistory } from 'vue-router'
import { checkAuth, authStore } from '../store/authStore'

import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import Dashboard from '../components/Dashboard.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { 
      path: '/login', 
      name: 'Login', 
      component: LoginView,
      meta: { requiresAuth: false }
    },
    { 
      path: '/register', 
      name: 'Register', 
      component: RegisterView,
      meta: { requiresAuth: false }
    },
    { 
      path: '/', 
      name: 'Dashboard', 
      component: Dashboard,
      meta: { requiresAuth: true }
    },
    // Перенаправление неизвестных маршрутов на логин или главную
    {
      path: '/:pathMatch(.*)*',
      redirect: () => {
        return authStore.isAuthenticated ? '/' : '/login'
      }
    }
  ]
})

// Навигационная гвардия - проверка авторизации перед переходом
router.beforeEach(async (to, from, next) => {
  // Если маршрут требует авторизации
  if (to.meta.requiresAuth) {
    // Проверяем, авторизован ли пользователь
    if (!authStore.isAuthenticated) {
      // Пытаемся проверить авторизацию на сервере
      try {
        const isAuth = await checkAuth()
        if (!isAuth) {
          // Не авторизован - перенаправляем на логин
          next('/login')
          return
        }
      } catch (error) {
        // Ошибка при проверке - перенаправляем на логин
        next('/login')
        return
      }
    }
  }
  
  // Если пользователь авторизован и пытается перейти на логин/регистрацию,
  // перенаправляем на главную страницу
  if ((to.name === 'Login' || to.name === 'Register') && authStore.isAuthenticated) {
    next('/')
    return
  }
  
  next()
})

export default router