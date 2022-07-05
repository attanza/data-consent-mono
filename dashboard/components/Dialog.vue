<template>
  <v-dialog v-model="dialog" max-width="500px" persistent>
    <v-card>
      <v-card-title>
        <span class="primary--text headline">{{ text }}</span>
      </v-card-title>
      <v-divider />
      <v-card-actions>
        <v-spacer />
        <v-btn @click="onClose"> No </v-btn>
        <v-btn color="primary" dark @click="onConfirmed"> Yes </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, Mixins, Prop, Watch } from 'vue-property-decorator'
import { ErrorMixin } from '~/mixins/error.mixin'
@Component
export default class Dialog extends Mixins(ErrorMixin) {
  dialog = false

  @Prop({ type: Boolean }) showDialog!: boolean
  @Prop({ type: String }) text!: string

  @Watch('showDialog')
  onShowDialogChange() {
    this.dialog = this.showDialog
  }

  onClose() {
    this.$emit('onClose')
  }

  onConfirmed() {
    this.$emit('onConfirmed')
  }
}
</script>
