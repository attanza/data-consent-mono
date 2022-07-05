enum ETableAlign {
  START = 'start',
  CENTER = 'center',
  END = 'end',
}

export interface ITableHeader {
  text: string
  value: string
  align?: ETableAlign
  sortable?: boolean
  filterable?: boolean
  divider?: boolean
  class?: string | string[]
  width?: string | number
  filter?: (value: any, search: string, item: any) => boolean
  sort?: (a: any, b: any) => number
}
