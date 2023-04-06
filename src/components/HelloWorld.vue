<template>
  <vContainer class="text-center">
    <h1>Welcome</h1>
    <p>Please choose an option:</p>
    <VBtn color="primary" to="/hand">Create 3D Shapes</VBtn>
    <VBtn color="secondary" @click="notImplemented" class="mx-2">Use Whiteboard</VBtn>
  </vContainer>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  methods: {
    notImplemented() {
      alert('This feature is not implemented yet.')
    },
  },
  mounted() {
    document.body.style.backgroundColor = '#f5f5f5'; // Change this to your desired color
  },
})
</script>
