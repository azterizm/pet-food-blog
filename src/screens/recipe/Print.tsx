import { X } from 'phosphor-react'
import { ReactElement, useCallback, useEffect, useRef, useState } from 'react'
import { FaArrowLeft, FaCog, FaPrint } from 'react-icons/fa'
import ReactToPrint from 'react-to-print'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader } from '../../components/Loader'
import { ReadContent } from '../../components/recipe/ReadContent'
import { API_ENDPOINT } from '../../constants/api'
import '../../css/recipe_read.css'
import { useApi } from '../../hooks/api'
import { useHeaderFooter } from '../../hooks/state'
import { RecipeReadData } from '../../types/api'

type Option = 'image' | 'notes'

export function PrintRecipe(): ReactElement {
  const contentRef = useRef<HTMLDivElement>(null)
  const { id } = useParams() as { id: string }
  const {
    data,
    error,
    loading: apiLoading,
  } = useApi<RecipeReadData>('/recipe/read/' + id)
  const navigate = useNavigate()
  const header = useHeaderFooter()
  const [showOptions, setShowOptions] = useState(false)
  const [options, setOptions] = useState<Option[]>(['image', 'notes'])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    header.hide()
    return () => header.show()
  }, [])

  function onBeforeGet() {
    setLoading(true)
    return new Promise<void>((r) => {
      setTimeout(() => {
        setLoading(false)
        r()
      }, 2000)
    })
  }

  function handleToggleOption(arg: Option) {
    setOptions((e) =>
      e.includes(arg) ? e.filter((r) => r !== arg) : [...e, arg],
    )
  }

  return (
    <div className='w-full'>
      <div className='border-b-2 border-gray-200'>
        <div className={`flex items-center p-5 ${showOptions ? 'pb-0' : ''}`}>
          <button
            onClick={() => navigate(-1)}
            className='flex items-center bg-white border-button mr-4 border-2 rounded-lg px-5 py-2 hover:bg-gray-200'
          >
            <FaArrowLeft size={16} className='text-button mr-2' />
            <span className='text-md font-medium text-button'>Go back</span>
          </button>
          <ReactToPrint
            onPrintError={() =>
              alert(
                'Error occurred when creating element for printing. Please try again.',
              )
            }
            onBeforeGetContent={onBeforeGet}
            content={() => contentRef.current}
            documentTitle={data?.title + ' recipe from So Pawlicious'}
            trigger={() => (
              <button className='flex items-center bg-white border-button mr-4 border-2 rounded-lg px-5 py-2 hover:bg-gray-200'>
                <FaPrint size={16} className='text-button mr-2' />
                <span className='text-md font-medium text-button'>Print</span>
              </button>
            )}
          />

          <button
            onClick={() => setShowOptions((e) => !e)}
            className='flex items-center bg-white border-button border-2 rounded-lg px-5 py-2 hover:bg-gray-200'
          >
            {showOptions ? (
              <X weight='bold' size={16} className='text-button mr-2' />
            ) : (
              <FaCog size={16} className='text-button mr-2' />
            )}
            <span className='text-md font-medium text-button'>Options</span>
          </button>

          {loading ? (
            <span className='text-button font-medium block ml-5'>
              Loading...
            </span>
          ) : null}
        </div>
        {showOptions ? (
          <div className='flex items-center p-5'>
            <button
              onClick={() => handleToggleOption('image')}
              className={`flex items-center ${
                options.includes('image')
                  ? 'bg-button text-white'
                  : 'bg-white text-button'
              } px-5 py-2 rounded-lg border-2 border-button mr-4 font-medium`}
            >
              Image
            </button>
            <button
              onClick={() => handleToggleOption('notes')}
              className={`flex items-center ${
                options.includes('notes')
                  ? 'bg-button text-white'
                  : 'bg-white text-button'
              } px-5 py-2 rounded-lg border-2 border-button mr-4 font-medium`}
            >
              Notes
            </button>
          </div>
        ) : null}
      </div>
      {apiLoading ? (
        <Loader />
      ) : !data || error ? (
        <p>Something went wrong.</p>
      ) : (
        <div className='p-5 max-w-md' ref={contentRef}>
          {options.includes('image') ? (
            <img
              src={API_ENDPOINT + data.mainImage}
              alt='recipe image'
              className='w-50 rounded-lg object-cover'
            />
          ) : null}

          <h1 className='m-0 mt-4'>{data.title}</h1>
          <p className='m-0'>by {data.author.name}</p>

          <div className='flex items-center gap-2 mt-4 mx-auto'>
            <div className='flex justify-center items-center flex-col text-black'>
              <span className='text-4xl font-light'>{data.duration}</span>
              <span className='text-sm'>Minutes</span>
            </div>
            <div className='w-0.5 h-10 bg-black mx-5' />
            <div className='flex justify-center items-center flex-col text-black'>
              <span className='text-4xl font-light'>{data.servings}</span>
              <span className='text-sm'>Servings</span>
            </div>
            <div className='w-0.5 h-10 bg-black mx-5' />
            <div className='flex justify-center items-center flex-col text-black'>
              <span className='text-4xl font-light uppercase'>{data.lang}</span>
              <span className='text-sm'>Language</span>
            </div>
          </div>

          <ReadContent
            showNotes={options.includes('notes')}
            showHelp={false}
            showSupport={false}
            data={data}
            id={id}
            liked={false}
            changeLiked={() => null}
          />

          <div className='flex items-center justify-center mt-16'>
            <p className='text-sm italic'>
              <span className='font-medium'>Find it online: </span>
              <span className='text-button underline'>
                https://sopawlicious.com/#/recipes/read/{data.id}
              </span>
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
