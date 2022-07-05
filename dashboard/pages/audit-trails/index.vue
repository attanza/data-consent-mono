<template>
  <v-card>
    <v-card-title class="primary--text">
      {{ title }}
    </v-card-title>
    <v-toolbar flat color="transparent">
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
        <template v-slot:item.action="{ item }">
          <NuxtLink :to="`${link}/${item._id}`">{{ item.action }}</NuxtLink>
        </template>

        <template v-slot:item.createdAt="{ item }">
          {{ $moment(item.createdAt).format('DD MMM YYYY') }}
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
    />
  </v-card>
</template>

<script lang="ts">
import { Component, mixins, Watch } from 'nuxt-property-decorator'
import { ErrorMixin } from '~/mixins/error.mixin'
import { TableMixin } from '~/mixins/table.mixin'
import { headers, generateDownloadData } from '@/components/audit-trails/util'
import FormData from '@/components/audit-trails/FormData.vue'
import Dialog from '@/components/Dialog.vue'
import { debounce } from 'typescript-debounce-decorator'
import { ICollectionResponse } from '~/interfaces/api-response.interface'
import { CommonMixin } from '~/mixins/common.mixin'
import { IAuditTrail } from '~/interfaces/audit-trail.interface'

@Component({ components: { FormData, Dialog } })
export default class AuditTrailsPage extends mixins(
  TableMixin,
  ErrorMixin,
  CommonMixin
) {
  link = '/audit-trails'
  title = 'Audit Trails'
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
      const queries = this.getQueries()
      const resp: ICollectionResponse<IAuditTrail> = await this.$axios.$get(
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

  onCreate(data: IAuditTrail): void {
    if (this.items.length === 0) {
      this.items = []
      this.items.push(data)
    } else {
      this.items.unshift(data)
    }
    this.closeForm()
  }

  doDownload(): void {
    const dataToDownload = generateDownloadData(this.items)
    this.generateCsv(dataToDownload, this.title)
    this.showConfirm = false
  }
}
</script>
