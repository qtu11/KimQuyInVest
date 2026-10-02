/* ==========================================================================
   TRANG SÀNG LỌC CỔ PHIẾU
   ========================================================================== */

import { useMemo, useState } from 'react'
import type { PageKey } from '../app/nav'
import { AreaChart, BarChart, BarList, Donut, Sparkline } from '../components/charts'
import {
  IconArrowRight, IconBookmark, IconCheck, IconDownload, IconLightning, IconMore,
  IconPlus, IconSearch, IconStar,
} from '../components/icons'
import { AiSuggestions, Badge, Card, Chip, SearchInput, Segmented, Tabs } from '../components/ui'
import {
  SCREEN_AI_SUGGESTIONS, SCREEN_PRESETS, SCREEN_TOP_METRICS,
} from '../data/content'
import { SECTORS, STOCKS, type Stock } from '../data/market'
import { performanceSeries } from '../data/market'
import { dirClass, num, slug } from '../lib/format'

const TABS = ['Bộ lọc nâng cao', 'Bộ lọc mẫu', 'Kết quả', 'Lưu bộ lọc'] as const
type Tab = (typeof TABS)[number]

type Filters = {
  market: string
  sector: string
  capMin: string
  capMax: string
  peMin: string
  peMax: string
  pbMin: string
  pbMax: string
  roeMin: string
  roeMax: string
  epsMin: string
  epsMax: string
  deMin: string
  deMax: string
}

const DEFAULT: Filters = {
  market: 'Tất cả', sector: 'Tất cả',
  capMin: '0', capMax: 'Đến ∞',
  peMin: '0', peMax: 'Đến 20',
  pbMin: '0', pbMax: 'Đến 5',
  roeMin: 'Từ 15', roeMax: 'Đến ∞',
  epsMin: 'Từ 10', epsMax: 'Đến ∞',
  deMin: 'Từ 0', deMax: 'Đến 1',
}

const NUM = (s: string, fallback: number) => {
  const m = s.match(/-?\d+(?:[.,]\d+)?/)
  return m ? Number(m[0].replace(',', '.')) : fallback
}

export function Screener({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Kết quả')
  const [f, setF] = useState<Filters>(DEFAULT)
  const [q, setQ] = useState('')
  const [sort, setSort] = useState<'ROE cao nhất' | 'P/E thấp nhất' | 'Tăng trưởng LNST' | 'Vốn hoá'>('ROE cao nhất')
  const [exTab, setExTab] = useState('Tất cả (124)')
  const [stars, setStars] = useState<string[]>(['FPT', 'TCB'])
  const [saved, setSaved] = useState(false)

  const set = (k: keyof Filters) => (v: string) => setF((p) => ({ ...p, [k]: v }))

  /* Áp dụng bộ lọc thực */
  const results = useMemo(() => {
    let out: Stock[] = STOCKS.filter((s) => {
      if (f.market !== 'Tất cả' && s.exchange !== f.market) return false
      if (f.sector !== 'Tất cả' && s.sector !== f.sector) return false
      if (s.pe < NUM(f.peMin, 0) || s.pe > NUM(f.peMax, 9999)) return false
      if (s.pb < NUM(f.pbMin, 0) || s.pb > NUM(f.pbMax, 9999)) return false
      if (s.roe < NUM(f.roeMin, -999) || s.roe > NUM(f.roeMax, 9999)) return false
      if (s.epsGrowth < NUM(f.epsMin, -999) || s.epsGrowth > NUM(f.epsMax, 9999)) return false
      if (s.de < NUM(f.deMin, -999) || s.de > NUM(f.deMax, 9999)) return false
      return true
    })
    if (q.trim()) out = out.filter((s) => slug(s.symbol).includes(slug(q)) || slug(s.name).includes(slug(q)))

    const sorted = [...out]
    if (sort === 'ROE cao nhất') sorted.sort((a, b) => b.roe - a.roe)
    if (sort === 'P/E thấp nhất') sorted.sort((a, b) => (a.pe || 999) - (b.pe || 999))
    if (sort === 'Tăng trưởng LNST') sorted.sort((a, b) => b.epsGrowth - a.epsGrowth)
    if (sort === 'Vốn hoá') sorted.sort((a, b) => b.marketCap - a.marketCap)
    return sorted
  }, [f, q, sort])

  const capDist = [
    { name: 'Ngân hàng', value: results.filter((s) => s.sector === 'Ngân hàng').length },
    { name: 'Bất động sản', value: results.filter((s) => s.sector === 'Bất động sản').length },
    { name: 'Hàng tiêu dùng', value: results.filter((s) => s.sector === 'Hàng tiêu dùng').length },
    { name: 'Công nghệ', value: results.filter((s) => s.sector === 'Công nghệ').length },
    { name: 'Vật liệu', value: results.filter((s) => s.sector === 'Vật liệu').length },
    { name: 'Hóa chất', value: results.filter((s) => s.sector === 'Hóa chất').length },
    { name: 'Bán lẻ', value: results.filter((s) => s.sector === 'Bán lẻ').length },
    { name: 'Khác', value: results.filter((s) => !['Ngân hàng', 'Bất động sản', 'Hàng tiêu dùng', 'Công nghệ', 'Vật liệu', 'Hóa chất', 'Bán lẻ'].includes(s.sector)).length },
  ].filter((d) => d.value > 0)

  const avgRoe = results.length ? results.reduce((a, b) => a + b.roe, 0) / results.length : 0
  const avgPe = results.length ? results.reduce((a, b) => a + (b.pe || 0), 0) / results.filter((s) => s.pe > 0).length : 0
  const upCount = results.filter((s) => s.changePct > 0).length

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <div className="row gap-10">
          <button className="btn sm ghost">Hướng dẫn sử dụng</button>
          <button className="btn sm gold" onClick={() => setSaved(true)}>
            {saved ? <IconCheck size={13} /> : <IconBookmark size={13} />}
            {saved ? 'Đã lưu bộ lọc này' : 'Lưu bộ lọc này'}
          </button>
        </div>
      </div>

      {/* ---------- Bộ lọc nâng cao ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.9fr) minmax(0,1fr)' }}>
        <Card title="Bộ lọc nâng cao">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0,1fr))', gap: '13px 14px' }}>
            <div className="field">
              <label className="field-label">Thị trường</label>
              <select className="input sm" value={f.market} onChange={(e) => set('market')(e.target.value)}>
                {['Tất cả', 'HOSE', 'HNX', 'UPCOM'].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Ngành</label>
              <select className="input sm" value={f.sector} onChange={(e) => set('sector')(e.target.value)}>
                {['Tất cả', ...Array.from(new Set(STOCKS.map((s) => s.sector)))].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Vốn hóa (tỷ VND)</label>
              <div className="range-row">
                <input className="input sm" value={f.capMin} onChange={(e) => set('capMin')(e.target.value)} />
                <span>—</span>
                <input className="input sm" value={f.capMax} onChange={(e) => set('capMax')(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">P/E</label>
              <div className="range-row">
                <input className="input sm" value={f.peMin} onChange={(e) => set('peMin')(e.target.value)} />
                <span>—</span>
                <input className="input sm" value={f.peMax} onChange={(e) => set('peMax')(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">P/B</label>
              <div className="range-row">
                <input className="input sm" value={f.pbMin} onChange={(e) => set('pbMin')(e.target.value)} />
                <span>—</span>
                <input className="input sm" value={f.pbMax} onChange={(e) => set('pbMax')(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">ROE (%)</label>
              <div className="range-row">
                <input className="input sm" value={f.roeMin} onChange={(e) => set('roeMin')(e.target.value)} />
                <span>—</span>
                <input className="input sm" value={f.roeMax} onChange={(e) => set('roeMax')(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Tăng trưởng LNST (%)</label>
              <div className="range-row">
                <input className="input sm" value={f.epsMin} onChange={(e) => set('epsMin')(e.target.value)} />
                <span>—</span>
                <input className="input sm" value={f.epsMax} onChange={(e) => set('epsMax')(e.target.value)} />
              </div>
            </div>
            <div className="field">
              <label className="field-label">Tỷ lệ nợ/VCSH</label>
              <div className="range-row">
                <input className="input sm" value={f.deMin} onChange={(e) => set('deMin')(e.target.value)} />
                <span>—</span>
                <input className="input sm" value={f.deMax} onChange={(e) => set('deMax')(e.target.value)} />
              </div>
            </div>
          </div>

          <div className="row-between" style={{ marginTop: 15, flexWrap: 'wrap', gap: 10 }}>
            <button className="btn sm gold-ghost" onClick={() => setF({ ...DEFAULT })}>
              <IconPlus size={13} /> Thêm bộ lọc
            </button>
            <div className="row gap-10">
              <button className="btn sm ghost" onClick={() => setF({ ...DEFAULT })}>
                Đặt lại
              </button>
              <button className="btn sm gold" onClick={() => setTab('Kết quả')}>
                <IconSearch size={13} /> Sàng lọc ngay
              </button>
            </div>
          </div>
        </Card>

        <Card title="Bộ lọc mẫu KIMQUY" action={<button className="card-link">Xem tất cả <IconArrowRight size={12} /></button>}>
          <div className="nav-list">
            {SCREEN_PRESETS.map((p) => (
              <div
                className="nav-list-row"
                key={p.name}
                onClick={() => setTab('Kết quả')}
                title={p.desc}
              >
                <span style={{ color: 'var(--kg-gold)', flexShrink: 0 }}>◆</span>
                <span className="grow">{p.name}</span>
                <IconArrowRight size={13} style={{ color: 'var(--tx-faint)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ---------- Kết quả + thống kê ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.9fr) minmax(0,1fr)' }}>
        <Card
          title={
            <div className="row gap-8">
              <h2 className="card-title">Kết quả sàng lọc</h2>
              <span className="gold" style={{ fontSize: 15, fontWeight: 650 }}>
                {results.length} cổ phiếu phù hợp
              </span>
            </div>
          }
          action={
            <div className="row gap-8">
              <button className="btn xs ghost"><IconDownload size={12} /> Xuất Excel</button>
              <button className="btn xs ghost" onClick={() => setSaved(true)}>
                <IconBookmark size={12} /> Lưu danh sách
              </button>
              <select className="input sm" value={sort} onChange={(e) => setSort(e.target.value as never)} style={{ width: 158 }}>
                {['ROE cao nhất', 'P/E thấp nhất', 'Tăng trưởng LNST', 'Vốn hoá'].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          }
        >
          <div className="row gap-8" style={{ marginBottom: 10, flexWrap: 'wrap' }}>
            {[
              `Tất cả (${results.length})`,
              `HOSE (${results.filter((s) => s.exchange === 'HOSE').length})`,
              `HNX (${results.filter((s) => s.exchange === 'HNX').length})`,
              `UPCOM (${results.filter((s) => s.exchange === 'UPCOM').length})`,
            ].map((t) => (
              <Chip key={t} onClick={() => setExTab(t)} active={exTab === t}>
                {t}
              </Chip>
            ))}
            <div style={{ marginLeft: 'auto', width: 190 }}>
              <SearchInput value={q} onChange={setQ} placeholder="Tìm mã..." size="sm" />
            </div>
          </div>

          <div className="table-wrap" style={{ maxHeight: 430 }}>
            <table className="data">
              <thead>
                <tr>
                  <th style={{ width: 26 }}>#</th>
                  <th className="l">Mã</th>
                  <th className="l">Tên công ty</th>
                  <th className="l">Ngành</th>
                  <th>Giá (VND)</th>
                  <th>+/-</th>
                  <th>%</th>
                  <th>P/E</th>
                  <th>P/B</th>
                  <th>ROE (%)</th>
                  <th>Tăng trưởng LNST (%)</th>
                  <th>Vốn hóa (tỷ VND)</th>
                  <th className="l">Biểu đồ 1Y</th>
                  <th style={{ width: 46 }}>Thêm</th>
                </tr>
              </thead>
              <tbody>
                {results.map((s, i) => (
                  <tr key={s.symbol} className="clickable" onClick={() => onNavigate('stock', s.symbol)}>
                    <td className="idx num">{i + 1}</td>
                    <td className="l ticker-cell">{s.symbol}</td>
                    <td className="l co-name">{s.name}</td>
                    <td className="l co-name">{s.sector}</td>
                    <td className="num">{num(s.price, 0)}</td>
                    <td className={`num ${dirClass(s.change)}`}>
                      {s.change > 0 ? '+' : ''}
                      {num(s.change, 0)}
                    </td>
                    <td className={`num ${dirClass(s.changePct)}`} style={{ fontWeight: 600 }}>
                      {s.changePct > 0 ? '+' : ''}
                      {num(s.changePct, 2)}%
                    </td>
                    <td className="num">{s.pe ? num(s.pe, 1) : '—'}</td>
                    <td className="num">{s.pb ? num(s.pb, 1) : '—'}</td>
                    <td className={`num ${s.roe >= 20 ? 'up' : ''}`} style={{ fontWeight: s.roe >= 20 ? 600 : 400 }}>
                      {s.roe ? num(s.roe, 1) : '—'}
                    </td>
                    <td className={`num ${dirClass(s.epsGrowth)}`}>{s.epsGrowth ? num(s.epsGrowth, 1) : '—'}</td>
                    <td className="num">{num(s.marketCap, 0)}</td>
                    <td className="l">
                      <span style={{ display: 'inline-block', width: 68 }}>
                        <Sparkline data={performanceSeries(s.symbol, '1Y', s.epsGrowth)} height={22} fill={false} />
                      </span>
                    </td>
                    <td>
                      <button
                        className="icon-btn"
                        style={{ width: 24, height: 24 }}
                        aria-label="Theo dõi"
                        onClick={(e) => {
                          e.stopPropagation()
                          setStars((st) => (st.includes(s.symbol) ? st.filter((x) => x !== s.symbol) : [...st, s.symbol]))
                        }}
                      >
                        <IconStar
                          size={13}
                          style={{ color: stars.includes(s.symbol) ? 'var(--kg-gold)' : 'var(--tx-faint)' }}
                          fill={stars.includes(s.symbol) ? 'currentColor' : 'none'}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {results.length === 0 && (
              <div className="empty">
                <IconSearch size={22} />
                <span>Không có cổ phiếu nào thỏa mãn bộ lọc. Hãy nới rộng điều kiện.</span>
              </div>
            )}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Thống kê kết quả">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', background: 'rgba(212,175,55,0.12)', color: 'var(--kg-gold)' }}>
                  <IconStar size={16} />
                </span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 680, color: 'var(--tx-hi)' }} className="num">
                    {results.length}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--tx-dim)' }}>Cổ phiếu phù hợp</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', background: 'var(--up-soft)', color: 'var(--up)' }}>
                  ▲
                </span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 680, color: 'var(--tx-hi)' }} className="num">
                    {results.length ? Math.round((upCount / results.length) * 100) : 0}%
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--tx-dim)' }}>Tăng giá trong 6 tháng</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', background: 'var(--up-soft)', color: 'var(--up)' }}>
                  ↗
                </span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 680, color: 'var(--up)' }} className="num">
                    {num(avgRoe, 1)}%
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--tx-dim)' }}>ROE trung bình</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 9, alignItems: 'center' }}>
                <span style={{ width: 34, height: 34, borderRadius: 'var(--r-sm)', display: 'grid', placeItems: 'center', background: 'rgba(212,175,55,0.12)', color: 'var(--kg-gold)' }}>
                  ◆
                </span>
                <div>
                  <div style={{ fontSize: 17, fontWeight: 680, color: 'var(--tx-hi)' }} className="num">
                    {num(avgPe, 1)}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--tx-dim)' }}>P/E trung bình</div>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Phân bổ theo ngành">
            <Donut
              data={capDist.slice(0, 7)}
              size={132}
              thickness={24}
              center={
                <>
                  <div className="donut-center-value">{results.length}</div>
                  <div className="donut-center-label">cổ phiếu</div>
                </>
              }
              legendFmt={(v) => `${v} (${num((v / Math.max(results.length, 1)) * 100, 1)}%)`}
            />
          </Card>

          <Card title="Top chỉ số nổi bật trong danh sách">
            <BarList
              rows={SCREEN_TOP_METRICS.map((m) => ({ name: m.label, value: m.value, color: m.color }))}
              fmt={(v) => num(v, 1)}
              barWidth={92}
            />
          </Card>

          <AiSuggestions
            items={SCREEN_AI_SUGGESTIONS.map((t) => ({ text: t, tone: 'gold' as const }))}
            onMore={() => onNavigate('copilot')}
          />
        </div>
      </div>

      {/* ---------- Biểu đồ so sánh ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)' }}>
        <Card
          title="Biểu đồ so sánh hiệu suất"
          action={<Segmented options={['1M', '3M', '6M', '1Y', '3Y']} value="1Y" onChange={() => {}} />}
        >
          <AreaChart
            series={[
              { id: 'basket', name: 'Danh sách lọc', data: performanceSeries('screen-basket', '1Y', 22.4), color: '#e8b44a' },
              { id: 'vn', name: 'VN-Index', data: performanceSeries('vnindex', '1Y', 8.3), color: '#8b8b8b', dashed: true, area: false },
              { id: 'vn30', name: 'VN30', data: performanceSeries('vn30-bench', '1Y', 9.6), color: '#5b8def', dashed: true, area: false },
            ]}
            labels={yearLabels()}
            height={204}
            fmt={(v) => `${num(v, 0)}%`}
            refLine={0}
            xTicks={6}
            legend
          />
        </Card>

        <Card title="Phân bố vốn hoá" action={<span className="card-link">Đơn vị: tỷ VND</span>}>
          <BarChart
            data={[
              results.filter((s) => s.marketCap >= 500000).length,
              results.filter((s) => s.marketCap >= 100000 && s.marketCap < 500000).length,
              results.filter((s) => s.marketCap >= 50000 && s.marketCap < 100000).length,
              results.filter((s) => s.marketCap < 50000).length,
            ]}
            labels={['Large cap', 'Mid cap', 'Small cap', 'Micro cap']}
            height={186}
            fmt={(v) => num(v, 0)}
            color="#d4af37"
            yTicks={3}
          />
          <div className="dim" style={{ fontSize: 10.5, textAlign: 'center', marginTop: 4 }}>
            Số lượng cổ phiếu theo nhóm vốn hoá
          </div>
        </Card>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="row gap-10" style={{ flexWrap: 'wrap' }}>
          <Badge tone="gold">Bộ lọc đang áp dụng: {Object.entries(f).filter(([, v]) => v && !v.startsWith('Từ 0') && v !== 'Tất cả').length} điều kiện</Badge>
          <Badge tone="up">{results.length} kết quả</Badge>
          <Badge tone="blue">Cập nhật: 22/09/2026 15:27</Badge>
          <Chip onClick={() => onNavigate('topic')}>Khám phá chủ đề đầu tư</Chip>
        </div>
      </div>
    </>
  )
}

function yearLabels(): string[] {
  const n = 252
  const out: string[] = []
  const now = new Date(2026, 8, 22)
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() - ((365 * (n - 1 - i)) / (n - 1)) * 86400000)
    out.push(`${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`)
  }
  return out
}

export { SECTORS, IconMore, IconLightning }