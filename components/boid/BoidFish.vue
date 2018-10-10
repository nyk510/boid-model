<template>
  <g
    v-if="value">
    <circle
      :cx="value.position.x"
      :cy="value.position.y"
      :r="radius"
      :style="strokeStyle"
      class="boid-fish"
      style="fill: transparent; stroke-width: 1" />
    <circle
      :cx="value.position.x"
      :cy="value.position.y"
      :r="value.sakuteki"
      :class="sakutekiClass"
      class="boid-fish boid-fish__sakuteki"
      style="fill: transparent"
      @click="onClick"/>
    <line
      :x1="value.position.x"
      :x2="value.position.x + value.verocity.x * 5"
      :y1="value.position.y"
      :y2="value.position.y + value.verocity.y * 5"
      :style="strokeStyle"
      class="boid-fish"
      style="stroke-width:2" />

    <v-fade-transition>
      <g v-if="showHistory">
        <line
          v-for="i in history.length - 1"
          :key="i"
          :x1="history[i - 1].x"
          :y1="history[i - 1].y"
          :x2="history[i].x"
          :y2="history[i].y"
          :style="strokeStyle"
          class="boid-fish"
          style="stroke-width: 2" />
      </g>
    </v-fade-transition>
  
  </g>
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: null
    },
    radius: {
      type: Number,
      default: 10
    },
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: '#1565c0'
    },
    disabledColor: {
      type: String,
      default: '#f2f2f2'
    }
  },
  computed: {
    history() {
      if (!this.value || !this.value.history) return []
      const allHistory = this.value.history.slice()
      const retval = []
      for (let i = 0; i < allHistory.length; i++) {
        if (i % 20) retval.push(allHistory[i])
      }
      return retval
    },
    sakutekiClass() {
      if (this.disabled) return 'boid-fish__sakuteki--hidden'
      if (this.active) return 'boid-fish__sakuteki--active'
    },
    showHistory() {
      return this.active && this.history.length >= 2
    },
    strokeStyle() {
      if (this.active) return `stroke: ${this.color}`
      if (this.disabled) return `stroke: ${this.disabledColor}`
      return `stroke: ${this.color}`
    }
  },
  methods: {
    onClick() {
      this.$emit('select')
    }
  }
}
</script>

<style scoped>
.boid-fish {
  transition: stroke 1s;
}

.boid-fish__sakuteki {
  opacity: 0.8;
  stroke: #eee;
}

.boid-fish__sakuteki--hidden {
  opacity: 0.3;
}

.boid-fish__sakuteki--active {
  opacity: 1;
  stroke: #1565c0;
}
</style>
