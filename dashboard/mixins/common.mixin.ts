import { Component, Vue } from 'vue-property-decorator'
import { EUserRole, IUser } from '~/interfaces/user.interface'
@Component
export class CommonMixin extends Vue {
  get currentEdit() {
    return this.$store.state.currentEdit
  }

  get comboData() {
    return this.$store.state.comboData
  }

  get user(): IUser {
    return this.$store.state.auth.user as IUser
  }

  get userRole(): EUserRole {
    return this.user.role
  }

  get vuexFormData() {
    return this.$store.state.formData
  }

  get globalLoading(): boolean {
    return this.$store.state.globalLoading
  }

  checkRole(roles: string): boolean {
    return roles.split(' ').includes(this.userRole)
  }

  checkDoUpdate(data1: any, data2: any): boolean {
    let doUpdate = false
    Object.keys(data1).forEach((key): void => {
      if (data1[key] !== data2[key]) {
        doUpdate = true
      }
    })
    return doUpdate
  }

  back(): void {
    this.$router.go(-1)
  }
}
