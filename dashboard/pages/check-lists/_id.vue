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
import { Context } from '@nuxt/types'
import { Component, mixins } from 'nuxt-property-decorator'
import { IApiResponse } from '@/interfaces/api-response.interface'
import { ICheckList } from '@/interfaces/check-list.interface'
import detail from '@/components/check-lists/Detail.vue'
import { CommonMixin } from '~/mixins/common.mixin'

@Component({
  components: { detail },
})
export default class CheckListDetail extends mixins(CommonMixin) {
  async fetch({ store, params, $axios }: Context) {
    try {
      const resp: IApiResponse<ICheckList> = await $axios.$get(
        '/check-lists/' + params.id
      )
      store.commit('SET_CURRENT_EDIT', resp.data)
    } catch (e) {
      store.dispatch('catchError', e)
    }
  }
}
</script>

<style scoped></style>
