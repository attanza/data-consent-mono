import { IConsent } from './consent.interface'
import { ISource } from './source.interface'
import { ITerm } from './term.interface'

export interface ICheckList {
  _id: string
  content: string
  source: ISource
  term: ITerm
  consent: IConsent
  createdAt: string
  updatedAt: string
}
