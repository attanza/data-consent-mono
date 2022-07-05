<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
    </v-card-title>
    <v-toolbar flat color="transparent">
      <v-btn
        color="primary"
        @click="showForm = !showForm"
        v-if="checkRole('ADMIN EDITOR')"
      >
        <v-icon>add</v-icon>
      </v-btn>
      <v-btn class="ml-2" @click="showConfirm = true">
        <v-icon color="primary"> cloud_download </v-icon>
      </v-btn>
      <v-spacer />
      <v-text-field
        v-model="options.search"
        append-icon="search"
        label="Search..."
        clearable
      />
    </v-toolbar>
    <v-card-text class="mt-4">
      <v-data-table
        :headers="headers"
        :items="items"
        :search="options.search"
        :loading="loading"
        :options.sync="options"
        :footer-props="footerProps"
        :server-items-length="total"
      >
        <template v-slot:item.nik="{ item }">
          <NuxtLink :to="`${link}/${item._id}`">{{ item.nik }}</NuxtLink>
        </template>
        <template v-slot:item.source="{ item }">
          {{ item.source ? item.source.name : '' }}
        </template>
        <template v-slot:item.createdAt="{ item }">
          {{ $moment(item.createdAt).format('DD MMM YYYY') }}
        </template>
        <template v-slot:item.actions="{ item }">
          <v-icon @click="toFormPage(item._id)"> list_alt </v-icon>
        </template>
      </v-data-table>
    </v-card-text>
    <form-data
      :show="showForm"
      :link="link"
      @closeForm="closeForm"
      @onCreate="onCreate"
    />
    <Dialog
      :show-dialog="showConfirm"
      text="Are you sure want to download data?"
      @onClose="showConfirm = false"
      @onConfirmed="doDownload"
    ></Dialog>
  </v-card>
</template>

<script lang="ts" type="module">
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { ErrorMixin } from '~/mixins/error.mixin'
import { TableMixin } from '~/mixins/table.mixin'
import { headers, generateDownloadData } from '@/components/consents/util'
import FormData from '@/components/consents/FormData.vue'
import Dialog from '@/components/Dialog.vue'
import { IConsent } from '~/interfaces/consent.interface'
import { debounce } from 'typescript-debounce-decorator'
import { ICollectionResponse } from '~/interfaces/api-response.interface'
import { CommonMixin } from '~/mixins/common.mixin'

@Component({ components: { FormData, Dialog } })
export default class ConsentsPage extends mixins(
  TableMixin,
  ErrorMixin,
  CommonMixin
) {
  link = '/consents'
  title = 'Consents'
  headers = headers

  @Watch('options', { immediate: true, deep: true })
  @debounce(500)
  onOptionsChange() {
    this.populateTable()
  }

  mounted() {
    this.populateTable()
  }

  async populateTable(): Promise<void> {
    try {
      this.activateGlobalLoading(true)
      const queries = this.getQueries() + 'populate=source'
      const resp: ICollectionResponse<IConsent> = await this.$axios.$get(
        this.link + queries
      )
      this.total = resp.meta.totalDocs
      this.items = resp.data
      this.activateGlobalLoading(false)
    } catch (e) {
      this.activateGlobalLoading(false)
      this.catchError(e)
    }
  }

  closeForm(): void {
    this.showForm = false
  }

  onCreate(data: IConsent): void {
    const idx = this.items.findIndex((i) => i._id === data._id)
    if (idx === -1) {
      this.items.unshift(data)
    } else {
      this.items.splice(idx, 1, data)
    }
    this.closeForm()
  }

  doDownload(): void {
    const dataToDownload = generateDownloadData(this.items)
    this.generateCsv(dataToDownload, this.title)
    this.showConfirm = false
  }

  toFormPage(consentId: string) {
    this.$router.push(`/consent-form?consentId=${consentId}`)
  }
}
</script>
