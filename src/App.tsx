import { AppLayout } from './components/layout/AppLayout'
import { Route, Routes } from 'react-router'
import MaterialLibraryPage from './pages/material-library/MaterialLibraryPage'
import WelcomePage from './pages/welcome/WelcomePage'
import GoHomePage from './pages/play/GoHomePage'
import LocalPlayPage from './pages/play/LocalPlayPage'
import GameSetupPage from './pages/setup/GameSetupPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<WelcomePage />} />
      <Route element={<AppLayout />}>
        <Route path="/play" caseSensitive element={<GoHomePage />} />
        <Route path="/play/local" caseSensitive element={<LocalPlayPage />} />
        <Route path="/play/local/setup" caseSensitive element={<GameSetupPage key="local" mode="local" />} />
        <Route path="/play/online/setup" caseSensitive element={<GameSetupPage key="online" mode="online" />} />
        <Route path="/materials" caseSensitive element={<MaterialLibraryPage />} />
      </Route>
      <Route path="*" element={<WelcomePage />} />
    </Routes>
  )
}
