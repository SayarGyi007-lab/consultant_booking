export interface loginInputs{
    email: string,
    password: string
}

export interface registerInputs extends loginInputs{
    firstName: string,
    lastName: string,
    phone: string
}

export interface updateUserInputs{
    firstName?: string,
    lastName?: string,
    email?: string,
    phone?: string
}

export interface QueryParams {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
  order?: "asc" | "desc",
  expertise?: string,
  status?: string
}

//response
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  role: "ADMIN" | "USER"
  createdAt: string
  updatedAt: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface UsersResponse {
  success: boolean
  data: User[]
  pagination: Pagination
}