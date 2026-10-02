/* ==========================================================================
   KIMQUY INVEST — NEXT.JS CORE APPLICATION SHELL
   Quản lý trạng thái trang, định tuyến đồng bộ URL, cuộn trang & trải nghiệm mượt mà
   ========================================================================== */

'use client'

import { useCallback, useEffect, useState } from 'react'
import '../styles/tokens.css'
import '../styles/components.css'

import { CommandPalette, PageHero, Sidebar, Ticker, TopBar } from './Shell'
import { PAGE_META, type PageKey } from '../app/nav'
import { useClock } from './ui'
import { IconRefresh } from './icons'
import { fmtLongDate } from '../lib/format'

import { Overview } from '../views/Overview'
import { Market } from '../views/Market'
import { SectorFlow } from '../views/SectorFlow'
import { News } from '../views/News'
import { Screener } from '../views/Screener'
import { Topics } from '../views/Topics'
import { Portfolio } from '../views/Portfolio'
import { Performance } from '../views/Performance'
import { Risk } from '../views/Risk'
import { Scenario } from '../views/Scenario'
import { Reports } from '../views/Reports'
import { ReportTemplate } from '../views/ReportTemplate'
import { Ideas } from '../views/Ideas'
import { Thesis } from '../views/Thesis'
import { Copilot } from '../views/Copilot'
import { Research } from '../views/Research'
import { Alerts } from '../views/Alerts'
import { Settings } from '../views/Settings'
import { StockDetail } from '../views/StockDetail'

interface KimQuyAppProps {
  initialPage?: PageKey
  initialSymbol?: string
}

export function KimQuyApp({ initialPage = 'overview', initialSymbol = 'FPT' }: KimQuyAppProps) {
  const now = useClock(1000)
  const [page, setPage] = useState<PageKey>(initialPage)
  const [symbol, setSymbol] = useState<string>(initialSymbol)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Điều hướng trang và cập nhật URL trình duyệt mà không reload
  const navigate = useCallback((p: PageKey, sym?: string) => {
    if (sym) setSymbol(sym)
    setPage(p)

    if (typeof window !== 'undefined') {
      let nextUrl = '/'
      if (p === 'overview') nextUrl = '/'
      else if (p === 'stock') nextUrl = `/stock/${sym || symbol}`
      else nextUrl = `/${p}`

      window.history.pushState({ page: p, symbol: sym || symbol }, '', nextUrl)
    }
  }, [symbol])

  // Lắng nghe sự kiện Back/Forward của trình duyệt
  useEffect(() => {
    const handlePopState = (e: PopStateEvent) => {
      if (e.state && e.state.page) {
        setPage(e.state.page)
        if (e.state.symbol) setSymbol(e.state.symbol)
      } else {
        // Suy ra từ pathname
        const path = window.location.pathname.replace(/^\//, '').split('/')[0]
        if (path === '' || path === 'overview') setPage('overview')
        else if (path === 'stock') {
          setPage('stock')
          const stockSym = window.location.pathname.split('/')[2]
          if (stockSym) setSymbol(stockSym.toUpperCase())
        } else if (PAGE_META[path as PageKey]) {
          setPage(path as PageKey)
        }
      }
    }

    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  // Đưa trang về đầu khi đổi màn hình
  useEffect(() => {
    const el = document.getElementById('scroller')
    if (el) el.scrollTop = 0
    setScrolled(false)
  }, [page, symbol])

  // Cập nhật Document Title
  useEffect(() => {
    const meta = PAGE_META[page]
    if (meta) {
      document.title = `${meta.title} — KIMQUY Invest`
    }
  }, [page, symbol])

  return (
    <div className={`app ${collapsed ? 'collapsed' : ''}`}>
      <Sidebar page={page} onNavigate={navigate} collapsed={collapsed} />

      <div className="main">
        {(() => {
          const headerKey = page === 'stock' || page === 'research' ? 'market' : page
          const hasHero = page !== 'copilot' && page !== 'report-template'
          const heroH = page === 'overview' ? 110 : page === 'market' ? 134 : 77
          return (
            <div
              className="hero-bg"
              aria-hidden
              style={{
                height: hasHero ? 66 + heroH : 66,
                backgroundImage: hasHero ? `url('/asset/art/header/${headerKey}.png')` : undefined,
                backgroundPosition: 'center 48px',
                opacity: scrolled || !hasHero ? 0 : 1,
              }}
            />
          )
        })()}

        <TopBar
          onOpenPalette={() => setPaletteOpen(true)}
          onNavigate={navigate}
          collapsed={collapsed}
          onToggleRail={() => setCollapsed((c) => !c)}
          solid={scrolled || page === 'copilot' || page === 'report-template'}
        />

        <div
          className="scroller"
          id="scroller"
          onScroll={(e) => setScrolled(e.currentTarget.scrollTop > 8)}
        >
          <div className="page" key={`${page}-${symbol}`}>
            <PageHero page={page}>
              {page === 'market' && (
                <div style={{ textAlign: 'right' }}>
                  <div className="num" style={{ fontSize: 12, color: 'var(--tx-hi)' }} suppressHydrationWarning>
                    {fmtLongDate(now)}{' '}
                    <span style={{ color: 'var(--tx-mid)' }} suppressHydrationWarning>
                      {now.toLocaleTimeString('vi-VN')}
                    </span>
                  </div>
                  <div className="row gap-6" style={{ justifyContent: 'flex-end', marginTop: 5 }}>
                    <span className="live-dot" />
                    <span style={{ fontSize: 10.5, color: 'var(--up-200)' }}>Thị trường đang mở</span>
                  </div>
                  <button className="btn sm" style={{ marginTop: 8 }}>
                    <IconRefresh size={13} /> Dữ liệu thời gian thực
                  </button>
                </div>
              )}
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
            {page === 'report-template' && <ReportTemplate onNavigate={navigate} />}
            {page === 'ideas' && <Ideas onNavigate={navigate} />}
            {page === 'thesis' && <Thesis onNavigate={navigate} />}
            {page === 'copilot' && <Copilot />}
            {page === 'research' && <Research onNavigate={navigate} />}
            {page === 'alerts' && <Alerts onNavigate={navigate} />}
            {page === 'settings' && <Settings onNavigate={navigate} />}
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
export default KimQuyApp
