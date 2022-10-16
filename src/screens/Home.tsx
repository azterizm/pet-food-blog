import moment from 'moment'
import { Hero } from '../components/home/Hero'
import { Recipe } from '../components/home/Recipe'

function Home() {
  return (
    <div className='relative'>
      <Hero />
      <div className='flex flex-wrap gap-10 w-300 block m-auto relative bottom-10 flex justify-center items-center'>
        <Recipe
          image='./recipes/r1.jpeg'
          authors={['Patricia']}
          postedOn={moment().subtract(5, 'year').toDate()}
          reviews={4.6}
          title='Homemade Dog Food'
          duration='30 min'
        />

        <Recipe
          image='./recipes/r3.jpeg'
          authors={['Memon']}
          postedOn={moment().subtract(5, 'minute').toDate()}
          reviews={3}
          title='Karahi for dogs'
          duration='10 min'
          large
        />

        <Recipe
          image='./recipes/r2.jpeg'
          authors={['Sean']}
          postedOn={moment().subtract(2, 'year').toDate()}
          reviews={4.6}
          title='Nice Eggs for Dog'
          duration='4 hours'
        />

        <Recipe
          image='./recipes/r4.jpeg'
          authors={['Jack']}
          postedOn={moment().subtract(5, 'month').toDate()}
          reviews={2.5}
          title='Nice Eggs for Dog'
          duration='4 hours'
        />

        <Recipe
          image='./recipes/r5.jpeg'
          authors={['Patricia']}
          postedOn={moment().subtract(5, 'month').toDate()}
          reviews={2.5}
          title='Working food'
          duration='2 hours'
        />
      </div>
      <div className='absolute top-0 left--30 mt-30vh rotate-270'>
        <span className='uppercase tracking-widest font-medium text-sm'>thoughts, stories and ideas</span>
      </div>
    </div>
  )
}

export default Home
