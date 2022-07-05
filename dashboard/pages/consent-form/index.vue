<template>
  <v-container>
    <div class="d-flex justify-end mb-4">
      <v-img
        src="https://newlarisa.pegadaian.co.id/pegadaian.png"
        max-height="120"
        max-width="200"
      />
    </div>
    <h2 class="text-center mb-5">Form Data Consent</h2>
    <ValidationObserver ref="observer">
      <form>
        <ValidationProvider v-slot="{ errors }" name="name" rules="required">
          <v-text-field
            v-model="name"
            :error-messages="errors"
            name="name"
            label="Name"
            placeholder="name"
            outlined
          />
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" name="nik" rules="required">
          <v-text-field
            v-model="nik"
            :error-messages="errors"
            name="nik"
            label="NIK"
            placeholder="NIK"
            outlined
          />
        </ValidationProvider>

        <ValidationProvider v-slot="{ errors }" name="cif" rules="required">
          <v-text-field
            v-model="cif"
            :error-messages="errors"
            name="cif"
            label="CIF"
            placeholder="CIF"
            outlined
          />
        </ValidationProvider>
        <ValidationProvider v-slot="{ errors }" name="phone" rules="required">
          <v-text-field
            v-model="phone"
            :error-messages="errors"
            name="phone"
            label="Phone"
            placeholder="Phone"
            outlined
          />
        </ValidationProvider>
        <ValidationProvider
          v-slot="{ errors }"
          name="email"
          rules="required|email"
        >
          <v-text-field
            v-model="email"
            :error-messages="errors"
            name="email"
            label="Email"
            placeholder="Email"
            outlined
          />
        </ValidationProvider>

        <div
          v-html="currentEdit.term ? currentEdit.term.content : ''"
          class="my-4"
        ></div>

        <v-checkbox
          v-for="checkList in checkLists"
          :key="checkList._id"
          v-model="selected"
          :label="checkList.content"
          :value="checkList._id"
          name="checkList"
          item-text="content"
          item-value="_id"
        ></v-checkbox>
        <div class="d-flex justify-end mt-4">
          <v-btn color="primary" @click="submit" :loading="globalLoading">
            Submit
          </v-btn>
        </div>
      </form>
    </ValidationObserver>
  </v-container>
</template>

<script lang="ts">
import { Context } from '@nuxt/types/app'
import { Component, mixins } from 'nuxt-property-decorator'
import { ICheckList } from '~/interfaces/check-list.interface'
import { IConsent } from '~/interfaces/consent.interface'
import { CommonMixin } from '~/mixins/common.mixin'
import { IApiResponse } from '~/interfaces/api-response.interface'
import { ErrorMixin } from '~/mixins/error.mixin'
import { ValidationObserver } from 'vee-validate'

@Component({
  layout: 'nonav',
})
export default class ConsentFormPage extends mixins(CommonMixin, ErrorMixin) {
  selected: any[] = []
  checkLists: ICheckList[] = []
  name = ''
  nik = ''
  cif = ''
  phone = ''
  email = ''
  source = ''
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }
  async fetch({ store, query, $axios }: Context) {
    try {
      const resp: IApiResponse<IConsent> = await $axios.$get(
        '/consents/' + query.consentId
      )
      store.commit('SET_CURRENT_EDIT', resp.data)
    } catch (e) {
      console.log('e', e)
    }
  }

  mounted() {
    this.initializeData()
  }
  initializeData() {
    const consent: IConsent = this.currentEdit

    this.checkLists = consent.term?.checkLists || []
    this.selected = consent.checkLists
    this.name = consent.name
    this.nik = consent.nik
    this.cif = consent.cif
    this.email = consent.email
    this.phone = consent.phone
    this.source = consent.source._id
  }

  async submit() {
    try {
      if (await this.$refs.observer.validate()) {
        this.activateGlobalLoading(true)
        const postData = {
          name: this.name,
          nik: this.nik,
          email: this.email,
          phone: this.phone,
          source: this.source,
          term: this.currentEdit.term._id,
          checkLists: this.selected,
        }
        await this.$axios.$put(`/consents/${this.currentEdit._id}`, postData)
        this.activateSnackbar('success', 'Data updated')
        this.activateGlobalLoading(false)
      }
    } catch (e) {
      this.activateGlobalLoading(false)
      this.catchError(e)
    }
  }
}
</script>

<style scoped></style>
