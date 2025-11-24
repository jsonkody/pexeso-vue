<script setup lang="ts">
import { computed } from 'vue';
import type { Card } from '../stores/game';

const props = defineProps<{ card: Card }>()
const emit = defineEmits(['flip'])

const bgImage = computed(() => `url('/images/logos/${props.card.value}.png')`)
</script>

<template>
  <div
    class="relative w-[150px] h-[150px] cursor-pointer perspective-800 select-none"
    @click="emit('flip', card)"
  >
    <div
      class="w-full h-full trans transform-style-3d shadow-xl rounded-lg duration-500"
      :class="{ 'rotate-y-180': card.isFlipped || card.isMatched, 'invisible': card.isMatched && false }"
    >
      <div
        class="absolute w-full h-full backface-hidden rounded-lg bg-indigo-900 shadow-inner"
        style="background-color: #371daa; background-image: url('/images/pexeso.png'); background-repeat: no-repeat; background-position: center; background-size: cover;"
      >
      </div>

      <div
        class="absolute w-full h-full backface-hidden rotate-y-180 rounded-lg overflow-hidden bg-white shadow-md"
      >
        <div
            class="w-full h-full bg-center bg-cover bg-no-repeat"
            :style="{ backgroundImage: bgImage }"
        ></div>
      </div>
    </div>
  </div>
</template>
