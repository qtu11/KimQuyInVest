/* ==========================================================================
   TRANG DANH MỤC CỦA TÔI
   ========================================================================== */

import { useMemo, useState } from 'react'
import type { PageKey } from '../app/nav'
import { AreaChart, Donut, Sparkline } from '../components/charts'
import { IconArrowRight, IconDownload, IconLightning, IconMore, IconPlus, IconSwap } from '../components/icons'
import { Badge, Card, Chip, Dropdown, Modal, SearchInput, Segmented, Stat, Tabs } from '../components/ui'
import {
  AI_QUESTIONS, HOLDING_SIGNALS, PORTFOLIO_REVIEW, RISK_METRICS, TRADES,
} from '../data/portfolio'
import { HOLDINGS, PORTFOLIO, benchmarkSeries, holdingSpark, portfolioSeries, vn30Series } from '../data/portfolio'
import { RANGES, type RangeKey } from '../data/market'
import { dirClass, num, vnd } from '../lib/format'

const TABS = ['Tổng quan', 'Chi tiết nắm giữ', 'Hiệu suất', 'Phân bổ tài sản', 'Lịch sử giao dịch', 'Đánh giá & Gợi ý'] as const
type Tab = (typeof TABS)[number]

const MIX = ['Theo ngành', 'Theo tài sản', 'Theo chiến lược'] as const

export function Portfolio({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Tổng quan')
  const [range, setRange] = useState<RangeKey>('YTD')
  const [mix, setMix] = useState<(typeof MIX)[number]>('Theo ngành')
  const [sort, setSort] = useState<'Lãi/Lỗ %' | 'Giá trị' | 'Tỷ trọng'>('Lãi/Lỗ %')
  const [q, setQ] = useState('')
  const [addOpen, setAddOpen] = useState(false)

  const rows = useMemo(() => {
    const filtered = HOLDINGS.filter((h) => !q || h.symbol.toLowerCase().includes(q.toLowerCase()))
    const s = [...filtered]
    if (sort === 'Lãi/Lỗ %') s.sort((a, b) => b.pnlPct - a.pnlPct)
    if (sort === 'Giá trị') s.sort((a, b) => b.value - a.value)
    if (sort === 'Tỷ trọng') s.sort((a, b) => b.weight - a.weight)
    return s
  }, [q, sort])

  const allocData =
    mix === 'Theo ngành'
      ? [
          { name: 'Ngân hàng', value: 32 },
          { name: 'Công nghệ', value: 18 },
          { name: 'Bất động sản', value: 15 },
          { name: 'Hàng tiêu dùng', value: 12 },
          { name: 'Chứng khoán', value: 10 },
          { name: 'Vật liệu', value: 8 },
          { name: 'Tiền mặt', value: 5 },
        ]
      : mix === 'Theo tài sản'
        ? [
            { name: 'Cổ phiếu niêm yết', value: 68 },
            { name: 'Trái phiếu', value: 14 },
            { name: 'Vàng', value: 8 },
            { name: 'Chứng chỉ quỹ', value: 5 },
            { name: 'Tiền mặt', value: 5 },
          ]
        : [
            { name: 'Tăng trưởng', value: 45 },
            { name: 'Giá trị', value: 30 },
            { name: 'Cổ tức', value: 15 },
            { name: 'Trading', value: 10 },
          ]

  const strategyAlloc = [
    { name: 'Tăng trưởng', value: 45 },
    { name: 'Giá trị', value: 30 },
    { name: 'Cổ tức', value: 15 },
    { name: 'Trading', value: 10 },
  ]

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <div className="row gap-10">
          <Chip>{PORTFOLIO.name}</Chip>
          <button className="btn sm gold" onClick={() => setAddOpen(true)}>
            <IconPlus size={13} /> Thêm giao dịch
          </button>
        </div>
      </div>

      {/* ---------- Dải số liệu ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(6, minmax(0,1fr))' }}>
        <Stat
          label="Tổng giá trị danh mục"
          value={<span style={{ fontSize: 17 }}>{vnd(PORTFOLIO.totalValue)} <span style={{ fontSize: 11, color: 'var(--tx-mid)' }}>VND</span></span>}
          delta={`+${num(PORTFOLIO.ytdPct, 1)}%`}
          deltaTone="up"
          sub={`(+${vnd(PORTFOLIO.ytdPnl)} VND)`}
          spark={<Sparkline data={portfolioSeries('1Y').slice(-30)} height={30} color="#e8b44a" />}
        />
        <Stat
          label="Lợi nhuận (YTD)"
          value={<span style={{ fontSize: 15 }}>+{vnd(PORTFOLIO.ytdPnl)} <span style={{ fontSize: 10.5, color: 'var(--tx-mid)' }}>VND</span></span>}
          delta={`+${num(PORTFOLIO.ytdPct, 1)}%`}
          deltaTone="up"
          spark={
            <svg viewBox="0 0 60 30" height={30} style={{ width: '100%' }} aria-hidden="true">
              {[6, 12, 9, 16, 13, 20, 17, 24, 22, 27].map((h, i) => (
                <rect key={i} x={i * 6} y={30 - h} width="4.4" height={h} rx="0.8" fill="#22c576" opacity="0.85" />
              ))}
            </svg>
          }
        />
        <Stat
          label={`${PORTFOLIO.benchmarkName} (YTD)`}
          value={<span style={{ fontSize: 15 }}>+{num(PORTFOLIO.benchmarkPct, 1)}%</span>}
          spark={<Sparkline data={benchmarkSeries('1Y').slice(-30)} height={30} color="#8b8b8b" />}
        />
        <Stat
          label={`Alpha so với ${PORTFOLIO.benchmarkName}`}
          value={<span style={{ fontSize: 15 }}>+{num(PORTFOLIO.alpha, 1)}%</span>}
          deltaTone="up"
          spark={
            <svg viewBox="0 0 60 30" height={30} style={{ width: '100%' }} aria-hidden="true">
              {[8, 11, 10, 14, 12, 17, 15, 19, 22, 26].map((h, i) => (
                <rect key={i} x={i * 6} y={30 - h} width="4.4" height={h} rx="0.8" fill="#2ec27b" opacity="0.9" />
              ))}
            </svg>
          }
        />
        <Stat label="Sharpe Ratio" value={<span style={{ fontSize: 17 }}>{num(PORTFOLIO.sharpe, 2)}</span>} sub="Tốt" />
        <Stat label="Beta" value={<span style={{ fontSize: 17 }}>{num(PORTFOLIO.beta, 2)}</span>} />
      </div>

      {/* ---------- Hiệu suất · phân bổ · chiến lược ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr) minmax(0,1fr)' }}>
        <Card title="Hiệu suất danh mục" action={<Segmented options={RANGES} value={range} onChange={setRange} />}>
          <AreaChart
            series={[
              { id: 'p', name: 'Danh mục của tôi', data: portfolioSeries(range), color: '#e8b44a' },
              { id: 'b', name: 'VN-Index', data: benchmarkSeries(range), color: '#8b8b8b', dashed: true, area: false },
              { id: 'v', name: 'VN30', data: vn30Series(range), color: '#5b8def', dashed: true, area: false },
            ]}
            labels={rangeLabels(range)}
            height={222}
            fmt={(v) => `${num(v, 0)}%`}
            refLine={0}
            xTicks={7}
            legend
          />
        </Card>

        <Card title="Phân bổ danh mục" action={<Tabs tabs={MIX} value={mix} onChange={setMix} />}>
          <div style={{ marginTop: 12 }}>
            <Donut
              data={allocData}
              size={144}
              thickness={27}
              center={
                <>
                  <div className="donut-center-value">1,25B</div>
                  <div className="donut-center-label">VND</div>
                </>
              }
              legendFmt={(v) => `${num(v, 0)}%`}
            />
          </div>
        </Card>

        <Card title="Phân bổ theo chiến lược" action={<Chip>Tùy chỉnh</Chip>}>
          <div style={{ marginTop: 12 }}>
            <Donut
              data={strategyAlloc}
              size={144}
              thickness={27}
              center={
                <>
                  <div className="donut-center-value">1,25B</div>
                  <div className="donut-center-label">VND</div>
                </>
              }
              legendFmt={(v) => `${num(v, 0)}%`}
            />
          </div>
          <div className="card-foot" style={{ borderTop: '1px solid var(--line)', marginTop: 12 }}>
            <div className="row-between">
              <span className="mini-label">Tiền mặt</span>
              <span className="num" style={{ fontSize: 14, fontWeight: 650, color: 'var(--tx-hi)' }}>
                {vnd(PORTFOLIO.cash)} VND
              </span>
              <span className="num gold" style={{ fontSize: 13, fontWeight: 650 }}>
                {num(PORTFOLIO.cashPct, 1)}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* ---------- Danh sách nắm giữ + rủi ro + AI ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.75fr) minmax(0,1fr)' }}>
        <Card
          title={`Danh sách nắm giữ (${HOLDINGS.length} mã)`}
          action={
            <div className="row gap-8">
              <button className="btn xs ghost"><IconDownload size={12} /> Xuất Excel</button>
              <button className="btn xs ghost" onClick={() => setAddOpen(true)}>
                <IconSwap size={12} /> Thêm giao dịch
              </button>
              <Dropdown
                trigger={({ toggle }) => (
                  <button className="btn xs ghost" onClick={toggle}>
                    Sắp xếp: {sort}
                  </button>
                )}
              >
                {(close) => (
                  <>
                    {(['Lãi/Lỗ %', 'Giá trị', 'Tỷ trọng'] as const).map((s) => (
                      <button
                        key={s}
                        className="menu-item"
                        onClick={() => {
                          setSort(s)
                          close()
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </>
                )}
              </Dropdown>
            </div>
          }
        >
          <SearchInput value={q} onChange={setQ} placeholder="Tìm mã trong danh mục..." size="sm" />

          <div className="table-wrap" style={{ marginTop: 11, maxHeight: 420 }}>
            <table className="data">
              <thead>
                <tr>
                  <th style={{ width: 26 }}>#</th>
                  <th className="l">Mã</th>
                  <th className="l">Tên công ty</th>
                  <th>Số lượng</th>
                  <th>Giá vốn (VND)</th>
                  <th>Giá hiện tại (VND)</th>
                  <th>Giá trị (VND)</th>
                  <th>Lãi/Lỗ</th>
                  <th>Lãi/Lỗ (%)</th>
                  <th>Tỷ trọng</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((h, i) => {
                  const sig = HOLDING_SIGNALS[h.symbol]
                  return (
                    <tr key={h.symbol} className="clickable" onClick={() => onNavigate('stock', h.symbol)}>
                      <td className="idx num">{i + 1}</td>
                      <td className="l ticker-cell">{h.symbol}</td>
                      <td className="l co-name">{h.name}</td>
                      <td className="num">{num(h.qty, 0)}</td>
                      <td className="num">{num(h.cost, 0)}</td>
                      <td className="num">{num(h.price, 0)}</td>
                      <td className="num">{num(h.value, 0)}</td>
                      <td className={`num ${dirClass(h.pnl)}`} style={{ fontWeight: 600 }}>
                        {h.pnl > 0 ? '+' : ''}
                        {num(h.pnl, 0)}
                      </td>
                      <td className={`num ${dirClass(h.pnlPct)}`} style={{ fontWeight: 600 }}>
                        {h.pnlPct > 0 ? '+' : ''}
                        {num(h.pnlPct, 1)}%
                      </td>
                      <td className="num">{num(h.weight, 1)}%</td>
                      <td>
                        <span className={sig ? (h.pnlPct >= 0 ? 'up' : 'down') : 'flat'} style={{ fontSize: 10.5, fontWeight: 550 }}>
                          {sig?.action ?? 'Nắm giữ'}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Hiệu suất so với thời gian" action={<span className="card-link">Xem chi tiết <IconArrowRight size={12} /></span>}>
            <div className="ohlc c3">
              {RISK_METRICS.slice(0, 3).map((m) => (
                <div className="ohlc-item" key={m.label}>
                  <div className="ohlc-label" style={{ fontSize: 9.5, lineHeight: 1.3, minHeight: 26 }}>
                    {m.label}
                  </div>
                  <div
                    className={m.tone === 'up' ? 'up' : m.tone === 'down' ? 'down' : 'gold'}
                    style={{ fontSize: 16, fontWeight: 680, marginTop: 2 }}
                  >
                    {m.value}
                  </div>
                  <div className="seg-meter" style={{ marginTop: 5 }}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <i
                        key={i}
                        className={i < m.bars ? `on ${m.level === 'high' ? 'lv-high' : m.level === 'mid' ? 'lv-mid' : 'lv-low'}` : ''}
                        style={{ width: 5, height: 12 }}
                      />
                    ))}
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--tx-dim)', marginTop: 3 }}>T8 · T9</div>
                </div>
              ))}
            </div>
          </Card>

          <Card
            className="gold"
            title={
              <div className="ai-head">
                <IconLightning size={14} /> Gợi ý từ AI KIMQUY
              </div>
            }
            action={
              <button className="card-link" onClick={() => onNavigate('copilot')}>
                Xem thêm <IconArrowRight size={12} />
              </button>
            }
          >
            <div className="ai-list">
              {[
                'Danh mục đang tập trung vào nhóm Ngân hàng (32%). Cần nhắc để đa dạng hoá sang Hàng tiêu dùng.',
                'FPT và MWG là động lực tăng trưởng chính.',
                'Theo dõi vùng giá 90.000 của VCB để gia tăng tỷ trọng.',
                'Rủi ro ngắn hạn đến từ biến động tỷ giá và lãi suất.',
              ].map((t, i) => (
                <div className="ai-row" key={i} onClick={() => onNavigate('copilot')}>
                  <span style={{ color: 'var(--kg-gold)', flexShrink: 0 }}>✦</span>
                  <span className="grow">{t}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ---------- Lịch sử giao dịch ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <Card
          title="Lịch sử giao dịch gần đây"
          action={<button className="card-link">Xem tất cả <IconArrowRight size={12} /></button>}
        >
          <table className="data">
            <thead>
              <tr>
                <th className="l">Ngày</th>
                <th className="l">Mã</th>
                <th className="l">Loại</th>
                <th>Khối lượng</th>
                <th>Giá khớp</th>
                <th>Giá trị</th>
                <th>Phí</th>
                <th>Thuế</th>
                <th className="l">Ghi chú</th>
              </tr>
            </thead>
            <tbody>
              {TRADES.map((t, i) => (
                <tr key={i}>
                  <td className="l num">{t.date}</td>
                  <td className="l ticker-cell">{t.symbol}</td>
                  <td className="l">
                    <Badge tone={t.side === 'Mua' ? 'up' : 'down'}>{t.side}</Badge>
                  </td>
                  <td className="num">{num(t.qty, 0)}</td>
                  <td className="num">{num(t.price, 0)}</td>
                  <td className="num">{num(t.value, 0)}</td>
                  <td className="num">{num(t.fee, 0)}</td>
                  <td className="num">{t.tax ? num(t.tax, 0) : '—'}</td>
                  <td className="l co-name">{t.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ---------- Đánh giá danh mục ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr) minmax(0,1fr)' }}>
        <Card title="Điểm chất lượng danh mục">
          <div className="row gap-12">
            <Donut
              data={[
                { name: 'Điểm', value: PORTFOLIO_REVIEW.score, color: '#22c576' },
                { name: 'Còn lại', value: 100 - PORTFOLIO_REVIEW.score, color: '#242424' },
              ]}
              size={112}
              thickness={13}
              legend={false}
              center={
                <>
                  <div className="donut-center-value" style={{ fontSize: 22 }}>{PORTFOLIO_REVIEW.score}</div>
                  <div className="donut-center-label">{PORTFOLIO_REVIEW.grade}</div>
                </>
              }
            />
            <div className="grow" style={{ minWidth: 0 }}>
              <div className="mini-label" style={{ marginBottom: 6 }}>Điểm mạnh</div>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 5, fontSize: 10.5, color: 'var(--tx-mid)', lineHeight: 1.5 }}>
                {PORTFOLIO_REVIEW.strengths.slice(0, 2).map((s, i) => (
                  <li key={i} style={{ display: 'flex', gap: 6 }}>
                    <span className="up">✓</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>

        <Card title="Cần cải thiện">
          <ul style={{ display: 'flex', flexDirection: 'column', gap: 9, fontSize: 11, color: 'var(--tx-mid)', lineHeight: 1.55 }}>
            {PORTFOLIO_REVIEW.improvements.map((s, i) => (
              <li key={i} style={{ display: 'flex', gap: 7 }}>
                <span className="gold" style={{ flexShrink: 0 }}>◆</span>
                {s}
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Hành động đề xuất">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {PORTFOLIO_REVIEW.actions.map((a, i) => (
              <div
                key={i}
                className="row gap-8"
                style={{
                  fontSize: 11,
                  padding: '8px 10px',
                  borderRadius: 'var(--r-sm)',
                  background: a.tone === 'up' ? 'var(--up-soft)' : a.tone === 'down' ? 'var(--down-soft)' : 'rgba(212,175,55,0.08)',
                  border: `1px solid ${a.tone === 'up' ? 'rgba(34,197,118,0.24)' : a.tone === 'down' ? 'rgba(229,72,77,0.24)' : 'var(--line-gold)'}`,
                }}
              >
                <span style={{ color: a.tone === 'up' ? 'var(--up)' : a.tone === 'down' ? 'var(--down)' : 'var(--kg-gold)', flexShrink: 0 }}>
                  {a.tone === 'up' ? '↗' : a.tone === 'down' ? '↘' : '◆'}
                </span>
                <span style={{ color: 'var(--tx)' }}>{a.text}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ---------- Modal thêm giao dịch ---------- */}
      <Modal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Thêm giao dịch"
        footer={
          <>
            <button className="btn ghost" onClick={() => setAddOpen(false)}>Hủy</button>
            <button className="btn gold" onClick={() => setAddOpen(false)}>Lưu giao dịch</button>
          </>
        }
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
          <div className="field">
            <label className="field-label">Mã cổ phiếu</label>
            <input className="input" placeholder="VD: FPT" defaultValue="FPT" />
          </div>
          <div className="field">
            <label className="field-label">Loại giao dịch</label>
            <select className="input" defaultValue="Mua">
              <option>Mua</option>
              <option>Bán</option>
            </select>
          </div>
          <div className="field">
            <label className="field-label">Khối lượng</label>
            <input className="input" type="number" defaultValue={1000} />
          </div>
          <div className="field">
            <label className="field-label">Giá khớp (VND)</label>
            <input className="input" type="number" defaultValue={126500} />
          </div>
          <div className="field">
            <label className="field-label">Ngày giao dịch</label>
            <input className="input" defaultValue="22/09/2026" />
          </div>
          <div className="field">
            <label className="field-label">Chiến lược</label>
            <select className="input" defaultValue="Tăng trưởng">
              <option>Tăng trưởng</option>
              <option>Giá trị</option>
              <option>Cổ tức</option>
              <option>Trading</option>
            </select>
          </div>
          <div className="field" style={{ gridColumn: '1 / -1' }}>
            <label className="field-label">Ghi chú</label>
            <input className="input" placeholder="Lý do giao dịch..." />
          </div>
        </div>
      </Modal>
    </>
  )
}

function rangeLabels(range: RangeKey): string[] {
  const counts: Record<RangeKey, number> = {
    '1M': 22, '3M': 66, '6M': 128, YTD: 190, '1Y': 252, '3Y': 756, ALL: 1200,
  }
  const n = counts[range]
  const out: string[] = []
  const now = new Date(2026, 8, 22)
  const span = range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 182 : range === 'YTD' ? 265 : range === '1Y' ? 365 : range === '3Y' ? 1095 : 1825
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() - ((span * (n - 1 - i)) / (n - 1)) * 86400000)
    out.push(`${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`)
  }
  return out
}

export { holdingSpark, AI_QUESTIONS, IconMore }