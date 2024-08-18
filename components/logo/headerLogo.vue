<script setup lang="ts">
defineProps({
  width: {
    type: [Number, String],
    default: 50,
  },
  height: {
    type: [Number, String],
    default: 50,
  },
  class: {
    type: String,
    default: '',
  },
})
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" :width="width" :height="height"
    viewBox="0 0 375 375" preserveAspectRatio="xMidYMid meet" :class="$attrs.class"
  >
    <defs>
      <clipPath id="logo-clip-path">
        <path d="M 23.695312 0 L 351.445312 0 L 351.445312 375 L 23.695312 375 Z M 23.695312 0 " clip-rule="nonzero" />
      </clipPath>
    </defs>
    <g clip-path="url(#logo-clip-path)">
      <image x="0" y="0" width="375" height="375" xlink:href="/images/logo-header.webp" preserveAspectRatio="xMidYMid meet" />
    </g>
  </svg>
</template>
