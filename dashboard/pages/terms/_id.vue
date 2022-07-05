<template>
  <div>
    <h2 v-if="currentEdit" class="headline primary--text mb-2">
      {{ currentEdit.name }}
    </h2>
    <v-tabs class="elevation-1">
      <v-tabs-slider color="white" />
      <v-tab href="#detail"> Detail </v-tab>
      <v-tab-item id="detail">
        <detail />
      </v-tab-item>
    </v-tabs>
  </div>
</template>

<script lang="ts">
import detail from '@/components/terms/Detail.vue'

import { Context } from '@nuxt/types'
import { Component, mixins } from 'nuxt-property-decorator'
import { ICollectionResponse } from '~/interfaces/api-response.interface'
import { ITerm } from '~/interfaces/term.interface'
import { CommonMixin } from '~/mixins/common.mixin'

@Component({
  components: { detail },
})
export default class TermDetailPage extends mixins(CommonMixin) {
  async fetch({ store, params, $axios }: Context) {
    try {
      const resp: ICollectionResponse<ITerm> = await $axios.$get(
        '/terms/' + params.id
      )
      store.commit('SET_CURRENT_EDIT', resp.data)
    } catch (e) {
      store.dispatch('catchError', e)
    }
  }
}
</script>

<style scoped></style>
