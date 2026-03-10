<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md">
      <div class="card">
        <h1 class="text-2xl font-bold text-center text-gray-800 mb-2">Create Account</h1>
        <p class="text-center text-gray-500 text-sm mb-6">Join the Leave Management System</p>

        <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          {{ error }}
        </div>

        <form @submit.prevent="handleSignup" novalidate>
          <div class="mb-4">
            <label class="form-label">Full Name</label>
            <input v-model="form.name" type="text" class="form-input" placeholder="John Doe" />
            <p v-if="v.name" class="form-error">{{ v.name }}</p>
          </div>

          <div class="mb-4">
            <label class="form-label">Email</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="you@example.com" />
            <p v-if="v.email" class="form-error">{{ v.email }}</p>
          </div>

          <div class="mb-4">
            <label class="form-label">Password</label>
            <input v-model="form.password" type="password" class="form-input" placeholder="At least 6 characters" />
            <p v-if="v.password" class="form-error">{{ v.password }}</p>
          </div>

          <div class="mb-4">
            <label class="form-label">Role</label>
            <select v-model="form.role" class="form-input">
              <option value="">Select a role</option>
              <option value="employee">Employee</option>
              <option value="employer">Employer / Manager</option>
            </select>
            <p v-if="v.role" class="form-error">{{ v.role }}</p>
          </div>

          <div class="mb-6">
            <label class="form-label">Department <span class="text-gray-400 font-normal">(optional)</span></label>
            <input v-model="form.department" type="text" class="form-input" placeholder="e.g. Engineering" />
          </div>

          <button type="submit" class="btn-primary w-full" :disabled="loading">
            {{ loading ? 'Creating account...' : 'Create Account' }}
          </button>
        </form>

        <p class="mt-4 text-center text-sm text-gray-600">
          Already have an account?
          <RouterLink to="/login" class="text-blue-600 hover:underline font-medium">Sign in</RouterLink>
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

const form = reactive({ name: '', email: '', password: '', role: '', department: '' })
const v = reactive({ name: '', email: '', password: '', role: '' })
const error = ref('')
const loading = ref(false)

function validate() {
  Object.keys(v).forEach((k) => (v[k] = ''))
  let valid = true
  if (!form.name || form.name.trim().length < 2) { v.name = 'Name must be at least 2 characters'; valid = false }
  if (!form.email) { v.email = 'Email is required'; valid = false }
  else if (!/^\S+@\S+\.\S+$/.test(form.email)) { v.email = 'Enter a valid email'; valid = false }
  if (!form.password || form.password.length < 6) { v.password = 'Password must be at least 6 characters'; valid = false }
  if (!form.role) { v.role = 'Please select a role'; valid = false }
  return valid
}

async function handleSignup() {
  error.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await auth.signup(form)
    router.push('/')
  } catch (err) {
    error.value = auth.error || 'Signup failed.'
  } finally {
    loading.value = false
  }
}
</script>
