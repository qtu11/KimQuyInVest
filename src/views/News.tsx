/* ==========================================================================
   TRANG TIN TỨC & SỰ KIỆN
   ========================================================================== */

import { useMemo, useState } from 'react'
import type { PageKey } from '../app/nav'
import { AreaChart, Sparkline } from '../components/charts'
import { Art, type ArtKind } from '../components/Art'
import {
  IconBookmark, IconBuild, IconCalendar, IconComment, IconDoc, IconFlame,
  IconGlobe, IconLightning, IconSearch, IconWarning,
} from '../components/icons'
import { Badge, Card, Chip, Segmented, SearchInput, Tabs } from '../components/ui'
import { NEWS, NEWS_STATS, NEWS_TABS, SENTIMENT } from '../data/content'
import { EVENTS, INDICES, intraday, type Stock } from '../data/market'
import { dirClass, num, slug } from '../lib/format'

export function News({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState('Tất cả')
  const [q, setQ] = useState('')
  const [period, setPeriod] = useState('')
  const [importance, setImportance] = useState('')
  const [sector, setSector] = useState('')
  const [source, setSource] = useState('')
  const [saved, setSaved] = useState<number[]>([])

  const list = useMemo(() => {
    let out = NEWS
    if (tab === 'Tin nổi bật') out = out.filter((n) => n.important)
    else if (tab !== 'Tất cả') out = out.filter((n) => slug(n.source).includes(slug(tab)) || slug(n.cat).includes(slug(tab)))
    if (q) out = out.filter((n) => slug(n.title + n.desc).includes(slug(q)))
    if (importance === 'Quan trọng') out = out.filter((n) => n.important)
    return out
  }, [tab, q, importance])

  const vn = INDICES[0]
  const sentimentSeries = Array.from({ length: 60 }, (_, i) => 0.1 + Math.sin(i / 6) * 0.28 + i * 0.004)

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={NEWS_TABS} value={tab} onChange={setTab} />
        <div className="row gap-10">
          <button className="btn sm gold-ghost">
            <IconLightning size={13} /> Sự kiện quan trọng
          </button>
          <button className="btn sm ghost">
            <IconCalendar size={13} /> Hôm nay, 22/09/2026
          </button>
        </div>
      </div>

      {/* ---------- Thống kê + tâm lý ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
        {NEWS_STATS.map((s) => {
          const hot = s.icon === 'flame'
          const El = s.icon === 'flame' ? IconFlame : s.icon === 'build' ? IconBuild : s.icon === 'globe' ? IconGlobe : IconDoc
          return (
            <div className="stat" key={s.label}>
              <div className="row gap-12" style={{ alignItems: 'flex-start' }}>
                <span
                  style={{
                    width: 34, height: 34, borderRadius: 11, flexShrink: 0,
                    display: 'grid', placeItems: 'center',
                    background: hot ? 'rgba(255, 84, 84, 0.14)' : 'rgba(74, 142, 255, 0.14)',
                    color: hot ? '#ff6b6b' : '#5a9bff',
                  }}
                >
                  <El size={17} />
                </span>
                <div style={{ minWidth: 0 }}>
                  <div className="stat-label" style={{ marginTop: 0 }}>{s.label}</div>
                  <div className="stat-value stat-xl">
                    {s.value}
                    <span className="stat-delta up">{s.delta}</span>
                  </div>
                  {s.note && <div className="stat-sub">{s.note}</div>}
                </div>
              </div>
            </div>
          )
        })}
        <div className="stat">
          <div className="stat-label">Chỉ số tâm lý thị trường (News Sentiment)</div>
          <div className="row gap-12" style={{ marginTop: 2 }}>
            <span className="bar-track" style={{ flex: 1, height: 9, display: 'flex' }}>
              <i style={{ width: '33.3%', background: 'var(--up)' }} />
              <i style={{ width: '33.3%', background: 'var(--kg-gold)' }} />
              <i style={{ width: '33.4%', background: 'var(--down)' }} />
            </span>
            <span className="num up" style={{ fontSize: 16, fontWeight: 650 }}>
              {SENTIMENT.score > 0 ? '+' : ''}
              {num(SENTIMENT.score, 2)}
            </span>
            <span style={{ width: 74 }}>
              <Sparkline data={sentimentSeries} height={24} color="#22c576" fill={false} />
            </span>
          </div>
          <div className="row-between" style={{ marginTop: 3 }}>
            <span className="up" style={{ fontSize: 10 }}>{SENTIMENT.label}</span>
          </div>
        </div>
      </div>

      {/* ---------- Bộ lọc + danh sách + sự kiện ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.75fr) minmax(0,1fr)' }}>
        <Card
          padded={false}
          title={null}
          bodyClass=""
        >
          <div style={{ padding: '13px 15px 0' }}>
            <div className="row gap-10" style={{ flexWrap: 'wrap' }}>
              <div style={{ flex: '1 1 220px', minWidth: 180 }}>
                <SearchInput value={q} onChange={setQ} placeholder="Tìm kiếm tin tức..." size="sm" />
              </div>
              <select className="input sm" value={period} onChange={(e) => setPeriod(e.target.value)} style={{ width: 118 }}>
                <option value="">Thời gian</option>
                {['Hôm nay', 'Tuần này', 'Tháng này'].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <select className="input sm" value={importance} onChange={(e) => setImportance(e.target.value)} style={{ width: 168 }}>
                <option value="">Mức độ quan trọng</option>
                <option value="Quan trọng">Quan trọng</option>
              </select>
              <select className="input sm" value={sector} onChange={(e) => setSector(e.target.value)} style={{ width: 118 }}>
                <option value="">Ngành</option>
                {['Ngân hàng', 'Công nghệ', 'Bán lẻ'].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
              <select className="input sm" value={source} onChange={(e) => setSource(e.target.value)} style={{ width: 118 }}>
                <option value="">Nguồn</option>
                {['KIMQUY', 'Vĩ mô'].map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="feed" style={{ padding: '4px 15px 12px' }}>
            {list.map((n) => (
              <article className="feed-row" key={n.id}>
                <div className="feed-time">
                  <div className="feed-time-main">{n.day === 'Hôm nay' ? n.time : n.day}</div>
                  <div className="feed-time-date">{n.day === 'Hôm nay' ? '' : n.time}</div>
                </div>

                <div className="feed-body">
                  <div className="row gap-6" style={{ flexWrap: 'wrap' }}>
                    <Badge tone={n.catTone as never}>
                      <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'currentColor', display: 'inline-block' }} />
                      {n.cat}
                    </Badge>
                  </div>
                  <h3 className="feed-title" onClick={() => onNavigate('stock', n.tickers[0]?.symbol ?? 'FPT')}>
                    {n.title}
                  </h3>
                  <p className="feed-desc clamp-2">{n.desc}</p>
                  <div className="feed-chips">
                    {n.source.split('·').map((t) => (
                      <span key={t} style={{ fontSize: 10, color: 'var(--tx-dim)', fontWeight: 500 }}>{t.trim()}</span>
                    ))}
                  </div>
                </div>

                <div className="feed-art">
                  <Art kind={n.art} />
                </div>

                <div className="feed-tickers">
                  {n.tickers.map((t) => (
                    <span className="feed-ticker" key={t.symbol}>
                      <b>{t.symbol}</b>
                      <span className={dirClass(t.pct)}>
                        {t.pct > 0 ? '+' : ''}
                        {num(t.pct, 2)}%
                      </span>
                    </span>
                  ))}
                </div>

                <div className="feed-act">
                  <button
                    className="icon-btn"
                    style={{ width: 26, height: 26 }}
                    aria-label="Lưu tin"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSaved((s) => (s.includes(n.id) ? s.filter((x) => x !== n.id) : [...s, n.id]))
                    }}
                  >
                    <IconBookmark
                      size={13}
                      style={{ color: saved.includes(n.id) ? 'var(--kg-gold)' : undefined }}
                    />
                  </button>
                </div>
              </article>
            ))}

            {list.length === 0 && (
              <div className="empty">
                <IconSearch size={22} />
                <span>Không tìm thấy tin tức phù hợp với bộ lọc hiện tại.</span>
              </div>
            )}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Sự kiện sắp diễn ra" action={<span className="card-link">Xem tất cả</span>}>
            <div style={{ position: 'relative', paddingLeft: 14 }}>
              <span
                style={{
                  position: 'absolute',
                  left: 3,
                  top: 8,
                  bottom: 8,
                  width: 1,
                  background: 'var(--line-strong)',
                }}
              />
              {EVENTS.slice(0, 5).map((e) => (
                <div key={`${e.day}-${e.time}`} className="row gap-12" style={{ padding: '8px 0', position: 'relative' }}>
                  <span
                    style={{
                      position: 'absolute',
                      left: -14,
                      top: 15,
                      width: 7,
                      height: 7,
                      borderRadius: '50%',
                      background: e.tone === 'up' ? 'var(--up)' : e.tone === 'down' ? 'var(--down)' : 'var(--kg-gold)',
                      boxShadow: '0 0 0 3px #0d0d0d',
                    }}
                  />
                  <div style={{ textAlign: 'center', width: 32, flexShrink: 0 }}>
                    <div className="num" style={{ fontSize: 14, fontWeight: 650, color: 'var(--tx-hi)', lineHeight: 1.15 }}>
                      {e.day}
                    </div>
                    <div style={{ fontSize: 9, color: 'var(--tx-dim)' }}>{e.month}</div>
                  </div>
                  <div className="grow">
                    <div className="num" style={{ fontSize: 11, color: 'var(--tx)' }}>{e.time}</div>
                    <div style={{ fontSize: 11.5, color: 'var(--tx)', lineHeight: 1.4, marginTop: 2 }}>{e.title}</div>
                    <div className="row gap-6" style={{ marginTop: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                      <Badge tone={e.source === 'Vĩ mô' ? 'rose' : e.source === 'Doanh nghiệp' ? 'blue' : 'teal'}>
                        <IconLightning size={9} />
                        {e.source}
                      </Badge>
                      <span
                        style={{
                          fontSize: 10,
                          color: e.impact === 'Cao' ? 'var(--down-200)' : e.impact === 'Trung bình' ? '#f5a05a' : 'var(--tx-dim)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 3,
                        }}
                      >
                        <IconWarning size={10} />
                        Ảnh hưởng {e.impact.toLowerCase()}
                      </span>
                    </div>
                  </div>
                  <span style={{ color: 'var(--tx-faint)', flexShrink: 0 }}>🔔</span>
                </div>
              ))}
            </div>
          </Card>

          <Card
            className="gold"
            title={
              <div className="row-between" style={{ width: '100%' }}>
                <span className="card-title">Phân tích tác động AI</span>
                <button className="btn xs gold-ghost" onClick={() => onNavigate('copilot')}>
                  <IconLightning size={12} /> AI Copilot
                </button>
              </div>
            }
            action={<span />}
          >
            <div className="row gap-10" style={{ marginBottom: 10 }}>
              <div style={{ width: 74, height: 50, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--line)' }}>
                <Art kind="oil" />
              </div>
              <div style={{ minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--tx-hi)', lineHeight: 1.4 }}>
                  Giá dầu tăng 3,2% do căng thẳng địa chính trị tại Trung Đông
                </div>
                <div style={{ fontSize: 10, color: 'var(--tx-dim)', marginTop: 2 }}>07:42 · Hôm nay</div>
              </div>
            </div>

            <div className="row-between" style={{ marginBottom: 8 }}>
              <span className="mini-label">Tác động đến ngành</span>
              <span className="mini-label">Cổ phiếu liên quan</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                {[
                  { n: 'Dầu khí', t: 'Tích cực', lv: 5 },
                  { n: 'Hàng không', t: 'Tiêu cực', lv: 4 },
                  { n: 'Vận tải biển', t: 'Tiêu cực', lv: 3 },
                  { n: 'Hóa chất', t: 'Tiêu cực', lv: 2 },
                  { n: 'Nhựa', t: 'Tiêu cực', lv: 2 },
                ].map((r) => (
                  <div className="row gap-6" key={r.n} style={{ fontSize: 10.5 }}>
                    <span className="truncate" style={{ flex: 1, color: 'var(--tx-mid)' }}>{r.n}</span>
                    <span className={r.t === 'Tích cực' ? 'up' : 'down'} style={{ fontSize: 9.5, flexShrink: 0 }}>
                      {r.t}
                    </span>
                    <span className="seg-meter">
                      {Array.from({ length: 5 }, (_, i) => (
                        <i key={i} className={i < r.lv ? `on ${r.t === 'Tích cực' ? 'lv-high' : 'lv-low'}` : ''} style={{ width: 7, height: 4 }} />
                      ))}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                <div className="row-between" style={{ fontSize: 9.5, color: 'var(--tx-dim)' }}>
                  <span className="up">Tích cực</span>
                  <span className="down">Tiêu cực</span>
                </div>
                {[
                  { s: 'GAS', p: 2.1, up: true },
                  { s: 'PVS', p: 1.8, up: true },
                  { s: 'PVD', p: 1.5, up: true },
                  { s: 'BSR', p: 1.2, up: true },
                  { s: 'HVN', p: -1.4, up: false },
                  { s: 'VJC', p: -1.2, up: false },
                  { s: 'ACV', p: -0.8, up: false },
                ].map((r) => (
                  <div className="row-between" key={r.s} style={{ fontSize: 10.5 }}>
                    <span className="ticker-cell" style={{ fontSize: 11 }}>{r.s}</span>
                    <span className={r.up ? 'up' : 'down'} style={{ fontWeight: 600 }}>
                      {r.p > 0 ? '+' : ''}
                      {num(r.p, 1)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <button className="btn gold" style={{ marginTop: 12, width: '100%' }} onClick={() => onNavigate('copilot')}>
              Xem phân tích chi tiết với AI →
            </button>
          </Card>
        </div>
      </div>

      {/* ---------- Tin liên quan theo dõi ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)' }}>
        <Card title="Tin theo dõi danh mục" action={<Chip onClick={() => onNavigate('portfolio')}>Danh mục</Chip>}>
          <div className="nav-list">
            {NEWS.filter((n) => n.tickers.some((t) => ['FPT', 'TCB', 'HPG', 'MWG', 'VCB'].includes(t.symbol)))
              .slice(0, 4)
              .map((n) => (
                <div className="nav-list-row" key={n.id} onClick={() => onNavigate('news')}>
                  <span className="num" style={{ fontSize: 10, color: 'var(--tx-dim)', flexShrink: 0, width: 34 }}>
                    {n.time}
                  </span>
                  <span className="grow clamp-2">{n.title}</span>
                </div>
              ))}
          </div>
        </Card>

        <Card title="Tin theo ngành quan tâm">
          <div className="row gap-7" style={{ flexWrap: 'wrap', marginBottom: 10, gap: 7 }}>
            {['Ngân hàng', 'Công nghệ', 'Bán lẻ', 'Thép'].map((s) => (
              <Chip key={s} onClick={() => setSector(s)} active={sector === s}>
                {s}
              </Chip>
            ))}
          </div>
          <div className="nav-list">
            {NEWS.filter((n) => slug(n.source).includes('ngân hàng') || slug(n.source).includes('công nghệ') || slug(n.source).includes('bán lẻ'))
              .slice(0, 3)
              .map((n) => (
                <div className="nav-list-row" key={n.id} onClick={() => onNavigate('news')}>
                  <span className="grow clamp-2">{n.title}</span>
                  <IconComment size={13} style={{ color: 'var(--tx-faint)', flexShrink: 0 }} />
                </div>
              ))}
          </div>
        </Card>

        <Card title="Chỉ số tâm lý theo thời gian">
          <AreaChart
            series={[{ id: 's', name: 'Tâm lý thị trường', data: sentimentSeries, color: '#22c576' }]}
            labels={sentimentSeries.map((_, i) => (i % 10 === 0 ? `${i}` : ''))}
            height={140}
            fmt={(v) => num(v, 1)}
            refLine={0}
            xTicks={4}
          />
          <div className="ohlc c2" style={{ marginTop: 10 }}>
            <div className="ohlc-item">
              <div className="ohlc-label">VN-Index</div>
              <div className={`ohlc-value ${dirClass(vn.changePct)}`}>
                {num(vn.value, 2)} ({vn.changePct > 0 ? '+' : ''}
                {num(vn.changePct, 2)}%)
              </div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Tin tích cực / tiêu cực</div>
              <div className="ohlc-value">
                <span className="up">78</span> <span className="dim">/</span> <span className="down">46</span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

export { intraday, type Stock, Segmented }
export type { ArtKind }