<template>
  <div id="app" v-bind:style="{ backgroundColor: backgroundColor }">
    <VApp>
      <VThemeProvider>
        <router-view></router-view>
      </VThemeProvider>
    </VApp>
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