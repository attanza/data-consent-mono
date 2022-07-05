import { EApplicationType } from '~/interfaces/aplication-type.enum'
import { EFormItemElement, IFormItem } from '~/interfaces/form-item.interface'
import { ITableHeader } from '~/interfaces/table-header.interface'
import moment from '~/utils/moment'

export const headers: ITableHeader[] = [
  { text: 'NIK', value: 'nik' },
  { text: 'Source', value: 'source' },
  { text: 'Name', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Phone', value: 'phone' },
  { text: 'Actions', value: 'actions', sortable: false },
]

export const formItems: IFormItem[] = [
  {
    key: 'nik',
    caption: 'NIK',
    el: EFormItemElement.TEXT,
    rules: 'required|max:250',
  },
  {
    key: 'name',
    caption: 'Name',
    el: EFormItemElement.TEXT,
    rules: 'required|max:150',
  },
  {
    key: 'email',
    caption: 'Email',
    el: EFormItemElement.TEXT,
    rules: 'email',
  },
  {
    key: 'phone',
    caption: 'Phone',
    el: EFormItemElement.TEXT,
    rules: 'max:20',
  },
  {
    key: 'source',
    caption: 'Source',
    el: EFormItemElement.COMBOBOX,
    rules: 'required',
    items: Object.values(EApplicationType).map((t: string) => ({
      _id: t,
      name: t,
    })),
  },
  {
    key: 'term',
    caption: 'Term',
    el: EFormItemElement.COMBOBOX,
    rules: 'required',
    items: [],
  },
]

export const generateDownloadData = (items: any): any => {
  const dataToDownload: any[] = []
  const keys = ['name', 'nik', 'email', 'phone', 'source', 'createdAt']
  items.forEach((i: any): void => {
    const data: any = {}
    for (const key of keys) {
      if (i[key]) {
        if (key === 'createdAt') {
          data[key] = moment(i[key]).format('YYYY-MM-DD')
        } else {
          data[key] = i[key]
        }
      }
    }
    dataToDownload.push(data)
  })
  return dataToDownload
}

const util = {}

export default util
