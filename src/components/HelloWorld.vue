<template>
  <VMain>
    <VContainer class="text-center">
      <h1>Wybierz:</h1>
      <VSpacer></VSpacer>
      <VBtn color="primary" to="/hand">Tworzenie brył 3D</VBtn>
      <VBtn color="secondary" @click="notImplemented" class="mx-2">Pisanie po "szkle"</VBtn>
    </VContainer>
  </VMain>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    notImplemented() {
      alert('This feature is not implemented yet.')
    },
  },
})
</script>
