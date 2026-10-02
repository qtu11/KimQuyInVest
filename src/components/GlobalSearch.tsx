/* ==========================================================================
   Ô TÌM KIẾM TOÀN CỤC — dùng chung cho thanh trên và ô tra cứu
   ========================================================================== */

import { useMemo, useState } from 'react'
import { IconArrowRight, IconSearch } from './icons'
import { STOCKS } from '../data/market'
import { dirClass, num, slug } from '../lib/format'

export type SearchHit = {
  kind: 'stock'
  symbol: string
  name: string
  price: number
  changePct: number
  sector: string
}

/** Tìm cổ phiếu theo từ khoá không dấu (mã, tên công ty hoặc ngành) */
export function searchAll(query: string, limit = 8): SearchHit[] {
  const n = slug(query)
  if (!n) return []
  const hits: SearchHit[] = []

  for (const s of STOCKS) {
    if (s.symbol.toLowerCase().includes(n) || slug(s.name).includes(n) || slug(s.sector).includes(n)) {
      hits.push({
        kind: 'stock',
        symbol: s.symbol,
        name: s.name,
        price: s.price,
        changePct: s.changePct,
        sector: s.sector,
      })
    }
    if (hits.length >= limit) break
  }
  return hits.slice(0, limit)
}

/** Ô nhập có gợi ý kết quả ngay bên dưới */
export function GlobalSearch({
  placeholder = 'Tìm mã cổ phiếu, ngành, chủ đề...',
  onPick,
  size = 'md',
}: {
  placeholder?: string
  onPick?: (hit: SearchHit) => void
  size?: 'sm' | 'md'
}) {
  const [q, setQ] = useState('')
  const [focus, setFocus] = useState(false)
  const hits = useMemo(() => searchAll(q), [q])

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <div
        className="searchbox"
        style={{ maxWidth: 'none', height: size === 'sm' ? 30 : 37 }}
      >
        <IconSearch size={size === 'sm' ? 13 : 15} />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => setFocus(true)}
          onBlur={() => window.setTimeout(() => setFocus(false), 160)}
          placeholder={placeholder}
          style={size === 'sm' ? { fontSize: 11.5 } : undefined}
          aria-label={placeholder}
        />
      </div>

      {focus && q && (
        <div
          className="menu"
          style={{ left: 0, right: 0, minWidth: 0, top: 'calc(100% + 5px)', maxHeight: 320, overflowY: 'auto' }}
        >
          {hits.length === 0 ? (
            <div className="empty" style={{ padding: '16px 12px' }}>
              <IconSearch size={18} />
              <span>Không tìm thấy kết quả cho “{q}”</span>
            </div>
          ) : (
            hits.map((h) => (
              <button
                key={h.symbol}
                className="menu-item"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onPick?.(h)
                  setQ('')
                }}
              >
                <span className="ticker-cell gold" style={{ width: 44, flexShrink: 0 }}>
                  {h.symbol}
                </span>
                <span style={{ minWidth: 0, flex: 1 }}>
                  <span className="truncate" style={{ display: 'block', fontSize: 11.5, color: 'var(--tx-hi)' }}>
                    {h.name}
                  </span>
                  <span style={{ display: 'block', fontSize: 10, color: 'var(--tx-dim)' }}>{h.sector}</span>
                </span>
                <span style={{ textAlign: 'right', flexShrink: 0 }}>
                  <span className="num" style={{ display: 'block', fontSize: 11.5, color: 'var(--tx-hi)' }}>
                    {num(h.price, 0)}
                  </span>
                  <span className={`num ${dirClass(h.changePct)}`} style={{ display: 'block', fontSize: 10.5, fontWeight: 600 }}>
                    {h.changePct > 0 ? '+' : ''}
                    {num(h.changePct, 2)}%
                  </span>
                </span>
                <IconArrowRight size={12} style={{ color: 'var(--tx-faint)', flexShrink: 0 }} />
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}