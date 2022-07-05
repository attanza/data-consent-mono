<template>
  <div class="text-center ma-2">
    <v-snackbar
      v-model="showSnackbar"
      :timeout="5000"
      :color="snackbar.color"
      dark
    >
      {{ snackbar.text }}
      <template v-slot:action="{ attrs }">
        <v-btn color="white" text v-bind="attrs" @click="closeSnackbar">
          Close
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script lang="ts">
import { Vue, Component, Watch } from 'vue-property-decorator'
import { ISnackbar } from '../interfaces/snackbar.interface'
@Component
export default class SnackbarComponent extends Vue {
  showSnackbar = false

  @Watch('snackbar', { immediate: true })
  onSnackbarChange() {
    this.showSnackbar = this.snackbar.show
  }

  @Watch('showSnackbar', { immediate: true })
  onShowSnackbarChange() {
    if (!this.showSnackbar) {
      this.closeSnackbar()
    }
  }

  get snackbar(): ISnackbar {
    return this.$store.state.snackbar
  }

  closeSnackbar() {
    const snackbarData: ISnackbar = { text: '', color: 'success', show: false }
    this.$store.commit('SET_SNACKBAR', snackbarData)
  }
}
</script>
