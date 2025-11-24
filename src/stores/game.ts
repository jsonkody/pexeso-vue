import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useIntervalFn } from '@vueuse/core'

export interface Card {
  id: string
  value: string
  isFlipped: boolean
  isMatched: boolean
}

export interface Player {
  id: number
  name: string
  score: number
  totalTime: number
}

// Exportujeme, abychom mohli v menu zjistit maximální počet
export const LANGUAGES = [
  'bash',
  'c',
  'cpp',
  'crystal',
  'csharp',
  'elixir',
  'git',
  'go',
  'haskell',
  'java',
  'javascript',
  'kotlin',
  'python',
  'ruby',
  'swift',
  'rust',
  'matlab',
  'fsharp',
  'lua',
  'scala',
  'haxe',
  'powershell',
  'ocaml',
  'perl',
  'dart',
  'coffeescript',
  'wolframmathematica',
]

export const useGameStore = defineStore('game', () => {
  const cards = ref<Card[]>([])
  const players = ref<Player[]>([])
  const currentPlayerIndex = ref(0)
  const isFreePlay = ref(false)
  const gameStatus = ref<'menu' | 'playing' | 'finished'>('menu')
  const flippedCards = ref<Card[]>([])
  const gameStartTime = ref(0)
  const gameDuration = ref(0)
  const turnStartTime = ref(0)

  const audioCoin = new Audio('/audio/coins.wav')
  const audioFlip = new Audio('/audio/flipCard.wav')

  const { pause: pauseTimer, resume: resumeTimer } = useIntervalFn(
    () => {
      if (gameStatus.value === 'playing') {
        gameDuration.value = Math.floor((Date.now() - gameStartTime.value) / 1000)
      }
    },
    1000,
    { immediate: false },
  )

  const currentPlayer = computed(() => players.value[currentPlayerIndex.value])
  const isGameFinished = computed(
    () => cards.value.length > 0 && cards.value.every((c) => c.isMatched),
  )

  function initializeGame(playerCount: number, freePlay: boolean, pairCount: number) {
    isFreePlay.value = freePlay
    gameStatus.value = 'playing'
    players.value = []
    flippedCards.value = []

    // Setup players
    if (freePlay) {
      players.value.push({ id: 1, name: 'Free Play', score: 0, totalTime: 0 })
    } else {
      for (let i = 1; i <= playerCount; i++) {
        players.value.push({ id: i, name: `Hráč ${i}`, score: 0, totalTime: 0 })
      }
    }

    // Setup Cards - Difficulty logic
    // Pokud je pairCount větší než máme jazyků, ořízneme to na max (bezpečné)
    const count = Math.min(pairCount, LANGUAGES.length)

    const selectedLangs = [...LANGUAGES].sort(() => 0.5 - Math.random()).slice(0, count)

    const deck = [...selectedLangs, ...selectedLangs]
      .sort(() => 0.5 - Math.random())
      .map((lang, index) => ({
        id: `card-${index}`,
        value: lang,
        isFlipped: false,
        isMatched: false,
      }))

    cards.value = deck
    currentPlayerIndex.value = 0
    gameStartTime.value = Date.now()
    turnStartTime.value = Date.now()
    gameDuration.value = 0
    resumeTimer()
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0')
    const s = (Math.round(seconds) % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  const formattedDuration = computed(() => {
    const m = Math.floor(gameDuration.value / 60)
      .toString()
      .padStart(2, '0')
    const s = (gameDuration.value % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  })

  async function flipCard(card: Card) {
    if (card.isMatched || card.isFlipped || flippedCards.value.length >= 2) return

    audioFlip.currentTime = 0
    audioFlip.play().catch(() => {})

    card.isFlipped = true
    flippedCards.value.push(card)

    if (flippedCards.value.length === 2) {
      checkMatch()
    }
  }

  function checkMatch() {
    // 1. Ochrana: Pokud z nějakého důvodu nejsou 2 karty, skončíme
    if (flippedCards.value.length !== 2) return

    // 2. Bezpečné rozbalení: TS teď ví, že pole má délku 2, ale pro jistotu typování:
    const c1 = flippedCards.value[0]
    const c2 = flippedCards.value[1]

    // 3. Další ochrana (pro TS satisfakci), kdyby v poli bylo undefined
    if (!c1 || !c2) return

    const turnDuration = (Date.now() - turnStartTime.value) / 1000

    // 4. Bezpečná aktualizace času hráče
    if (!isFreePlay.value) {
      const currentPlayerObj = players.value[currentPlayerIndex.value]
      // Pokud hráč existuje (což by měl), přičteme čas
      if (currentPlayerObj) {
        currentPlayerObj.totalTime += turnDuration
      }
    }

    turnStartTime.value = Date.now()

    if (c1.value === c2.value) {
      setTimeout(() => {
        // Tady už TS ví, že c1 a c2 existují díky podmínce nahoře
        c1.isMatched = true
        c2.isMatched = true
        flippedCards.value = []

        // Bezpečné přičtení skóre
        const p = players.value[currentPlayerIndex.value]
        if (p) p.score++

        audioCoin.currentTime = 0
        audioCoin.play().catch(() => {})

        if (isGameFinished.value) {
          endGame()
        }
      }, 500)
    } else {
      setTimeout(() => {
        c1.isFlipped = false
        c2.isFlipped = false
        flippedCards.value = []

        if (!isFreePlay.value) {
            currentPlayerIndex.value = (currentPlayerIndex.value + 1) % players.value.length
        }
      }, 1200)
    }
  }

  function endGame() {
    gameStatus.value = 'finished'
    pauseTimer()
  }

  function resetGame() {
    gameStatus.value = 'menu'
    cards.value = []
    flippedCards.value = []
  }

  return {
    cards,
    players,
    currentPlayer,
    isFreePlay,
    gameStatus,
    gameDuration,
    formattedDuration,
    formatTime,
    initializeGame,
    flipCard,
    resetGame,
  }
})
