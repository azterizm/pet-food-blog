import { capitalize } from 'lodash'
import moment from 'moment'
import { API_ENDPOINT } from '../constants/api'
import { RecipeReadData } from '../types/api'

export function constructRecipeSchema(data: RecipeReadData) {
  const cookTime = moment.duration(data.duration / 2, 'minute').toISOString()
  return {
    '@context': 'https://schema.org/',
    '@type': 'Recipe',
    name: data.title,
    image: [API_ENDPOINT + data.mainImage],
    author: {
      '@type': 'Person',
      name: data.author.name,
    },
    datePublished: new Date(data.createdAt || '').toISOString().split('T')[0],
    description: data.intro,
    prepTime: cookTime,
    cookTime,
    totalTime: moment.duration(data.duration, 'minute').toISOString(),
    keywords: data.tags.join(', '),
    recipeYield: data.servings + ' serving',
    recipeCategory: capitalize(data.categories[0]),
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '5',
      ratingCount: data.likes,
    },
    recipeIngredient: [data.ingredients.map((r) => r.items).flat()],
    recipeInstructions: data.instructions.map((r) => stripHTML(r)),
  }
}

export function stripHTML(arg: string) {
  return arg.replace(/<[^>]+>/g, '')
}
