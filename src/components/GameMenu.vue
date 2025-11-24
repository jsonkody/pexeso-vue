<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore, LANGUAGES } from '../stores/game'

const store = useGameStore()

const difficulties = [
  { label: 'Easy (12)', count: 12 },
  { label: 'Medium (18)', count: 18 },
  { label: 'Hard (24)', count: 24 },
  { label: 'MAX', count: LANGUAGES.length },
]

const selectedDifficulty = ref(difficulties[1])

// Font Asap, italic a bold pro dynamičtější vzhled tlačítek
const btnBase =
  'w-full py-3 px-4 rounded-xl font-asap font-bold italic text-lg transition-all shadow-lg hover:scale-105 cursor-pointer tracking-wide'
const btnPrimary = `${btnBase} bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/50`
const btnSecondary = `${btnBase} bg-stone-700 hover:bg-stone-600 text-stone-200 border border-stone-600 shadow-stone-900/50`
</script>

<template>
  <div
    class="fixed inset-0 flex flex-col items-center justify-center bg-stone-900 text-white bg-[url('/images/wood.jpg')] bg-cover bg-center select-none"
  >
    <div
      class="bg-black/80 p-12 rounded-3xl backdrop-blur-xl shadow-2xl border border-white/10 text-center max-w-sm w-full mx-4"
    >
      <h1
        class="text-6xl font-asap font-black italic mb-2 text-transparent bg-clip-text bg-linear-to-b from-amber-400 to-amber-700 tracking-tighter drop-shadow-sm"
      >
        PEXESO
      </h1>
      <p
        class="text-stone-500 mb-8 font-asap font-medium text-sm tracking-widest uppercase opacity-70"
      >
        Dev Edition
      </p>

      <div class="mb-8 flex justify-center p-1 rounded-lg bg-stone-900/80 border border-white/5">
        <button
          v-for="diff in difficulties"
          :key="diff.label"
          @click="selectedDifficulty = diff"
          class="px-3 py-1.5 text-xs font-asap font-bold transition-all rounded-md cursor-pointer"
          :class="
            selectedDifficulty.count === diff.count
              ? 'bg-amber-600 text-white shadow-lg scale-105'
              : 'text-stone-500 hover:text-stone-300'
          "
        >
          {{ diff.label.split(' ')[0] }}
        </button>
      </div>

      <div class="flex flex-col gap-4">
        <button
          @click="store.initializeGame(1, true, selectedDifficulty.count)"
          :class="btnPrimary"
        >
          FREE PLAY
        </button>

        <div class="relative py-2">
          <div class="absolute inset-0 flex items-center">
            <span class="w-full border-t border-white/10"></span>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-black/0 px-2 text-stone-600 font-asap font-bold">Multiplayer</span>
          </div>
        </div>

        <button
          @click="store.initializeGame(2, false, selectedDifficulty.count)"
          :class="btnSecondary"
        >
          2 Hráči
        </button>
        <button
          @click="store.initializeGame(3, false, selectedDifficulty.count)"
          :class="btnSecondary"
        >
          3 Hráči
        </button>
        <button
          @click="store.initializeGame(4, false, selectedDifficulty.count)"
          :class="btnSecondary"
        >
          4 Hráči
        </button>
      </div>
    </div>
  </div>
</template>
