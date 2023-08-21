import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { ISave } from '@backend/models/save'
import { useHookstate } from '@hookstate/core'
import List from '../components/home/List'
import { Recipes } from '../components/home/Recipes'
import Title from '../components/home/Title'
import { AuthorSortValues } from '../constants/api'
import '../css/home.css'
import { useApi } from '../hooks/api'
import { AuthorTotalRecipe, Category } from '../types/api'
import { SortBy } from '../types/ui'

export function Home() {
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
    }/${filter.page.value * 10}`,
    { debounce: 800, onSuccess:()=>window.scrollTo({top:0,left:0,behavior:'smooth'}) },
    [filter],
  )

  return (
    <div className='relative'>
      <Title onChangeSortBy={filter.sortBy.set} sortBy={filter.sortBy.value} />
      <List
        category={filter.category.value}
        onChangeCategory={filter.category.set}
      />
      <Recipes data={data} error={error} loading={loading} />
      {data && data?.total > data?.recipes.length
        ? (
          <div className='flex items-center gap-2 justify-center'>
            {filter.page.value > 0 && (
              <button
                onClick={() => filter.page.set((e) => e > 0 ? e - 1 : 0)}
                className='px-6 py-3 rounded-full bg-secondary font-medium c-white block mt-32 border-none'
              >
                Go back
              </button>
            )}
            {data?.total > (data?.recipes.length + (filter.page.value * 10)) &&
              (
                <button
                  onClick={() => filter.page.set((e) => e + 1)}
                  className='px-6 py-3 rounded-full bg-neutral-600 font-medium c-white block mt-32 border-none'
                >
                  More recipes
                </button>
              )}
          </div>
        )
        : null}
    </div>
  )
}
