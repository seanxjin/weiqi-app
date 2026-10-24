import type { CSSProperties } from 'react'
import { branches } from './branches'
import './SakuraBranches.css'

const petals = [0, 72, 144, 216, 288]

interface SakuraBranchesProps {
  paused?: boolean
}

export function SakuraBranches({ paused = false }: SakuraBranchesProps) {
  return (
    <div className="sakura" aria-hidden="true"
      style={{ '--scene-play-state': paused ? 'paused' : 'running' } as CSSProperties}>
      {branches.map(branch => (
        <svg key={branch.name} className={`sakura__branch sakura__branch--${branch.name}`}
          viewBox={branch.viewBox} fill="none">
          <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
            {branch.strokes.map(stroke => (
              <path key={stroke.path} className="sakura__stroke" d={stroke.path} pathLength="1"
                strokeWidth={stroke.width} style={{ '--grow-delay': `${stroke.delay}s`, '--grow-duration': `${stroke.duration}s` } as CSSProperties} />
            ))}
          </g>
          {branch.blossoms.map(blossom => (
            <g key={`${blossom.x}-${blossom.y}`} transform={`translate(${blossom.x} ${blossom.y}) rotate(${blossom.rotation}) scale(${blossom.size / 16})`}>
              <g className="sakura__blossom" style={{ '--bloom-delay': `${blossom.delay}s` } as CSSProperties}>
                {petals.map(rotation => <ellipse key={rotation} cx="0" cy="-3.2" rx="2.6" ry="3.6" transform={`rotate(${rotation})`} />)}
                <circle className="sakura__heart" r="1.1" />
              </g>
            </g>
          ))}
          {branch.fallingPetals.map(petal => {
            const origin = branch.blossoms[petal.blossom]
            return <g key={petal.blossom} transform={`translate(${origin.x} ${origin.y})`}>
              <path className="sakura__petal" d="M0 -5 C5 -4 5 1 1 5 C-4 4 -4 -2 0 -5Z"
                style={{ '--fall-duration': `${petal.duration}s`, '--fall-delay': `${petal.delay}s`, '--drift': `${petal.drift}px` } as CSSProperties} />
            </g>
          })}
        </svg>
      ))}
    </div>
  )
}
