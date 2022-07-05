<template>
  <div>
    <v-row>
      <v-col>
        <source-count-component />
      </v-col>
    </v-row>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import SourceCountComponent from '~/components/dashboard/source-count.vue'
@Component({
  components: { SourceCountComponent },
})
export default class DashboardPage extends Vue {}
</script>
