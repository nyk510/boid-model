<template>
  <div>
    <v-card>
      <v-toolbar card>
        <v-btn @click="onClickAdd">Add</v-btn>
        <v-btn
          :disabled="isRunning" 
          color="primary"
          @click="start">START</v-btn>
        <v-btn 
          :disabled="!isRunning"
          color="primary"
          @click="stop">STOP</v-btn>
      </v-toolbar>
      <div 
        ref="field"
        style="height: 500px">
        <svg 
          width="100%" 
          height="100%">
          <template v-if="field">
            <boid-fish
              v-for="fish in field.fishes"
              :key="fish.id"
              :value="fish"
              :active="fish === selectedFish"
              @select="onSelectFish(fish)"/>
          </template>
        </svg>
      </div>
    </v-card>
    <v-subheader>History Watch</v-subheader>
    <v-select
      v-if="field"
      v-model="fishId"
      :items="fishItems"
      item-text="text"
      item-value="id"/>
    <v-list
      v-if="selectedFish">
      <v-list-tile>
        <v-list-tile-content>
          <v-list-tile-title>
            ID:{{ selectedFish.id }} 索敵範囲 {{ selectedFish.sakuteki }}
          </v-list-tile-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
  </div>
</template>

<script>
import { Field } from '@/models/boid'
import BoidFish from './BoidFish'

export default {
  components: {
    BoidFish
  },
  data() {
    return {
      field: null,
      updateInterval: 10,
      fishId: 0,
      updateTask: null
    }
  },
  computed: {
    isRunning() {
      return this.updateTask !== null
    },
    selectedFish() {
      if (!this.field) return null
      const fish = this.field.fishes.filter(f => f.id === this.fishId)
      if (fish.length) {
        return fish[0]
      }
      return null
    },
    fishItems() {
      if (!this.field) return []

      return this.field.fishes.map(f => {
        return {
          id: f.id,
          text: `おさかな ID ${f.id}`
        }
      })
    }
  },
  watch: {
    fishId(val) {
      if (val) {
        this.stop()
      }
    }
  },
  mounted() {
    this.init()
    this.start()
  },
  methods: {
    init() {
      const fieldDom = this.$refs.field
      this.field = new Field(fieldDom.offsetWidth, fieldDom.offsetHeight, 100)
      for (let i = 0; i < 30; i++) {
        this.field.addFish()
      }
    },
    onClickNext() {
      this.field.next()
    },
    stop() {
      if (!this.updateTask) return
      window.clearInterval(this.updateTask)
      this.updateTask = null
    },
    start() {
      this.fishId = null
      this.updateTask = window.setInterval(() => {
        this.field.next()
      }, this.updateInterval)
    },
    onClickAdd() {
      this.field.addFish()
    },
    onSelectFish(v) {
      this.fishId = v.id
    }
  }
}
</script>
