<template>
  <div>
    <h2 v-if="currentEdit" class="headline primary--text mb-2">
      {{ currentEdit.nik }}
    </h2>
    <v-tabs class="elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail"> Detail </v-tab>
      <v-tab-item id="detail">
        <Detail />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import { Context } from '@nuxt/types'
import { Component, mixins } from 'nuxt-property-decorator'
import { IApiResponse } from '~/interfaces/api-response.interface'
import { IConsent } from '~/interfaces/consent.interface'
import { CommonMixin } from '~/mixins/common.mixin'
import Detail from '@/components/consents/Detail.vue'

@Component({
  components: { Detail },
})
export default class ConsentDetailPage extends mixins(CommonMixin) {
  async fetch({ store, params, $axios }: Context) {
    try {
      const resp: IApiResponse<IConsent> = await $axios.$get(
        '/consents/' + params.id
      )
      let currentEdit: any = { ...resp.data }

      if (resp.data.term && typeof resp.data.term === 'object') {
        currentEdit = { ...resp.data, term: resp.data.term._id }
      }

      store.commit('SET_CURRENT_EDIT', currentEdit)
    } catch (e) {
      store.dispatch('catchError', e)
    }
  }
}
</script>

<style scoped></style>
