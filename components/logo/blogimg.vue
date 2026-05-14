<template>
  <!--
    Hero LCP de la home : doit être chargé en priorité (Lighthouse mobile
    remontait LCP 8.8s à cause de loading="lazy" + fetchpriority absent).
    fetchpriority="high" + loading="eager" + le <link rel="preload"> dans
    app.vue (HOME-only via useHead conditionnel) doivent ramener LCP < 2.5s.
  -->
  <img
    src="/images/blog.webp" alt="Blog image" width="1000" height="558" loading="eager" fetchpriority="high" decoding="async"
    class="w-full h-auto rounded-2xl shadow-2xl shadow-indigo-500/20 ring-1 ring-gray-900/5 dark:ring-white/10 hover:scale-[1.02] transition-all duration-500 ease-out"
  >
</template>
