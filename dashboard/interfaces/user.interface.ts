export interface IUser {
  _id: string
  name: string
  email: string
  password: string
  role: EUserRole
  isActive: boolean
  createdAt?: Date
  updatedAt?: Date
}

export enum EUserRole {
  VIEWER = 'VIEWER',
  EDITOR = 'EDITOR',
  ADMIN = 'ADMIN',
}
