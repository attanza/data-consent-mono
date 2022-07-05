export interface ISnackbar {
  text: string
  color: string
  show: boolean
}

export const snackbarInit = {
  text: '',
  color: 'error',
  show: false,
}
