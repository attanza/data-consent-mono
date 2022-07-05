<template>
  <v-row align="center" justify="center">
    <v-col cols="12" sm="6">
      <ValidationObserver ref="observer">
        <form>
          <v-card flat>
            <v-card-text>
              <ValidationProvider
                v-slot="{ errors }"
                name="file"
                rules="required"
              >
                <v-file-input
                  show-size
                  label="File input"
                  v-model="file"
                  accept="image/*"
                  :error-messages="errors"
                ></v-file-input>
              </ValidationProvider>
              <v-btn
                @click="submit"
                :disable="file === null"
                color="primary"
                class="mt-4"
                >Submit</v-btn
              >
            </v-card-text>
          </v-card>
        </form>
      </ValidationObserver>
    </v-col>
  </v-row>
</template>

<script lang="ts">
import { ValidationObserver } from 'vee-validate/dist/types/components/Observer'
import { Component, Mixins } from 'vue-property-decorator'
import { CommonMixin } from '~/mixins/common.mixin'
import { ErrorMixin } from '~/mixins/error.mixin'

@Component
export default class ConsentAttachmentsComponent extends Mixins(
  ErrorMixin,
  CommonMixin
) {
  file: any = null
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }
  get currentEdit() {
    return { ...this.$store.state.currentEdit }
  }

  mounted() {
    this.$refs.observer // eslint-disable-line
  }

  async submit() {
    if (await this.$refs.observer.validate()) {
      this.postImage()
    }
  }

  async postImage() {
    try {
      this.activateGlobalLoading(true)
      let formData = new FormData()
      formData.append('file', this.file)
      const resp = await this.$axios.$post(
        `/consents/${this.currentEdit._id}/add-attachment`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      )
      console.log('resp', resp)
      this.file = null
      this.activateGlobalLoading(false)
    } catch (error) {
      this.activateGlobalLoading(false)
      this.catchError(error)
    }
  }
}
</script>

<style scoped></style>
