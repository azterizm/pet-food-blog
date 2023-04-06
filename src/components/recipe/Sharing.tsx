import {
  Envelope,
  FacebookLogo,
  LinkedinLogo,
  RedditLogo,
  TwitterLogo,
  WhatsappLogo,
} from 'phosphor-react'
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'
import { API_ENDPOINT } from '../../constants/api'
export const Sharing = ({
  id,
  disableSharing,
}: {
  id: number | string
  disableSharing?: boolean
}) => {
  const attr = {
    url: window.location.href,
    onClick: disableSharing
      ? undefined
      : async () => {
          try {
            const data = await fetch(API_ENDPOINT + '/recipe/share/' + id, {
              credentials: 'include',
              method: 'post',
            })
              .then((r) => r.text())
              .catch((_) => null)
            console.log('data:', data)
          } catch (error) {
            console.error(error)
          }
        },
  }
  return (
    <div className='flex items-center gap-5 flex-wrap text-3xl ml-5 my-auto justify-center'>
      <FacebookShareButton {...attr}>
        <FacebookLogo />
      </FacebookShareButton>
      <TwitterShareButton {...attr}>
        <TwitterLogo />
      </TwitterShareButton>
      <LinkedinShareButton {...attr}>
        <LinkedinLogo />
      </LinkedinShareButton>
      <RedditShareButton {...attr}>
        <RedditLogo />
      </RedditShareButton>
      <WhatsappShareButton {...attr}>
        <WhatsappLogo />
      </WhatsappShareButton>
      <EmailShareButton {...attr}>
        <Envelope />
      </EmailShareButton>
    </div>
  )
}
