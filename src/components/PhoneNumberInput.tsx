import { ChangeEvent, KeyboardEvent } from 'react'

export const MAX_PHONE = 13
export function PhoneNumberInput({
  onChange,
  value,
}: {
  value: string
  onChange: (arg: string) => void
}) {
  function handlePhoneChange(e: ChangeEvent<HTMLInputElement>) {
    const input = e.target.value
    if (value.length > MAX_PHONE || isNaN(input as any)) return

    if (!value) {
      onChange('+' + input)
    } else onChange(input)
  }

  function handlePhoneKeyPress(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key.toLowerCase() === 'backspace') onChange(value.slice(0, -1))
  }
  return (
    <input
      type='text'
      name='phone'
      id='phone'
      placeholder='Your phone number'
      className='focus:outline-none p-5 pb-3 font-black c-primary text-xl border-t-0 border-l-0 border-r-0 border-b-4 border-element min-w-15rem text-center focus:border-primary'
      value={value}
      onChange={handlePhoneChange}
      onKeyDown={handlePhoneKeyPress}
    />
  )
}
