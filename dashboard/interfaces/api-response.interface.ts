export interface ICollectionResponse<T> {
  meta: {
    status: number
    message: string
    limit: number
    hasPrevPage: boolean
    hasNextPage: boolean
    hasMore: boolean
    totalDocs: number
    totalPages: number
    page: number
    pagingCounter: number
    nextPage: number
  }
  data: T[]
}

export interface IApiResponse<T> {
  meta: {
    status: number
    message: string
  }
  data: T
}
