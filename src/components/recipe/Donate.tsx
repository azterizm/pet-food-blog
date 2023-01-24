export const Donate = (props: { name: string }) => (
  <div>
    <h3 className='text-xl font-bold bg-neutral-200 ml--10 pl-10 py-3 w-full'>
      Do you want to support {props.name}?
    </h3>

    <p>
      {props.name} is supported by generiosity of her <b>So Pawlicious</b>{' '}
      followers like you.
    </p>
    <div className='flex-center gap-2'>
      <button className='c-primary px-5 py-3 rounded-lg bg-neutral-200 border-0 text-xl font-bold'>
        1.99$
      </button>
      <button className='c-primary px-5 py-3 rounded-lg bg-neutral-200 border-0 text-xl font-bold'>
        4.99$
      </button>
      <button className='c-primary px-5 py-3 rounded-lg bg-neutral-200 border-0 text-xl font-bold'>
        19.99$
      </button>
    </div>
  </div>
)
