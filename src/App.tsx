import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from './layout'
import Login from './modules/Login'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<AdminLayout />} />
    </Routes>
  )
}

export default App
