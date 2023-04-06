import { Heart } from 'phosphor-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { handleLike } from '../../features/like'

interface Props {
  saved: boolean
  onPrint: () => void
  onSave: () => void
  liked: boolean
  blog?: boolean
  onLike: (arg: boolean) => void
}

export const LikeSection = (props: Props) => {
  const { id } = useParams() as { id: string }
  const [saved, setSaved] = useState(props.saved)

  async function onLike() {
    const { error, info } = await handleLike(id, props.blog ? 'blog' : 'recipe')

    if (error) {
      alert(info)
      return
    }

    props.onLike(!props.liked)
  }

  return (
    <div className='flex justify-center md:justify-start items-center gap-2 uppercase font-medium text-primary text-xs mt-8 md:mt-4'>
      <button
        type='button'
        onClick={onLike}
        className='gap-2 flex items-center text-white bg-[#FEA2AD] rounded-full border-none py-2 px-5'
      >
        <Heart size={20} weight='fill' color='#fff' />
        <span className='font-bold text-md'>
          {props.liked ? 'You liked it!' : 'Like it'}
        </span>
      </button>
      <button
        type='button'
        onClick={props.onPrint}
        className='font-bold text-md gap-2 flex items-center text-white bg-[#98d4cb] rounded-full border-none py-2 px-5'
      >
        Print
      </button>
      <button
        type='button'
        onClick={() => (props.onSave(), setSaved((e) => !e))}
        className='font-bold text-md gap-2 flex items-center text-white bg-[#98d4cb] rounded-full border-none py-2 px-5'
      >
        {saved ? 'Saved!' : 'Save'}
      </button>
    </div>
  )
}
