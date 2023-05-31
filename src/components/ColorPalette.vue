<template>
    <VRow class="mx-2 mt-2">
        <VCol v-for="(color, index) in colors" :key="index">
            <VCard :color="color" class="pa-1 color-card" @click="selectColor(color)" />
        </VCol>
    </VRow>
</template>
  
<script>
export default {
    name: "ColorPalette",
    props: {
        colors: {
            type: Array,
            required: true,
        },
    },
    methods: {
        selectColor(color) {
            this.$emit("color-selected", color);
        },
    },
};
</script>
  
<style scoped>
.color-card {
    width: 40px;
    height: 40px;
    cursor: pointer;
}
</style>
  