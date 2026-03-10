<template>
  <div>
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Leave Requests</h2>

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
    </div>

    <div v-else class="space-y-3">
      <div v-for="leave in leaveStore.leaves" :key="leave._id" class="card">
        <div class="flex flex-wrap items-start justify-between gap-3">
          <div class="flex-1 min-w-0">
            <div class="flex flex-wrap items-center gap-2 mb-1">
              <span class="font-semibold text-gray-800">{{ leave.employee?.name }}</span>
              <span class="text-gray-400">·</span>
              <span class="text-sm text-gray-500">{{ leave.employee?.department || 'No Department' }}</span>
              <StatusBadge :status="leave.status" />
            </div>
            <p class="text-sm font-medium text-gray-700">
              {{ leave.leaveType }} Leave —
              {{ formatDate(leave.startDate) }} to {{ formatDate(leave.endDate) }}
              <span class="text-gray-400 font-normal ml-1">({{ leave.totalDays }} day{{ leave.totalDays !== 1 ? 's' : '' }})</span>
            </p>
            <p class="text-sm text-gray-500 mt-1">{{ leave.reason }}</p>
          </div>

          <div class="flex gap-2 shrink-0">
            <template v-if="leave.status === 'Pending'">
              <button @click="openModal(leave, 'Approved')" class="btn-success text-xs">Approve</button>
              <button @click="openModal(leave, 'Rejected')" class="btn-danger text-xs">Reject</button>
            </template>
            <span v-else class="text-xs text-gray-400 italic">
              {{ leave.status }} by {{ leave.reviewedBy?.name || 'N/A' }}
            </span>
          </div>
        </div>

        <div v-if="leave.reviewNote" class="mt-2 text-sm text-gray-500 italic border-t border-gray-50 pt-2">
          Note: "{{ leave.reviewNote }}"
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

    <!-- Review Modal -->
    <div v-if="modal.open" class="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div class="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h3 class="text-lg font-bold text-gray-800 mb-1">
          {{ modal.status === 'Approved' ? '✓ Approve' : '✗ Reject' }} Leave Request
        </h3>
        <p class="text-sm text-gray-500 mb-4">
          {{ modal.leave?.employee?.name }} · {{ modal.leave?.leaveType }} · {{ formatDate(modal.leave?.startDate) }} – {{ formatDate(modal.leave?.endDate) }}
        </p>

        <div v-if="modal.error" class="mb-3 p-2 bg-red-50 text-red-600 text-sm rounded">{{ modal.error }}</div>

        <div class="mb-4">
          <label class="form-label">Review Note <span class="text-gray-400 font-normal">(optional)</span></label>
          <textarea v-model="modal.note" rows="3" class="form-input resize-none" placeholder="Add a note..."></textarea>
        </div>

        <div class="flex gap-3">
          <button
            @click="submitReview"
            :class="modal.status === 'Approved' ? 'btn-success' : 'btn-danger'"
            :disabled="modal.loading"
          >
            {{ modal.loading ? 'Processing...' : `Confirm ${modal.status}` }}
          </button>
          <button @click="modal.open = false" class="btn-secondary">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
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

const modal = reactive({ open: false, leave: null, status: '', note: '', loading: false, error: '' })

function loadLeaves(page = 1) {
  leaveStore.fetchAllLeaves({ status: filterStatus.value || undefined, page })
}

function goToPage(p) {
  loadLeaves(p)
}

function openModal(leave, status) {
  modal.open = true
  modal.leave = leave
  modal.status = status
  modal.note = ''
  modal.error = ''
}

async function submitReview() {
  modal.loading = true
  modal.error = ''
  try {
    await leaveStore.reviewLeave(modal.leave._id, { status: modal.status, reviewNote: modal.note })
    modal.open = false
  } catch {
    modal.error = leaveStore.error || 'Failed to review leave.'
  } finally {
    modal.loading = false
  }
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}

onMounted(() => loadLeaves())
</script>
