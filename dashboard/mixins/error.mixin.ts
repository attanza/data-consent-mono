import { Component, Vue } from 'vue-property-decorator'
import { ISnackbar } from '~/interfaces/snackbar.interface'
@Component
export class ErrorMixin extends Vue {
  catchError(e: any) {
    if (e.response && e.response.status) {
      const status: Number = e.response.status
      const message: any = e.response.data.meta.message
      if (status === 401) {
        this.$auth.logout()
        this.$router.push('/login')
        return this.activateSnackbar('error', message)
      }

      if (status === 400) {
        let errorMessage = ''
        if (message instanceof Array) {
          errorMessage = message[0]
        } else {
          errorMessage = message
        }
        return this.activateSnackbar('error', errorMessage)
      }

      if (status === 404) {
        return this.activateSnackbar('error', message)
      }
      if (status === 403) {
        return this.activateSnackbar('error', message)
      }
    } else {
      return this.activateSnackbar('error', e)
    }
  }

  activateSnackbar(color: string, text: string) {
    const snackbarData: ISnackbar = { color, text, show: true }
    this.$store.commit('SET_SNACKBAR', snackbarData)
  }

  deactivateSnackbar() {
    const snackbarData: ISnackbar = { color: 'success', text: '', show: false }
    this.$store.commit('SET_SNACKBAR', snackbarData)
  }

  activateGlobalLoading(val: boolean) {
    this.$store.commit('SET_GLOBAL_LOADING', val)
  }
}
