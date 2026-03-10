<template>
  <div class="max-w-2xl mx-auto">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Apply for Leave</h2>

    <div class="card">
      <div v-if="success" class="mb-4 p-3 bg-green-50 border border-green-200 rounded-md text-green-700 text-sm">
        ✓ Leave application submitted successfully!
        <RouterLink to="/employee/my-leaves" class="ml-2 underline font-medium">View your requests →</RouterLink>
      </div>
      <div v-if="error" class="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
        {{ error }}
      </div>

      <form @submit.prevent="handleSubmit" novalidate>
        <div class="mb-4">
          <label class="form-label">Leave Type</label>
          <select v-model="form.leaveType" class="form-input">
            <option value="">Select leave type</option>
            <option v-for="t in leaveTypes" :key="t" :value="t">{{ t }}</option>
          </select>
          <p v-if="v.leaveType" class="form-error">{{ v.leaveType }}</p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label class="form-label">Start Date</label>
            <input v-model="form.startDate" type="date" class="form-input" :min="today" />
            <p v-if="v.startDate" class="form-error">{{ v.startDate }}</p>
          </div>
          <div>
            <label class="form-label">End Date</label>
            <input v-model="form.endDate" type="date" class="form-input" :min="form.startDate || today" />
            <p v-if="v.endDate" class="form-error">{{ v.endDate }}</p>
          </div>
        </div>

        <div v-if="form.startDate && form.endDate && !v.startDate && !v.endDate" class="mb-4 text-sm text-blue-600 bg-blue-50 rounded px-3 py-2">
          Duration: <strong>{{ totalDays }} day{{ totalDays !== 1 ? 's' : '' }}</strong>
        </div>

        <div class="mb-6">
          <label class="form-label">Reason</label>
          <textarea
            v-model="form.reason"
            rows="4"
            class="form-input resize-none"
            placeholder="Please provide a reason for your leave request (min. 10 characters)"
          ></textarea>
          <p v-if="v.reason" class="form-error">{{ v.reason }}</p>
          <p class="mt-1 text-xs text-gray-400">{{ form.reason.length }} characters</p>
        </div>

        <div class="flex gap-3">
          <button type="submit" class="btn-primary" :disabled="loading">
            {{ loading ? 'Submitting...' : 'Submit Application' }}
          </button>
          <button type="button" class="btn-secondary" @click="resetForm">Reset</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useLeaveStore } from '../../store/leave'

const leaveStore = useLeaveStore()
const leaveTypes = ['Annual', 'Sick', 'Maternity', 'Paternity', 'Unpaid', 'Other']

const today = new Date().toISOString().split('T')[0]

const form = reactive({ leaveType: '', startDate: '', endDate: '', reason: '' })
const v = reactive({ leaveType: '', startDate: '', endDate: '', reason: '' })
const loading = ref(false)
const error = ref('')
const success = ref(false)

const totalDays = computed(() => {
  if (!form.startDate || !form.endDate) return 0
  const diff = new Date(form.endDate) - new Date(form.startDate)
  return Math.ceil(diff / (1000 * 60 * 60 * 24)) + 1
})

function validate() {
  Object.keys(v).forEach((k) => (v[k] = ''))
  let valid = true
  if (!form.leaveType) { v.leaveType = 'Please select a leave type'; valid = false }
  if (!form.startDate) { v.startDate = 'Start date is required'; valid = false }
  else if (form.startDate < today) { v.startDate = 'Start date cannot be in the past'; valid = false }
  if (!form.endDate) { v.endDate = 'End date is required'; valid = false }
  else if (form.endDate < form.startDate) { v.endDate = 'End date must be after start date'; valid = false }
  if (!form.reason.trim()) { v.reason = 'Reason is required'; valid = false }
  else if (form.reason.trim().length < 10) { v.reason = 'Reason must be at least 10 characters'; valid = false }
  return valid
}

async function handleSubmit() {
  success.value = false
  error.value = ''
  if (!validate()) return
  loading.value = true
  try {
    await leaveStore.applyLeave(form)
    success.value = true
    resetForm()
  } catch (err) {
    error.value = leaveStore.error || 'Failed to submit application.'
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.leaveType = ''
  form.startDate = ''
  form.endDate = ''
  form.reason = ''
  Object.keys(v).forEach((k) => (v[k] = ''))
}
</script>
