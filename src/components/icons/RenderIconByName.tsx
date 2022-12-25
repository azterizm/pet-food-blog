import {
  IconProps,
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  MediumLogo,
  PinterestLogo,
  RedditLogo,
  SnapchatLogo,
  TiktokLogo,
  TwitterLogo,
  YoutubeLogo,
} from 'phosphor-react'
import type { ReactElement, RefAttributes } from 'react'

export interface RenderIconByNameProps
  extends IconProps,
    RefAttributes<SVGSVGElement> {
  name: string
}

const Icons = [
  FacebookLogo,
  InstagramLogo,
  LinkedinLogo,
  MediumLogo,
  PinterestLogo,
  RedditLogo,
  SnapchatLogo,
  TiktokLogo,
  TwitterLogo,
  YoutubeLogo,
]

export function RenderIconByName(props: RenderIconByNameProps): ReactElement {
  const Component = (Icons as any)[props.name]
  return <Component {...props} />
}
