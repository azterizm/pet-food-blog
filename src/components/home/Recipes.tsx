import moment from 'moment'
import type { ReactElement } from 'react'
import { useSpring, animated as a, config } from 'react-spring'
import { MainButton } from '../MainButton'
import { Recipe } from './Recipe'

export function Recipes(): ReactElement {
  const main = useSpring({
    from: {
      y: 100,
    },
    to: { y: 0 },
    config: config.slow,
  })
  return (
    <a.div
      style={{ transform: main.y.to((r) => `translate3d(0,${r}px,0)`) }}
      className='flex flex-wrap gap-10 xl:w-300 block m-auto relative bottom-10 flex justify-center items-center'
    >
      <Recipe
        image='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80'
        paid
        authors={['Patricia']}
        postedOn={moment().subtract(5, 'year').toDate()}
        reviews={4.6}
        title='Homemade Dog Food'
        duration='30 min'
      />

      <Recipe
        image='./recipes/r3.jpg'
        authors={['Memon']}
        postedOn={moment().subtract(5, 'minute').toDate()}
        reviews={3}
        title='Karahi for dogs'
        duration='10 min'
        large
      />

      <Recipe
        image='./recipes/r2.jpg'
        authors={['Sean']}
        postedOn={moment().subtract(2, 'year').toDate()}
        paid
        reviews={4.6}
        title='Nice Eggs for Dog'
        duration='4 hours'
      />

      <Recipe
        image='./recipes/r4.jpg'
        paid
        authors={['Jack']}
        postedOn={moment().subtract(5, 'month').toDate()}
        reviews={2.5}
        title='Nice Eggs for Dog'
        duration='4 hours'
      />

      <Recipe
        image='./recipes/r5.jpg'
        authors={['Patricia']}
        postedOn={moment().subtract(5, 'month').toDate()}
        reviews={2.5}
        title='Working food'
        duration='2 hours'
      />
      <MainButton>See all recipes</MainButton>
    </a.div>
  )
}
