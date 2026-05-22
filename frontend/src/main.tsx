import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Layout from './Layout'
import Dashboard from './pages/Dashboard'
import Members from './pages/Members'
import Orders from './pages/Orders'
import Inventory from './pages/Inventory'
import Diagnosis from './pages/Diagnosis'
import Marketing from './pages/Marketing'
import Profit from './pages/Profit'
import Login from './pages/Login'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="members" element={<Members />} />
          <Route path="orders" element={<Orders />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="diagnosis" element={<Diagnosis />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="profit" element={<Profit />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
