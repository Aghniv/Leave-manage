<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Employer Dashboard</h2>

    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
      <div class="card text-center">
        <p class="text-3xl font-bold text-yellow-500">{{ counts.Pending }}</p>
        <p class="text-sm text-gray-500 mt-1">Pending Review</p>
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
        <h3 class="text-lg font-semibold text-gray-700">Pending Requests</h3>
        <RouterLink to="/employer/requests" class="text-sm text-blue-600 hover:underline">View all →</RouterLink>
      </div>

      <div v-if="leaveStore.loading" class="text-center py-8 text-gray-400">Loading...</div>
      <div v-else-if="!pendingLeaves.length" class="text-center py-8 text-gray-400">No pending leave requests.</div>
      <div v-else class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b border-gray-100">
              <th class="text-left py-2 px-3 text-gray-500 font-medium">Employee</th>
              <th class="text-left py-2 px-3 text-gray-500 font-medium">Type</th>
              <th class="text-left py-2 px-3 text-gray-500 font-medium">Period</th>
              <th class="text-left py-2 px-3 text-gray-500 font-medium">Days</th>
              <th class="text-left py-2 px-3 text-gray-500 font-medium">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="leave in pendingLeaves.slice(0, 5)" :key="leave._id" class="border-b border-gray-50 hover:bg-gray-50">
              <td class="py-2 px-3">
                <p class="font-medium">{{ leave.employee?.name }}</p>
                <p class="text-xs text-gray-400">{{ leave.employee?.department || 'N/A' }}</p>
              </td>
              <td class="py-2 px-3">{{ leave.leaveType }}</td>
              <td class="py-2 px-3 text-gray-600">{{ formatDate(leave.startDate) }} – {{ formatDate(leave.endDate) }}</td>
              <td class="py-2 px-3">{{ leave.totalDays }}</td>
              <td class="py-2 px-3">
                <RouterLink to="/employer/requests" class="text-blue-600 hover:underline text-xs">Review</RouterLink>
              </td>
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

const leaveStore = useLeaveStore()

onMounted(() => leaveStore.fetchAllLeaves({ limit: 50 }))

const pendingLeaves = computed(() => leaveStore.leaves.filter((l) => l.status === 'Pending'))
const counts = computed(() => {
  const c = { Pending: 0, Approved: 0, Rejected: 0 }
  leaveStore.leaves.forEach((l) => c[l.status]++)
  return c
})

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
</script>
