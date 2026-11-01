import { useEffect } from 'react'
import { useSearchParams } from 'react-router'
import { LocalBoard } from './LocalBoard'
import './PlayPages.css'

export default function LocalPlayPage() {
  const [params] = useSearchParams()
  const size = params.get('size')
  const boardSize = size === '9' ? 9 : size === '13' ? 13 : 19
  useEffect(() => { document.title = 'Baduk — Local Play' }, [])
  return (
    <main className="local-play" id="main-content">
      <header className="local-play__heading">
        <div><p>FRIENDLY GAME</p><h1>A moment for the game.</h1></div>
        <span>{boardSize} × {boardSize} · Japanese rules</span>
      </header>
      <div className="local-play__board"><LocalBoard boardSize={boardSize} /></div>
    </main>
  )
}
