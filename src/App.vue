<template>
  <div id="app">
    <transition name="fade" mode="out-in">
      <router-view class="router" style="min-height: 100%;background-color: rgba(255, 255, 255, 1)"/>
    </transition>
  </div>
</template>

<style lang="scss">
#app {
  .fade-enter-active, .fade-leave-active {
    transition: opacity .25s;
  }

  .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
  {
    opacity: 0;
  }
}
</style>
