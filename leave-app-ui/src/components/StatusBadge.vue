<template>
  <span :class="badgeClass">{{ status }}</span>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ status: String })
const badgeClass = computed(() => ({
  'badge': true,
  'badge-pending': props.status === 'Pending',
  'badge-approved': props.status === 'Approved',
  'badge-rejected': props.status === 'Rejected',
}))
</script>
