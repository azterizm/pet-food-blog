import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { ISave } from '@backend/models/save'
import { useHookstate } from '@hookstate/core'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import List from '../components/home/List'
import PageIndicator from '../components/home/PageIndicator'
import { Recipes } from '../components/home/Recipes'
import Title from '../components/home/Title'
import { AuthorSortValues } from '../constants/api'
import '../css/home.css'
import { useApi } from '../hooks/api'
import {
  AuthorTotalRecipe,
  categories,
  Category,
  categoryLabel,
} from '../types/api'
import { SortBy } from '../types/ui'

export function Home() {
  const [activePage, setActivePage] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const filter = useHookstate<
    { sortBy: SortBy; category: Category | null; page: number }
  >({
    sortBy: SortBy.Newest,
    category: null,
    page: 0,
  })

  const { data, error, loading } = useApi<{
    recipes: (IRecipe & {
      author: IAuthor
      saves: ISave[]
      userLiked: boolean
    })[]
    authorTotalRecipes: AuthorTotalRecipe[]
    total: number
  }>(
    `/recipe/get_client_recipes/${filter.category.value}/${
      AuthorSortValues[filter.sortBy.value]
    }/${filter.page.value * 30}`,
    {
      debounce: 800,
      onSuccess: () => window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }),
    },
    [filter],
  )

  return (
    <div
      className={classNames(
        'transition duration-500 relative',
        mounted ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10',
      )}
    >
      <Title
        title='Discover'
        subTitle='Yummy Recipes'
        onChangeSortBy={filter.sortBy.set}
        sortBy={filter.sortBy.value}
      />
      <List
        data={categories.map((r) => ({  key: r, value: categoryLabel[r]}))}
        value={filter.category.value}
        onChange={filter.category.set}
      />
      <PageIndicator active={activePage} />
      <Recipes data={data} error={error} loading={loading} />
      {data && data?.total > data?.recipes.length && (
        <div
          id='more_recipes_button'
          className='flex items-center gap-2 justify-center'
        >
          {filter.page.value > 0 && (
            <button
              onClick={() => (filter.page.set((e) => e > 0 ? e - 1 : 0),
                setActivePage((e) => e <= 0 ? 3 : e - 1))}
              className='px-6 py-3 rounded-full bg-secondary font-medium c-white block border-none'
            >
              Go back
            </button>
          )}

          {data?.total > (data?.recipes.length + (filter.page.value * 30)) &&
            (
              <button
                onClick={() => (filter.page.set((e) => e + 1),
                  setActivePage((e) => e === 3 ? 0 : e + 1))}
                className='px-6 py-3 rounded-full bg-white border-2 border-gray-300 font-medium c-black block'
              >
                More recipes
              </button>
            )}
        </div>
      )}
    </div>
  )
}
