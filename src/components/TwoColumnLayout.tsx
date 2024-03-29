import { CaretLeft } from 'phosphor-react'
import { ReactElement, ReactNode, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { TypeAnimation } from 'react-type-animation'
import { useHeaderFooter } from '../hooks/state'

export interface TwoColumnLayoutProps {
  subTitle?: [string, string, string]
  title?: string
  children: ReactNode
  image: string
  containerClass?: string
  backText?: string
  hideHeadings?: boolean
}

export function TwoColumnLayout({
  children,
  hideHeadings,
  subTitle,
  containerClass,
  title,
  image,
  backText = 'Back to Homepage',
}: TwoColumnLayoutProps): ReactElement {
  const navigate = useNavigate()
  const headFoot = useHeaderFooter()
  useEffect(() => {
    headFoot.hide()
    return () => {
      headFoot.show()
    }
  }, [])
  return (
    <div className={'flex h-100vh ' + containerClass}>
      <img
        src={image}
        alt='dog food'
        className='w-50% object-cover object-center ml--10 h-100vh hidden lg:block'
      />
      <div className='flex-1 py-5 overflow-auto'>
        <div
          className='flex items-center cursor-pointer hover:gap-6 transition gap-5 justify-center'
          onClick={() => navigate('/')}
        >
          <CaretLeft size={36} className='c-primary' />
          <span className='font-medium c-primary text-lg'>{backText}</span>
        </div>
        <div className='px-5 flex justify-center flex-col h-80% items-center c-primary relative mt-10'>
          {title && !hideHeadings && <h1>{title}</h1>}
          {subTitle && !hideHeadings && (
            <TypeAnimation
              sequence={[subTitle[0], 1000, subTitle[1], 1500, subTitle[2]]}
              wrapper='div'
              cursor
              repeat={0}
              style={{
                fontSize: '2rem',
                textAlign: 'center',
                maxWidth: '35rem',
              }}
            />
          )}
          {children}
        </div>
        <img
          src='/logo.svg'
          alt='logo'
          className='invert max-w-30rem block mx-auto px-5 mt-10'
        />
      </div>
    </div>
  )
}
