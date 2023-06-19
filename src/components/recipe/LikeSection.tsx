import { Heart } from 'phosphor-react'
import { useEffect, useState } from 'react'
import { Portal } from 'react-portal'
import { useNavigate, useParams } from 'react-router-dom'
import { handleLike } from '../../features/like'
import { useFade } from '../../hooks/state'

interface Props {
  saved: boolean
  onPrint: () => void
  onSave: () => void
  liked: boolean
  blog?: boolean
  onLike: (arg: boolean) => void
  originalId?: number
  availableLanguages?: { lang: string; id: number }[]
}

export const LikeSection = (props: Props) => {
  const { id } = useParams() as { id: string }
  const [saved, setSaved] = useState(props.saved)
  const [showLanguages, setShowLanguages] = useState(false)
  const fade = useFade()
  const navigate = useNavigate()

  useEffect(() => {
    showLanguages ? fade.show() : fade.hide()
  }, [showLanguages])

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
        <span className='font-bold text-md w-max'>
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
      {props.originalId ? (
        <button
          type='button'
          onClick={() => navigate('/recipes/read/' + props.originalId)}
          className='font-bold text-md gap-2 flex items-center text-white bg-[#98d4cb] rounded-full border-none py-2 px-5'
        >
          See original version
        </button>
      ) : props.availableLanguages?.length ? (
        <button
          type='button'
          onClick={() => setShowLanguages(true)}
          className='font-bold text-md gap-2 flex items-center text-white bg-[#98d4cb] rounded-full border-none py-2 px-5'
        >
          Change language
        </button>
      ) : null}
      <Portal>
        {showLanguages && (
          <div className='fixed-center bg-white rounded-lg p-10'>
            <h1 className='text-center font-bold text-sm'>
              Available langauges
            </h1>
            <div className='flex items-center gap-4 flex-wrap justify-center'>
              {props.availableLanguages?.map((lang) => (
                <button
                  onClick={() => navigate('/recipes/read/' + lang.id)}
                  className='p-5 border-1 border-black uppercase text-xl font-bold rounded-full hover:bg-neutral-200 cursor-pointer'
                >
                  {lang.lang}
                </button>
              ))}
            </div>
            <button
              className='px-5 py-2 rounded-full bg-primary text-white mx-auto block mt-8'
              onClick={() => setShowLanguages(false)}
            >
              Cancel
            </button>
          </div>
        )}
      </Portal>
    </div>
  )
}
