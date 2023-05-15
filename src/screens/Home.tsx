import { Recipes } from '../components/home/Recipes'
import '../css/home.css'

export function Home() {
  return (
    <div className='relative'>
      <div id='list_title'>
        <h1 className='text-center text-3xl'>Discover</h1>
      </div>
      <Recipes />
    </div>
  )
}
