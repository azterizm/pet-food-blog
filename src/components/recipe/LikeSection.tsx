import { Heart } from 'phosphor-react'
import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { API_ENDPOINT } from '../../constants/api'
import { ApiProcess } from '../../types/api'

interface Props {
  saved: boolean
  onPrint: () => void
  onSave: () => void
  liked: boolean
}

export const LikeSection = (props: Props) => {
  const { id } = useParams() as { id: string }
  const [saved, setSaved] = useState(props.saved)
  const [liked, setLiked] = useState(props.liked)

  async function onLike() {
    const data: ApiProcess = await fetch(API_ENDPOINT + '/recipe/like/' + id, {
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())

    if (data.error) {
      alert(data.info)
      return
    }

    setLiked((e) => !e)
  }

  return (
    <div className='flex justify-start items-center gap-2 uppercase font-medium text-primary text-xs mt-4'>
      <button
        type='button'
        onClick={onLike}
        className='gap-2 flex items-center text-white bg-[#FEA2AD] rounded-full border-none py-2 px-5'
      >
        <Heart size={20} weight='fill' color='#fff' />
        <span className='font-bold text-md'>
          {liked ? 'You liked it!' : 'Like it'}
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
