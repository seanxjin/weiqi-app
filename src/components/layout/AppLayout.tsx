import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router'
import { AppSidebar } from './AppSidebar'
import type { AppLayoutContext } from './useAppLayout'
import './AppLayout.css'

export function AppLayout() {
  const location = useLocation()
  const [compact, setCompact] = useState(() => window.matchMedia('(width < 1000px)').matches)
  const drawer = useRef<HTMLDialogElement>(null)
  const toggle = useRef<HTMLButtonElement>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notice, setNotice] = useState({ label: '', sequence: 0 })

  const closeNavigation = () => {
    drawer.current?.close()
    setSidebarOpen(false)
  }

  useEffect(() => {
    const media = window.matchMedia('(width < 1000px)')
    const onResize = () => {
      drawer.current?.close()
      setSidebarOpen(false)
      setCompact(media.matches)
    }
    media.addEventListener('change', onResize)
    return () => media.removeEventListener('change', onResize)
  }, [])

  useEffect(() => {
    drawer.current?.close()
  }, [location])

  useEffect(() => {
    if (!notice.label) return
    const timer = window.setTimeout(() => setNotice(value => ({ ...value, label: '' })), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const comingSoon = (label: string) => {
    closeNavigation()
    setNotice(value => ({ label, sequence: value.sequence + 1 }))
  }

  const sidebar = <AppSidebar compact={compact} onNavigate={closeNavigation} onNotice={comingSoon} />

  return (
    <div className="app-layout">
      {compact ? (
        <dialog
          ref={drawer}
          id="go-sidebar-drawer"
          className="go-sidebar-drawer"
          aria-label="Baduk navigation"
          onClose={() => {
            setSidebarOpen(false)
            toggle.current?.focus()
          }}
          onClick={event => {
            if (event.target === event.currentTarget) closeNavigation()
          }}
          onKeyDown={event => {
            if (event.key !== 'Tab') return
            const controls = event.currentTarget.querySelectorAll<HTMLElement>('a[href], button')
            const first = controls[0]
            const last = controls[controls.length - 1]
            if (event.shiftKey && document.activeElement === first) {
              event.preventDefault()
              last?.focus()
            } else if (!event.shiftKey && document.activeElement === last) {
              event.preventDefault()
              first?.focus()
            }
          }}
        >
          {sidebar}
        </dialog>
      ) : sidebar}
      <div className="app-layout__content">
        {compact && (
          <div className="app-layout__menu-bar">
            <button
              ref={toggle}
              className="go-sidebar-toggle"
              type="button"
              aria-label="Open navigation"
              aria-expanded={sidebarOpen}
              aria-controls="go-sidebar-drawer"
              onClick={() => {
                drawer.current?.showModal()
                setSidebarOpen(true)
              }}
            >
              <span aria-hidden="true">&#9776;</span>
            </button>
          </div>
        )}
        <Outlet context={{ comingSoon } satisfies AppLayoutContext} />
      </div>
      <div className="go-notice" role="status" aria-live="polite" aria-atomic="true">
        {notice.label && <span key={notice.sequence}>{notice.label} is coming soon.</span>}
      </div>
    </div>
  )
}
