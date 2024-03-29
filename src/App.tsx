import { lazy, Suspense, useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/header'
import { Loader } from './components/Loader'
import { useAuth } from './hooks/api'
import { useFade, useHeaderFooter } from './hooks/state'
import { lazyImport } from './util/ui'
import 'swiper/css'
import ScrollToTop from './components/ScrollToTopRouter'
import FreeStuffPaymentFeedback from './screens/free_stuff/PaymentFeedback'

const Donate = lazy(() => import('./screens/recipe/Donate'))
const { TermsAndConditions } = lazyImport(
  () => import('./screens/TermsAndConditions'),
  'TermsAndConditions',
)

const { PrivacyPolicy } = lazyImport(
  () => import('./screens/PrivacyPolicy'),
  'PrivacyPolicy',
)
const { PrintRecipe } = lazyImport(
  () => import('./screens/recipe/Print'),
  'PrintRecipe',
)
const { Home } = lazyImport(() => import('./screens/Home'), 'Home')
const { PastDeposits } = lazyImport(
  () => import('./screens/PastDeposits'),
  'PastDeposits',
)
const { AuthorList } = lazyImport(
  () => import('./screens/author/List'),
  'AuthorList',
)
const { AuthorProfile } = lazyImport(
  () => import('./screens/author/Profile'),
  'AuthorProfile',
)
const { NotFound } = lazyImport(() => import('./screens/NotFound'), 'NotFound')
const { Profile } = lazyImport(() => import('./screens/Profile'), 'Profile')
const { Purchases } = lazyImport(
  () => import('./screens/Purchases'),
  'Purchases',
)
const { RecipeRead } = lazyImport(
  () => import('./screens/recipe/Read'),
  'RecipeRead',
)
const { Register } = lazyImport(() => import('./screens/Register'), 'Register')
const { Search } = lazyImport(() => import('./screens/Search'), 'Search')
const { Login } = lazyImport(() => import('./screens/Login'), 'Login')
const { Subscribed } = lazyImport(
  () => import('./screens/Subscribed'),
  'Subscribed',
)
const { FreeStuff } = lazyImport(
  () => import('./screens/free_stuff'),
  'FreeStuff',
)
const { Saved } = lazyImport(() => import('./screens/Saved'), 'Saved')
const { List: BlogList } = lazyImport(
  () => import('./screens/blog/List'),
  'List',
)
const { Read: BlogRead } = lazyImport(
  () => import('./screens/blog/Read'),
  'Read',
)
const { SuccessPayment } = lazyImport(
  () => import('./screens/payment/Success'),
  'SuccessPayment',
)
const { CanceledPayment } = lazyImport(
  () => import('./screens/payment/Canceled'),
  'CanceledPayment',
)
const { FailedBank } = lazyImport(
  () => import('./screens/bank/Failed'),
  'FailedBank',
)
const { SuccessBank } = lazyImport(
  () => import('./screens/bank/Success'),
  'SuccessBank',
)

function App() {
  const headFoot = useHeaderFooter()
  const [user, _, refetch] = useAuth()
  const fade = useFade()

  useEffect(() => {
    refetch()
  }, [])

  return (
    <div
      id='route_container'
      className={`${headFoot.visible ? 'px-10' : ''} antialiased`}
    >
      <Suspense fallback={<Loader />}>
        {headFoot.visible ? <Header user={user} /> : null}
        <ScrollToTop />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='login' element={<Login />} />
          <Route path='register' element={<Register />} />
          <Route path='terms' element={<TermsAndConditions />} />
          <Route path='policy' element={<PrivacyPolicy />} />
          <Route path='free'>
            <Route path='pay' element={<FreeStuffPaymentFeedback />} />
            <Route path=':id' element={<FreeStuff />} />
            <Route index element={<FreeStuff />} />
          </Route>
          <Route path='saved' element={<Saved />} />
          {user
            ? (
              <>
                <Route path='profile' element={<Profile />} />
                <Route path='deposit' element={<PastDeposits />} />
                <Route path='purchases' element={<Purchases />} />
                <Route path='subscribed' element={<Subscribed />} />
              </>
            )
            : null}
          <Route path='recipes'>
            <Route path='donate' element={<Donate />} />
            <Route path='read/print/:id' element={<PrintRecipe />} />
            <Route path='read/:id/:slug?' element={<RecipeRead />} />
          </Route>
          <Route path='authors'>
            <Route path=':id' element={<AuthorProfile />} />
            <Route index element={<AuthorList />} />
          </Route>
          <Route path='blog'>
            <Route index element={<BlogList />} />
            <Route path=':id' element={<BlogRead />} />
          </Route>
          <Route path='payment'>
            <Route path='success' element={<SuccessPayment />} />
            <Route path='cancel' element={<CanceledPayment />} />
          </Route>
          <Route path='bank'>
            <Route path='success' element={<SuccessBank />} />
            <Route path='fail' element={<FailedBank />} />
          </Route>
          <Route path='search' element={<Search />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
        {fade.visible
          ? (
            <div className='fixed top-0 left-0 w-full h-full bg-black opacity-50'>
            </div>
          )
          : null}
        {headFoot.visible ? <Footer /> : null}
      </Suspense>
    </div>
  )
}
export default App
