import { ICheckList } from './check-list.interface'
import { ISource } from './source.interface'

export interface ITerm {
  _id: string
  title: string
  content: string
  source: ISource
  isPublish: boolean
  checkLists: ICheckList[]
  createdAt: string
  updatedAt: string
}
