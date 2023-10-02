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
import moment from 'moment'
import { ChatCircle, Heart, Share, XCircle } from 'phosphor-react'
import { ReactElement, useEffect, useRef, useState } from 'react'
import { Portal } from 'react-portal'
import { useNavigate, useParams } from 'react-router-dom'
import shortNumber from 'short-number'
import CommentSection from '../../components/blog/CommentSection'
import AuthorListItem from '../../components/blog/ListItem'
import VoicePlayer from '../../components/blog/VoicePlayer'
import { GoBack } from '../../components/GoBack'
import { Loader } from '../../components/Loader'
import { Sharing } from '../../components/recipe/Sharing'
import UnpublishedBanner from '../../components/recipe/UnpublishedBanner'
import { API_ENDPOINT } from '../../constants/api'
import '../../css/editor.css'
import { followAuthor } from '../../features/author'
import { LinkInlineTool } from '../../features/editor/inline-tool-link'
import { handleLike } from '../../features/like'
import { onSavePost } from '../../features/save'
import { useApi, useAuth } from '../../hooks/api'
import { useFade } from '../../hooks/state'
import { calculateEstimatedTimeReading } from '../../util/ui'

export function Read(): ReactElement {
  const { id } = useParams()

  const [showCommentSection, setShowCommentSection] = useState(false)
  const [showShareDialog, setShowShareDialog] = useState(false)

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

  const { data, loading, error, refetch } = useApi<IPost & FetchData>(
    '/blog/one/' + id + '/1',
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

  useEffect(() => {
    if (!editorContainerRef.current || !data) return
    if (editorRef.current) {
      editorRef.current.isReady.then(() => editorRef.current?.destroy()).then(
        () => initEditor(data?.body as any),
      )
    } else initEditor(data?.body as any)
  }, [editorContainerRef, editorRef, data])

  function initEditor(editorData?: OutputData) {
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
        image: {
          class: Image,
        },
        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: 'unordered',
          },
        },
        link: {
          class: LinkInlineTool,
        },
      },
      logLevel: 'ERROR' as any,
      data: editorData,
      readOnly: true,
      onReady: () => {
        const videoBlocks = editorData?.blocks.filter((r) => r.type === 'video')
        videoBlocks?.forEach((block) => {
          const data = block.data as {
            autoplay: boolean
            controls: boolean
            muted: boolean
            stretched: boolean
            url: string
          }
          const el = document.querySelector(
            `.ce-block[data-id="${block.id}"] div`,
          )
          if (el) {
            el.innerHTML = `
              <video
              src="${data.url}"
              ${data.autoplay ? 'autoplay' : ''}
              ${data.muted ? 'muted' : ''}
              ${data.controls ? 'controls' : ''}
              style="width:100%"
              />`
          }
        })
        const imagesWithLink = data?.imagesSrcWithLinks
        imagesWithLink?.forEach((item) => {
          const el = document.querySelector(`img[src="${item.imageSrc}"]`)
          if (!el) return
          const anchor = document.createElement('a')
          anchor.href = item.link
          if (item.openInNewtab) anchor.target = '_blank'
          else anchor.target = '_self'
          const clonedImageEl = el.cloneNode() as HTMLImageElement
          anchor.appendChild(clonedImageEl)
          el.replaceWith(anchor)
        })
      },
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
            src={status.liked.value
              ? '/icons/clap-active.png'
              : '/icons/clap.png'}
            alt='Clapping hands icon'
            width='45'
            style={{ transform: 'translateY(-2px)' }}
            className='group-active:scale-150 group-focus:scale-150 transition-transform'
          />
          <span
            className='text-md'
            style={{ marginLeft: -8 }}
          >
            {shortNumber(
              data.likesCount + (status.liked.value && !data.userLiked ? 1 : 0),
            )}
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
      <div className='flex items-center gap-6 relative'>
        <button
          onClick={() => (status.saved.set((e) => !e),
            onSavePost(data.id, user))}
          className='bg-white border-none text-gray-600'
        >
          <Heart weight={status.saved.value ? 'fill' : 'regular'} size={20} />
        </button>
        <button
          onClick={() => setShowShareDialog((e) => !e)}
          className={classNames(
            'border-none text-gray-600',
            showShareDialog ? 'bg-neutral-200 pt-2 rounded-t-lg' : 'bg-white ',
          )}
        >
          {showShareDialog ? <XCircle size={20} /> : <Share size={20} />}
        </button>
        <div
          className={classNames(
            'absolute top-full right-0 w-max transition bg-neutral-200 pr-8 py-4 flex items-center justify-center rounded-lg',
            !showShareDialog
              ? 'translate-y-5 opacity-0 pointer-events-none'
              : 'translate-y-0 opacity-100',
          )}
        >
          <Sharing data={data} contentType='post' />
        </div>
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
                  status.following.value ? 'text-gray-600' : 'text-blue-600',
                )}
              >
                {status.following.value ? 'Following' : 'Follow'}
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
                {moment(data.createdAt || '').format('MMM D')}
              </p>
            </div>
          </div>
        </div>
        {interactButtons('border-y-2')}

        <img
          src={API_ENDPOINT + data.mainImage}
          className='w-full rounded-lg object-cover object-center'
          style={{ aspectRatio: '9 / 16' }}
        />

        {data.voiceVersionPath && (
          <VoicePlayer url={API_ENDPOINT + data.voiceVersionPath} />
        )}

        <div className='font-sans' ref={editorContainerRef} />
        <div className='flex items-center gap-4 flex-wrap'>
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
                    status.following.value
                      ? 'bg-gray-200 text-black'
                      : 'bg-black text-white',
                  )}
                >
                  {status.following.value ? 'Following' : 'Follow'}
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
      {data.status !== 'published' && (
        <UnpublishedBanner status={data.status} contentType='Blog post' />
      )}
      <Portal>
        <div
          className={classNames(
            'transition-transform fixed top-0 right-0 z-101 overflow-auto h-screen w-full md:w-1/2 lg:w-1/3',
            showCommentSection ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <CommentSection
            onRefetch={refetch}
            postAuthorId={data.authorId!}
            authorProfileImage={data.author.profile}
            authorName={data.author.name}
            onClose={() => (setShowCommentSection(false), fade.hide())}
            postId={data.id!}
            data={data.comments}
            open={showCommentSection}
            ip={data.ip}
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
  comments: (IComment & { author: IAuthor; repliesCount: number })[]
  ip?: string
}
