<template>
  <v-layout 
    row 
    wrap>
    <v-flex 
      xs12 
      sm8>
      
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
          <v-spacer/>
          <v-dialog
            v-model="showSetting"
            max-width="500">
            <v-toolbar-side-icon slot="activator">
              <v-icon>menu</v-icon>
            </v-toolbar-side-icon>
            <v-card>
              <v-toolbar 
                card >
                <v-toolbar-title>設定</v-toolbar-title>
              </v-toolbar>
              <v-divider/>
              <v-container>
                <v-slider 
                  v-model="edittingSettings.sakutekiRange"
                  :min="1"
                  :max="300"
                  class="pt-5 mt-0"
                  thumb-label="always"
                  hint="自分からこの範囲内にある魚を見ることが出来ます。"
                  persistent-hint
                  label="索敵範囲"/>
                <v-slider 
                  v-model="edittingSettings.dislikeRange"
                  :min="1"
                  :max="edittingSettings.sakutekiRange"
                  class="pt-5"
                  thumb-label="always"
                  persistent-hint
                  hint="この範囲以下に入った魚からは遠ざかろうとします"
                  label="忌避範囲"/>
              </v-container>
              <v-card-actions>
                <v-spacer/>
                <v-btn 
                  color="primary"
                  depressed 
                  @click="onClickSave">保存</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
        <div 
          ref="field"
          style="height: 1000px">
          <svg 
            width="100%" 
            height="100%">
            <template v-if="field">
              <boid-fish
                v-for="fish in field.fishes"
                :key="fish.id"
                :value="fish"
                :disabled="existSelectedFish && fish !== selectedFish"
                :active="fish === selectedFish"
                @select="onSelectFish(fish)"/>
            </template>
          </svg>
        </div>
      </v-card>

    </v-flex>
    <v-flex 
      sm4 
      xs12>
      <v-card>
        <v-subheader>History Watch</v-subheader>
        <v-card-text>
          <v-select
            v-if="field"
            v-model="fishId"
            :items="fishItems"
            item-text="text"
            append-icon="search"
            solo
            clearable
            item-value="id"/>
          <v-list
            v-if="selectedFish">
            <v-list-tile>
              <v-list-tile-action>
                <v-icon>info</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>
                  ID:{{ selectedFish.id }}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  索敵範囲 {{ selectedFish.sakuteki }} 忌避範囲 {{ selectedFish.dislikeDistance }}
                </v-list-tile-sub-title>
              </v-list-tile-content>
            </v-list-tile>
          </v-list>
          <div v-else>
            No Fish Selected
          </div>
        </v-card-text>     
      </v-card>
    </v-flex>
  </v-layout>
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
      updateTask: null,
      showSetting: false,
      settings: {
        sakutekiRange: 100,
        dislikeRange: 20,
        dislikeForce: 1
      },
      edittingSettings: {}
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
    existSelectedFish() {
      return this.selectedFish !== null
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
    },
    showSetting(val) {
      if (val) {
        this.stop()
        this.edittingSettings = Object.assign({}, this.settings)
      } else this.start()
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const fieldDom = this.$refs.field
      Field.count = 0
      this.field = new Field(
        fieldDom.offsetWidth,
        fieldDom.offsetHeight,
        this.settings.sakutekiRange,
        this.settings.dislikeRange
      )
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
    },
    onClickSave() {
      this.showSetting = false
      this.settings = Object.assign({}, this.edittingSettings)
      this.init()
    }
  }
}
</script>
