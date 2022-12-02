import { useLayoutEffect, useState } from 'react'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/header'
import { CREATOR_ENDPOINT } from './constants/api'
import { getUser } from './features/auth'
import { useHeaderFooter } from './hooks/state'
import { AuthorList } from './screens/author/List'
import Home from './screens/Home'
import { Login } from './screens/Login'
import { NotFound } from './screens/NotFound'
import { Onboard } from './screens/Onboard'
import { Profile } from './screens/Profile'
import { RecipeList } from './screens/recipe/List'
import { RecipeRead } from './screens/recipe/Read'
import { Register } from './screens/Register'
import { Search } from './screens/Search'
import { AuthUser } from './types/auth'

function App() {
  const headFoot = useHeaderFooter()
  const [user, setUser] = useState<null | AuthUser>(null)
  const navigate = useNavigate()
  useLayoutEffect(() => {
    getUser().then((r) => {
      if (r && r.type === 'author') window.location.href = CREATOR_ENDPOINT
      else {
        if (!r) return
        setUser(r)
        if (!r.profile) navigate('/onboard')
      }
    })
  }, [])
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
            <Route path='profile' element={<Profile user={user} />} />
            <Route path='onboard' element={<Onboard />} />
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
