import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { IVetInfo } from '@backend/models/vetInfo'
import { AuthorSort } from '@backend/zod/api'

export interface Recipe {
  ingredients: string[]
  categories: string[]
  title: string
  id: number
  mainImage: string
  createdAt: Date
  duration: number
  price: number
  status: string
  servings: number
  lang: string
  author: Author
}
export interface Author {
  id: number
  name: string
}

export type Category = (typeof categories)[number]

export const categories = [
  'meal',
  'health',
  'desert',
  'treat',
  'birthday',
  'season',
  'raw',
  'cooked',
  'vegan',
] as const

export const categoryLabel = {
  meal: 'Meals',
  birthday: 'Birthday',
  cooked: 'Cooked',
  desert: 'Dessert',
  health: 'Health condition',
  raw: 'Raw',
  season: 'Seasonal',
  treat: 'Treats',
  vegan: 'Vegetarian',
} as Record<Category, string>

export const sortLabel = {
  new: 'Newest',
  popular: 'Popular',
  liked: 'Most liked',
} as Record<NonNullable<AuthorSort>, string>

export interface Author {
  id: number
  email: string
  username: string
  phone: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export interface ApiProcess {
  error: boolean
  info: string
}
export interface AuthorTotalRecipe {
  id: number
  total: number
}

export interface RecipeReadData extends IRecipe {
  author: IAuthor & { recipes: IRecipe[] }
  userLiked: boolean
  userSaved: boolean
  popular: (IRecipe & { likes: number })[]
  likes: number
  vetinfo?: IVetInfo
  following: boolean
  availableLanguages: { lang: string; id: number }[]
  views: number
}
