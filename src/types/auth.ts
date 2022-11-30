import { IUser as UserT } from '@backend/models/user'
export type AuthType = 'user' | 'author'

export interface DBEssentials {
  id: number
  createdAt: Date
  updatedAt: Date
}

export type AuthUser = IUser
export interface IUser extends UserT {
  type: AuthType
}
