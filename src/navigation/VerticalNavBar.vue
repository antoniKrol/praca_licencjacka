<template>
  <VNavigationDrawer app :mini-variant="mini" :width="drawerWidth" :value="drawer" permanent>
    <VBtn variant="text" color="primary" @click="toggleDrawer" :icon="toggleIcon" />

    <VDivider></VDivider>
    <VList dense>
      <VListItem v-for="(item, index) in menuItems" :key="index" :to="item.link">
        <VListItemIcon>
          <VIcon>{{ item.icon }}</VIcon>
        </VListItemIcon>
        <VListItemContent>
          <VListItemTitle>{{ item.title }}</VListItemTitle>
        </VListItemContent>
      </VListItem>
    </VList>
  </VNavigationDrawer>
</template>

<script>
export default {
  name: "VerticalNavigation",
  data() {
    return {
      drawer: true,
      mini: false,
      menuItems: [
        { title: "Start", icon: "mdi-home", link: "/" },
        { title: "Bryły 3D", icon: "mdi-hand-back-left", link: "/hand" },
        {
          title: "Whiteboard",
          icon: "mdi-human-male-board",
          link: "/white-board",
        },
      ],
    };
  },
  computed: {
    toggleIcon() {
      return this.mini ? "mdi-chevron-right" : "mdi-chevron-left";
    },
    drawerWidth() {
      return this.mini ? 56 : 240;
    },
  },
  methods: {
    toggleDrawer() {
      this.mini = !this.mini;
    },
  },
};
</script>
