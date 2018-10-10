<template>
  <div>
    <v-jumbotron 
      color="primary" 
      dark>
      <v-container fill-height>
        <v-layout 
          column 
          justify-center>
          <div>
            <h2 class="display-2">Fish Boid Model</h2>
            <span>群れのシュミレーション</span>
          </div>
        </v-layout>
      </v-container>
    </v-jumbotron>
    <v-container 
      style="margin-top: -150px" 
      class="pa-0"
      grid-list-md>
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
