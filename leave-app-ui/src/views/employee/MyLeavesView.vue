<template>
  <div>
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold text-gray-800">My Leave Requests</h2>
      <RouterLink to="/employee/apply" class="btn-primary">+ New Application</RouterLink>
    </div>

    <!-- Filters -->
    <div class="card mb-6">
      <div class="flex flex-wrap gap-2">
        <button
          v-for="s in statusOptions"
          :key="s.value"
          @click="filterStatus = s.value; loadLeaves()"
          :class="['btn text-xs', filterStatus === s.value ? 'btn-primary' : 'btn-secondary']"
        >
          {{ s.label }}
        </button>
      </div>
    </div>

    <div v-if="leaveStore.loading" class="text-center py-12 text-gray-400">Loading...</div>

    <div v-else-if="!leaveStore.leaves.length" class="card text-center py-12 text-gray-400">
      No leave requests found.
      <RouterLink to="/employee/apply" class="text-blue-600 hover:underline ml-1">Apply now</RouterLink>
    </div>

    <div v-else class="space-y-3">
      <div v-for="leave in leaveStore.leaves" :key="leave._id" class="card hover:shadow-md transition-shadow">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="font-semibold text-gray-800">{{ leave.leaveType }} Leave</span>
              <StatusBadge :status="leave.status" />
            </div>
            <p class="text-sm text-gray-500">
              {{ formatDate(leave.startDate) }} → {{ formatDate(leave.endDate) }}
              <span class="ml-2 text-gray-400">({{ leave.totalDays }} day{{ leave.totalDays !== 1 ? 's' : '' }})</span>
            </p>
            <p class="text-sm text-gray-600 mt-1">{{ leave.reason }}</p>
          </div>
          <div class="text-right text-xs text-gray-400">
            <p>Applied {{ formatDate(leave.createdAt) }}</p>
          </div>
        </div>

        <div v-if="leave.status !== 'Pending'" class="mt-3 pt-3 border-t border-gray-100 text-sm">
          <span class="text-gray-500">Reviewed by <strong class="text-gray-700">{{ leave.reviewedBy?.name || 'N/A' }}</strong></span>
          <span v-if="leave.reviewNote" class="ml-3 text-gray-600 italic">"{{ leave.reviewNote }}"</span>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="leaveStore.totalPages > 1" class="flex justify-center gap-2 mt-6">
      <button
        v-for="p in leaveStore.totalPages"
        :key="p"
        @click="goToPage(p)"
        :class="['btn text-xs', p === leaveStore.page ? 'btn-primary' : 'btn-secondary']"
      >{{ p }}</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLeaveStore } from '../../store/leave'
import StatusBadge from '../../components/StatusBadge.vue'

const leaveStore = useLeaveStore()
const filterStatus = ref('')
const statusOptions = [
  { label: 'All', value: '' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Rejected', value: 'Rejected' },
]

function loadLeaves(page = 1) {
  leaveStore.fetchMyLeaves({ status: filterStatus.value || undefined, page })
}

function goToPage(p) {
  loadLeaves(p)
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => loadLeaves())
</script>
