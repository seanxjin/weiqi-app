import { useEffect } from 'react'
import { Link } from 'react-router'
import { InteractiveBoard } from '../../components/InteractiveBoard'
import './PlayPages.css'

export default function LocalPlayPage() {
  useEffect(() => { document.title = 'Baduk — Local Play' }, [])
  return (
    <main className="local-play" id="main-content">
      <header><Link to="/play">Back to Play</Link><h1>Local play</h1></header>
      <div className="local-play__board"><InteractiveBoard /></div>
    </main>
  )
}
