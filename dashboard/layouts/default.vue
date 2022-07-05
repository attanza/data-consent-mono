<template>
  <v-app dark>
    <Sidebar></Sidebar>
    <v-main>
      <v-container fluid>
        <Nuxt />
        <Loader></Loader>
        <Snackbar></Snackbar>
      </v-container>
    </v-main>

    <v-footer :absolute="true" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script lang="ts">
import Sidebar from '@/components/nav/sidebar.vue'
import { Vue, Component } from 'vue-property-decorator'
@Component({
  components: { Sidebar },
})
export default class DefaultLayout extends Vue {}
</script>
