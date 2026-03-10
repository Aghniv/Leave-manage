import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    loading: false,
    error: null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    isEmployee: (state) => state.user?.role === 'employee',
    isEmployer: (state) => state.user?.role === 'employer',
  },

  actions: {
    async signup(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/auth/signup', payload)
        this._setSession(data)
        return data
      } catch (err) {
        this.error = this._parseError(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async login(payload) {
      this.loading = true
      this.error = null
      try {
        const { data } = await api.post('/auth/login', payload)
        this._setSession(data)
        return data
      } catch (err) {
        this.error = this._parseError(err)
        throw err
      } finally {
        this.loading = false
      }
    },

    logout() {
      this.user = null
      this.token = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    _setSession({ token, user }) {
      this.token = token
      this.user = user
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
    },

    _parseError(err) {
      if (err.response?.data?.errors) {
        return err.response.data.errors.map((e) => e.msg).join(', ')
      }
      return err.response?.data?.message || 'Something went wrong.'
    },
  },
})
