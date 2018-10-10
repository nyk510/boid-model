<template>
  <div>
    <v-jumbotron 
      color="primary" 
      dark>
      <v-container>
        <div class="pb-3">
          <h2 class="display-1">Fish Boid Model</h2>
          <span>群れのシュミレーション</span>
        </div>
      </v-container>
    </v-jumbotron>
    <v-container>
      <boid-canvas/>
    </v-container>
  </div>
</template>

<script>
import BoidCanvas from '@/components/boid/BoidCanvas'
export default {
  components: {
    BoidCanvas
  }
}
</script>
