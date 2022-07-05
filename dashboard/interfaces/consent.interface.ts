import { ICheckList } from './check-list.interface'
import { ISource } from './source.interface'
import { ITerm } from './term.interface'

export interface IConsent {
  _id: string
  name: string
  nik: string
  cif: string
  phone: string
  email: string
  source: ISource
  term: ITerm
  checkLists: ICheckList[]
  createdAt: string
  updatedAt: string
}
