<template>
  <g
    v-if="value">
    <circle
      :cx="value.position.x"
      :cy="value.position.y"
      :r="radius"
      :style="fishCircleStyle"
      class="primary--text"
      style="fill: transparent; stroke: blue"
    />
    <circle
      :cx="value.position.x"
      :cy="value.position.y"
      :r="value.sakuteki"
      style="fill: transparent; stroke: #eee"
      @click="onClick"/>
    <line
      :x1="value.position.x"
      :x2="value.position.x + value.verocity.x * 5"
      :y1="value.position.y"
      :y2="value.position.y + value.verocity.y * 5"
      style="stroke: blue; stroke-width:2" />

    <g v-if="active">
      <line
        v-for="i in history.length - 1"
        :key="i"
        :x1="history[i - 1].x"
        :y1="history[i - 1].y"
        :x2="history[i].x"
        :y2="history[i].y"
        style="stroke: blue; stroke-width:2" />
    </g>
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
    }
  },
  data() {
    return {
      history: null
    }
  },
  computed: {
    fishCircleStyle() {
      if (this.active) {
        return 'stroke-width: 3'
      }
      return ''
    }
  },
  watch: {
    active(val) {
      if (val) {
        const allHistory = this.value.history.slice()
        const retval = []
        for (let i = 0; i < allHistory.length; i++) {
          if (i % 20) retval.push(allHistory[i])
        }
        this.history = retval
      }
    }
  },
  methods: {
    onClick() {
      this.$emit('select')
    }
  }
}
</script>
