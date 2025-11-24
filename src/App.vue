<script setup lang="ts">
import { useGameStore } from './stores/game'
import GameMenu from './components/GameMenu.vue'
import GameBoard from './components/GameBoard.vue'

const store = useGameStore()
</script>

<template>
  <transition name="fade" mode="out-in">
    <GameMenu v-if="store.gameStatus === 'menu'" />
    <GameBoard v-else />
  </transition>
</template>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
