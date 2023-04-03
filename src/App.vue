<template>
  <div id="app" v-bind:style="{ backgroundColor: backgroundColor }">
    <!-- Your other components here -->
    <HandRecognition />
  </div>
</template>

<script>
import HandRecognition from './components/HandRecognition.vue';

export default {
  components: {
    HandRecognition,
  },
  data() {
    return {

    };
  },
};
</script>