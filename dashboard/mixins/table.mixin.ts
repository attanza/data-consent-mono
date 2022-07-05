import { ExportToCsv } from 'export-to-csv'
import { Component, Vue } from 'vue-property-decorator'
import { ESortMode, IRequestQuery } from '~/interfaces/request-query.interface'
import { ISnackbar } from '~/interfaces/snackbar.interface'
import { ITableOptions } from '~/interfaces/table-options.interface'

@Component
export class TableMixin extends Vue {
  loading = false
  items: any[] = []
  total: number = 0
  options: ITableOptions = {
    search: '',
    page: 1,
    itemsPerPage: 10,
    sortBy: ['createdAt'],
    sortDesc: [true],
  }

  footerProps = {
    itemsPerPageOptions: [10, 25, 50, 100],
  }

  showForm = false
  showConfirm = false

  getQueries(): string {
    const sortMode = this.options.sortDesc[0] ? ESortMode.DESC : ESortMode.ASC
    const requestQuery: IRequestQuery = {
      page: Number(this.options.page) || 1,
      limit: Number(this.options.itemsPerPage) || 10,
      sortBy: this.options.sortBy[0],
      sortMode,
    }
    if (this.options.search && this.options.search !== '') {
      requestQuery.search = this.options.search
    }
    let query = '?'
    Object.keys(requestQuery).map(
      (key) =>
        (query += `${key}=${requestQuery[key as keyof typeof requestQuery]}&`)
    )
    return query
  }

  generateCsv(data: any, title: string) {
    const options = {
      filename: title,
      fieldSeparator: ',',
      quoteStrings: '"',
      decimalSeparator: '.',
      showLabels: true,
      showTitle: true,
      title,
      useTextFile: false,
      useBom: true,
      useKeysAsHeaders: true,
    }
    const csvExporter = new ExportToCsv(options)

    csvExporter.generateCsv(data)
  }

  strLimit(str: string, limit: number) {
    if (str.length > limit) {
      return str.substr(1, limit) + '...'
    }
    return str
  }

  mqttAction(topic: string, message: string): void {
    const mainTopic = topic.split('/')[1]
    const subTopic = topic.split('/')[2]
    const parsedMessage = JSON.parse(message)
    if (subTopic === 'create') {
      const idx = this.items.findIndex((i) => i._id === parsedMessage._id)
      if (idx === -1) {
        this.items.unshift(parsedMessage)
        this.activateSnackbar('success', `${mainTopic} data has been added`)
      }
    }
    if (subTopic === 'update') {
      const idx = this.items.findIndex((i) => i._id === parsedMessage._id)
      if (idx !== -1) {
        this.items.splice(idx, 1, parsedMessage)
        this.activateSnackbar('success', `${mainTopic} data has been updated`)
      }
    }
    if (subTopic === 'delete') {
      const idx = this.items.findIndex((i) => i._id === parsedMessage._id)
      if (idx !== -1) {
        this.items.splice(idx, 1)
        this.activateSnackbar('success', `${mainTopic} data has been deleted`)
      }
    }
  }

  activateSnackbar(color: string, text: string) {
    const snackbarData: ISnackbar = { color, text, show: true }
    this.$store.commit('SET_SNACKBAR', snackbarData)
  }

  async getSources() {
    try {
      const resp = await this.$axios.$get('/sources?limit100&select=name')
      return resp.data
    } catch (error) {
      console.log('error', error)
    }
  }
}
