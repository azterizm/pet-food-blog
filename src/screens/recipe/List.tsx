import { CaretDown, CaretUp } from 'phosphor-react'
import Paginate from 'react-paginate'
import { ReactElement, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Recipe } from '../../components/home/Recipe'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import { useApi } from '../../hooks/api'
import { categories, Category, categoryLabel, sortLabel } from '../../types/api'
import { AuthorSort } from '@backend/zod/api'
import { IRecipe } from '@backend/models/recipe'
import { IAuthor } from '@backend/models/author'

const OFFSET = 20

export function RecipeList(): ReactElement {
  const [category, setCategory] = useState<Category>('meal')
  const [sort, setSort] = useState<AuthorSort>('new')
  const [showSort, setShowSort] = useState(false)
  const [page, setPage] = useState(0)
  const { data, error, loading } = useApi<{
    recipes: (IRecipe & { author: IAuthor })[]
    total: number
  }>(
    `/recipe/get_client_recipes/${category}/${sort}/${page * OFFSET}`,
    { debounce: 800 },
    [sort, category]
  )
  const navigate = useNavigate()
  return (
    <div className='min-h-100vh'>
      <div className='text-center my-10'>
        <span className='text-4xl block font-bold mb-2'>Recipes</span>
        <span>All the food your pet ever needs.</span>
      </div>
      <div className='justify-center mt-5 flex flex-wrap items-center gap-5'>
        {categories.map((r, i) => (
          <div
            className={
              'block px-5 py-2 rounded-full cursor-pointer ' +
              (category === r ? 'bg-primary c-white' : 'bg-gray-300 c-black')
            }
            key={'category_' + i}
            onClick={() => setCategory(r)}
          >
            {categoryLabel[r]}
          </div>
        ))}
      </div>
      <div
        className={
          'mb-5 mt-10 flex justify-between items-center relative  border-element w-max p-3 rounded-t-lg hover:border-1 ' +
          (showSort ? 'border-t-2 border-l-2 border-r-2' : 'rounded-b-lg')
        }
      >
        <div
          onClick={() => setShowSort((e) => !e)}
          className='flex items-center gap-2 cursor-pointer'
        >
          {showSort ? <CaretUp size={16} /> : <CaretDown size={16} />}
          <span>Sort by: {!sort ? null : sortLabel[sort]}</span>
        </div>
        {showSort ? (
          <div className='absolute top-12 left--0.5 flex flex-col items-start z-2 bg-white w-full'>
            {Object.keys(sortLabel)
              .filter((r) => r !== sort)
              .map((key: any, i) => (
                <span
                  onClick={() => (setSort(key), setShowSort(false))}
                  key={i}
                  className={
                    i === 0
                      ? 'p-3 w-86% border-2 border-element bg-white hover:bg-neutral-100 cursor-pointer'
                      : 'p-3 w-86% border-2 border-t-0 rounded-b-lg border-element bg-white hover:bg-neutral-100 cursor-pointer'
                  }
                >
                  {(sortLabel as any)[key]}
                </span>
              ))}
          </div>
        ) : null}
      </div>
      {loading ? (
        <Loader />
      ) : error ? (
        <span>{error}</span>
      ) : data && data.recipes.length ? (
        <div>
          <div className='flex flex-wrap gap-10 items-center'>
            {data.recipes.map((r) => (
              <Recipe
                authors={[r.author]}
                duration={r.duration}
                image={API_ENDPOINT + r.mainImage}
                postedOn={r.createdAt!}
                reviews={r.likes}
                title={r.title}
                onClick={() => navigate('/recipes/read/' + r.id)}
                priceType={r.priceType}
                key={r.id}
              />
            ))}
          </div>
          {data.total > data.recipes.length ? (
            <Paginate
              pageCount={Math.floor(data.total / 20)}
              breakLabel='...'
              containerClassName='list_nav flex justify-center items-center gap-10 list-none'
              onPageChange={(e) => setPage(e.selected)}
            />
          ) : null}
        </div>
      ) : (
        <span>No recipes are avialable yet. Please try again later.</span>
      )}
    </div>
  )
}
