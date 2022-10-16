import { Route, Routes } from 'react-router-dom'
import { Header } from './components/Header'
import Home from './screens/Home'

function App() {
  return (
    <div className='px-10 antialiased'>
      <Header/>
    <Routes>
      <Route path='/' element={<Home />} />
    </Routes>
    </div>
  )
}

export default App
