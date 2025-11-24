<script setup lang="ts">
// ... importy a logika beze změny ...
// (Ujisti se, že imports obsahují computed atd.)
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from '../stores/game'
import CardComponent from './Card.vue'

const store = useGameStore()
// ... zbytek scriptu beze změny ...
const CARD_SIZE = 150
const GAP = 16

const winSize = ref({ w: window.innerWidth, h: window.innerHeight })
const updateSize = () => {
  winSize.value = { w: window.innerWidth, h: window.innerHeight }
}

onMounted(() => window.addEventListener('resize', updateSize))
onUnmounted(() => window.removeEventListener('resize', updateSize))

const layout = computed(() => {
  const count = store.cards.length
  const { w, h } = winSize.value
  const availableH = h - 60
  const screenRatio = w / availableH

  let cols = Math.round(Math.sqrt(count * screenRatio))
  cols = Math.max(2, cols)
  const rows = Math.ceil(count / cols)

  return { cols, rows }
})

const boardScale = computed(() => {
  const { cols, rows } = layout.value
  const { w, h } = winSize.value
  const boardW = cols * CARD_SIZE + (cols - 1) * GAP + 40
  const boardH = rows * CARD_SIZE + (rows - 1) * GAP + 40 + 50
  const scaleX = w / boardW
  const scaleY = h / boardH
  return Math.min(1, scaleX, scaleY)
})

const gridStyle = computed(() => {
  return {
    gridTemplateColumns: `repeat(${layout.value.cols}, ${CARD_SIZE}px)`,
    gap: `${GAP}px`,
    transform: `scale(${boardScale.value})`,
    transformOrigin: 'center center',
  }
})
</script>

<template>
  <div class="flex flex-col h-screen w-screen overflow-hidden bg-stone-900 text-white bg-[url('/images/wood.jpg')] bg-cover bg-center font-asap">

    <header class="group trans flex-none h-7 flex items-center justify-between px-6 z-20 opacity-40 hover:opacity-100 bg-black/80 backdrop-blur-lg fixed top-0 w-full left-0 hover:bg-black/90 border-b border-white/5">

      <div class="trans font-asap font-bold italic text-sm group-hover:text-amber-500 w-32 tracking-wider flex items-center gap-2">
          <span class="text-white/40 not-italic font-normal text-xs">TIME</span>
          {{ store.formattedDuration }}
      </div>

      <div v-if="!store.isFreePlay" class="flex gap-8 text-sm font-bold uppercase tracking-wider">
        <div
          v-for="p in store.players"
          :key="p.id"
          class="transition-all duration-300 px-3 py-0.5 rounded-md flex items-center gap-2"
          :class="{
            'text-yellow-400 bg-white/10 scale-105': store.currentPlayer?.id === p.id,
            'text-gray-500': store.currentPlayer?.id !== p.id,
          }"
        >
          <span class="font-asap italic">{{ p.name }}</span>
          <span class="bg-black/40 px-1.5 rounded text-xs">{{ p.score }}</span>
        </div>
      </div>

      <div class="w-32 flex justify-end">
        <button
            @click="store.resetGame()"
            class="px-3 py-1 cursor-pointer text-[10px] font-bold uppercase tracking-widest text-white/40 group-hover:text-white hover:bg-red-600/80 rounded transition-all font-asap"
        >
            Ukončit
        </button>
      </div>
    </header>

    <main class="flex-grow w-full h-full flex items-center justify-center overflow-hidden relative pt-10">
      <div class="grid transition-transform duration-300 ease-out p-4" :style="gridStyle">
        <CardComponent
          v-for="card in store.cards"
          :key="card.id"
          :card="card"
          @flip="store.flipCard"
        />
      </div>
    </main>

    <div v-if="store.gameStatus === 'finished'" class="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-50">
      <div class="bg-stone-800 p-10 rounded-2xl border border-stone-600 shadow-2xl text-center max-w-md w-full mx-4">
        <h2 class="text-4xl font-asap font-black italic text-amber-500 mb-8">KONEC HRY</h2>

        <div class="space-y-3 mb-8 text-left text-base" v-if="!store.isFreePlay">
             <div v-for="p in store.players" :key="p.id" class="flex justify-between border-b border-stone-700 pb-3 items-end">
                <span class="text-stone-300 font-asap">{{ p.name }}</span>
                <div class="text-right">
                    <span class="block font-bold text-yellow-500 text-xl font-asap italic">{{ p.score }} bodů</span>
                    <span class="text-xs text-stone-500">{{ store.formatTime(p.totalTime) }}</span>
                </div>
             </div>
        </div>

        <div class="mb-8 p-4 bg-black/40 rounded-lg text-center">
            <span class="text-xs text-stone-500 uppercase tracking-widest block mb-1">Celkový čas</span>
            <span class="text-2xl font-asap font-bold italic text-white">{{ store.formattedDuration }}</span>
        </div>

        <button
          @click="store.resetGame()"
          class="bg-emerald-700 hover:bg-emerald-600 text-white text-lg px-8 py-3 rounded-xl shadow-lg font-asap font-bold italic w-full transition-colors tracking-wide"
        >
          ZPĚT DO MENU
        </button>
      </div>
    </div>
  </div>
</template>
