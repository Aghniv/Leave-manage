<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="card text-center">
        <p class="text-3xl font-bold text-yellow-500">{{ counts.Pending }}</p>
        <p class="text-sm text-gray-500 mt-1">Pending</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-green-600">{{ counts.Approved }}</p>
        <p class="text-sm text-gray-500 mt-1">Approved</p>
      </div>
      <div class="card text-center">
        <p class="text-3xl font-bold text-red-500">{{ counts.Rejected }}</p>
        <p class="text-sm text-gray-500 mt-1">Rejected</p>
      </div>
    </div>

    <div class="card">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-gray-700">Recent Applications</h3>
        <RouterLink to="/employee/apply" class="btn-primary text-xs">+ Apply for Leave</RouterLink>
      </div>

      <div v-if="leaveStore.loading" class="text-center py-8 text-gray-400">Loading...</div>
      <div v-else-if="!leaveStore.leaves.length" class="text-center py-8 text-gray-400">
        No leave applications yet.
        <RouterLink to="/employee/apply" class="text-blue-600 hover:underline ml-1">Apply now</RouterLink>
      </div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left py-2 px-3 text-gray-500 font-medium">Type</th>
              <th class="text-left py-2 px-3 text-gray-500 font-medium">Start</th>
              <th class="text-left py-2 px-3 text-gray-500 font-medium">End</th>
              <th class="text-left py-2 px-3 text-gray-500 font-medium">Days</th>
              <th class="text-left py-2 px-3 text-gray-500 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="leave in leaveStore.leaves.slice(0, 5)" :key="leave._id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-2 px-3 font-medium">{{ leave.leaveType }}</td>
              <td class="py-2 px-3 text-gray-600">{{ formatDate(leave.startDate) }}</td>
              <td class="py-2 px-3 text-gray-600">{{ formatDate(leave.endDate) }}</td>
              <td class="py-2 px-3 text-gray-600">{{ leave.totalDays }}</td>
              <td class="py-2 px-3"><StatusBadge :status="leave.status" /></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useLeaveStore } from '../../store/leave'
import StatusBadge from '../../components/StatusBadge.vue'

const leaveStore = useLeaveStore()

onMounted(() => leaveStore.fetchMyLeaves({ limit: 20 }))

const counts = computed(() => {
  const c = { Pending: 0, Approved: 0, Rejected: 0 }
  leaveStore.leaves.forEach((l) => c[l.status]++)
  return c
})

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
