<template>
  <div id="app" v-bind:style="{ backgroundColor: backgroundColor }">
    <VThemeProvider>
      <router-view></router-view>
    </VThemeProvider>

  </div>
</template>

<script>


export default {

  theme: {
    defaultTheme: 'dark'
  },
  components: {

  },
  data() {
    return {

    };
  },
};
</script>