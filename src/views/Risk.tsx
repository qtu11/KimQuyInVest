/* ==========================================================================
   TRANG QUẢN TRỊ RỦI RO
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import { AreaChart, BarChart, BarList, Donut, Sparkline } from '../components/charts'
import { Art } from '../components/Art'
import { IconArrowRight, IconLightning, IconShield } from '../components/icons'
import {
  IconBolt, IconCrosshair, IconGauge, IconPulse, IconScale, IconShieldCheck, IconStack, IconWarning,
} from '../components/icons.extra'
import { Badge, Card, Chip, Segmented, Tabs } from '../components/ui'
import { HOLDINGS, PORTFOLIO, RISK_METRICS, benchmarkSeries, portfolioSeries } from '../data/portfolio'
import { SECTORS } from '../data/market'
import { dirClass, num } from '../lib/format'

const TABS = ['Tổng quan', 'Rủi ro thị trường', 'Rủi ro tập trung', 'Rủi ro thanh khoản', 'Cảnh báo & Ngưỡng'] as const
type Tab = (typeof TABS)[number]

const RISK_LEVELS = [
  { label: 'Rủi ro thị trường', value: 62, tone: 'gold' as const, note: 'Beta 1,18 · Biến động 14,8%' },
  { label: 'Rủi ro tập trung', value: 74, tone: 'down' as const, note: 'Top 3 mã chiếm 46,8%' },
  { label: 'Rủi ro thanh khoản', value: 28, tone: 'up' as const, note: 'Tiền mặt 5,0%' },
  { label: 'Rủi ro tỷ giá', value: 41, tone: 'gold' as const, note: 'Tác động ước tính -6,2%' },
  { label: 'Rủi ro lãi suất', value: 56, tone: 'gold' as const, note: 'Độ nhạy -8,4% / +1%' },
  { label: 'Rủi ro ngành', value: 68, tone: 'down' as const, note: 'Ngân hàng 32% danh mục' },
]

const ALERTS = [
  { name: 'Ngưỡng cắt lỗ vị thế', value: '-8%', status: 'Đang bật', tone: 'up' as const, hits: 1 },
  { name: 'Ngưỡng tỷ trọng ngành', value: '35%', status: 'Đang bật', tone: 'gold' as const, hits: 0 },
  { name: 'Ngưỡng drawdown danh mục', value: '-15%', status: 'Đang bật', tone: 'up' as const, hits: 0 },
  { name: 'Cảnh báo biến động bất thường', value: '2σ', status: 'Đang bật', tone: 'gold' as const, hits: 0 },
  { name: 'Cảnh báo khối lượng đột biến', value: '3× TB20', status: 'Tắt', tone: 'flat' as const, hits: 0 },
]

export function Risk({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Tổng quan')
  const [period, setPeriod] = useState('1Y')

  const top3 = [...HOLDINGS].sort((a, b) => b.weight - a.weight).slice(0, 3)
  const top3Weight = top3.reduce((a, b) => a + b.weight, 0)

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <Segmented options={['3M', '6M', '1Y', '3Y']} value={period} onChange={setPeriod} />
      </div>

      {/* ---------- Chỉ số rủi ro ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.3fr) repeat(4, minmax(0,1fr))' }}>
        <Card title="Điểm rủi ro tổng thể" className="gold" action={<Badge tone="gold">Mức: Trung bình – Cao</Badge>}>
          <div className="row gap-16" style={{ gap: 16 }}>
            <Donut
              data={[
                { name: 'Điểm rủi ro', value: 58, color: '#e8b44a' },
                { name: 'Còn lại', value: 42, color: '#242424' },
              ]}
              size={116}
              thickness={13}
              legend={false}
              center={
                <>
                  <div className="donut-center-value" style={{ fontSize: 24 }}>58</div>
                  <div className="donut-center-label">/ 100</div>
                </>
              }
            />
            <div className="grow" style={{ minWidth: 0 }}>
              <p style={{ fontSize: 11, color: 'var(--tx-mid)', lineHeight: 1.6 }}>
                Danh mục có mức rủi ro <strong style={{ color: 'var(--kg-gold-200)' }}>trung bình – cao</strong>,
                chủ yếu đến từ mức độ tập trung ngành và độ nhạy với lãi suất.
              </p>
              <div className="row gap-8" style={{ marginTop: 10, flexWrap: 'wrap' }}>
                <Badge tone="down">Tập trung cao</Badge>
                <Badge tone="gold">Beta 1,18</Badge>
                <Badge tone="up">Thanh khoản tốt</Badge>
              </div>
            </div>
          </div>
        </Card>

        {RISK_METRICS.slice(0, 4).map((m, i) => {
          const Icons = [IconPulse, IconGauge, IconScale, IconCrosshair]
          const Icon = Icons[i]
          return (
            <div className="stat" key={m.label}>
              <div className="stat-label">
                <Icon size={13} style={{ color: 'var(--tx-dim)' }} />
                {m.label}
              </div>
              <div
                className={m.tone === 'up' ? 'up' : m.tone === 'down' ? 'down' : 'gold'}
                style={{ fontSize: 22, fontWeight: 680, letterSpacing: '-0.02em' }}
              >
                {m.value}
              </div>
              <div className="seg-meter" style={{ marginTop: 7 }}>
                {Array.from({ length: 10 }, (_, i) => (
                  <i
                    key={i}
                    className={i < m.bars ? `on ${m.level === 'high' ? 'lv-high' : m.level === 'mid' ? 'lv-mid' : 'lv-low'}` : ''}
                    style={{ width: 7, height: 6 }}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* ---------- Mức rủi ro theo nhóm ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.4fr)' }}>
        <Card title="Phân loại mức độ rủi ro">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {RISK_LEVELS.map((r) => (
              <div key={r.label}>
                <div className="row-between" style={{ marginBottom: 5 }}>
                  <span className="row gap-8" style={{ minWidth: 0 }}>
                    <span
                      style={{
                        width: 20,
                        height: 20,
                        borderRadius: 'var(--r-xs)',
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        background:
                          r.tone === 'up' ? 'var(--up-soft)' : r.tone === 'down' ? 'var(--down-soft)' : 'rgba(212,175,55,0.12)',
                        color: r.tone === 'up' ? 'var(--up)' : r.tone === 'down' ? 'var(--down)' : 'var(--kg-gold)',
                      }}
                    >
                      <IconShield size={11} />
                    </span>
                    <span style={{ fontSize: 11.5, color: 'var(--tx)' }}>{r.label}</span>
                  </span>
                  <span
                    className="num"
                    style={{
                      fontSize: 12,
                      fontWeight: 650,
                      color: r.tone === 'up' ? 'var(--up)' : r.tone === 'down' ? 'var(--down)' : 'var(--kg-gold)',
                    }}
                  >
                    {r.value}/100
                  </span>
                </div>
                <span className="bar-track" style={{ display: 'block', width: '100%' }}>
                  <i
                    style={{
                      width: `${r.value}%`,
                      background:
                        r.tone === 'up' ? 'var(--up)' : r.tone === 'down' ? 'var(--down)' : 'var(--kg-gold)',
                    }}
                  />
                </span>
                <div style={{ fontSize: 10, color: 'var(--tx-dim)', marginTop: 4 }}>{r.note}</div>
              </div>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Drawdown theo thời gian" sub="Mức sụt giảm từ đỉnh của danh mục so với VN-Index">
            <AreaChart
              series={[
                { id: 'dd', name: 'Danh mục', data: drawdownSeries('portfolio'), color: '#e5484d' },
                { id: 'ddb', name: 'VN-Index', data: drawdownSeries('vnindex'), color: '#8b8b8b', dashed: true, area: false },
              ]}
              labels={yearLabels()}
              height={180}
              fmt={(v) => `${num(v, 0)}%`}
              refLine={0}
              xTicks={6}
              legend
            />
          </Card>

          <div className="grid g-2" style={{ padding: 0, gap: 12 }}>
            <Card title="Rủi ro tập trung" action={<Chip>Top 3</Chip>}>
              <div className="ohlc c1">
                {top3.map((h) => (
                  <div className="ohlc-item" key={h.symbol}>
                    <div className="row-between" style={{ marginBottom: 4 }}>
                      <span className="ticker-cell" style={{ fontSize: 11.5 }}>{h.symbol}</span>
                      <span className="num" style={{ fontSize: 11.5, color: 'var(--tx-hi)', fontWeight: 600 }}>
                        {num(h.weight, 1)}%
                      </span>
                    </div>
                    <span className="bar-track" style={{ display: 'block', width: '100%' }}>
                      <i style={{ width: `${(h.weight / 25) * 100}%`, background: 'var(--kg-gold)' }} />
                    </span>
                  </div>
                ))}
                <div className="card-foot" style={{ borderTop: '1px solid var(--line)' }}>
                  <div className="row-between">
                    <span className="mini-label">Tổng top 3</span>
                    <span className="num down" style={{ fontWeight: 650 }}>
                      {num(top3Weight, 1)}%
                    </span>
                  </div>
                  <div className="dim" style={{ fontSize: 10, marginTop: 5, lineHeight: 1.45 }}>
                    Vượt ngưỡng khuyến nghị 40% — nên phân bổ lại.
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Rủi ro ngành" action={<Chip>Ngành</Chip>}>
              <BarList
                rows={SECTORS.slice(0, 5).map((s, i) => ({
                  name: s.name,
                  value: [32, 24, 15, 12, 8][i],
                  color: i < 2 ? '#e5484d' : '#d4af37',
                }))}
                fmt={(v) => `${num(v, 0)}%`}
                barWidth={70}
              />
              <div className="dim" style={{ fontSize: 10, marginTop: 8, lineHeight: 1.45 }}>
                Ngân hàng vượt ngưỡng khuyến nghị 30%.
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ---------- VaR · tương quan · thanh khoản ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
        <Card title="Value at Risk (VaR)" sub="Tổn thất tối đa ước tính trong 1 ngày">
          <div className="ohlc c2" style={{ marginBottom: 12 }}>
            <div className="ohlc-item">
              <div className="ohlc-label">VaR 95% (1 ngày)</div>
              <div className="ohlc-value down" style={{ fontSize: 17 }}>-3,2%</div>
              <div className="dim" style={{ fontSize: 10 }}>≈ -40.000.000 VND</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">VaR 99% (1 ngày)</div>
              <div className="ohlc-value down" style={{ fontSize: 17 }}>-4,7%</div>
              <div className="dim" style={{ fontSize: 10 }}>≈ -58.750.000 VND</div>
            </div>
          </div>
          <BarChart
            data={[1.8, 2.4, 3.2, 4.7, 6.2, 8.4]}
            labels={['90%', '92,5%', '95%', '99%', '99,5%', '99,9%']}
            height={132}
            fmt={(v) => `${num(v, 1)}%`}
            color="#e5484d"
            yTicks={3}
          />
        </Card>

        <Card title="Ma trận tương quan" sub="Hệ số tương quan giữa các nhóm ngành chính">
          <div style={{ display: 'grid', gridTemplateColumns: 'auto repeat(5, minmax(0,1fr))', gap: 3, fontSize: 10 }}>
            <span />
            {['NH', 'CN', 'BĐS', 'TD', 'CK'].map((h) => (
              <span key={h} className="num" style={{ textAlign: 'center', color: 'var(--tx-dim)', paddingBottom: 3 }}>
                {h}
              </span>
            ))}
            {[
              ['NH', [1.0, 0.42, 0.68, 0.31, 0.74]],
              ['CN', [0.42, 1.0, 0.28, 0.36, 0.52]],
              ['BĐS', [0.68, 0.28, 1.0, 0.24, 0.61]],
              ['TD', [0.31, 0.36, 0.24, 1.0, 0.22]],
              ['CK', [0.74, 0.52, 0.61, 0.22, 1.0]],
            ].map(([label, vals]) => (
              <>
                <span key={`l-${label}`} className="num" style={{ color: 'var(--tx-dim)', display: 'grid', placeItems: 'center', paddingRight: 4 }}>
                  {label as string}
                </span>
                {(vals as number[]).map((v, i) => (
                  <span
                    key={`${label}-${i}`}
                    className="num"
                    style={{
                      textAlign: 'center',
                      padding: '6px 2px',
                      borderRadius: 3,
                      fontWeight: Math.abs(v) > 0.6 && v !== 1 ? 650 : 400,
                      background:
                        v === 1
                          ? 'rgba(212,175,55,0.22)'
                          : v > 0.6
                            ? 'rgba(229,72,77,0.18)'
                            : v > 0.4
                              ? 'rgba(212,175,55,0.1)'
                              : 'rgba(34,197,118,0.09)',
                      color: v === 1 ? 'var(--kg-gold-200)' : v > 0.6 ? 'var(--down-200)' : 'var(--tx)',
                    }}
                  >
                    {num(v, 2)}
                  </span>
                ))}
              </>
            ))}
          </div>
          <div className="dim" style={{ fontSize: 10, marginTop: 9, lineHeight: 1.45 }}>
            Tương quan cao giữa Ngân hàng – Chứng khoán (0,74) làm giảm hiệu quả đa dạng hoá.
          </div>
        </Card>

        <Card title="Rủi ro thanh khoản" sub="Khả năng chuyển đổi vị thế thành tiền mặt">
          <div className="ohlc c2" style={{ marginBottom: 12 }}>
            <div className="ohlc-item">
              <div className="ohlc-label">Tiền mặt khả dụng</div>
              <div className="ohlc-value">5,0%</div>
              <div className="dim" style={{ fontSize: 10 }}>62.500.000 VND</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Số ngày thanh lý 50%</div>
              <div className="ohlc-value up">2,4 ngày</div>
            </div>
          </div>
          <BarList
            rows={[...HOLDINGS]
              .sort((a, b) => b.weight - a.weight)
              .slice(0, 5)
              .map((h) => ({ name: h.symbol, value: h.weight, color: '#2ec27b' }))}
            fmt={(v) => `${num(v, 1)}%`}
            barWidth={70}
          />
          <div className="callout" style={{ marginTop: 12 }}>
            <p>Toàn bộ vị thế hiện tại có thanh khoản tốt — có thể thanh lý trong vòng 3 phiên mà không ảnh hưởng giá.</p>
          </div>
        </Card>
      </div>

      {/* ---------- Cảnh báo & ngưỡng ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr)' }}>
        <Card title="Cảnh báo & ngưỡng rủi ro" action={<button className="btn xs gold-ghost">+ Thêm ngưỡng</button>}>
          <table className="data">
            <thead>
              <tr>
                <th className="l">Loại cảnh báo</th>
                <th>Ngưỡng</th>
                <th className="l">Trạng thái</th>
                <th>Số lần kích hoạt</th>
                <th className="l">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {ALERTS.map((a) => (
                <tr key={a.name}>
                  <td className="l" style={{ color: 'var(--tx)' }}>{a.name}</td>
                  <td className="num gold" style={{ fontWeight: 600 }}>{a.value}</td>
                  <td className="l">
                    <Badge tone={a.tone === 'up' ? 'up' : a.tone === 'flat' ? 'flat' : 'gold'}>{a.status}</Badge>
                  </td>
                  <td className="num">
                    {a.hits ? <span className="down" style={{ fontWeight: 600 }}>{a.hits}</span> : '0'}
                  </td>
                  <td className="l">
                    <button className="btn xs ghost">Chỉnh sửa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card
          className="gold"
          title={
            <div className="ai-head">
              <IconLightning size={14} /> Khuyến nghị giảm rủi ro
            </div>
          }
          action={<button className="btn xs gold-ghost" onClick={() => onNavigate('copilot')}>Hỏi AI</button>}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {[
              { icon: IconStack, tone: 'down' as const, text: 'Giảm tỷ trọng Ngân hàng từ 32% xuống dưới 30% để tránh vi phạm ngưỡng tập trung.' },
              { icon: IconBolt, tone: 'gold' as const, text: 'Bổ sung 1–2 mã phòng thủ (Điện nước, Tiêu dùng thiết yếu) để giảm tương quan danh mục.' },
              { icon: IconShieldCheck, tone: 'up' as const, text: 'Nâng tiền mặt từ 5% lên 8–10% để có dư địa mua khi thị trường điều chỉnh.' },
              { icon: IconWarning, tone: 'down' as const, text: 'Đặt cắt lỗ -8% cho HSG và VIC — hai vị thế đang có đóng góp âm.' },
            ].map((r, i) => {
              const Icon = r.icon
              return (
                <div className="row gap-9" key={i} style={{ alignItems: 'flex-start', gap: 9 }}>
                  <span
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 'var(--r-xs)',
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      background:
                        r.tone === 'up' ? 'var(--up-soft)' : r.tone === 'down' ? 'var(--down-soft)' : 'rgba(212,175,55,0.12)',
                      color: r.tone === 'up' ? 'var(--up)' : r.tone === 'down' ? 'var(--down)' : 'var(--kg-gold)',
                    }}
                  >
                    <Icon size={13} />
                  </span>
                  <span style={{ fontSize: 11.5, color: 'var(--tx)', lineHeight: 1.55 }}>{r.text}</span>
                </div>
              )
            })}
          </div>
          <button className="btn gold" style={{ marginTop: 13, width: '100%' }} onClick={() => onNavigate('scenario')}>
            Chạy stress test <IconArrowRight size={13} />
          </button>
        </Card>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="quote-block" style={{ minHeight: 96 }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
            <Art kind="mountain" />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,6,6,0.95), rgba(6,6,6,0.6))' }} />
          <div className="inner row-between" style={{ position: 'relative', gap: 20 }}>
            <div>
              <div className="hero-quote-mark">“</div>
              <div className="hero-quote-text" style={{ fontSize: 13 }}>
                Biết rủi ro trước, giữ vững thành quả sau.
              </div>
              <div className="hero-quote-by">KIMQUY INVEST</div>
            </div>
            <div className="row gap-8">
              <Badge tone="gold">Beta 1,18</Badge>
              <Badge tone="down">Max DD -12,6%</Badge>
              <Badge tone="up">Sharpe 0,82</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="row gap-10" style={{ flexWrap: 'wrap' }}>
          <Chip onClick={() => onNavigate('scenario')}>Kịch bản & Stress test</Chip>
          <Chip onClick={() => onNavigate('performance')}>Phân tích hiệu suất</Chip>
          <Chip onClick={() => onNavigate('portfolio')}>Về danh mục</Chip>
          <span className="row gap-6" style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>
            <IconShield size={12} style={{ color: 'var(--kg-gold)' }} /> Cập nhật: 22/09/2026 15:27
          </span>
        </div>
      </div>
    </>
  )
}

function drawdownSeries(seed: string): number[] {
  const base = seed === 'portfolio' ? portfolioSeries('1Y') : benchmarkSeries('1Y')
  let peak = -Infinity
  return base.map((v) => {
    const level = 100 + v
    peak = Math.max(peak, level)
    return Number((((level - peak) / peak) * 100).toFixed(2))
  })
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

export { PORTFOLIO, Sparkline, dirClass }