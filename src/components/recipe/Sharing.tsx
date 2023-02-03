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
export const Sharing = ({ id }: { id: number | string }) => {
  const attr = {
    url: window.location.href,
    onClick: () =>
      fetch(API_ENDPOINT + '/recipe/share/' + id, {
        credentials: 'include',
        method: 'post',
      })
        .then((r) => r.json())
        .then(console.log),
  }
  return (
    <div className='flex items-center gap-5 text-3xl mt-5'>
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
