<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md">
      <div class="card">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">Leave Management</h1>
        <p class="text-center text-gray-500 text-sm mb-6">Sign in to your account</p>

        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleLogin" novalidate>
          <div class="mb-4">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="you@example.com" required />
            <p v-if="v.email" class="form-error">{{ v.email }}</p>
          </div>

          <div class="mb-6">
            <label class="form-label">Password</label>
            <input v-model="form.password" type="password" class="form-input" placeholder="••••••••" required />
            <p v-if="v.password" class="form-error">{{ v.password }}</p>
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? 'Signing in...' : 'Sign In' }}
          </button>
        </form>

        <div class="mt-8 pt-6 border-t border-gray-100">
          <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Demo Credentials</p>
          <div class="grid grid-cols-2 gap-3">
            <button 
              @click="fillDemo('alice@example.com', 'password123')"
              class="text-left p-2 rounded border border-blue-100 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <span class="block text-xs font-bold text-blue-700">Employee</span>
              <span class="block text-[10px] text-blue-600 truncate">alice@example.com</span>
              <span class="block text-[10px] text-blue-600 truncate">password123</span>
            </button>
            <button 
              @click="fillDemo('bob.manager@example.com', 'password123')"
              class="text-left p-2 rounded border border-indigo-100 bg-indigo-50 hover:bg-indigo-100 transition-colors"
            >
              <span class="block text-xs font-bold text-indigo-700">Employer</span>
              <span class="block text-[10px] text-indigo-600 truncate">bob.manager@example.com</span>
              <span class="block text-[10px] text-indigo-600 truncate">password123</span>
            </button>
          </div>
        </div>

        <p class="mt-6 text-center text-sm text-gray-600">
          Don't have an account?
          <RouterLink to="/signup" class="text-blue-600 hover:underline font-medium">Sign up</RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'

const router = useRouter()
const auth = useAuthStore()

const form = reactive({ email: '', password: '' })
const v = reactive({ email: '', password: '' })
const error = ref('')
const loading = ref(false)

function fillDemo(email, password) {
  form.email = email
  form.password = password
  error.value = ''
}

function validate() {
  v.email = ''
  v.password = ''
  let valid = true
  if (!form.email) { v.email = 'Email is required'; valid = false }
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) { v.email = 'Enter a valid email'; valid = false }
  if (!form.password) { v.password = 'Password is required'; valid = false }
  return valid
}

async function handleLogin() {
  error.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await auth.login(form)
    router.push('/')
  } catch (err) {
    error.value = auth.error || 'Login failed.'
  } finally {
    loading.value = false
  }
}
</script>
