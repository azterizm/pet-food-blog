import { Star } from 'phosphor-react'
export function Hero() {
  return (
    <div className='flex items-center ml--10 xl:ml-10 gap-20 relative'>
      <img
        className='brightness-75 lg:brightness-100 w-120% lg:w-50% h-70vh xl:rounded-lg lg:rounded-r-lg object-right aspect-video object-cover'
        src='./images/main.jpg'
        alt=''
      />
      <div className='c-primary w-full md:w-120 ml-10 top-50% left-50% translate-x--50% translate-y--50% lg:translate-y-0 lg:translate-x-0 absolute lg:static c-white lg:c-primary lg:invert-0'>
        <div className='flex items-center bg-primary px-3 py-2 rounded-full w-max gap-2'>
          <Star weight='fill' className='c-white' />
          <span className='uppercase font-bold text-sm c-white'>Featured</span>
        </div>
        <h1 className='max-w-80vw text-3xl md:text-5xl md:leading-15'>
          I am passionate about the food and the tradition of making it.
        </h1>
        <span>
          by <b>Sean Hamilton</b> 5 years ago
        </span>
      </div>
    </div>
  )
}
