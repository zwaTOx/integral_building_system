<template>
  <div class="auth-container">
    <h2>Вход</h2>
    <form class="auth-form" @submit.prevent="onSubmit">
      <input 
        v-model="email" 
        type="email" 
        placeholder="Почта" 
        required
        :disabled="isLoading"
      />
      <input 
        v-model="password" 
        type="password" 
        placeholder="Пароль" 
        required
        :disabled="isLoading"
      />
      <p v-if="error" class="error">{{ error }}</p>
      <button type="submit" :disabled="isLoading">
        {{ isLoading ? 'Вход...' : 'Войти' }}
      </button>
      <router-link to="/register" class="register-link">
        Нет аккаунта? Зарегистрироваться
      </router-link>
    </form>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { login } from '../store/authStore'
import { useRouter } from 'vue-router'

const email = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

const router = useRouter()

async function onSubmit() {
  error.value = ''
  isLoading.value = true
  
  try {
    await login(email.value, password.value)
    
    // Успешный логин - переходим на главную страницу
    router.push('/')
  } catch (e) {
    console.error(e)
    error.value = 'Неверный email или пароль'
  } finally {
    isLoading.value = false
  }
}
</script>

<style scoped>
.error {
  color: red;
  margin-bottom: 10px;
}
</style>
