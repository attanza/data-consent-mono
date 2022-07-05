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
        <template v-slot:item.name="{ item }">
          <NuxtLink :to="`${link}/${item._id}`">{{ item.name }}</NuxtLink>
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
import { headers, generateDownloadData } from '@/components/sources/util'
import FormData from '@/components/sources/FormData.vue'
import Dialog from '@/components/Dialog.vue'
import { debounce } from 'typescript-debounce-decorator'
import { ICollectionResponse } from '~/interfaces/api-response.interface'
import { ICheckList } from '~/interfaces/check-list.interface'
import { CommonMixin } from '~/mixins/common.mixin'
import { ISource } from '~/interfaces/source.interface'

@Component({ components: { FormData, Dialog } })
export default class SourcePage extends mixins(
  TableMixin,
  ErrorMixin,
  CommonMixin
) {
  link = '/sources'
  title = 'Sources'
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
      const resp: ICollectionResponse<ISource> = await this.$axios.$get(
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

  onCreate(data: ICheckList): void {
    this.items.unshift(data)
    this.closeForm()
  }

  doDownload(): void {
    const dataToDownload = generateDownloadData(this.items)
    this.generateCsv(dataToDownload, this.title)
    this.showConfirm = false
  }
}
</script>
