<template>
  <v-app>
    <v-main>
      <client-only>
        <nuxt />
        <Snackbar />
      </client-only>
    </v-main>
  </v-app>
</template>

<script lang="ts">
import Snackbar from '@/components/Snackbar.vue'
import { Vue, Component } from 'vue-property-decorator'
@Component({ components: { Snackbar } })
export default class DefaultLayout extends Vue {}
</script>
