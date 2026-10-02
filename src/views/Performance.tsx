/* ==========================================================================
   TRANG PHÂN TÍCH HIỆU SUẤT
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import {
  AreaChart, BarChart, BarList, Donut, GroupedBars, Sparkline,
} from '../components/charts'
import { IconArrowRight, IconDownload, IconLightning, IconTarget } from '../components/icons'
import { Badge, Card, Chip, Segmented, Stat, Tabs } from '../components/ui'
import {
  BENCHMARKS, BENCHMARK_COMPARE, CONTRIBUTIONS, PERF_ROWS, PORTFOLIO,
  benchmarkSeries, holdingSpark, portfolioSeries, vn30Series,
} from '../data/portfolio'
import { RANGES, type RangeKey } from '../data/market'
import { dirClass, num, vnd } from '../lib/format'

const TABS = ['Tổng quan', 'Hiệu suất theo thời gian', 'Đóng góp hiệu suất', 'So sánh chuẩn', 'Phân tích rủi ro', 'Giao dịch & chi phí'] as const
type Tab = (typeof TABS)[number]
const MIX = ['Theo ngành', 'Theo loại tài sản', 'Theo chiến lược'] as const

export function Performance({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Tổng quan')
  const [range, setRange] = useState<RangeKey>('YTD')
  const [mix, setMix] = useState<(typeof MIX)[number]>('Theo ngành')
  const [contribTab, setContribTab] = useState<'Tích cực' | 'Tiêu cực'>('Tích cực')
  const [benchTab, setBenchTab] = useState<'VN-Index' | 'VN30' | 'Tùy chỉnh'>('VN-Index')

  const contrib = contribTab === 'Tích cực'
    ? CONTRIBUTIONS.filter((c) => c.value > 0).sort((a, b) => b.value - a.value)
    : CONTRIBUTIONS.filter((c) => c.value < 0).sort((a, b) => a.value - b.value)

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <div className="row gap-10">
          <button className="btn sm ghost">01/01/2025 – 22/09/2026</button>
          <button className="btn sm gold-ghost">
            <IconDownload size={13} /> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* ---------- Dải số liệu ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(5, minmax(0,1fr))' }}>
        <Stat
          label="Tổng giá trị danh mục"
          value={<span style={{ fontSize: 16 }}>{vnd(PORTFOLIO.totalValue)} <span style={{ fontSize: 10.5, color: 'var(--tx-mid)' }}>VND</span></span>}
          delta={`+${num(PORTFOLIO.ytdPct, 1)}%`}
          deltaTone="up"
          sub={`(+${vnd(PORTFOLIO.ytdPnl)} VND)`}
          spark={<Sparkline data={portfolioSeries('1Y').slice(-28)} height={30} color="#e8b44a" />}
        />
        <Stat
          label="Tỷ suất sinh lời (TWR)"
          value={<span style={{ fontSize: 17 }} className="up">+{num(PORTFOLIO.twr, 1)}%</span>}
          sub={`vs. VN-Index +${num(PORTFOLIO.benchmarkPct, 1)}%`}
          spark={<Sparkline data={[8, 14, 11, 19, 16, 24, 21, 29, 27, 34]} height={30} />}
        />
        <Stat
          label="Alpha"
          value={<span style={{ fontSize: 17 }} className="up">+{num(PORTFOLIO.alpha, 1)}%</span>}
          sub="so với VN-Index"
          spark={
            <span style={{ display: 'grid', placeItems: 'center', height: 30 }}>
              <IconTarget size={26} style={{ color: 'var(--up)' }} />
            </span>
          }
        />
        <Stat
          label="Sharpe Ratio"
          value={<span style={{ fontSize: 17 }}>{num(PORTFOLIO.sharpe, 2)}</span>}
          sub="Tốt"
          spark={
            <svg viewBox="0 0 60 30" height={30} style={{ width: '100%' }} aria-hidden="true">
              {[10, 14, 12, 18, 16, 21, 19, 25, 23, 28].map((h, i) => (
                <rect key={i} x={i * 6} y={30 - h} width="4.4" height={h} rx="0.8" fill="#2ec27b" opacity="0.85" />
              ))}
            </svg>
          }
        />
        <Stat
          label="Max Drawdown"
          value={<span style={{ fontSize: 17 }} className="down">{num(PORTFOLIO.maxDrawdown, 1)}%</span>}
          sub="(T3/2026)"
          spark={<Sparkline data={[0, -2, -5, -9, -12.6, -10, -7, -4, -2, -1]} height={30} color="#e5484d" />}
        />
      </div>

      {/* ---------- Biểu đồ chính ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr) minmax(0,1fr)' }}>
        <Card title="Hiệu suất danh mục theo thời gian" action={<Segmented options={RANGES} value={range} onChange={setRange} />}>
          <AreaChart
            series={[
              { id: 'p', name: 'Danh mục của tôi', data: portfolioSeries(range), color: '#e8b44a' },
              { id: 'b', name: 'VN-Index', data: benchmarkSeries(range), color: '#8b8b8b', dashed: true, area: false },
              { id: 'v', name: 'VN30', data: vn30Series(range), color: '#5b8def', dashed: true, area: false },
            ]}
            labels={rangeLabels(range)}
            height={242}
            fmt={(v) => `${num(v, 0)}%`}
            refLine={0}
            xTicks={7}
            legend
          />
        </Card>

        <Card title="Đóng góp hiệu suất theo cổ phiếu" action={<Tabs tabs={['Tích cực', 'Tiêu cực'] as const} value={contribTab} onChange={setContribTab} />}>
          <div style={{ marginTop: 6 }}>
            <BarList
              rows={contrib.map((c) => ({
                name: c.symbol,
                value: c.value,
                color: c.value > 0 ? '#2ec27b' : '#e5484d',
              }))}
              fmt={(v) => `${v > 0 ? '+' : ''}${num(v, 1)}%`}
              barWidth={78}
            />
          </div>
        </Card>

        <Card title="Phân bổ tài sản hiện tại" action={<Tabs tabs={MIX} value={mix} onChange={setMix} />}>
          <div style={{ marginTop: 10 }}>
            <Donut
              data={
                mix === 'Theo ngành'
                  ? [
                      { name: 'Ngân hàng', value: 32 },
                      { name: 'Công nghệ', value: 24 },
                      { name: 'Bất động sản', value: 15 },
                      { name: 'Hàng tiêu dùng', value: 12 },
                      { name: 'Công nghiệp', value: 8 },
                      { name: 'Vật liệu', value: 6 },
                      { name: 'Tiền mặt', value: 3 },
                    ]
                  : mix === 'Theo loại tài sản'
                    ? [
                        { name: 'Cổ phiếu', value: 68 },
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
              }
              size={140}
              thickness={26}
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
      </div>

      {/* ---------- Bảng chi tiết + so sánh chuẩn ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.75fr) minmax(0,1fr)' }}>
        <Card
          title="Hiệu suất chi tiết theo cổ phiếu"
          action={
            <div className="row gap-8">
              <span className="dim" style={{ fontSize: 10.5 }}>Sắp xếp: Đóng góp hiệu suất</span>
            </div>
          }
        >
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: 26 }}>#</th>
                <th className="l">Mã</th>
                <th className="l">Tên công ty</th>
                <th>Tỷ trọng</th>
                <th>Giá vốn (VND)</th>
                <th>Giá hiện tại</th>
                <th>Lãi/Lỗ</th>
                <th>Lãi/Lỗ (%)</th>
                <th>Đóng góp (%)</th>
                <th className="l" style={{ width: 76 }}>Xu hướng</th>
              </tr>
            </thead>
            <tbody>
              {PERF_ROWS.map((r, i) => (
                <tr key={r.symbol} className="clickable" onClick={() => onNavigate('stock', r.symbol)}>
                  <td className="idx num">{i + 1}</td>
                  <td className="l ticker-cell">{r.symbol}</td>
                  <td className="l co-name">{r.name}</td>
                  <td className="num">{num(r.weight, 1)}%</td>
                  <td className="num">{num(r.cost, 0)}</td>
                  <td className="num">{num(r.price, 0)}</td>
                  <td className={`num ${dirClass(r.pnl)}`} style={{ fontWeight: 600 }}>
                    {r.pnl > 0 ? '+' : ''}
                    {num(r.pnl, 0)}
                  </td>
                  <td className={`num ${dirClass(r.pnlPct)}`} style={{ fontWeight: 600 }}>
                    {r.pnlPct > 0 ? '+' : ''}
                    {num(r.pnlPct, 1)}%
                  </td>
                  <td className={`num ${dirClass(r.contribution)}`} style={{ fontWeight: 600 }}>
                    {r.contribution > 0 ? '+' : ''}
                    {num(r.contribution, 1)}%
                  </td>
                  <td className="l">
                    <span style={{ display: 'inline-block', width: 62 }}>
                      <Sparkline data={holdingSpark(r.seed, r.pnlPct > 0)} height={22} fill={false} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card
            title="So sánh với chỉ số chuẩn"
            action={<Tabs tabs={['VN-Index', 'VN30', 'Tùy chỉnh'] as const} value={benchTab} onChange={setBenchTab} />}
          >
            <GroupedBars
              groups={BENCHMARK_COMPARE.map((b) => ({ label: b.label, values: b.values }))}
              seriesNames={BENCHMARKS}
              height={196}
              fmt={(v) => num(v, 1)}
            />
          </Card>

          <Card
            className="gold"
            title={
              <div className="ai-head">
                <IconLightning size={14} /> Nhận định hiệu suất từ AI KIMQUY
              </div>
            }
            action={
              <button className="btn xs gold-ghost" onClick={() => onNavigate('copilot')}>
                <IconLightning size={12} /> AI Copilot
              </button>
            }
          >
            <div style={{ fontSize: 11.5, color: 'var(--tx)', lineHeight: 1.65 }}>
              <p>
                Danh mục của bạn đang <strong style={{ color: 'var(--tx-hi)' }}>vượt trội</strong> so với VN-Index nhờ
                đóng góp tích cực từ <strong style={{ color: 'var(--up-200)' }}>FPT, TCB và MWG</strong>.
              </p>
              <p style={{ marginTop: 7 }}>
                Tuy nhiên, tỷ trọng bất động sản và vật liệu đang làm giảm hiệu suất chung.
              </p>
              <p style={{ marginTop: 7 }}>
                <span className="gold">Gợi ý:</span> Cân nhắc giảm tỷ trọng HSG, VIC và tăng tỷ trọng các cổ phiếu
                công nghệ, ngân hàng có nền tảng cơ bản tốt.
              </p>
            </div>
            <button className="btn gold" style={{ marginTop: 12, width: '100%' }} onClick={() => onNavigate('copilot')}>
              Xem phân tích chi tiết <IconArrowRight size={13} />
            </button>
          </Card>
        </div>
      </div>

      {/* ---------- Rủi ro & chi phí ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
        <Card title="Phân tích rủi ro">
          <BarChart
            data={[14.8, 16.2, 15.9, 12.4, 18.6, 17.2]}
            labels={['T1', 'T2', 'T3', 'T4', 'T5', 'T6']}
            height={148}
            fmt={(v) => `${num(v, 0)}%`}
            color="#d4af37"
            yTicks={3}
          />
          <div className="dim" style={{ fontSize: 10.5, textAlign: 'center', marginTop: 4 }}>
            Độ biến động theo tháng
          </div>
        </Card>

        <Card title="Chi phí giao dịch">
          <div className="ohlc c2">
            <div className="ohlc-item">
              <div className="ohlc-label">Tổng phí giao dịch</div>
              <div className="ohlc-value">{num(634_275, 0)} VND</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Thuế TNCN</div>
              <div className="ohlc-value">{num(105_900, 0)} VND</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Số giao dịch</div>
              <div className="ohlc-value">8 lệnh</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Tỷ lệ chi phí / GTGD</div>
              <div className="ohlc-value">0,15%</div>
            </div>
          </div>
          <div className="callout" style={{ marginTop: 12 }}>
            <p>Tổng chi phí giao dịch chiếm <strong>0,15%</strong> giá trị giao dịch — thấp hơn mức trung bình thị trường (0,18%).</p>
          </div>
        </Card>

        <Card title="So sánh nhanh với chuẩn">
          <table className="matrix">
            <thead>
              <tr>
                <th>Chỉ tiêu</th>
                <th className="hl">Danh mục</th>
                <th>VN-Index</th>
                <th>Chênh lệch</th>
              </tr>
            </thead>
            <tbody>
              {[
                { l: 'Tổng sinh lời', a: 14.8, b: 8.3 },
                { l: 'Độ biến động', a: 14.8, b: 16.2, inv: true },
                { l: 'Sharpe Ratio', a: 0.82, b: 0.54 },
                { l: 'Max Drawdown', a: -12.6, b: -18.4 },
              ].map((r) => {
                const diff = r.a - r.b
                return (
                  <tr key={r.l}>
                    <td>{r.l}</td>
                    <td className="gold">{num(r.a, r.l.includes('Ratio') ? 2 : 1)}{r.l.includes('Ratio') ? '' : '%'}</td>
                    <td>{num(r.b, r.l.includes('Ratio') ? 2 : 1)}{r.l.includes('Ratio') ? '' : '%'}</td>
                    <td className={dirClass(r.inv ? -diff : diff)}>
                      {diff > 0 ? '+' : ''}
                      {num(diff, r.l.includes('Ratio') ? 2 : 1)}
                      {r.l.includes('Ratio') ? '' : '%'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
          <div className="row gap-6" style={{ marginTop: 12, flexWrap: 'wrap' }}>
            <Badge tone="up">Vượt trội 3/4 chỉ tiêu</Badge>
            <Badge tone="gold">Sharpe tốt</Badge>
          </div>
        </Card>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="row gap-10" style={{ flexWrap: 'wrap' }}>
          <Chip onClick={() => onNavigate('portfolio')}>Về danh mục</Chip>
          <Chip onClick={() => onNavigate('risk')}>Quản trị rủi ro</Chip>
          <Chip onClick={() => onNavigate('scenario')}>Kịch bản & Stress test</Chip>
          <Chip onClick={() => onNavigate('report')}>Xuất báo cáo hiệu suất</Chip>
        </div>
      </div>
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