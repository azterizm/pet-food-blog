import classNames from 'classnames'

interface Props {
  active: number
}
export default function PageIndicator(props: Props) {
  return (
    <div
      id='page_indicator'
      className='flex items-center justify-center gap-2 text-5xl'
    >
      {new Array(4).fill(null).map((_, i) => (
        <span
          className={classNames(
            props.active ===
                i
              ? 'c-button'
              : 'c-neutral-400',
            'select-none',
          )}
          key={i}
        >
          &bull;
        </span>
      ))}
    </div>
  )
}
