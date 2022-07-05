import { EApplicationType } from '~/interfaces/aplication-type.enum'
import { EFormItemElement, IFormItem } from '~/interfaces/form-item.interface'
import { ITableHeader } from '~/interfaces/table-header.interface'
import moment from '~/utils/moment'

export const headers: ITableHeader[] = [
  { text: 'Content', value: 'content' },
  { text: 'Source', value: 'source' },
  { text: 'Created', value: 'createdAt' },
]

export const formItems: IFormItem[] = [
  {
    key: 'content',
    caption: 'Content',
    el: EFormItemElement.TEXTAREA,
    rules: 'required',
  },
  {
    key: 'source',
    caption: 'Source',
    el: EFormItemElement.COMBOBOX,
    rules: 'required',
    items: [],
  },
]

export const generateDownloadData = (items: any): any => {
  const dataToDownload: any[] = []
  const keys = ['content', 'createdAt']
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
