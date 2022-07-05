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

      <v-btn
        color="primary"
        dark
        @click="onUpdate"
        v-if="checkRole('ADMIN EDITOR')"
      >
        <v-icon>save</v-icon>
      </v-btn>
    </v-toolbar>
    <shared-form
      :form-items="formItems"
      :init-value="currentEdit"
      @onSubmit="onUpdate"
      :showSaveBtn="checkRole('ADMIN EDITOR')"
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
import {
  IApiResponse,
  ICollectionResponse,
} from '~/interfaces/api-response.interface'
import { ITerm } from '~/interfaces/term.interface'
import { IConsent } from '~/interfaces/consent.interface'
import { IItems } from '~/interfaces/form-item.interface'

@Component({
  components: {
    SharedForm,
    Dialog,
  },
})
export default class ArticleDetailComponent extends Mixins(
  ErrorMixin,
  CommonMixin
) {
  link = '/consents'
  formItems = formItems
  showDialog = false
  source = ''

  mounted() {
    const idx = this.formItems.findIndex((f) => f.key === 'terms')
    if (idx !== -1) {
      this.formItems.splice(idx, 1)
    }
    if (this.currentEdit.source && this.currentEdit.source !== '') {
      this.source = this.currentEdit.source._id
      this.getTerms()
    }
  }
  async getTerms() {
    try {
      this.activateGlobalLoading(true)
      const url = `/terms?limit=100&fieldKey=source&fieldValue=${this.source}`
      const resp: ICollectionResponse<ITerm> = await this.$axios.$get(url)
      const terms: IItems[] = []
      resp.data.map((doc: ITerm) => {
        terms.push({ _id: doc._id, name: doc.title })
      })
      const idx = this.formItems.findIndex((f) => f.key === 'term')
      if (idx !== -1) {
        this.formItems[idx].items = terms
      }

      this.activateGlobalLoading(false)
    } catch (e) {
      this.activateGlobalLoading(false)
      this.catchError(e)
    }
  }
  async onUpdate() {
    const data = { ...this.vuexFormData }
    if (typeof data.source === 'object') {
      data.source = data.source._id
    }
    const doUpdate = this.checkDoUpdate(data, this.currentEdit)
    if (doUpdate) {
      try {
        this.activateGlobalLoading(true)
        const resp: IApiResponse<IConsent> = await this.$axios.$put(
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
