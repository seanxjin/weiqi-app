import { Route, Routes } from 'react-router'
import MaterialLibraryPage from './pages/material-library/MaterialLibraryPage'
import WelcomePage from './pages/welcome/WelcomePage'
import GoHomePage from './pages/play/GoHomePage'
import LocalPlayPage from './pages/play/LocalPlayPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route path="/play" caseSensitive element={<GoHomePage />} />
      <Route path="/play/local" caseSensitive element={<LocalPlayPage />} />
      <Route path="/materials" caseSensitive element={<MaterialLibraryPage />} />
      <Route path="*" element={<WelcomePage />} />
    </Routes>
  )
}
