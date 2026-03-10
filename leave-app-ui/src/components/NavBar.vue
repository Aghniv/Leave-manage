<template>
  <nav class="bg-white border-b border-gray-200 shadow-sm">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center h-16">
        <div class="flex items-center gap-6">
          <span class="text-lg font-bold text-blue-600">LeaveMS</span>
          <div class="hidden sm:flex gap-1">
            <RouterLink
              v-for="link in links"
              :key="link.to"
              :to="link.to"
              class="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
              active-class="text-blue-600 bg-blue-50"
            >
              {{ link.label }}
            </RouterLink>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <div class="text-right hidden sm:block">
            <p class="text-sm font-medium text-gray-800">{{ user?.name }}</p>
            <p class="text-xs text-gray-500 capitalize">{{ user?.role }}</p>
          </div>
          <button @click="handleLogout" class="btn-secondary text-xs">Logout</button>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import { computed } from 'vue'

const props = defineProps({ links: Array })
const router = useRouter()
const auth = useAuthStore()
const user = computed(() => auth.user)

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>
