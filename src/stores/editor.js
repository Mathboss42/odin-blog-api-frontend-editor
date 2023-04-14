import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useEditorStore = defineStore('editor', () => {
  const isLoggedIn = ref(false)

  return { isLoggedIn }
})
