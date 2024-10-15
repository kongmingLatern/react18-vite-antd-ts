import { Route, Routes } from 'react-router-dom'
import { AdminLayout } from './layout'
import Login from './modules/Login'

export default function Index() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<AdminLayout />} />
      </Routes>
    </>
  )
}
