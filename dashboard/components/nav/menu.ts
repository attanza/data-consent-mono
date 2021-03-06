import { EUserRole } from '~/interfaces/user.interface'

export interface IMenu {
  title: string
  icon: string
  to: string
  role?: EUserRole[]
}

const menus: IMenu[] = [
  { title: 'Dashboard', icon: 'dashboard', to: '/' },
  { title: 'Users', icon: 'people', to: '/users', role: [EUserRole.ADMIN] },
  { title: 'Sources', icon: 'source', to: '/sources' },
  { title: 'Check Lists', icon: 'rule', to: '/check-lists' },
  { title: 'Terms', icon: 'gavel', to: '/terms' },
  { title: 'Consents', icon: 'verified', to: '/consents' },
  {
    title: 'Audit Trails',
    icon: 'subject',
    to: '/audit-trails',
    role: [EUserRole.ADMIN],
  },
]

export default menus
