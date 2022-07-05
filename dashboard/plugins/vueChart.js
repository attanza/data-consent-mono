import Vue from 'vue'
import { Bar, Doughnut, Line, Pie, mixins } from 'vue-chartjs'

const registerComponent = function (name, originalComponent) {
  Vue.component(name, {
    mixins: [mixins.reactiveProp],
    extends: originalComponent,
    props: {
      chartData: {
        type: Object,
        default: () => {},
      },
      chartOptions: {
        type: Object,
        default: () => {},
      },
    },
    mounted() {
      this.renderChart(this.chartData, this.chartOptions)
    },
  })
}

registerComponent('BarChart', Bar)
registerComponent('DoughnutChart', Doughnut)
registerComponent('LineChart', Line)
registerComponent('PieChart', Pie)
