export interface IAuditTrail {
  _id: string
  ip: string
  userId: string
  email: string
  resource: string
  resourceId: string
  action: string
  prevData: string
  data: string
  createdAt: string
  updatedAt: string
}
