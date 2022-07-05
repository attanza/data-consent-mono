import { EApplicationType } from '~/interfaces/aplication-type.enum'
import { EFormItemElement, IFormItem } from '~/interfaces/form-item.interface'
import { ITableHeader } from '~/interfaces/table-header.interface'
import { EUserRole } from '~/interfaces/user.interface'
import moment from '~/utils/moment'

export const headers: ITableHeader[] = [
  { text: 'Name', value: 'name' },
  { text: 'Email', value: 'email' },
  { text: 'Role', value: 'role' },
  { text: 'Created', value: 'createdAt' },
]

export const formItems: IFormItem[] = [
  {
    key: 'name',
    caption: 'Name',
    el: EFormItemElement.TEXT,
    rules: 'required',
  },
  {
    key: 'email',
    caption: 'Email',
    el: EFormItemElement.TEXT,
    rules: 'required|email',
    items: [],
  },
  {
    key: 'password',
    caption: 'Password',
    el: EFormItemElement.TEXT,
    rules: 'required|min:8',
    items: [],
    type: 'password',
  },
  {
    key: 'role',
    caption: 'Role',
    el: EFormItemElement.COMBOBOX,
    items: Object.values(EUserRole).map((role) => ({ _id: role, name: role })),
    rules: 'required',
    cacheItems: true,
  },
]

export const generateDownloadData = (items: any): any => {
  const dataToDownload: any[] = []
  const keys = ['name', 'email', 'role', 'createdAt']
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
