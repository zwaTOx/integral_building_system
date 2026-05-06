<template>
  <div class="auth-container">
    <RegisterForm @submit="handleRegister" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import RegisterForm from '../components/RegisterForm.vue'
import '../assets/styles/auth.css'
import { register, checkAuth } from '../store/authStore'
import { onMounted } from 'vue'

const router = useRouter()

async function handleRegister(data) {
  try {
    await register(data.username, data.email, data.password)
    
    // Показываем сообщение об успехе
    alert('Регистрация успешна! Пожалуйста, войдите.')
    
    // Перенаправляем на страницу логина
    router.push('/login')
  } catch (err) {
    // Ошибка уже обработана в authStore
    console.error('Ошибка регистрации:', err)
  }
}

// Если пользователь уже авторизован, перенаправляем на главную страницу
onMounted(async () => {
  try {
    const isAuth = await checkAuth()
    if (isAuth) {
      router.push('/')
    }
  } catch (error) {
    // Пользователь не авторизован, это нормально для страницы регистрации
  }
})
</script>
