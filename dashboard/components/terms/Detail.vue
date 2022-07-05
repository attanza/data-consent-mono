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
import { ICheckList } from '~/interfaces/check-list.interface'
import { ITerm } from '~/interfaces/term.interface'
import { TableMixin } from '~/mixins/table.mixin'

@Component({
  components: {
    SharedForm,
    Dialog,
  },
})
export default class ArticleDetailComponent extends Mixins(
  ErrorMixin,
  CommonMixin,
  TableMixin
) {
  link = '/terms'
  formItems = formItems
  showDialog = false
  source = ''

  mounted() {
    this.populateSources()

    if (this.currentEdit.source && this.currentEdit.source !== '') {
      this.source = this.currentEdit.source._id
      this.getCheckLists()
    }
  }

  async populateSources() {
    const idx = this.formItems.findIndex((f) => f.key === 'source')
    if (idx !== -1) {
      if (
        this.formItems[idx] &&
        this.formItems[idx].items &&
        this.formItems[idx].items?.length === 0
      ) {
        const sources = await this.getSources()
        this.formItems[idx].items = sources
      }
    }
  }

  async getCheckLists() {
    try {
      this.activateGlobalLoading(true)
      const url = `/check-lists?limit=100&fieldKey=source&fieldValue=${this.source}`
      const resp: ICollectionResponse<ICheckList> = await this.$axios.$get(url)
      const checkListItems: any[] = []
      resp.data?.map((doc: ICheckList) => {
        checkListItems.push({ _id: doc._id, name: doc.content })
      })
      const idx = this.formItems.findIndex((f) => f.key === 'checkLists')
      if (idx !== -1) {
        this.formItems[idx].items = checkListItems
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
    if (typeof data.checkLists[0] === 'object') {
      data.checkLists = data.checkLists.map((c: any) => c._id)
    }
    const doUpdate = this.checkDoUpdate(data, this.currentEdit)
    if (doUpdate) {
      try {
        this.activateGlobalLoading(true)
        const resp: IApiResponse<ITerm> = await this.$axios.$put(
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
