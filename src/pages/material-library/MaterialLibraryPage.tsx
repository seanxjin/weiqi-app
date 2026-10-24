import { useEffect } from 'react'
import { BoardCanvas } from '../../components/BoardCanvas'
import { StoneCanvas } from '../../components/StoneCanvas'
import { boardThemes, stoneStyles } from '../../lib/baduk'
import type { BoardThemeId, StoneStyleId } from '../../lib/baduk'
import './MaterialLibraryPage.css'

const boards: BoardThemeId[] = ['kaya', 'walnut', 'ash']
const stones: StoneStyleId[] = ['polished', 'satin', 'matte', 'snow']

function MaterialLibraryPage() {
  useEffect(() => { document.title = 'Baduk — Boards & stones' }, [])
  return (
    <main className="material-library">
      <header className="page-header">
        <div className="eyebrow header-meta">
          <span>Baduk / Material library</span>
          <span>Collection 01</span>
        </div>
        <h1>Boards & stones.</h1>
        <p className="introduction">Natural materials. Quiet details. A place for the game.</p>
      </header>
      <section className="boards-section" aria-labelledby="boards-title">
        <div className="section-heading">
          <h2 id="boards-title"><span className="section-number">01</span> The boards</h2>
          <p>Three timbers · 19 × 19</p>
        </div>
        <div className="boards-grid">
          {boards.map((theme, index) => (
            <figure className="board-sample" key={theme}>
              <BoardCanvas theme={theme} />
              <figcaption className="board-caption">
                <span className="sample-number">0{index + 1}</span>
                <div>
                  <h3>{boardThemes[theme].name}</h3>
                  <p>{boardThemes[theme].material}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="stones-section" aria-labelledby="stones-title">
        <div className="section-heading">
          <h2 id="stones-title"><span className="section-number">02</span> The stones</h2>
          <p>Four styles · black & white</p>
        </div>
        <div className="stone-study">
          <div className="eyebrow study-meta">
            <span>Baduk / Material study</span><span>Enlarged samples</span>
          </div>
          <div className="study-intro">
            <h3>A quiet contrast.</h3>
            <p>Four surfaces. Black and white, in the same soft light.</p>
          </div>
          <div className="stone-rows">
            {stones.map(style => (
              <div className="stone-row" key={style}>
                <div className="material-notes">
                  <p className="eyebrow">{stoneStyles[style].finish}</p>
                  <h4>{stoneStyles[style].name}</h4>
                  <p className="material-description">{stoneStyles[style].description}</p>
                </div>
                <div className="stone-pair">
                  {(['black', 'white'] as const).map(color => (
                    <figure className="stone-sample" key={color}>
                      <StoneCanvas style={style} color={color} />
                      <figcaption>{stoneStyles[style].labels[color]}</figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="study-footer">
            <span>Enlarged samples · consistent scale</span>
            <span>Smooth, rounded form / subtle surface variation</span>
          </div>
        </div>
      </section>
      <footer className="page-footer"><span>Baduk</span><span>The essentials, considered.</span></footer>
    </main>
  )
}

export default MaterialLibraryPage
