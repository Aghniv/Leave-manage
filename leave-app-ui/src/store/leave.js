import { defineStore } from 'pinia'
import api from '../services/api'

export const useLeaveStore = defineStore('leave', {
  state: () => ({
    leaves: [],
    total: 0,
    page: 1,
    totalPages: 1,
    loading: false,
    error: null,
  }),

  actions: {
    async fetchMyLeaves(params = {}) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/leaves/my', { params })
        this.leaves = data.leaves
        this.total = data.total
        this.page = data.page
        this.totalPages = data.totalPages
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch leaves.'
      } finally {
        this.loading = false
      }
    },

    async fetchAllLeaves(params = {}) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.get('/leaves', { params })
        this.leaves = data.leaves
        this.total = data.total
        this.page = data.page
        this.totalPages = data.totalPages
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to fetch leaves.'
      } finally {
        this.loading = false
      }
    },

    async applyLeave(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/leaves', payload)
        return data
      } catch (err) {
        const errors = err.response?.data?.errors
        this.error = errors ? errors.map((e) => e.msg).join(', ') : err.response?.data?.message || 'Failed to apply for leave.'
        throw err
      } finally {
        this.loading = false
      }
    },

    async reviewLeave(id, payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.patch(`/leaves/${id}/review`, payload)
        // Update local list
        const idx = this.leaves.findIndex((l) => l._id === id)
        if (idx !== -1) this.leaves[idx] = data.leave
        return data
      } catch (err) {
        this.error = err.response?.data?.message || 'Failed to review leave.'
        throw err
      } finally {
        this.loading = false
      }
    },
  },
})
