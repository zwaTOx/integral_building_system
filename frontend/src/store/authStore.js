import { reactive, computed } from 'vue'
import api from '../services/api'

export const authStore = reactive({
  user: null,
  isLoading: false,
  error: null,
  isAuthenticated: false
})

export const authComputed = {
  isAuthenticated: computed(() => authStore.isAuthenticated),
  user: computed(() => authStore.user),
  isLoading: computed(() => authStore.isLoading),
  error: computed(() => authStore.error)
}

/**
 * Регистрация нового пользователя
 */
export async function register(username, email, password) {
  authStore.isLoading = true
  authStore.error = null
  
  try {
    const response = await api.post('/user/register/', {
      username,
      email,
      password
    })
    
    authStore.isLoading = false
    return response.data
  } catch (error) {
    authStore.isLoading = false
    
    if (error.response?.data?.detail) {
      authStore.error = error.response.data.detail
    } else if (error.response?.status === 409) {
      authStore.error = 'Пользователь с таким email или именем уже существует'
    } else {
      authStore.error = 'Ошибка регистрации. Попробуйте позже.'
    }
    
    throw error
  }
}

/**
 * Логин пользователя
 */
export async function login(email, password) {
  authStore.isLoading = true
  authStore.error = null
  
  try {
    const response = await api.post('/user/login/', {
      email,
      password
    })
    
    if (response.data.ok) {
      // После логина проверяем текущего пользователя
      await checkAuth()
      authStore.isLoading = false
      return response.data
    } else {
      throw new Error('Ошибка логина')
    }
  } catch (error) {
    authStore.isLoading = false
    
    if (error.response?.status === 401) {
      authStore.error = 'Неверный email или пароль'
    } else if (error.response?.data?.detail) {
      authStore.error = error.response.data.detail
    } else {
      authStore.error = 'Ошибка при логине. Попробуйте позже.'
    }
    
    throw error
  }
}

/**
 * Проверка текущей авторизации
 */
export async function checkAuth() {
  authStore.isLoading = true
  authStore.error = null
  
  try {
    const response = await api.get('/user/check/')
    
    if (response.data.ok && response.data.user) {
      authStore.user = response.data.user
      authStore.isAuthenticated = true
    } else {
      authStore.user = null
      authStore.isAuthenticated = false
    }
    
    authStore.isLoading = false
    return response.data.ok
  } catch (error) {
    authStore.user = null
    authStore.isAuthenticated = false
    authStore.isLoading = false
    
    // checkAuth может быть вызван при загрузке, поэтому не устанавливаем ошибку
    return false
  }
}

/**
 * Выход из аккаунта
 */
export async function logout() {
  authStore.user = null
  authStore.isAuthenticated = false
  authStore.error = null
  // Сервер просто проверяет cookie, поэтому выход в основном - это очистка клиента
  // Cookie будет удалена браузером через механизм сессии
}

/**
 * Очистка ошибки
 */
export function clearError() {
  authStore.error = null
}
