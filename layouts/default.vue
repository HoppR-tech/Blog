<template>
  <div class="gd-container mt-16 sm:mt-18 md:mt-20 lg:mt-24 font-luciole">
    <header class="fixed w-full bg-[#F1F2F4] dark:bg-slate-950 z-10">
      <MainHeader />
    </header>
    <main id="main">
      <slot />
    </main>
    <footer>
      <MainFooter />
    </footer>
  </div>
</template>

<style scoped>
#main{
  margin-top: 40px;
}

.gd-container {
  display: grid;
  grid-template-rows: 1fr auto;
  min-height: 100vh;
}
</style>
