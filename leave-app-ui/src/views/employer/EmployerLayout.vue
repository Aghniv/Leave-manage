<template>
  <div class="min-h-screen bg-gray-50">
    <NavBar :links="navLinks" />
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import NavBar from '../../components/NavBar.vue'
import { RouterView } from 'vue-router'

const navLinks = [
  { to: '/employer/dashboard', label: 'Dashboard' },
  { to: '/employer/requests', label: 'Leave Requests' },
]
</script>
