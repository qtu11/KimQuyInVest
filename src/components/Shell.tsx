/* ==========================================================================
   KHUNG ỨNG DỤNG: Sidebar · Topbar · Hero · Ticker · Command palette
   ========================================================================== */

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { NAV, PAGE_META, ALL_NAV, type PageKey } from '../app/nav'
import { HeroScene } from './Art'
import {
  IconArrowRight, IconBell, IconBriefcase, IconChevronDown, IconClose, IconCopilot,
  IconGrid, IconMail, IconSearch, IconSettings, IconUser,
} from './icons'
import { Badge, Dropdown, useClock } from './ui'
import { NOTICES } from '../data/portfolio'
import { STOCKS, TICKER_ITEMS } from '../data/market'
import { dirClass, fmtClock, num, slug } from '../lib/format'
import { GlobalSearch } from './GlobalSearch'

/* -------------------------------------------------------------------------- */
/* Logo thương hiệu                                                           */
/* -------------------------------------------------------------------------- */

function Brand({ collapsed }: { collapsed: boolean }) {
  return (
    <div className="rail-brand">
      <img
        src="/asset/logo-remove-background.png"
        alt="KIMQUY Invest"
        style={{ width: 36, height: 36, objectFit: 'contain' }}
      />
      {!collapsed && (
        <div className="rail-brand-text">
          <div className="rail-brand-name">KIMQUY</div>
          <div className="rail-brand-sub" style={{ color: 'var(--kg-gold)', fontStyle: 'normal', letterSpacing: '0.14em' }}>Invest</div>
          <div className="rail-brand-tag">Intelligence for a Greater Tomorrow</div>
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Sidebar                                                                    */
/* -------------------------------------------------------------------------- */

export function Sidebar({
  page,
  onNavigate,
  collapsed,
}: {
  page: PageKey
  onNavigate: (p: PageKey) => void
  collapsed: boolean
}) {
  return (
    <aside className="rail" aria-label="Điều hướng chính">
      <Brand collapsed={collapsed} />
      <nav className="rail-nav">
        {NAV.map((group, gi) => (
          <div className="rail-group" key={gi}>
            {group.label && !collapsed && <div className="rail-group-label">{group.label}</div>}
            {group.items.map((item) => {
              const Icon = item.icon
              const active = page === item.key
              return (
                <button
                  key={item.key}
                  className={`rail-item ${active ? 'active' : ''}`}
                  onClick={() => onNavigate(item.key)}
                  aria-current={active ? 'page' : undefined}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon size={16} />
                  {!collapsed && <span className="rail-item-label">{item.label}</span>}
                </button>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="rail-diamond">
        <div className="rail-diamond-title">
          <span>◆</span> KIMQUY Diamond
        </div>
        <p>
          Exclusive insights.
          <br />
          Priority opportunities.
          <br />A higher perspective.
        </p>
      </div>
    </aside>
  )
}

/* -------------------------------------------------------------------------- */
/* Thanh trên                                                                 */
/* -------------------------------------------------------------------------- */

function NotificationsMenu() {
  const unread = NOTICES.filter((n) => !n.read).length
  return (
    <Dropdown
      trigger={({ toggle }) => (
        <button className="icon-btn" onClick={toggle} aria-label="Thông báo">
          <IconBell size={17} />
        </button>
      )}
    >
      {(close) => (
        <div style={{ width: 330, padding: 4 }}>
          <div className="row-between" style={{ padding: '8px 10px 10px' }}>
            <strong style={{ fontSize: 13, color: 'var(--tx-hi)' }}>Thông báo</strong>
            <Badge tone="gold">{unread} mới</Badge>
          </div>
          <div className="menu-sep" />
          {NOTICES.slice(0, 4).map((n) => (
            <button className="menu-item" key={n.id} onClick={close} style={{ alignItems: 'flex-start' }}>
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  marginTop: 6,
                  flexShrink: 0,
                  background:
                    n.tone === 'up' ? 'var(--up)' : n.tone === 'down' ? 'var(--down)' : 'var(--kg-gold)',
                }}
              />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: 'block', fontSize: 12, color: 'var(--tx-hi)', fontWeight: 550 }}>
                  {n.title}
                </span>
                <span style={{ display: 'block', fontSize: 10.5, color: 'var(--tx-dim)', marginTop: 2 }}>
                  {n.time}
                </span>
              </span>
            </button>
          ))}
          <div className="menu-sep" />
          <button className="menu-item" onClick={close} style={{ justifyContent: 'center', color: 'var(--tx-gold)' }}>
            Xem tất cả thông báo
          </button>
        </div>
      )}
    </Dropdown>
  )
}

export function TopBar({
  onOpenPalette,
  onNavigate,
  onToggleRail,
  collapsed,
  solid,
}: {
  onOpenPalette: () => void
  onNavigate: (p: PageKey) => void
  onToggleRail: () => void
  collapsed: boolean
  solid?: boolean
}) {
  const searchRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        onOpenPalette()
      }
      if (e.key === '/' && document.activeElement === document.body) {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onOpenPalette])

  return (
    <header className={solid ? 'topbar solid' : 'topbar'}>
      <div className="searchbox" onClick={onOpenPalette} role="search">
        <IconSearch size={15} />
        <input
          ref={searchRef}
          placeholder="Tìm mã cổ phiếu, ngành, chủ đề, tin tức..."
          readOnly
          onFocus={onOpenPalette}
          aria-label="Tìm kiếm toàn cục"
        />
        <span className="kbd">Ctrl K</span>
      </div>

      <div style={{ flex: 1 }} />

      <NotificationsMenu />

      <Dropdown
        trigger={({ toggle }) => (
          <button className="user-chip" onClick={toggle} aria-label="Tài khoản">
            <span className="avatar">NH</span>
            <span style={{ textAlign: 'left' }}>
              <span className="user-name" style={{ display: 'block' }}>
                Nguyễn Hoàng
              </span>
              <span className="user-tier" style={{ display: 'block' }}>
                Diamond Member
              </span>
            </span>
            <IconChevronDown size={13} style={{ color: 'var(--tx-dim)' }} />
          </button>
        )}
      >
        {(close) => (
          <>
            <button className="menu-item" onClick={close}>
              <IconUser size={14} /> Hồ sơ cá nhân
            </button>
            <button className="menu-item" onClick={close}>
              <IconBriefcase size={14} /> Danh mục của tôi
            </button>
            <button className="menu-item" onClick={close}>
              <IconMail size={14} /> Hộp thư & báo cáo
            </button>
            <div className="menu-sep" />
            <button className="menu-item" onClick={() => { close(); onNavigate('settings') }}>
              <IconSettings size={14} /> Cài đặt
            </button>
            <button className="menu-item" onClick={close}>
              <IconCopilot size={14} /> Nâng cấp gói Diamond
            </button>
          </>
        )}
      </Dropdown>
    </header>
  )
}

/* -------------------------------------------------------------------------- */
/* Phần đầu trang                                                             */
/* -------------------------------------------------------------------------- */

export function PageHero({ page, children }: { page: PageKey; children?: ReactNode }) {
  if (page === 'copilot' || page === 'report-template') return null

  const headerKey = page === 'stock' || page === 'research' ? 'market' : page
  const headerImg = `/asset/art/header/${headerKey}.png`
  const isOverview = page === 'overview'
  const isMarket = page === 'market'
  const heroHeight = isOverview ? 110 : isMarket ? 134 : 77
  const meta = PAGE_META[page]

  return (
    <section
      className="hero"
      style={{
        padding: 0,
        height: heroHeight,
        minHeight: heroHeight,
        maxHeight: heroHeight,
        background: 'transparent',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--line-soft)',
        overflow: 'hidden',
      }}
    >
      {isMarket && meta && (
        <div style={{ position: 'absolute', left: 24, top: 68, right: 240, zIndex: 10 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 33,
              lineHeight: 1.15,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#fff',
            }}
          >
            {meta.title}
          </h1>
          <p
            style={{
              margin: '5px 0 0',
              fontSize: 12.5,
              lineHeight: 1.5,
              color: 'rgba(255,255,255,0.72)',
              maxWidth: 760,
            }}
          >
            {meta.desc}
          </p>
        </div>
      )}
      {children && (
        <div style={{ position: 'absolute', right: 24, bottom: 14, zIndex: 10 }}>
          {children}
        </div>
      )}
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Thanh chỉ số chạy cuối trang                                               */
/* -------------------------------------------------------------------------- */

export function Ticker() {
  const now = useClock(1000)
  const items = useMemo(() => [...TICKER_ITEMS, ...TICKER_ITEMS], [])

  return (
    <footer className="ticker" aria-label="Chỉ số thị trường">
      <div className="ticker-track">
        {items.map((it, i) => (
          <span className="ticker-item" key={i}>
            <span className="ticker-name">{it.name}</span>
            <span className="ticker-val">{it.value}</span>
            <span className={dirClass(it.pct)} style={{ fontWeight: 600 }}>
              {it.pct > 0 ? '+' : ''}
              {num(it.pct, 2)}%
            </span>
          </span>
        ))}
      </div>
      <div className="ticker-meta">
        <span className="live-dot" />
        <span style={{ color: 'var(--up-200)' }}>Kết nối dữ liệu: Trực tuyến</span>
        <span className="num" style={{ color: 'var(--tx-mid)' }} suppressHydrationWarning>
          {fmtClock(now)}
        </span>
      </div>
    </footer>
  )
}

/* -------------------------------------------------------------------------- */
/* Bảng lệnh điều hướng nhanh                                                 */
/* -------------------------------------------------------------------------- */

export function CommandPalette({
  open,
  onClose,
  onNavigate,
}: {
  open: boolean
  onClose: () => void
  onNavigate: (p: PageKey, symbol?: string) => void
}) {
  const [q, setQ] = useState('')
  const [sel, setSel] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setQ('')
      setSel(0)
      requestAnimationFrame(() => inputRef.current?.focus())
    }
  }, [open])

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const pages = ALL_NAV.filter((n) => !needle || slug(n.label).includes(slug(needle)))
    const stocks = needle ? searchStocks(needle) : []
    return { pages: needle ? pages : ALL_NAV, stocks }
  }, [q])

  const flat = useMemo(
    () => [
      ...results.pages.map((p) => ({ kind: 'page' as const, key: p.key, label: p.label })),
      ...results.stocks.map((s) => ({ kind: 'stock' as const, key: s.symbol, label: s.symbol, sub: s.name })),
    ],
    [results],
  )

  useEffect(() => setSel(0), [q])

  if (!open) return null

  const choose = (i: number) => {
    const item = flat[i]
    if (!item) return
    if (item.kind === 'page') onNavigate(item.key as PageKey)
    else onNavigate('stock', item.key)
    onClose()
  }

  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div
        className="palette"
        role="dialog"
        aria-modal="true"
        aria-label="Tìm kiếm nhanh"
        onKeyDown={(e) => {
          if (e.key === 'ArrowDown') {
            e.preventDefault()
            setSel((s) => Math.min(s + 1, flat.length - 1))
          } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            setSel((s) => Math.max(s - 1, 0))
          } else if (e.key === 'Enter') {
            e.preventDefault()
            choose(sel)
          } else if (e.key === 'Escape') {
            onClose()
          }
        }}
      >
        <div className="palette-input">
          <IconSearch size={17} style={{ color: 'var(--tx-dim)' }} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Tìm trang, mã cổ phiếu, chủ đề..."
            aria-label="Nội dung tìm kiếm"
          />
          <span className="kbd">ESC</span>
        </div>
        <div className="palette-results">
          {flat.length === 0 && (
            <div className="empty">
              <IconSearch size={22} />
              <span>Không tìm thấy kết quả cho “{q}”</span>
            </div>
          )}
          {results.pages.length > 0 && (
            <>
              <div className="palette-group">ĐIỀU HƯỚNG</div>
              {results.pages.map((p, i) => {
                const Icon = p.icon
                return (
                  <button
                    className={`palette-item ${sel === i ? 'sel' : ''}`}
                    key={p.key}
                    onMouseEnter={() => setSel(i)}
                    onClick={() => choose(i)}
                    style={{ width: '100%' }}
                  >
                    <Icon size={15} />
                    <span className="palette-item-title">{p.label}</span>
                    <IconArrowRight size={13} style={{ marginLeft: 'auto', color: 'var(--tx-faint)' }} />
                  </button>
                )
              })}
            </>
          )}
          {results.stocks.length > 0 && (
            <>
              <div className="palette-group">CỔ PHIẾU</div>
              {results.stocks.map((s, i) => {
                const idx = results.pages.length + i
                return (
                  <button
                    className={`palette-item ${sel === idx ? 'sel' : ''}`}
                    key={s.symbol}
                    onMouseEnter={() => setSel(idx)}
                    onClick={() => choose(idx)}
                    style={{ width: '100%' }}
                  >
                    <span className="ticker-cell gold" style={{ width: 46 }}>
                      {s.symbol}
                    </span>
                    <span style={{ minWidth: 0 }}>
                      <span className="palette-item-title">{s.name}</span>
                      <span className="palette-item-sub">
                        {num(s.price, 0)} VND · <span className={dirClass(s.changePct)}>
                          {s.changePct > 0 ? '+' : ''}
                          {num(s.changePct, 2)}%
                        </span>
                      </span>
                    </span>
                  </button>
                )
              })}
            </>
          )}
        </div>
      </div>
    </>
  )
}

/* Tìm cổ phiếu theo từ khoá (không dấu) */
function searchStocks(needle: string) {
  const n = slug(needle)
  return STOCKS.filter(
    (s) => s.symbol.toLowerCase().includes(n) || slug(s.name).includes(n) || slug(s.sector).includes(n),
  ).slice(0, 8)
}

export { GlobalSearch }