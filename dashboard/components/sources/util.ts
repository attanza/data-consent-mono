import { EApplicationType } from '~/interfaces/aplication-type.enum'
import { EFormItemElement, IFormItem } from '~/interfaces/form-item.interface'
import { ITableHeader } from '~/interfaces/table-header.interface'
import moment from '~/utils/moment'

export const headers: ITableHeader[] = [
  { text: 'Name', value: 'name' },
  { text: 'Description', value: 'description' },
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
    key: 'description',
    caption: 'Description',
    el: EFormItemElement.TEXTAREA,
    rules: '',
  },
  {
    key: 'clientId',
    caption: 'Client ID',
    el: EFormItemElement.TEXT,
    rules: '',
    disabled: true,
  },
  {
    key: 'clientSecret',
    caption: 'Client Secret',
    el: EFormItemElement.TEXT,
    rules: '',
    disabled: true,
  },

  {
    key: 'ipAddresses',
    caption: 'IP Addresses, separated by comma',
    el: EFormItemElement.TEXT,
    rules: '',
  },
]

export const generateDownloadData = (items: any): any => {
  const dataToDownload: any[] = []
  const keys = [
    'name',
    'description',
    'clientId',
    'clientSecret',
    'ipAddresses',
    'createdAt',
  ]
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
