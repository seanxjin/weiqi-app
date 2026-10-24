import { Route, Routes } from 'react-router'
import MaterialLibraryPage from './pages/material-library/MaterialLibraryPage'
import WelcomePage from './pages/welcome/WelcomePage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/materials" caseSensitive element={<MaterialLibraryPage />} />
      <Route path="*" element={<WelcomePage />} />
    </Routes>
  )
}
