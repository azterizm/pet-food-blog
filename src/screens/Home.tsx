import { Hero } from '../components/home/Hero'
import { Recipes } from '../components/home/Recipes'

function Home() {
  return (
    <div className='relative'>
      <Hero
        title='I am passionate about the food and the tradition of making it.'
        image='/images/main.avif'
        featured
        publishedOn={new Date()}
      />
      <Recipes />
      <div className='absolute top-0 left--30 mt-30vh rotate-270'>
        <span className='invisible md:visible invert xl:invert-0 uppercase tracking-widest font-medium text-sm'>
          thoughts, stories and ideas
        </span>
      </div>
    </div>
  )
}

export default Home
