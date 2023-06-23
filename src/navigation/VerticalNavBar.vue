<template>
  <VNavigationDrawer
    app
    class="drawer"
    :mini-variant="mini.value"
    :width="drawerWidth"
    :value="drawer"
    permanent
  >
    <VBtn
      variant="text"
      color="white"
      class="mt-2"
      @click="toggleDrawer"
      :icon="toggleIcon"
    />

    <VDivider class="divider"></VDivider>

    <VList dense>
      <VListItem
        v-for="(item, index) in menuItems"
        :key="index"
        :to="item.link"
        class="white--text"
      >
        <VListItemIcon class="white--text">
          <VIcon>{{ item.icon }}</VIcon>
        </VListItemIcon>
        <VListItemContent>
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<script setup>
import { ref, computed } from 'vue'

// Data
const drawer = ref(true)
const mini = ref(false)
const menuItems = ref([
  { title: "Start", icon: "mdi-home", link: "/" },
  { title: "Bryły 3D", icon: "mdi-cube-outline", link: "/hand" },
  { title: "Tablica", icon: "mdi-human-male-board", link: "/white-board" },
  { title: "Kształty 2D", icon: "mdi-triangle", link: "/2d-shapes" },
])

// Computed
const toggleIcon = computed(() => (mini.value ? "mdi-chevron-right" : "mdi-chevron-left"))
const drawerWidth = computed(() => (mini.value ? 120 : 56))

// Methods
function toggleDrawer() {
  mini.value = !mini.value
}
</script>

<style scoped>
.drawer {
  background: linear-gradient(to bottom, #673ab7, #512da8);
  box-shadow: 10px 0px 20px rgba(0, 0, 0, 0.15);
}

.divider {
  background: white;
}

.v-list-item {
  transition: background 0.3s ease;
}

.v-list-item:hover {
  background: rgba(255, 255, 255, 0.1);
}
</style>
