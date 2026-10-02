/* ==========================================================================
   KIMQUY INVEST — ĐIỂM KHỞI TẠO
   ========================================================================== */

import { StrictMode, useCallback, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/tokens.css'
import './styles/components.css'

import { CommandPalette, PageHero, Sidebar, Ticker, TopBar } from './components/Shell'
import { PAGE_META, type PageKey } from './app/nav'

import { Overview } from './views/Overview'
import { Market } from './views/Market'
import { SectorFlow } from './views/SectorFlow'
import { News } from './views/News'
import { Screener } from './views/Screener'
import { Topics } from './views/Topics'
import { Portfolio } from './views/Portfolio'
import { Performance } from './views/Performance'
import { Risk } from './views/Risk'
import { Scenario } from './views/Scenario'
import { Reports } from './views/Reports'
import { Ideas } from './views/Ideas'
import { Thesis } from './views/Thesis'
import { Copilot } from './views/Copilot'
import { Research } from './views/Research'
import { Alerts } from './views/Alerts'
import { Settings } from './views/Settings'
import { StockDetail } from './views/StockDetail'

/* -------------------------------------------------------------------------- */
/* Bộ định tuyến                                                              */
/* -------------------------------------------------------------------------- */

function App() {
  const [page, setPage] = useState<PageKey>('overview')
  const [symbol, setSymbol] = useState<string>('FPT')
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const navigate = useCallback((p: PageKey, sym?: string) => {
    if (sym) setSymbol(sym)
    setPage(p)
  }, [])

  /* Đưa trang về đầu khi chuyển màn hình */
  useEffect(() => {
    const el = document.getElementById('scroller')
    if (el) el.scrollTop = 0
    setScrolled(false)
  }, [page, symbol])

  useEffect(() => {
    document.title = `${PAGE_META[page].title} — KIMQUY Invest`
  }, [page])

  return (
    <div className={`app ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar page={page} onNavigate={navigate} collapsed={collapsed} />

      <div className="main">
        <TopBar
          onOpenPalette={() => setPaletteOpen(true)}
          onNavigate={navigate}
          collapsed={collapsed}
          onToggleRail={() => setCollapsed((c) => !c)}
        />

        <div
          className="scroller"
          id="scroller"
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)}
        >
          <div className="page" key={`${page}-${symbol}`}>
            <PageHero page={page}>
              {page === 'stock' && (
                <div className="hero-eyebrow" style={{ marginTop: 8 }}>
                  {symbol} · {PAGE_META.stock.title}
                </div>
              )}
            </PageHero>

            {page === 'overview' && <Overview onNavigate={navigate} />}
            {page === 'market' && <Market onNavigate={navigate} />}
            {page === 'sector' && <SectorFlow onNavigate={navigate} />}
            {page === 'news' && <News onNavigate={navigate} />}
            {page === 'screener' && <Screener onNavigate={navigate} />}
            {page === 'topic' && <Topics onNavigate={navigate} />}
            {page === 'portfolio' && <Portfolio onNavigate={navigate} />}
            {page === 'performance' && <Performance onNavigate={navigate} />}
            {page === 'risk' && <Risk onNavigate={navigate} />}
            {page === 'scenario' && <Scenario onNavigate={navigate} />}
            {page === 'report' && <Reports onNavigate={navigate} />}
            {page === 'ideas' && <Ideas onNavigate={navigate} />}
            {page === 'thesis' && <Thesis onNavigate={navigate} />}
            {page === 'copilot' && <Copilot />}
            {page === 'research' && <Research onNavigate={navigate} />}
            {page === 'alerts' && <Alerts onNavigate={navigate} />}
            {page === 'settings' && <Settings />}
            {page === 'stock' && <StockDetail symbol={symbol} onNavigate={navigate} />}
          </div>
        </div>

        <Ticker />
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        onNavigate={navigate}
      />

      {scrolled && (
        <button
          className="icon-btn"
          onClick={() => document.getElementById('scroller')?.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Lên đầu trang"
          style={{
            position: 'fixed',
            right: 22,
            bottom: 56,
            zIndex: 50,
            background: '#191919',
            border: '1px solid var(--line-strong)',
            boxShadow: 'var(--sh-pop)',
          }}
        >
          ↑
        </button>
      )}
    </div>
  )
}

const root = document.getElementById('root')
if (!root) throw new Error('Không tìm thấy phần tử #root')

createRoot(root).render(
  <StrictMode>
    <App />
  </StrictMode>,
)