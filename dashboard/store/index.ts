import { ActionTree, GetterTree, MutationTree } from 'vuex'
import { IItems } from '~/interfaces/form-item.interface'
import { ISnackbar } from '~/interfaces/snackbar.interface'
import { IUser } from '~/interfaces/user.interface'

export const state = () => ({
  globalLoading: false,
  snackbar: {
    text: '',
    color: 'success',
    show: false,
  },
  currentEdit: {},
  comboData: [],
  formData: {},
  comboSearch: {
    url: '',
    items: [] as IItems[],
  },
})

export type RootState = ReturnType<typeof state>

export const getters: GetterTree<RootState, RootState> = {}

export const mutations: MutationTree<RootState> = {
  SET_GLOBAL_LOADING: (state, val: boolean) => {
    state.globalLoading = val
  },
  SET_SNACKBAR: (state, val: ISnackbar) => {
    state.snackbar = { ...state.snackbar, ...val }
  },
  SET_CURRENT_EDIT: (state, val: any) => {
    state.currentEdit = val
  },
  SET_COMBO_DATA: (state, val: any) => {
    state.comboData = val
  },
  SET_USER: (state, val: IUser) => {
    // @ts-ignore
    state.auth.user = val
  },
  SET_FORM_DATA: (state, val: IUser) => {
    state.formData = { ...val }
  },
  SET_COMBO_SEARCH: (state, val) => {
    const currentComboSearch = state.comboSearch
    state.comboSearch = { ...currentComboSearch, ...val }
  },
}

export const actions: ActionTree<RootState, RootState> = {
  catchError({ commit }, error) {
    if (error.response && error.response.data) {
      const { meta } = error.response.data
      commit('SET_SNACKBAR', {
        text: meta.message,
        show: true,
        color: 'error',
      })
    } else {
      commit('SET_SNACKBAR', { text: error, show: true, color: 'error' })
    }
  },
  // async onComboSearch({ commit, state }, value) {
  //   const { url } = state.comboSearch
  //   const queries = `&search=${value}`
  //   const items: IItems[] = []
  //   if (url !== '' && value) {
  //     const resp = await this.$axios.$get(url + queries).then((res) => res.data)
  //     resp.map((item: IItems) =>
  //       items.push({
  //         _id: item._id,
  //         name: `${item.firstName} ${item.lastName} | ${item.email}`,
  //       })
  //     )
  //     commit('SET_COMBO_SEARCH', { items })
  //   }
  // },
}
