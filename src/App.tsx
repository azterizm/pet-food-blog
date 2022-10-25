import { useEffect, useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Footer } from './components/Footer'
import { Header } from './components/header'
import { getUser } from './features/auth'
import { useHeaderFooter } from './hooks/state'
import Home from './screens/Home'
import { Login } from './screens/Login'
import { Register } from './screens/Register'

function App() {
  const headFoot = useHeaderFooter()
  const [user, setUser] = useState(null)
  useEffect(() => {
    getUser().then(console.log)
  }, [])
  return (
    <div className={`${headFoot.visible ? 'px-10' : ''} antialiased`}>
      {headFoot.visible ? <Header /> : null}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='login' element={<Login />} />
        <Route path='register' element={<Register />} />
      </Routes>
      {headFoot.visible ? <Footer /> : null}
    </div>
  )
}

export default App
