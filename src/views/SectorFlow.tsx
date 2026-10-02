/* ==========================================================================
   TRANG NGÀNH & DÒNG TIỀN
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import { AreaChart, BarChart, BarList, Donut, Sparkline } from '../components/charts'
import { Art } from '../components/Art'
import { IconArrowRight, IconCalendar, IconLightning } from '../components/icons'
import { Badge, Card, Segmented, Tabs, Trend, useClock } from '../components/ui'
import { LIQUIDITY, SECTORS, heatLevel } from '../data/market'
import { dirClass, fmtDate, num, ty } from '../lib/format'

const TABS = ['Tổng quan', 'Dòng tiền', 'Hiệu suất ngành', 'Định giá', 'Cổ phiếu tiêu biểu', 'So sánh ngành'] as const
type Tab = (typeof TABS)[number]
const PERIODS = ['1D', '1W', '1M', '3M', 'YTD'] as const

export function SectorFlow({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Tổng quan')
  const [heatMode, setHeatMode] = useState<'Vốn hóa' | 'GTGD' | 'Thay đổi'>('Thay đổi')
  const [period, setPeriod] = useState<(typeof PERIODS)[number]>('1D')
  const [flowTab, setFlowTab] = useState<'GTGD' | 'Dòng tiền ròng'>('GTGD')
  const [rank, setRank] = useState<'Hôm nay' | 'Tuần này' | 'Tháng này'>('Hôm nay')
  const now = useClock(1000)

  const inflow = [...SECTORS].sort((a, b) => b.net - a.net).slice(0, 5)
  const outflow = [...SECTORS].sort((a, b) => a.net - b.net).slice(0, 5)
  const sorted = [...SECTORS].sort((a, b) => b.pct - a.pct)

  const flowBars = sorted.slice(0, 8)

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <button className="btn sm" onClick={() => onNavigate('market')} suppressHydrationWarning>
          <IconCalendar size={13} /> Hôm nay, {fmtDate(now)}
        </button>
      </div>

      {/* ---------- Thống kê nhanh ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
        <div className="stat">
          <div className="stat-label">Tổng giá trị giao dịch</div>
          <div className="stat-value stat-xl">
            {ty(LIQUIDITY.turnover)}
            <span className="stat-delta up">+{num(LIQUIDITY.turnoverPct, 1)}%</span>
          </div>
          <div className="stat-sub">so với phiên trước</div>
        </div>
        <div className="stat">
          <div className="stat-label">GTGD khớp lệnh</div>
          <div className="stat-value stat-xl">
            {ty(LIQUIDITY.matched)}
            <span className="stat-delta up">+{num(LIQUIDITY.matchedPct, 1)}%</span>
          </div>
          <div className="stat-sub">so với phiên trước</div>
        </div>
        <div className="stat">
          <div className="stat-label">GTGD thỏa thuận</div>
          <div className="stat-value stat-xl">
            {ty(LIQUIDITY.putThrough)}
            <span className="stat-delta down">{num(LIQUIDITY.putThroughPct, 1)}%</span>
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Dòng tiền ròng (Toàn thị trường)</div>
          <div className="stat-value stat-xl">
            <span className="up">+{num(LIQUIDITY.netFlow, 0)} tỷ</span>
          </div>
          <div className="stat-spark">
            <Sparkline data={[180, 320, 240, 410, 380, 520, 460, 610, 560, 700, 640, 780, 720, 842]} height={38} />
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">Độ rộng thị trường</div>
          <div className="row gap-8" style={{ marginTop: 4 }}>
            <span className="num up" style={{ fontSize: 16, fontWeight: 650 }}>248</span>
            <span className="bar-track" style={{ flex: 1, display: 'flex' }}>
              <i style={{ width: '67%', background: 'var(--up)' }} />
              <i style={{ width: '33%', background: 'var(--down)' }} />
            </span>
            <span className="num down" style={{ fontSize: 16, fontWeight: 650 }}>121</span>
          </div>
        </div>
      </div>

      {/* ---------- Bản đồ nhiệt + hiệu suất ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.15fr) minmax(0,1fr)' }}>
        <Card
          title={`Bản đồ nhiệt ngành (Theo % thay đổi trong ngày)`}
          action={<Segmented options={['Vốn hóa', 'GTGD', 'Thay đổi']} value={heatMode} onChange={setHeatMode} />}
        >
          <div className="heatmap">
            {sorted.map((s) => (
              <button
                key={s.name}
                className={`heat-cell ${heatLevel(s.pct)}`}
                style={{ gridColumn: s.name === 'Khác' ? 'span 2' : undefined }}
                onClick={() => onNavigate('screener')}
              >
                <span className="hc-name">{s.name}</span>
                <span className="hc-pct">
                  {s.pct > 0 ? '+' : ''}
                  {num(s.pct, 2)}%
                </span>
                <span className="hc-meta">
                  {heatMode === 'GTGD' ? `GTGD: ${num(s.turnover, 0)} tỷ` : heatMode === 'Vốn hóa' ? `${num(s.turnover * 9, 0)} tỷ` : `${num(s.stocks, 0)} mã`}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card
          title="Hiệu suất ngành"
          action={
            <div className="row gap-8">
              <Tabs tabs={PERIODS} value={period} onChange={setPeriod} />
            </div>
          }
        >
          <div className="table-wrap" style={{ maxHeight: 320 }}>
            <table className="data">
              <thead>
                <tr>
                  <th style={{ width: 28 }}>#</th>
                  <th className="l">Ngành</th>
                  <th>% Thay đổi</th>
                  <th>GTGD (tỷ)</th>
                  <th>Dòng tiền ròng (tỷ)</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((s, i) => (
                  <tr key={s.name} className="clickable" onClick={() => onNavigate('screener')}>
                    <td className="idx num">{i + 1}</td>
                    <td className="l" style={{ color: 'var(--tx-hi)', fontWeight: 500 }}>{s.name}</td>
                    <td className={`num ${dirClass(s.pct)}`} style={{ fontWeight: 600 }}>
                      {s.pct > 0 ? '+' : ''}
                      {num(s.pct, 2)}%
                    </td>
                    <td className="num">{num(s.turnover, 0)}</td>
                    <td className={`num ${dirClass(s.net)}`} style={{ fontWeight: 600 }}>
                      {s.net > 0 ? '+' : ''}
                      {num(s.net, 0)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* ---------- Dòng tiền theo ngành ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)' }}>
        <Card
          title="Dòng tiền theo ngành"
          action={
            <div className="row gap-8">
              <Tabs tabs={['GTGD', 'Dòng tiền ròng'] as const} value={flowTab} onChange={setFlowTab} />
              <span className="dim" style={{ fontSize: 10.5 }}>Đơn vị: tỷ VND</span>
            </div>
          }
        >
          <BarChart
            data={flowBars.map((s) => (flowTab === 'GTGD' ? s.turnover : s.net))}
            labels={flowBars.map((s) => s.name.replace('Dịch vụ tài chính', 'DVTC').replace('Hàng tiêu dùng', 'Hàng TD'))}
            height={218}
            diverging
            fmt={(v) => num(v, 0)}
            yTicks={4}
            legend={[
              { label: 'Mua chủ động', color: '#22c576' },
              { label: 'Bán chủ động', color: '#e5484d' },
            ]}
            lineSeries={{ data: flowBars.map((s) => s.turnover * 0.82), color: '#e8b44a', name: 'Dòng tiền ròng' }}
          />
        </Card>

        <Card title="Tỷ trọng GTGD theo ngành">
          <Donut
            data={SECTORS.slice(0, 7).map((s) => ({ name: s.name, value: s.turnover }))}
            size={148}
            thickness={27}
            center={
              <>
                <div className="donut-center-value">18.532</div>
                <div className="donut-center-label">tỷ VND</div>
              </>
            }
            legendFmt={(v) => `${num((v / SECTORS.slice(0, 7).reduce((a, b) => a + b.turnover, 0)) * 100, 1)}%`}
          />
        </Card>
      </div>

      {/* ---------- Hút ròng / rút ròng / nhận định ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
        <Card
          title="Top ngành hút ròng"
          action={<Segmented options={['Hôm nay', 'Tuần này', 'Tháng này']} value={rank} onChange={setRank} />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {inflow.map((s) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5 }}>
                <span className="truncate" style={{ flex: 1, color: 'var(--tx-mid)' }}>{s.name}</span>
                <span className="bar-track" style={{ width: 90, display: 'flex', justifyContent: 'flex-end' }}>
                  <i style={{ width: `${(s.net / inflow[0].net) * 100}%`, background: 'var(--up)' }} />
                </span>
                <span className="num up" style={{ width: 56, textAlign: 'right', fontWeight: 600, flexShrink: 0 }}>
                  +{num(s.net, 0)} tỷ
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          title="Top ngành rút ròng"
          action={<Segmented options={['Hôm nay', 'Tuần này', 'Tháng này']} value={rank} onChange={setRank} />}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {outflow.map((s) => (
              <div key={s.name} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11.5 }}>
                <span className="truncate" style={{ flex: 1, color: 'var(--tx-mid)' }}>{s.name}</span>
                <span className="bar-track" style={{ width: 90, display: 'flex', justifyContent: 'flex-end' }}>
                  <i style={{ width: `${(Math.abs(s.net) / Math.abs(outflow[0].net)) * 100}%`, background: 'var(--down)' }} />
                </span>
                <span className="num down" style={{ width: 56, textAlign: 'right', fontWeight: 600, flexShrink: 0 }}>
                  {num(s.net, 0)} tỷ
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card
          className="gold"
          title={
            <div className="row gap-8">
              <span className="card-title">Nhận định dòng tiền</span>
            </div>
          }
          action={<button className="btn xs gold-ghost"><IconLightning size={12} /> AI Phân tích</button>}
        >
          <div className="callout" style={{ marginBottom: 10 }}>
            <div className="callout-title">
              <IconArrowRight size={13} /> Dòng tiền dài tích cực
            </div>
            <p>
              Dòng tiền đang lan tỏa sang nhóm ngành hạ tầng và chứng khoán, cho thấy tâm lý thị trường cải thiện
              rõ rệt. Nhóm bất động sản tiếp tục thu hút dòng tiền với thanh khoản tăng mạnh.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { name: 'Ngân hàng', text: 'Dẫn dắt thị trường, dòng tiền mạnh.', tone: 'up' as const, pct: 2.41 },
              { name: 'Chứng khoán', text: 'Thanh khoản tăng, xu hướng tích cực.', tone: 'up' as const, pct: 1.85 },
              { name: 'Bất động sản', text: 'Dòng tiền quay trở lại, chủ yếu nhóm vốn hóa lớn.', tone: 'up' as const, pct: 1.12 },
              { name: 'Thép', text: 'Vẫn chịu áp lực bán ròng.', tone: 'down' as const, pct: -0.62 },
              { name: 'Hàng tiêu dùng', text: 'Phân hóa, dòng tiền thận trọng.', tone: 'down' as const, pct: -0.34 },
            ].map((r) => (
              <div className="row gap-8" key={r.name} style={{ fontSize: 11 }}>
                <span style={{ color: r.tone === 'up' ? 'var(--up)' : 'var(--down)', flexShrink: 0 }}>●</span>
                <span style={{ color: 'var(--tx-hi)', fontWeight: 550, flexShrink: 0 }}>{r.name}:</span>
                <span className="grow muted">{r.text}</span>
                <span className={`num ${dirClass(r.pct)}`} style={{ fontWeight: 600, flexShrink: 0 }}>
                  {num(r.pct, 2)}%
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ---------- Xếp hạng GTGD ngành ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' }}>
        <Card title="Xếp hạng thanh khoản ngành" action={<span className="card-link">Đơn vị: tỷ VND</span>}>
          <BarList
            rows={[...SECTORS].sort((a, b) => b.turnover - a.turnover).slice(0, 10).map((s, i) => ({
              name: s.name,
              value: s.turnover,
              color: i < 3 ? '#d4af37' : '#4a4a4a',
            }))}
            fmt={(v) => num(v, 0)}
            barWidth={110}
          />
        </Card>

        <Card title="So sánh hiệu suất ngành theo kỳ" action={<span className="card-link">Đơn vị: %</span>}>
          <table className="matrix">
            <thead>
              <tr>
                <th>Ngành</th>
                <th>1D</th>
                <th>1W</th>
                <th>1M</th>
                <th>3M</th>
                <th>YTD</th>
              </tr>
            </thead>
            <tbody>
              {sorted.slice(0, 10).map((s) => (
                <tr key={s.name}>
                  <td>{s.name}</td>
                  <td className={dirClass(s.pct)}>{num(s.pct, 2)}%</td>
                  <td className={dirClass(s.pct * 1.4)}>{num(s.pct * 1.4, 2)}%</td>
                  <td className={dirClass(s.pct * 2.1)}>{num(s.pct * 2.1, 2)}%</td>
                  <td className={dirClass(s.pct * 3.4)}>{num(s.pct * 3.4, 2)}%</td>
                  <td className={dirClass(s.pct * 5.2)}>{num(s.pct * 5.2, 2)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="quote-block" style={{ minHeight: 96 }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
            <Art kind="power" />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,6,6,0.95), rgba(6,6,6,0.6))' }} />
          <div className="inner row-between" style={{ position: 'relative', gap: 20 }}>
            <div>
              <div className="hero-quote-mark">“</div>
              <div className="hero-quote-text" style={{ fontSize: 13 }}>
                Dòng tiền luôn tìm đến nơi có câu chuyện tốt nhất.
              </div>
              <div className="hero-quote-by">KIMQUY INVEST</div>
            </div>
            <div className="row gap-8">
              {['Ngân hàng', 'Chứng khoán', 'Bất động sản'].map((n) => (
                <Badge key={n} tone="up">
                  {n} ▲
                </Badge>
              ))}
              <Badge tone="down">Thép ▼</Badge>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export { AreaChart, Trend, heatLevel }