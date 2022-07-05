import { IFormItem } from '~/interfaces/form-item.interface'
import { ITableHeader } from '~/interfaces/table-header.interface'
import moment from '~/utils/moment'

export const headers: ITableHeader[] = [
  { text: 'Action', value: 'action' },
  { text: 'User', value: 'userId' },
  { text: 'Resource', value: 'resource' },
  { text: 'Created', value: 'createdAt' },
]

export const formItems: IFormItem[] = []

export const generateDownloadData = (items: any): any => {
  const dataToDownload: any[] = []
  const keys = [
    'userId',
    'email',
    'resource',
    'resourceId',
    'action',
    'prevData',
    'Data',
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
