export enum ESortMode {
  ASC = 'asc',
  DESC = 'desc',
}

export interface IRequestQuery {
  page: number
  limit: number
  search?: string
  sortBy: string
  sortMode: ESortMode
  dateField?: string
  dateStart?: Date
  dateEnd?: Date
  fieldKey?: string
  fieldValue?: string
}
