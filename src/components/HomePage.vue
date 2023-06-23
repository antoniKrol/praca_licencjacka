<template>
  <VMain>
    <VContainer class="text-center">
      <h1>Wybierz:</h1>
      <VSpacer></VSpacer>
      <VRow class="mt-4">
        <VCard class="mx-auto" max-width="344" variant="outlined">
          <VCardItem>
            <div>
              <div class="text-h6 mb-1">Tworzenie brył 3D</div>
              <div class="text-caption">
                Twórz bryły przy użyciu kamery oraz dłoni
              </div>
            </div>
          </VCardItem>
          <VCardActions class="justify-center">
            <VBtn variant="outlined" color="on-surface" to="/hand"
              >Tworzenie brył 3D</VBtn
            >
          </VCardActions>
        </VCard>
        <VCard class="mx-auto" max-width="344" variant="outlined">
          <VCardItem>
            <div>
              <div class="text-h6 mb-1">Pisanie po szkle</div>
              <div class="text-caption">
                Pisz w powietrzu tak jak na tablicy
              </div>
            </div>
          </VCardItem>
          <VCardActions class="justify-center">
            <VBtn
              variant="outlined"
              color="on-surface"
              to="/white-board"
              class="mx-2"
              >Pisanie po "szkle"</VBtn
            >
          </VCardActions>
        </VCard>
        <VCard class="mx-auto" max-width="344" variant="outlined">
          <VCardItem>
            <div>
              <div class="text-h6 mb-1">Kształty 2D</div>
              <div class="text-caption">Twórz kształty w przestrzeni 2D</div>
            </div>
          </VCardItem>
          <VCardActions class="justify-center">
            <VBtn variant="outlined" color="on-surface" to="/2d-shapes"
              >Tworzenie brył 2D</VBtn
            >
          </VCardActions>
        </VCard>
      </VRow>
    </VContainer>
  </VMain>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  methods: {
    notImplemented() {
      alert("This feature is not implemented yet.");
    },
  },
});
</script>
