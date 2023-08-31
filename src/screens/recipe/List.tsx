import { IAuthor } from '@backend/models/author'
import { IRecipe } from '@backend/models/recipe'
import { ISave } from '@backend/models/save'
import { AuthorSort } from '@backend/zod/api'
import _ from 'lodash'
import { CaretDown, CaretUp } from 'phosphor-react'
import { ReactElement, useEffect, useState } from 'react'
import Paginate from 'react-paginate'
import { useLocation, useNavigate } from 'react-router-dom'
import { Recipe } from '../../components/home/Recipe'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT, PAGE_OFFSET } from '../../constants/api'
import { isSavedRecipe, onSaveRecipe } from '../../features/save'
import { useApi, useAuth } from '../../hooks/api'
import { categories, Category, categoryLabel, sortLabel } from '../../types/api'

interface ApiResponse {
  recipes: (IRecipe & {
    author: IAuthor
    saves: ISave[]
    userLiked: boolean
  })[]
  total: number
}

export function RecipeList(): ReactElement {
  const navigate = useNavigate()
  const [user] = useAuth()

  const [category, setCategory] = useState<Category | null>(null)
  const [sort, setSort] = useState<AuthorSort>('new')
  const [showSort, setShowSort] = useState(false)
  const [page, setPage] = useState(0)
  const [data, setData] = useState<ApiResponse['recipes']>([])

  const { data: newData, error, loading } = useApi<ApiResponse>(
    `/recipe/get_client_recipes/${category}/${sort}/${page * PAGE_OFFSET}`,
    {
      debounce: 800,

      onSuccess: (e: ApiResponse) => {
        setData((v) => (_.uniqBy([...v, ...e.recipes], 'id')))
      },
    },
    [sort, category],
  )

  const { state } = useLocation()

  useEffect(() => {
    const category = state?.category as Category
    if (category) setCategory(category)
  }, [])

  return (
    <div className='min-h-100vh'>
      <div className='text-center my-10'>
        <span className='text-4xl block font-bold mb-2'>Recipes</span>
        <span>All the food your pet ever needs.</span>
      </div>
      <div className='justify-center mt-5 flex flex-wrap items-center gap-5'>
        <div
          className={'block px-5 py-2 rounded-full cursor-pointer ' +
            (!category ? 'bg-primary c-white' : 'bg-gray-300 c-black')}
          onClick={() => setCategory(null)}
        >
          All
        </div>
        {categories.map((r, i) => (
          <div
            className={'block px-5 py-2 rounded-full cursor-pointer ' +
              (category === r ? 'bg-primary c-white' : 'bg-gray-300 c-black')}
            key={'category_' + i}
            onClick={() => setCategory(r)}
          >
            {categoryLabel[r]}
          </div>
        ))}
      </div>
      <div
        className={'mb-5 mt-10 flex justify-between items-center relative  border-element w-max p-3 rounded-t-lg hover:border-1 ' +
          (showSort ? 'border-t-2 border-l-2 border-r-2' : 'rounded-b-lg')}
      >
        <div
          onClick={() => setShowSort((e) => !e)}
          className='flex items-center gap-2 cursor-pointer'
        >
          {showSort ? <CaretUp size={16} /> : <CaretDown size={16} />}
          <span>Sort by: {!sort ? null : sortLabel[sort]}</span>
        </div>
        {showSort
          ? (
            <div className='absolute top-12 left--0.5 flex flex-col items-start z-2 bg-white w-full'>
              {Object.keys(sortLabel)
                .filter((r) => r !== sort)
                .map((key: any, i) => (
                  <span
                    onClick={() => (setSort(key), setShowSort(false))}
                    key={i}
                    className={i === 0
                      ? 'p-3 w-86% border-2 border-element bg-white hover:bg-neutral-100 cursor-pointer'
                      : 'p-3 w-86% border-2 border-t-0 rounded-b-lg border-element bg-white hover:bg-neutral-100 cursor-pointer'}
                  >
                    {(sortLabel as any)[key]}
                  </span>
                ))}
            </div>
          )
          : null}
      </div>
      {loading
        ? <Loader />
        : error
        ? <span>{error}</span>
        : data && data.length
        ? (
          <div>
            <div className='flex flex-wrap gap-10 items-start'>
              {data.map((r) => (
                <Recipe
                  intro={r.intro}
                  mainImage={r.mainImage}
                  tags={r.tags}
                  author={r.author}
                  userLiked={r.userLiked}
                  id={r.id!}
                  duration={r.duration}
                  image={API_ENDPOINT + r.mainImage}
                  postedOn={r.createdAt!}
                  likesCount={r.likesDisplay}
                  title={decodeURIComponent(r.title)}
                  onClick={() =>
                    navigate('/recipes/read/' + r.id + '/' + r.slug)}
                  priceType={r.priceType}
                  key={r.id}
                  categories={r.categories}
                  price={r.price}
                  authorTotalRecipes={0}
                  onSave={() => onSaveRecipe({ user, id: r.id })}
                  saved={isSavedRecipe({ data: r, user, id: r.id })}
                />
              ))}
            </div>
            {newData && newData.total > data.length
              ? (
                <Paginate
                  pageCount={Math.floor(newData.total / PAGE_OFFSET)}
                  breakLabel='...'
                  containerClassName='list_nav flex justify-center items-center gap-10 list-none'
                  onPageChange={(e) => setPage(e.selected)}
                />
              )
              : null}
          </div>
        )
        : <span>No recipes are avialable yet. Please try again later.</span>}
    </div>
  )
}
