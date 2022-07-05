<template>
  <ValidationObserver ref="observer">
    <form>
      <v-container fluid>
        <v-row v-for="f in formItems" :key="f.key" class="px-2">
          <v-col v-if="!f.hidden" :sm6="sm6">
            <ValidationProvider
              v-if="f.el === 'text'"
              v-slot="{ errors }"
              :name="f.caption"
              :rules="f.rules"
            >
              <v-text-field
                v-model="formData[f.key]"
                :type="f.type"
                :error-messages="errors"
                :name="f.key"
                :label="f.caption"
                :disabled="f.disabled"
                :placeholder="f.placeholder"
              />
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el === 'switch'"
              v-slot="{ errors }"
              :name="f.caption"
              :rules="f.rules"
            >
              <v-switch
                v-model="formData[f.key]"
                :error-messages="errors"
                :name="f.key"
                :label="f.caption"
                color="primary"
              />
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el === 'combobox'"
              v-slot="{ errors }"
              :name="f.caption"
              :rules="f.rules"
            >
              <v-autocomplete
                v-model="formData[f.key]"
                :items="f.items"
                :error-messages="errors"
                :name="f.key"
                :label="f.caption"
                item-text="name"
                item-value="_id"
                color="primary"
                :cache-items="f.cacheItems"
                :multiple="f.multiple"
                :chips="f.multiple"
                :small-chips="f.multiple"
                clearable
                :deletable-chips="f.multiple"
              />
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el === 'apiCombobox'"
              v-slot="{ errors }"
              :name="f.caption"
              :rules="f.rules"
            >
              <v-autocomplete
                v-model="formData[f.key]"
                :items="items"
                :search-input.sync="search"
                :error-messages="errors"
                color="primary"
                hide-no-data
                hide-selected
                item-text="name"
                item-value="_id"
                :label="f.caption"
                placeholder="Start typing to Search"
                :multiple="f.multiple"
                chips
                small-chips
                clearable
                deletable-chips
              />
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el === 'date'"
              v-slot="{ errors }"
              :name="f.caption"
              :rules="f.rules"
            >
              <v-menu
                v-model="dateMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template #activator="{ on }">
                  <v-text-field
                    v-model="formData[f.key]"
                    :type="f.type"
                    :error-messages="errors"
                    :name="f.key"
                    :label="f.caption"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-date-picker
                  v-model="formData[f.key]"
                  @input="dateMenu = false"
                />
              </v-menu>
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el === 'time'"
              v-slot="{ errors }"
              :name="f.caption"
              :rules="f.rules"
            >
              <v-menu
                v-model="timeMenu"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template #activator="{ on }">
                  <v-text-field
                    v-model="formData[f.key]"
                    :type="f.type"
                    :error-messages="errors"
                    :name="f.key"
                    :label="f.caption"
                    readonly
                    v-on="on"
                  />
                </template>
                <v-time-picker
                  v-model="formData[f.key]"
                  @input="timeMenu = false"
                />
              </v-menu>
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el === 'textarea'"
              v-slot="{ errors }"
              :name="f.caption"
              :rules="f.rules"
            >
              <v-textarea
                v-model="formData[f.key]"
                :error-messages="errors"
                :name="f.key"
                :label="f.caption"
              />
            </ValidationProvider>

            <ValidationProvider
              v-if="f.el === 'editor'"
              v-slot="{ errors }"
              :name="f.caption"
              :rules="f.rules"
            >
              <label>{{ f.caption }}</label>
              <vue-editor
                v-model="formData[f.key]"
                :error-messages="errors"
                :name="f.key"
                :label="f.caption"
              />
              <p
                v-if="errors.length"
                class="red--text mt-2"
                style="font-size: 12px"
              >
                {{ errors[0] }}
              </p>
            </ValidationProvider>
          </v-col>
        </v-row>
        <v-divider />
        <v-card-actions class="mt-4">
          <v-spacer />
          <v-btn v-if="showCloseBtn" @click="close">
            <v-icon>close</v-icon>
          </v-btn>
          <v-btn v-if="showSaveBtn" color="primary" @click="submit">
            <v-icon>save</v-icon>
          </v-btn>
        </v-card-actions>
      </v-container>
    </form>
  </ValidationObserver>
</template>

<script lang="ts">
import { Component, mixins } from 'nuxt-property-decorator'
import { Prop, Watch } from 'vue-property-decorator'
import { ValidationObserver } from 'vee-validate'
import { ErrorMixin } from '~/mixins/error.mixin'
import { debounce } from 'typescript-debounce-decorator'

@Component({})
export default class SharedForm extends mixins(ErrorMixin) {
  formData: any = {}
  dateMenu = false
  timeMenu = false
  search = ''
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

  @Prop({ type: Array }) formItems!: any[]
  @Prop({ type: Boolean, default: false }) sm6!: boolean
  @Prop({ type: Object, default: null }) initValue!: any
  @Prop({ type: Boolean, default: false }) showCloseBtn!: boolean
  @Prop({ type: Boolean, default: true }) showSaveBtn!: boolean

  get items() {
    return this.$store.state.comboSearch.items
  }

  @Watch('initValue')
  onInitValueChange() {
    this.assignInitValue()
  }

  @Watch('formData', { deep: true, immediate: true })
  onFormDataChange() {
    this.$store.commit('SET_FORM_DATA', this.formData)
  }

  @Watch('search', { immediate: true })
  @debounce(500)
  onSearchChange() {
    this.apiSearch()
  }

  mounted() {
    this.$refs.observer // eslint-disable-line
    if (this.initValue) {
      this.assignInitValue()
    }
  }

  close() {
    this.formData = {}
    this.$emit('close')
  }

  async submit() {
    if (await this.$refs.observer.validate()) {
      this.$emit('onSubmit', this.formData)
    }
  }

  assignInitValue() {
    this.formData = Object.assign({}, this.initValue)
  }

  @debounce(500)
  apiSearch() {
    // this.$store.dispatch('onComboSearch', this.search)
  }
}
</script>

<style lang="scss" scoped></style>
