<template>
  <v-dialog v-model="dialog" width="500">
    <v-card>
      <v-card-title class="headline primary white--text" primary-title>
        {{ title }}
      </v-card-title>
      <shared-form
        :form-items="formItems"
        show-close-btn
        @onSubmit="submit"
        @close="closeForm"
      />
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
import { Component, mixins, Prop, Watch } from 'nuxt-property-decorator'
import { IUser } from '../../interfaces/user.interface'
import { CommonMixin } from '../../mixins/common.mixin'
import { ErrorMixin } from '../../mixins/error.mixin'
import { TableMixin } from '../../mixins/table.mixin'
import SharedForm from '../SharedForm.vue'
import { formItems } from './util'

@Component({
  components: {
    SharedForm,
  },
})
export default class UserFormData extends mixins(
  ErrorMixin,
  TableMixin,
  CommonMixin
) {
  dialog = false
  title = 'Create User'
  formItems = formItems
  @Prop({ type: Boolean }) show!: boolean
  @Prop({ type: String }) link!: string

  @Watch('show', { immediate: true })
  onShowChange() {
    this.dialog = this.show
  }

  closeForm() {
    this.$emit('closeForm')
  }

  async submit(data: IUser) {
    try {
      this.activateGlobalLoading(true)
      const resp = await this.$axios.$post(this.link, data)
      this.$emit('onCreate', resp.data)
      this.activateGlobalLoading(false)
    } catch (e) {
      this.activateGlobalLoading(false)
      this.catchError(e)
    }
  }
}
</script>
