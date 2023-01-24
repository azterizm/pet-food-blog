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
export const Sharing = () => (
  <div className='flex items-center gap-5 text-3xl mt-5'>
    <FacebookShareButton url={window.location.href}>
      <FacebookLogo />
    </FacebookShareButton>
    <TwitterShareButton url={window.location.href}>
      <TwitterLogo />
    </TwitterShareButton>
    <LinkedinShareButton url={window.location.href}>
      <LinkedinLogo />
    </LinkedinShareButton>
    <RedditShareButton url={window.location.href}>
      <RedditLogo />
    </RedditShareButton>
    <WhatsappShareButton url={window.location.href}>
      <WhatsappLogo />
    </WhatsappShareButton>
    <EmailShareButton url={window.location.href}>
      <Envelope />
    </EmailShareButton>
  </div>
)
