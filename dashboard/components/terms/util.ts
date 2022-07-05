import { EApplicationType } from '~/interfaces/aplication-type.enum'
import { EFormItemElement, IFormItem } from '~/interfaces/form-item.interface'
import { ITableHeader } from '~/interfaces/table-header.interface'
import moment from '~/utils/moment'

export const headers: ITableHeader[] = [
  { text: 'Title', value: 'title' },
  { text: 'Source', value: 'source' },
  { text: 'Created', value: 'createdAt' },
]

export const formItems: IFormItem[] = [
  {
    key: 'title',
    caption: 'Title',
    el: EFormItemElement.TEXT,
    rules: 'required',
  },
  {
    key: 'source',
    caption: 'Source',
    el: EFormItemElement.COMBOBOX,
    rules: 'required',
    items: [],
  },
  {
    key: 'isPublish',
    caption: 'Publish',
    el: EFormItemElement.SWITCH,
    rules: '',
  },
  {
    key: 'content',
    caption: 'Content',
    el: EFormItemElement.EDITOR,
    rules: 'required',
  },
  {
    key: 'checkLists',
    caption: 'Check Lists',
    el: EFormItemElement.COMBOBOX,
    multiple: true,
    items: [],
    rules: 'required',
    cacheItems: false,
  },
]

export const generateDownloadData = (items: any): any => {
  const dataToDownload: any[] = []
  const keys = ['title', 'content', 'isPublish', 'source', 'createdAt']
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
