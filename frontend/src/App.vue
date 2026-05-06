<template>
  <div class="app-container">
    <div v-if="isInitializing" class="loading-screen">
      <div class="spinner"></div>
      <p>Загрузка...</p>
    </div>
    <template v-else>
      <!-- Навбар с информацией о пользователе и кнопкой выхода -->
      <nav class="navbar" v-if="isAuthenticated">
        <div class="navbar-content">
          <div class="navbar-title">Интегральная система показателей</div>
          <div class="navbar-user">
            <span v-if="user" class="user-name">{{ user.username }}</span>
            <button @click="handleLogout" class="logout-btn">Выход</button>
          </div>
        </div>
      </nav>
      
      <!-- Основное содержимое -->
      <router-view />
    </template>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { checkAuth, logout, authStore } from './store/authStore'

const isInitializing = ref(true)
const router = useRouter()

// Вычисляемые свойства для использования в шаблоне
const isAuthenticated = computed(() => authStore.isAuthenticated)
const user = computed(() => authStore.user)

// При загрузке приложения проверяем авторизацию
onMounted(async () => {
  try {
    await checkAuth()
  } catch (error) {
    console.error('Ошибка при проверке авторизации:', error)
  } finally {
    isInitializing.value = false
  }
})

// Обработчик выхода
async function handleLogout() {
  await logout()
  router.push('/login')
}
</script>

<style scoped>
.app-container {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.loading-screen {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #ffffff;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.navbar {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.navbar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.navbar-title {
  font-size: 1.5rem;
  font-weight: bold;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-name {
  font-weight: 500;
}

.logout-btn {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.95rem;
  transition: background-color 0.3s ease;
}

.logout-btn:hover {
  background-color: #c0392b;
}
</style>
