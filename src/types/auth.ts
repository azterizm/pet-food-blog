export type AuthType = 'user' | 'author'

export interface DBEssentials {
  id: number
  createdAt: Date
  updatedAt: Date
}
export type AuthUser = DBEssentials & IUser & { type: AuthType }
export interface IUser extends DBEssentials {
  email: string
  username: string
  name: string
  createdAt: Date
  type: string
  deposit: number
  id: number
}
