import { Outlet } from 'react-router'
import './App.css'
import { Header } from './components/header/Header'

function App() {

  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export default App
