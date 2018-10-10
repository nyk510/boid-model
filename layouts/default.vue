<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      temporary
      fixed
      app
    >
      <v-list>
        <v-list-tile
          v-for="(item, i) in items"
          :to="item.to"
          :key="i"
          router
          active-class="primary white--text"
          exact
        >
          <v-list-tile-action>
            <v-icon v-html="item.icon"/>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title v-text="item.title"/>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar 
      fixed 
      app 
      clipped-left
      color="white">
      <v-toolbar-side-icon @click="drawer = !drawer"/>
      <v-toolbar-title v-text="title"/>
    </v-toolbar>
    <v-content>
      <nuxt />
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      drawer: true,
      items: [
        { icon: 'apps', title: 'Welcome', to: '/' },
        { icon: 'info', title: 'About', to: '/about' },
        { icon: 'apps', title: 'Fish Boid Model', to: '/boid' }
      ],
      title: 'NYK510'
    }
  }
}
</script>
