import ReactCodeInput, { ReactCodeInputProps } from 'react-code-input'
export function VerificationCodeInput(props: Partial<ReactCodeInputProps>) {
  return (
    <div className='text-center'>
      <h1>Please verify your phone number</h1>
      <p>
        A message with verification code has been sent to your mobile phone.
        Enter the code to continue.
      </p>
      <div className='flex-center mb-10'>
        <ReactCodeInput {...props} inputMode='tel' name='code' fields={6} />
      </div>
    </div>
  )
}
