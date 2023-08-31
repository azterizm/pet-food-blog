import { IAuthor } from '@backend/models/author'
import { IComment } from '@backend/models/comment'
import { IPost } from '@backend/models/post'
import Delimiter from '@editorjs/delimiter'
import EditorJS, { OutputData } from '@editorjs/editorjs'
import Embed from '@editorjs/embed'
import Header from '@editorjs/header'
import Image from '@editorjs/image'
import List from '@editorjs/list'
import Quote from '@editorjs/quote'
import Underline from '@editorjs/underline'
import { useHookstate } from '@hookstate/core'
import classNames from 'classnames'
import { ChatCircle, Heart, Share } from 'phosphor-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { Portal } from 'react-portal'
import { useNavigate, useParams } from 'react-router-dom'
import shortNumber from 'short-number'
import CommentSection from '../../components/blog/CommentSection'
import AuthorListItem from '../../components/blog/ListItem'
import { GoBack } from '../../components/GoBack'
import { Loader } from '../../components/Loader'
import { API_ENDPOINT } from '../../constants/api'
import { followAuthor } from '../../features/author'
import { handleLike } from '../../features/like'
import { onSavePost } from '../../features/save'
import { useApi, useAuth } from '../../hooks/api'
import { useFade } from '../../hooks/state'
import { calculateEstimatedTimeReading } from '../../util/ui'

//TODO: comment, share
export function Read(): ReactElement {
  const { id } = useParams()

  const [showCommentSection, setShowCommentSection] = useState(false)

  const status = useHookstate({
    liked: false,
    following: false,
    saved: false,
  })

  const navigate = useNavigate()
  const editorContainerRef = useRef<HTMLDivElement>(null)
  const editorRef = useRef<EditorJS>()

  const [user] = useAuth()

  const fade = useFade()

  const { data, loading, error } = useApi<IPost & FetchData>(
    '/blog/one/' + id + '/true',
    {
      onSuccess: (r) => {
        status.set({
          liked: r.userLiked,
          following: r.following,
          saved: r.saved,
        })
      },
    },
    [id],
  )
  console.log({ data })

  useEffect(() => {
    if (!editorContainerRef.current || !data) return
    if (editorRef.current) {
      editorRef.current.isReady.then(() => editorRef.current?.destroy()).then(
        () => initEditor(data?.body as any),
      )
    } else initEditor(data?.body as any)
  }, [editorContainerRef, editorRef, data])

  function initEditor(data?: OutputData) {
    if (!editorContainerRef.current) return

    const editor = new EditorJS({
      holder: editorContainerRef.current,
      tools: {
        header: Header,
        quote: Quote,
        delimiter: Delimiter,
        underline: Underline,
        embed: {
          class: Embed,
          inlineToolbar: true,
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        image: {
          class: Image,
        },
      },
      logLevel: 'ERROR' as any,
      data,
      readOnly: true,
    })
    editorRef.current = editor
  }

  if (loading) return <Loader />
  else if (!data || error) {
    return (
      <div className='flex-center absolute-center'>
        <span className='c-red'>{error}</span>
      </div>
    )
  }

  const interactButtons = (className?: string) => (
    <div
      className={classNames(
        'flex items-center justify-between border-gray-200 my-6 py-2',
        className,
      )}
    >
      <div className='flex items-center gap-6'>
        <button
          onClick={() => (status.liked.set((e) => !e),
            handleLike(data.id!, 'blog'))}
          className='flex items-center gap-1 bg-white text-gray-600 border-none group select-none whitespace-nowrap cursor-pointer'
        >
          <img
            src={status.liked ? '/icons/clap-active.png' : '/icons/clap.png'}
            alt='Clapping hands icon'
            width='45'
            style={{ transform: 'translateY(-2px)' }}
            className='group-active:scale-150 group-focus:scale-150 transition-transform'
          />
          <span
            className='text-md'
            style={{ marginLeft: -8 }}
          >
            {shortNumber(data.likesCount + (status.liked ? 1 : 0))}
          </span>
        </button>

        <button
          onClick={() => (setShowCommentSection((e) => !e), fade.show())}
          className='flex items-center gap-1 bg-white border-none text-gray-600'
        >
          <ChatCircle
            size={20}
            weight={showCommentSection ? 'fill' : 'regular'}
          />
          <span className='text-md'>
            {shortNumber(data.comments.length)}
          </span>
        </button>
      </div>
      <div className='flex items-center gap-6'>
        <button
          onClick={() => (status.saved.set((e) => !e),
            onSavePost(data.id, user))}
          className='bg-white border-none text-gray-600'
        >
          <Heart weight={status.saved.value ? 'fill' : 'regular'} size={20} />
        </button>
        <button className='bg-white border-none text-gray-600'>
          <Share size={20} />
        </button>
      </div>
    </div>
  )

  return (
    <>
      <div className='max-w-[42.5rem] mx-auto'>
        <GoBack />
        <h1 className='text-5xl font-black block mt-16'>
          {data.title}
        </h1>
        <div className='flex items-center gap-2'>
          <img
            className='rounded-full aspect-sqaure object-cover object-center w-16'
            src={data.author.profile}
            alt={`${data.author.name} profile`}
          />
          <div>
            <div className='flex items-center gap-2 text-lg'>
              <p className='m-0'>{data.author.name}</p>
              <span>&bull;</span>
              <button
                onClick={() => (followAuthor(data.author.id, user),
                  status.following.set((e) => !e))}
                disabled={loading}
                className={classNames(
                  'py-2 bg-white hover:underline border-none text-lg font-bold',
                  status.following ? 'text-gray-600' : 'text-blue-600',
                )}
              >
                {status.following ? 'Following' : 'Follow'}
              </button>
            </div>
            <div className='flex items-center gap-2 text-sm text-gray-600'>
              <p className='m-0'>
                {calculateEstimatedTimeReading(
                  JSON.stringify(data.body.blocks),
                )}
              </p>
              <span>&bull;</span>
              <p className='m-0'>
                {new Date(data.createdAt || '').toDateString()}
              </p>
            </div>
          </div>
        </div>
        {interactButtons('border-y-2')}

        <img src={API_ENDPOINT + data.mainImage} className='w-full' />
        <div className='font-sans' ref={editorContainerRef} />
        <div className='flex items-center gap-4'>
          {data.tags.map((r, i) => (
            <button
              key={i}
              onClick={() => navigate('/blog')}
              className='bg-gray-100 rounded-full px-5 py-2 border-none'
            >
              {r}
            </button>
          ))}
        </div>
        {interactButtons()}
      </div>

      <div className='mt-16 w-screen -ml-10 bg-gray-100'>
        <div className='py-16 max-w-[42.5rem] mx-auto px-10'>
          <div className='my-8'>
            <img
              className='rounded-full aspect-sqaure object-cover object-center w-16 mb-4'
              src={data.author.profile}
              alt={`${data.author.name} profile`}
            />
            <div className='flex items-center justify-between'>
              <div>
                <p className='m-0 font-semibold text-2xl mb-2'>
                  Written by {data.author.name}
                </p>
                <p className='m-0 text-md'>
                  {shortNumber(data.author.followersCount)}{' '}
                  Follower{data.author.followersCount > 1 ? 's' : ''}
                </p>
              </div>
              <div className='flex items-center gap-2'>
                <button
                  onClick={() => (followAuthor(data.author.id, user),
                    status.following.set((e) => !e))}
                  className={classNames(
                    'px-5 font-medium py-3 rounded-full border-none',
                    status.following
                      ? 'bg-gray-200 text-black'
                      : 'bg-black text-white',
                  )}
                >
                  {status.following ? 'Following' : 'Follow'}
                </button>
              </div>
            </div>
          </div>
          <div style={{ height: 2 }} className='w-full bg-gray-200' />
          <p className='text-xl font-medium my-8'>
            Recommended
          </p>
          <div className='grid sm:grid-cols-2 gap-4'>
            {data.recommendations.map((r, i) => (
              <AuthorListItem
                key={i}
                title={r.title}
                image={API_ENDPOINT + r.mainImage}
                onClick={() => navigate('/blog/' + r.id)}
                authorName={r.author.name}
                likes={r.likesCount}
                onLike={() => handleLike(r.id!, 'blog')}
                liked={r.userLiked}
              />
            ))}
          </div>
        </div>
      </div>
      <Portal>
        <div
          className={classNames(
            'transition-transform fixed top-0 right-0 z-101 overflow-auto h-screen w-full md:w-1/2 lg:w-1/3',
            showCommentSection ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <CommentSection
            authorProfileImage={data.author.profile}
            authorName={data.author.name}
            onClose={() => (setShowCommentSection(false), fade.hide())}
            postId={data.id!}
            data={data.comments}
          />
        </div>
      </Portal>
    </>
  )
}

interface FetchData {
  author: IAuthor & { followersCount: number }
  userLiked: boolean
  recommendations: (IPost & {
    author: { name: string }
    likesCount: number
    userLiked: boolean
  })[]
  likesCount: number
  following: boolean
  saved: boolean
  comments: (IComment & { author: IAuthor })[]
}
