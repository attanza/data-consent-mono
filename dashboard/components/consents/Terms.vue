<template>
  <v-container fluid>
    <v-toolbar light flat dense>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-btn text @click="selectAll">Select All</v-btn>
        <v-btn text @click="clearAll">Clear All</v-btn>
        <v-combobox
          v-model="source"
          :items="sourceItems"
          label="Source"
          clearable
          outlined
          dense
          class="mt-1"
        />
      </v-toolbar-items>
    </v-toolbar>
    <v-row class="my-4">
      <v-col v-for="term in terms" cols="12" sm="4" md="4" :key="term._id">
        <v-checkbox
          v-model="selected"
          :label="term.content"
          :value="term._id"
        ></v-checkbox>
      </v-col>
    </v-row>
    <v-toolbar light flat dense>
      <v-btn color="primary" @click="submit">Submit</v-btn>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <v-combobox
          v-model="perPage"
          :items="perPages"
          style="max-width: 70px"
          class="mr-4"
          outlined
          dense
        />
        <v-pagination
          v-model="page"
          :length="paginationLength"
          circle
          :total-visible="5"
        />
      </v-toolbar-items>
    </v-toolbar>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins, Watch } from 'vue-property-decorator'
import { EApplicationType } from '~/interfaces/aplication-type.enum'
import { ITerm } from '~/interfaces/term.interface'
import { ErrorMixin } from '~/mixins/error.mixin'
import { debounce } from 'typescript-debounce-decorator'

@Component
export default class ConsentTermComponent extends Mixins(ErrorMixin) {
  selected: string[] = []
  source = EApplicationType.OUTLET
  terms: ITerm[] = []
  sourceItems = Object.values(EApplicationType)
  page = 1
  paginationLength = 4
  perPages = [9, 24, 48, 99]
  perPage = 9
  get currentTerms() {
    return this.$store.state.comboData
  }

  get currentEdit() {
    return { ...this.$store.state.currentEdit }
  }

  @Watch('page')
  @Watch('perPage')
  @Watch('source')
  @debounce(500)
  handleGetChange(e: any) {
    if (typeof e === 'string') this.page = 1
    this.getTerms()
  }

  @Watch('selected')
  @debounce(500)
  handleSelectedChange() {
    this.$store.commit('SET_CURRENT_EDIT', {
      ...this.currentEdit,
      terms: this.selected,
    })
  }

  mounted() {
    this.getTerms()
    this.setCurrentTerms()
  }

  setCurrentTerms() {
    this.selected = [...this.currentEdit.terms]
  }

  selectAll() {
    const ids: string[] = []
    this.terms.map((t) => {
      ids.push(t._id)
    })
    this.selected = [...this.selected, ...ids]
  }

  clearAll() {
    this.selected = []
  }

  async submit() {
    try {
      this.activateGlobalLoading(true)
      if (this.selected.length > 0) {
        const resp = await this.$axios.$put(
          `/consents/${this.currentEdit._id}`,
          { terms: this.selected }
        )
        this.activateSnackbar('success', resp.meta.message)
      }
      this.activateGlobalLoading(false)
    } catch (error) {
      this.activateGlobalLoading(false)
      this.catchError(error)
    }
  }

  async getTerms() {
    try {
      this.activateGlobalLoading(true)
      const url = `/terms?page=${this.page}&limit=${
        this.perPage
      }&fieldKey=source&fieldValue=${this.source || ''}&select=term`
      const resp = await this.$axios.$get(url)
      this.paginationLength = resp.data.totalPages
      this.terms = resp.data.docs
      this.setCurrentTerms()
      console.log(' this.terms', this.terms)

      this.activateGlobalLoading(false)
    } catch (error) {
      this.activateGlobalLoading(false)
      this.catchError(error)
    }
  }
}
</script>

<style scoped></style>
