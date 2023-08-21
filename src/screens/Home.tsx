import { useHookstate } from '@hookstate/core'
import List from '../components/home/List'
import { Recipes } from '../components/home/Recipes'
import Title from '../components/home/Title'
import '../css/home.css'
import { Category } from '../types/api'
import { SortBy } from '../types/ui'

export function Home() {
  const filter = useHookstate<{ sortBy: SortBy; category: Category | null }>({
    sortBy: SortBy.Newest,
    category: null,
  })

  return (
    <div className='relative'>
      <Title onChangeSortBy={filter.sortBy.set} sortBy={filter.sortBy.value} />
      <List
        category={filter.category.value}
        onChangeCategory={filter.category.set}
      />
      <Recipes />
    </div>
  )
}
