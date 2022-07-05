<template>
  <div>
    <v-dialog v-model="dialog" hide-overlay persistent width="300">
      <v-card color="primary" dark>
        <v-card-text>
          Please wait ...
          <v-progress-linear indeterminate color="white" class="mb-0" />
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Prop, Watch } from 'vue-property-decorator'
@Component
export default class Loader extends Vue {
  dialog = false
  @Prop({ default: false }) loading!: boolean

  @Watch('loading')
  onLoadingChange() {
    this.dialog = this.loading
  }

  @Watch('globalLoading')
  onGlobalLoadingChange() {
    this.dialog = this.globalLoading
  }

  get globalLoading() {
    return this.$store.state.globalLoading
  }
}
</script>
