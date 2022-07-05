<template>
  <v-card width="500">
    <v-card-title>Consent per Source</v-card-title>
    <v-card-text>
      <v-progress-circular
        v-if="loading"
        indeterminate
        color="primary"
      ></v-progress-circular>
      <DoughnutChart v-if="!loading" :chart-data="pieData" :options="options" />
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component
export default class extends Vue {
  loading = true
  pieData = {
    labels: [] as string[],
    datasets: [
      {
        label: 'Count of Sources',
        data: [] as number[],
        backgroundColor: [] as string[],
        hoverOffset: 4,
      },
    ],
  }
  options = {
    responsive: true,
  }

  mounted() {
    this.getStatistics()
  }

  async getStatistics() {
    try {
      const resp = await this.$axios.$get('/statistics')
      const countOfSources = resp.data.countOfSources
      countOfSources.map((c: any) => {
        this.pieData.labels.push(c.source)
        this.pieData.datasets[0].data.push(c.count)
        this.pieData.datasets[0].backgroundColor.push(this.getRandomColor())
      })
      this.loading = false
    } catch (error) {
      console.log('error', error)
    }
  }

  getRandomColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16)}`
  }
}
</script>

<style scoped></style>
