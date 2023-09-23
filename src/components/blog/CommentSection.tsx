import { IAuthor } from '@backend/models/author'
import { IComment } from '@backend/models/comment'
import { useHookstate } from '@hookstate/core'
import classNames from 'classnames'
import _ from 'lodash'
import moment from 'moment'
import { ChatCircle, X } from 'phosphor-react'
import { useEffect, useRef, useState } from 'react'
import shortNumber from 'short-number'
import { API_ENDPOINT } from '../../constants/api'
import { useAuth } from '../../hooks/api'
import { useOnClickOutside } from '../../hooks/ui'

//TODO: Approved distinguish
interface Props {
  onClose: () => void
  ip?: string
  authorProfileImage: string
  authorName: string
  postId: number | string
  data: (IComment & { author?: IAuthor; repliesCount: number })[]
  onRefetch: () => void
  postAuthorId: number | string
  open?: boolean
}

export default function CommentSection(props: Props) {
  const [collapse, setCollapse] = useState(false)
  const loading = useHookstate({
    comment: false,
    reply: false,
  })
  const [text, setText] = useState('')
  const [repliesData, setRepliesData] = useState<
    { [x: number]: Props['data'] }
  >({})
  const [replyText, setReplyText] = useState('')
  const [replyingComment, setReplyingComment] = useState<
    null | { id: number; authorName: string }
  >(null)
  const [likedCommentsId, setLikedCommentsId] = useState<number[]>([])
  const containerRef = useRef<HTMLDivElement>(null)
  const commentInputRef = useRef<HTMLTextAreaElement>(null)
  const [user] = useAuth()

  useEffect(() => {
    if (props.open) commentInputRef.current?.focus()
  }, [props.open])

  useOnClickOutside(containerRef, props.onClose)

  async function onComment() {
    if (!text) return
    loading.comment.set(true)
    const data = await fetch(`${API_ENDPOINT}/comment/add/blog`, {
      body: JSON.stringify({ id: props.postId, text }),
      method: 'post',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
    }).then((r) => r.json())
    loading.comment.set(false)
    if (data.error) return alert(data.info)
    props.onRefetch()
  }

  async function onReply() {
    if (!replyText || !replyingComment) return
    loading.reply.set(true)
    const data = await fetch(`${API_ENDPOINT}/comment/add/blog`, {
      body: JSON.stringify({
        id: props.postId,
        text: replyText,
        repliedTo: replyingComment.id,
      }),
      method: 'post',
      credentials: 'include',
      headers: { 'content-type': 'application/json' },
    }).then((r) => r.json())
    loading.reply.set(false)
    if (data.error) return alert(data.info)
    setRepliesData((e) => ({
      ...e,
      [replyingComment.id]: [{
        author: user as any,
        repliesCount: 0,
        repliedTo: undefined,
        text: replyText,
        postId: Number(props.postId),
        userId: user?.id,
        likes: 0,
        ip: !user ? 'unknown' : '',
        id: data.id,
        approved: false,
      }, ...e[replyingComment.id]],
    }))
    setReplyText('')
    setReplyingComment(null)
  }

  async function onShowReplies(id: number, force?: boolean) {
    if (id in repliesData && !force) {
      setRepliesData((e) =>
        _.omitBy({ ...e, [id]: undefined as any }, _.isUndefined)
      )
      return
    }
    const replies = await fetch(
      `${API_ENDPOINT}/comment/replies/${props.postId}/${id}`,
    ).then((r) => r.json())
    setRepliesData((e) => ({ ...e, [id]: replies }))
  }

  async function onLike(id?: number) {
    if (!id) return
    setLikedCommentsId((e) => [...e, id])
    await fetch(`${API_ENDPOINT}/comment/like/${id}`, {
      method: 'post',
      credentials: 'include',
    }).then((r) => r.json())
  }

  return (
    <div
      ref={containerRef}
      className='bg-white px-5 shadow-xl pb-3 min-h-screen'
    >
      <div className='flex items-center gap-2 justify-between'>
        <p className='text-2xl font-bold'>Comments ({props.data.length})</p>
        <button
          onClick={props.onClose}
          className='border-none bg-white text-2xl translate-y-1'
        >
          <X />
        </button>
      </div>
      {collapse
        ? (
          <button
            onClick={() => (setCollapse(false),
              commentInputRef.current?.focus())}
            className='bg-white text-left w-full py-3 border-none text-neutral-400 shadow-lg px-5 rounded-lg'
          >
            What are your thoughts?
          </button>
        )
        : (
          <div className='p-4 rounded-lg shadow-lg my-4'>
            <div className='flex items-center gap-2'>
              <img
                className='aspect-square object-cover object-center w-14 rounded-full mr-2'
                src={!user ? '/images/avatar.webp' : user.profile}
                alt='user profile image'
              />
              <p>{user ? user.name : 'Anonymous'}</p>
            </div>
            <textarea
              className='bg-white focus:outline-none mt-4 border-none w-full h-20 block font-sans placeholder:text-neutral-400'
              name='comment'
              id='comment'
              placeholder='What are your thoughts?'
              onChange={(e) => setText(e.target.value)}
              value={text}
              ref={commentInputRef}
            />
            <div className='flex items-center w-full justify-end gap-2'>
              <button
                disabled={loading.comment.value}
                onClick={() => setCollapse(true)}
                className='bg-white border-none'
              >
                Cancel
              </button>
              <button
                disabled={loading.comment.value}
                onClick={onComment}
                className='bg-button text-white px-5 py-3 rounded-full border-none'
              >
                {loading.comment.value ? 'Commenting...' : 'Comment'}
              </button>
            </div>
          </div>
        )}
      <div className='divide-y grid grid-cols-1 mt-16'>
        {props.data
          .map((r) => (
            <div
              key={r.id}
              className={classNames('pt-10 pb-6 border-gray-200 relative')}
            >
              <div className='flex items-center gap-2'>
                <img
                  className='aspect-square object-cover object-center w-14 rounded-full mr-2'
                  src={r.author?.profile || '/images/avatar.webp'}
                  alt='author profile image'
                />
                <div className='flex items-center justify-between w-full'>
                  <div className='flex items-start flex-col'>
                    <p className='m-0 font-medium'>
                      {!r.author ? 'Anonymous' : r.author.name}{' '}
                      {r.author?.id === props.postAuthorId
                        ? (
                          <span className='inline-block bg-green-600 text-white p-2 rounded text-xs font-bold ml-2'>
                            AUTHOR
                          </span>
                        )
                        : null}
                      {!user && r.ip === props.ip
                        ? (
                          <span className='inline-block bg-gray-600 text-white p-2 rounded text-xs font-bold ml-2'>
                            YOU
                          </span>
                        )
                        : null}
                    </p>
                    <p className='m-0 text-sm'>
                      {moment(r.createdAt).fromNow()}
                    </p>
                  </div>
                  {!r.approved&&(

                  <span className='bg-red-600 text-white uppercase p-2 rounded font-medium'>
                    AUTHOR REVIEW REQUIRED
                  </span>
                  )}
                </div>
              </div>
              <p>{r.text}</p>
              <div className='flex items-center gap-2 justify-between -ml-4'>
                <div className='flex items-center gap-2'>
                  <button
                    onClick={() => onLike(r.id)}
                    className='flex items-center bg-white border-none'
                  >
                    <img
                      src={r.id && likedCommentsId.includes(r.id)
                        ? '/icons/clap-active.png'
                        : '/icons/clap.png'}
                      alt='Clapping hands icon'
                      width='45'
                      className='group-active:scale-150 group-focus:scale-150 transition-transform -translate-y-1'
                    />
                    <span>
                      {shortNumber(
                        r.likes +
                          (r.id && likedCommentsId.includes(r.id) ? 1 : 0),
                      )}
                    </span>
                  </button>
                  {r.repliesCount > 0 ||
                      r.id && r.id in repliesData &&
                        repliesData[r.id].length > 0
                    ? (
                      <button
                        onClick={() => onShowReplies(r.id!)}
                        className='flex items-center bg-white border-none gap-2'
                      >
                        <ChatCircle
                          weight={r.id && r.id in repliesData
                            ? 'fill'
                            : 'regular'}
                          size={20}
                        />
                        <span>
                          {shortNumber(
                            r.id && r.id in repliesData
                              ? repliesData[r.id].length
                              : r.repliesCount,
                          )} {r.repliesCount > 1 ? 'replies' : 'reply'}
                        </span>
                      </button>
                    )
                    : null}
                </div>
                <button
                  onClick={() => (
                    replyingComment
                      ? setReplyingComment(null)
                      : setReplyingComment({
                        id: r.id!,
                        authorName: !r.author ? 'Anonymous' : r.author.name,
                      }), onShowReplies(r.id!, true)
                  )}
                  className={classNames(
                    'px-5 py-2 bg-white border-none font-medium',
                    replyingComment !== null ? 'text-gray-400' : 'text-black',
                  )}
                >
                  Reply
                </button>
              </div>
              <div className='border-l-2 border-gray-200 pl-4'>
                {replyingComment && replyingComment.id === r.id
                  ? (
                    <div className='p-4 shadow-lg'>
                      <textarea
                        className='bg-white focus:outline-none mt-4 border-none w-full h-20 block font-sans placeholder:text-neutral-400'
                        name='comment'
                        id='comment'
                        placeholder={'Replying to ' +
                          replyingComment.authorName}
                        onChange={(e) => setReplyText(e.target.value)}
                        value={replyText}
                      />
                      <div className='flex items-center gap-2 justify-end'>
                        <div className='flex items-center w-full justify-end gap-2'>
                          <button
                            onClick={() => setReplyingComment(null)}
                            disabled={loading.reply.value}
                            className='bg-white border-none'
                          >
                            Cancel
                          </button>
                          <button
                            onClick={onReply}
                            className='bg-button text-white px-5 py-3 rounded-full border-none'
                            disabled={loading.reply.value}
                          >
                            {loading.reply.value ? 'Replying...' : 'Reply'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                  : null}
                {r.id && r.id in repliesData
                  ? !repliesData[r.id].length && r.repliesCount > 0
                    ? <span>Loading...</span>
                    : repliesData[r.id].map((r) => (
                      <div className='p-4' key={r.id}>
                        <div className='flex items-center gap-2'>
                          <img
                            className='aspect-square object-cover object-center w-14 rounded-full mr-2'
                            src={!r.author
                              ? '/images/avatar.webp'
                              : r.author.profile}
                            alt='author profile image'
                          />
                          <div className='flex items-start flex-col'>
                            <p className='m-0 font-medium'>
                              {r.author?.name || 'Anonymous'}{' '}
                              {r.author?.id === props.postAuthorId
                                ? (
                                  <span className='inline-block bg-green-600 text-white p-2 rounded text-xs font-bold ml-2'>
                                    AUTHOR
                                  </span>
                                )
                                : null}
                              {!user && r.ip === props.ip
                                ? (
                                  <span className='inline-block bg-gray-600 text-white p-2 rounded text-xs font-bold ml-2'>
                                    YOU
                                  </span>
                                )
                                : null}
                            </p>
                            <p className='m-0 text-sm'>
                              {moment(r.createdAt).fromNow()}
                            </p>
                          </div>
                        </div>

                        <p>{r.text}</p>
                        <div className='flex items-center gap-2 justify-between -ml-4'>
                          <div className='flex items-center gap-2'>
                            <button
                              onClick={() =>
                                onLike(r.id)}
                              className='flex items-center bg-white border-none'
                            >
                              <img
                                src={r.id && likedCommentsId.includes(r.id)
                                  ? '/icons/clap-active.png'
                                  : '/icons/clap.png'}
                                alt='Clapping hands icon'
                                width='45'
                                className='group-active:scale-150 group-focus:scale-150 transition-transform -translate-y-1'
                              />
                              <span>
                                {shortNumber(
                                  r.likes +
                                    (r.id && likedCommentsId.includes(r.id)
                                      ? 1
                                      : 0),
                                )}
                              </span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  : null}
              </div>
              <div className='absolute top-0 right-0 !opacity-100'>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}
