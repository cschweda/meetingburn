<script setup lang="ts">
const props = defineProps<{
  score: number
  size?: number
}>()

const size = computed(() => props.size ?? 120)

const ringColor = computed(() => {
  if (props.score >= 90) return '#0cce6b'
  if (props.score >= 50) return '#f9ab00'
  return '#ea4335'
})
</script>

<template>
  <div class="relative inline-flex items-center justify-center" :style="{ width: size + 'px', height: size + 'px' }">
    <svg
      class="size-full -rotate-90"
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <!-- Background ring -->
      <circle
        cx="60"
        cy="60"
        :r="54"
        stroke="currentColor"
        stroke-width="12"
        class="text-muted/30"
      />
      <!-- Colored score ring -->
      <circle
        cx="60"
        cy="60"
        :r="54"
        :stroke="ringColor"
        stroke-width="12"
        stroke-linecap="round"
        fill="none"
        :stroke-dasharray="2 * Math.PI * 54"
        :stroke-dashoffset="2 * Math.PI * 54 * (1 - score / 100)"
      />
    </svg>
    <span
      class="absolute inset-0 flex items-center justify-center text-4xl font-bold tabular-nums"
      :class="{
        'text-[#0cce6b]': score >= 90,
        'text-[#f9ab00]': score >= 50 && score < 90,
        'text-[#ea4335]': score < 50,
      }"
    >
      {{ score }}
    </span>
  </div>
</template>
