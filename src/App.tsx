import { useLayoutEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/header'
import { getUser } from './features/auth'
import { useHeaderFooter } from './hooks/state'
import Home from './screens/Home'
import { Login } from './screens/Login'
import { NotFound } from './screens/NotFound'
import { Profile } from './screens/Profile'
import { Register } from './screens/Register'
import { Search } from './screens/Search'
import { AuthUser } from './types/auth'

function App() {
  const headFoot = useHeaderFooter()
  const [user, setUser] = useState<null | AuthUser>(null)
  useLayoutEffect(() => {
    getUser().then((r) => {
      if (!r || (r && r.error)) return alert(r.info)
      else if (r.type === 'author') window.location.href = '/creator'
      else setUser(r)
    })
  }, [])
  return (
    <div className={`${headFoot.visible ? 'px-10' : ''} antialiased`}>
      {headFoot.visible ? <Header user={user} /> : null}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
        {user ? (
          <>
            <Route path='profile' element={<Profile user={user} />} />
            <Route path='search' element={<Search />} />
          </>
        ) : null}
        <Route path='*' element={<NotFound />} />
      </Routes>
      {headFoot.visible ? <Footer /> : null}
    </div>
  )
}

export default App
