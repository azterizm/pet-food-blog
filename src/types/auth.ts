export type AuthType = 'user' | 'author'

export interface DBEssentials {
  id: number
  createdAt: Date
  updatedAt: Date
}
export type AuthUser = IAuthor & DBEssentials & IUser & { type: AuthType }
export interface IAuthor extends DBEssentials {
  name: string
  email: string
  username: string
  phone: string
}
export interface IUser extends DBEssentials {
  name: string
  email: string
  username: string
  phone: string
  deposit: number
}
