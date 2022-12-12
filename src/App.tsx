import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/header'
import { useAuth } from './hooks/api'
import { useHeaderFooter } from './hooks/state'
import { AuthorList } from './screens/author/List'
import { Deposit } from './screens/Deposit'
import Home from './screens/Home'
import { Login } from './screens/Login'
import { NotFound } from './screens/NotFound'
import { Onboard } from './screens/Onboard'
import { Profile } from './screens/Profile'
import { Purchases } from './screens/Purchases'
import { RecipeList } from './screens/recipe/List'
import { RecipeRead } from './screens/recipe/Read'
import { Register } from './screens/Register'
import { Search } from './screens/Search'

function App() {
  const headFoot = useHeaderFooter()
  const [user] = useAuth()
  return (
    <div
      id='route_container'
      className={`${headFoot.visible ? 'px-10' : ''} antialiased`}
    >
      {headFoot.visible ? <Header user={user} /> : null}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        {user ? (
          <>
            <Route path='profile' element={<Profile />} />
            <Route path='onboard' element={<Onboard />} />
            <Route path='deposit' element={<Deposit />} />
            <Route path='purchases' element={<Purchases />} />
          </>
        ) : null}
        <Route path='recipes'>
          <Route path='read/:id' element={<RecipeRead />} />
          <Route index element={<RecipeList />} />
        </Route>
        <Route path='authors'>
          <Route index element={<AuthorList />} />
        </Route>
        <Route path='search' element={<Search />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
      {headFoot.visible ? <Footer /> : null}
    </div>
  )
}

export default App
