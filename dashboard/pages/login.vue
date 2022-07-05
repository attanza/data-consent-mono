<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="6">
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Login</v-toolbar-title>
            <div class="flex-grow-1"></div>
          </v-toolbar>
          <v-card-text>
            <ValidationObserver ref="observer">
              <form>
                <ValidationProvider
                  v-slot="{ errors }"
                  name="email"
                  rules="required|email"
                >
                  <v-text-field
                    v-model="email"
                    :error-messages="errors"
                    name="email"
                    prepend-icon="email"
                    label="Alamat Email"
                    data-vv-name="email"
                  />
                </ValidationProvider>
                <ValidationProvider
                  v-slot="{ errors }"
                  v-model="password"
                  name="password"
                  rules="required"
                >
                  <v-text-field
                    v-model="password"
                    prepend-icon="lock"
                    :error-messages="errors"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                    name="password"
                    label="Password"
                    autocomplete="off"
                    @click:append="show = !show"
                  />
                </ValidationProvider>
              </form>
            </ValidationObserver>
          </v-card-text>
          <v-card-actions>
            <div class="flex-grow-1"></div>
            <v-btn color="primary" :loading="loading" @click="submit">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { ValidationObserver, setInteractionMode } from 'vee-validate'
import Component, { mixins } from 'vue-class-component'
import { ErrorMixin } from '~/mixins/error.mixin'
setInteractionMode('eager')

@Component({ layout: 'nonav' })
export default class Login extends mixins(ErrorMixin) {
  loading = false
  email = ''
  password = ''
  show = false
  $refs!: {
    observer: InstanceType<typeof ValidationObserver>
  }

  mounted() {
    // eslint-disable-next-line
    this.$refs.observer
  }

  async submit() {
    if (await this.$refs.observer.validate()) {
      this.doLogin()
    }
  }

  async doLogin() {
    try {
      this.loading = true
      await this.$auth.loginWith('local', {
        data: {
          email: this.email,
          password: this.password,
        },
      })
      this.loading = false
      this.$router.push('/')
    } catch (e) {
      this.loading = false
      this.catchError(e)
    }
  }
}
</script>
