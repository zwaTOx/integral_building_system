<template>
  <div class="auth-container">
    <AuthForm />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import AuthForm from '../components/AuthForm.vue'
import '../assets/styles/login.css' 
import { checkAuth } from '../store/authStore'
import { onMounted } from 'vue'

const router = useRouter()

// Если пользователь уже авторизован, перенаправляем на главную страницу
onMounted(async () => {
  try {
    const isAuth = await checkAuth()
    if (isAuth) {
      router.push('/')
    }
  } catch (error) {
    // Пользователь не авторизован, это нормально для страницы логина
  }
})
</script>
