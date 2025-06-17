<template>
  <div class="bg-mesh min-h-screen">
    <slot />
  </div>
</template>

<style lang="css">
.bg-mesh {
  background: radial-gradient(at 67% 99%, #eef5ff 0px, transparent 50%), radial-gradient(at 100% 79%, #bfd6f5 0px, transparent 50%), radial-gradient(at 22% 42%, #a3c5f0 0px, transparent 50%), radial-gradient(at 81% 72%, #6996a5 0px, transparent 50%), #eef5ff;
}
</style>
