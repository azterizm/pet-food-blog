import {
  Balloon,
  Cake,
  CookingPot,
  Egg,
  ForkKnife,
  Heart,
  Leaf,
} from 'phosphor-react'
import { ReactElement } from 'react'
import { Category } from '../../types/api'

export const categoryRenders: CategoriesUI = [
  {
    value: 'meal',
    icon: <CookingPot size={24} />,
    color: ['#fde68a', '#b45309'],
  },
  {
    value: 'health',
    icon: <Heart size={24} />,
    color: ['#fecaca', '#b91c1c'],
  },
  {
    value: 'dessert',
    icon: <Cake size={24} />,
    color: ['#bfdbfe', '#1d4ed8'],
  },
  {
    value: 'treat',
    icon: (
      <img width={24} height={24} src='/icons/dog-treat.png' alt='dog treat' />
    ),
    color: ['#e9d5ff', '#7e22ce'],
  },
  {
    value: 'birthday',
    icon: <Balloon size={24} />,
    color: ['#fbcfe8', '#be185d'],
  },
  {
    value: 'season',
    icon: <ForkKnife size={24} />,
    color: ['#b5179e', '#fbcfe8'],
  },
  {
    value: 'raw',
    icon: <Egg size={24} />,
    color: ['#fff', '#3f37c9'],
  },
  {
    value: 'cooked',
    icon: <CookingPot size={24} />,
    color: ['#22577a', '#38a3a5'],
  },
  {
    value: 'vegan',
    icon: <Leaf size={24} />,
    color: ['#57cc99', 'rgb(68, 68, 68)'],
  },
]

export type CategoriesUI = {
  value: Category
  icon: ReactElement
  color: [string, string]
}[]
