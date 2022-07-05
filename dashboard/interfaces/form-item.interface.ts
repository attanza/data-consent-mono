export interface IItems {
  _id: string
  name: string
}

export interface IFormItem {
  key: string
  caption: string
  el: EFormItemElement
  rules: string
  placeholder?: string
  disabled?: boolean
  hidden?: boolean
  multiple?: boolean
  type?: string
  cacheItems?: boolean
  items?: IItems[]
  onChange?: any
}

export enum EFormItemElement {
  API_COMBOBOX = 'apiCombobox',
  COMBOBOX = 'combobox',
  DATE = 'date',
  EDITOR = 'editor',
  SWITCH = 'switch',
  TEXT = 'text',
  TEXTAREA = 'textarea',
  TIME = 'time',
}
