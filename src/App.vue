<template>
  <VApp>
    <VerticalNavBar />
    <VMain>
      <VThemeProvider>
        <RouterView />
      </VThemeProvider>
    </VMain>
  </VApp>
</template>

<script>
import VerticalNavBar from "./navigation/VerticalNavBar.vue";
export default {
  components: {
    VerticalNavBar,
  },
  data() {
    return {};
  },
};
</script>
