<template>
  <div>
    <v-toolbar flat color="transparent">
      <v-btn @click="back">
        <v-icon>keyboard_arrow_left</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn
        color="danger"
        dark
        class="mr-3"
        @click="showDialog = !showDialog"
        v-if="checkRole('ADMIN')"
      >
        <v-icon>delete</v-icon>
      </v-btn>

      <v-btn color="primary" dark @click="onUpdate" v-if="checkRole('ADMIN')">
        <v-icon>save</v-icon>
      </v-btn>
    </v-toolbar>
    <shared-form
      :form-items="formItems"
      :init-value="currentEdit"
      @onSubmit="onUpdate"
      :showSaveBtn="checkRole('ADMIN')"
    />
    <Dialog
      :show-dialog="showDialog"
      text="Are you sure want to delete?"
      @onClose="showDialog = false"
      @onConfirmed="destroy"
    />
  </div>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator'
import SharedForm from '../SharedForm.vue'
import Dialog from '../Dialog.vue'
import { formItems } from './util'
import { ErrorMixin } from '~/mixins/error.mixin'
import { CommonMixin } from '~/mixins/common.mixin'
import { IApiResponse } from '~/interfaces/api-response.interface'
import { TableMixin } from '~/mixins/table.mixin'
import { IUser } from '~/interfaces/user.interface'

@Component({
  components: {
    SharedForm,
    Dialog,
  },
})
export default class UserDetailComponent extends Mixins(
  ErrorMixin,
  CommonMixin,
  TableMixin
) {
  link = '/users'
  formItems = formItems
  showDialog = false

  mounted() {
    this.formItems[2].hidden = true
  }

  async onUpdate() {
    const data = { ...this.vuexFormData }

    const doUpdate = this.checkDoUpdate(data, this.currentEdit)
    if (doUpdate) {
      try {
        this.activateGlobalLoading(true)
        const resp: IApiResponse<IUser> = await this.$axios.$put(
          `${this.link}/${this.currentEdit._id}`,
          data
        )
        this.$store.commit('SET_CURRENT_EDIT', resp.data)
        this.activateSnackbar('success', 'Data updated')
        this.activateGlobalLoading(false)
      } catch (e) {
        this.activateGlobalLoading(false)
        this.catchError(e)
      }
    }
  }

  async destroy() {
    try {
      this.activateGlobalLoading(true)
      await this.$axios.$delete(`${this.link}/${this.currentEdit._id}`)
      this.showDialog = false
      this.activateSnackbar('success', 'Data deleted')
      this.activateGlobalLoading(false)
      this.$router.push(this.link)
    } catch (e) {
      this.showDialog = false
      this.activateGlobalLoading(false)
      this.catchError(e)
    }
  }
}
</script>
