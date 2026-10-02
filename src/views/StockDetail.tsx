/* ==========================================================================
   TRANG CHI TIẾT CỔ PHIẾU
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import {
  AreaChart, BarChart, CandleChart, Donut, GroupedBars, Sparkline, type Candle,
} from '../components/charts'
import { IconArrowRight, IconBookmark, IconLightning, IconPlus, IconStar } from '../components/icons'
import { Badge, Card, Chip, Segmented, Tabs } from '../components/ui'
import { NEWS } from '../data/content'
import { RANGES, SECTORS, STOCKS, performanceSeries, rng, stockBySymbol, type RangeKey } from '../data/market'
import { dirClass, num, slug, vnd } from '../lib/format'

const TABS = ['Tổng quan', 'Định giá', 'Tài chính', 'Kỹ thuật', 'Cổ đông & Giao dịch', 'Tin tức', 'Luận điểm'] as const
type Tab = (typeof TABS)[number]

/** Sinh nến từ chuỗi giá */
function candles(symbol: string, count = 90): Candle[] {
  const st = stockBySymbol(symbol)!
  const r = rng(`${symbol}-candle`)
  const prices = performanceSeries(`${symbol}-px`, '3M', st.epsGrowth * 0.6).map(
    (v) => st.price * (1 + v / 100),
  )
  const step = Math.max(1, Math.floor(prices.length / count))
  const out: Candle[] = []
  for (let i = 0; i < prices.length; i += step) {
    const c = prices[i]
    const o = i === 0 ? c : prices[i - 1]
    const hi = Math.max(o, c) * (1 + r() * 0.012)
    const lo = Math.min(o, c) * (1 - r() * 0.012)
    out.push({ o, h: hi, l: lo, c, v: 40 + r() * 160 })
  }
  return out
}

function monthLabels(range: RangeKey): string[] {
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

export function StockDetail({
  symbol,
  onNavigate,
}: {
  symbol: string
  onNavigate: (p: PageKey, s?: string) => void
}) {
  const st = stockBySymbol(symbol) ?? STOCKS[0]
  const [tab, setTab] = useState<Tab>('Tổng quan')
  const [range, setRange] = useState<RangeKey>('1Y')
  const [chart, setChart] = useState<'Vùng' | 'Nến'>('Vùng')
  const [watched, setWatched] = useState(false)

  const peers = STOCKS.filter((s) => s.sector === st.sector && s.symbol !== st.symbol).slice(0, 4)
  const sector = SECTORS.find((s) => s.name === st.sector)

  return (
    <>
      {/* ---------- Thanh mã + giá ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <div className="row gap-12">
          <span className="row gap-10">
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: 'var(--r-md)',
                display: 'grid',
                placeItems: 'center',
                background: 'var(--grad-gold-btn)',
                color: '#1d1602',
                fontWeight: 700,
                fontSize: 13,
                letterSpacing: '0.02em',
              }}
            >
              {st.symbol.slice(0, 3)}
            </span>
            <span>
              <span className="row gap-9" style={{ gap: 9 }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: 'var(--tx-hi)' }}>
                  {st.symbol}
                </span>
                <Badge tone="blue">{st.exchange}</Badge>
                <Badge tone="gold">{st.sector}</Badge>
              </span>
              <span style={{ display: 'block', fontSize: 11.5, color: 'var(--tx-mid)', marginTop: 2 }}>
                {st.name}
              </span>
            </span>
          </span>

          <span style={{ marginLeft: 12 }}>
            <span className={`num ${dirClass(st.changePct)}`} style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {num(st.price, 1)}
            </span>
            <span className={`num ${dirClass(st.changePct)}`} style={{ fontSize: 13, fontWeight: 600, marginLeft: 10 }}>
              {st.change > 0 ? '+' : ''}
              {num(st.change, 2)} ({st.changePct > 0 ? '+' : ''}
              {num(st.changePct, 2)}%)
            </span>
          </span>
        </div>

        <div className="row gap-8">
          <button className="icon-btn" onClick={() => setWatched((w) => !w)} aria-label="Theo dõi">
            <IconStar size={16} style={{ color: watched ? 'var(--kg-gold)' : undefined }} fill={watched ? 'currentColor' : 'none'} />
          </button>
          <button className="btn sm ghost">
            <IconBookmark size={13} /> Lưu
          </button>
          <button className="btn sm gold" onClick={() => onNavigate('portfolio')}>
            <IconPlus size={13} /> Thêm vào danh mục
          </button>
        </div>
      </div>

      {/* ---------- Biểu đồ giá + chỉ số ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)' }}>
        <Card
          title="Biểu đồ giá"
          action={
            <div className="row gap-8">
              <Segmented options={['Vùng', 'Nến'] as const} value={chart} onChange={setChart} />
              <Segmented options={RANGES} value={range} onChange={setRange} />
            </div>
          }
        >
          <div className="ohlc c5" style={{ marginBottom: 12 }}>
            <div className="ohlc-item">
              <div className="ohlc-label">Mở cửa</div>
              <div className="ohlc-value">{num(st.open, 2)}</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Cao nhất</div>
              <div className="ohlc-value up">{num(st.high, 2)}</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Thấp nhất</div>
              <div className="ohlc-value down">{num(st.low, 2)}</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Giá tham chiếu</div>
              <div className="ohlc-value">{num(st.ref, 2)}</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Khối lượng</div>
              <div className="ohlc-value">{num(st.volume / 1e6, 2)} triệu</div>
            </div>
          </div>

          {chart === 'Vùng' ? (
            <AreaChart
              series={[
                {
                  id: 'px',
                  name: st.symbol,
                  data: performanceSeries(`${st.symbol}-px`, range, st.epsGrowth * 0.6).map((v) => st.price * (1 + v / 100)),
                  color: st.changePct >= 0 ? '#22c576' : '#e5484d',
                },
              ]}
              labels={monthLabels(range)}
              height={266}
              fmt={(v) => num(v, 0)}
              xTicks={7}
            />
          ) : (
            <CandleChart data={candles(st.symbol)} height={266} fmt={(v) => num(v, 0)} volume />
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Chỉ số định giá">
            <div className="ohlc c2">
              <div className="ohlc-item">
                <div className="ohlc-label">P/E</div>
                <div className="ohlc-value">{st.pe ? num(st.pe, 1) : '—'}</div>
              </div>
              <div className="ohlc-item">
                <div className="ohlc-label">P/B</div>
                <div className="ohlc-value">{st.pb ? num(st.pb, 1) : '—'}</div>
              </div>
              <div className="ohlc-item">
                <div className="ohlc-label">ROE</div>
                <div className="ohlc-value up">{st.roe ? `${num(st.roe, 1)}%` : '—'}</div>
              </div>
              <div className="ohlc-item">
                <div className="ohlc-label">Tăng trưởng LNST</div>
                <div className={`ohlc-value ${dirClass(st.epsGrowth)}`}>
                  {st.epsGrowth ? `${num(st.epsGrowth, 1)}%` : '—'}
                </div>
              </div>
              <div className="ohlc-item">
                <div className="ohlc-label">Nợ/VCSH</div>
                <div className="ohlc-value">{st.de ? num(st.de, 2) : '—'}</div>
              </div>
              <div className="ohlc-item">
                <div className="ohlc-label">Cổ tức</div>
                <div className="ohlc-value">{st.dividendYield ? `${num(st.dividendYield, 1)}%` : '—'}</div>
              </div>
            </div>
            <div className="card-foot" style={{ borderTop: '1px solid var(--line)' }}>
              <div className="row-between">
                <span className="mini-label">Vốn hoá</span>
                <span className="num" style={{ fontSize: 13, fontWeight: 650, color: 'var(--tx-hi)' }}>
                  {num(st.marketCap, 0)} tỷ
                </span>
              </div>
              <div className="row-between" style={{ marginTop: 6 }}>
                <span className="mini-label">Khối ngoại ròng</span>
                <span className={`num ${dirClass(st.foreignNet)}`} style={{ fontSize: 12, fontWeight: 650 }}>
                  {st.foreignNet > 0 ? '+' : ''}
                  {num(st.foreignNet, 0)} tỷ
                </span>
              </div>
            </div>
          </Card>

          <Card
            className="gold"
            title={
              <div className="ai-head">
                <IconLightning size={14} /> Nhận định AI
              </div>
            }
            action={<button className="btn xs gold-ghost" onClick={() => onNavigate('copilot')}>Hỏi thêm</button>}
          >
            <p style={{ fontSize: 11.5, color: 'var(--tx)', lineHeight: 1.65 }}>
              {st.roe >= 20
                ? `${st.symbol} có chất lượng sinh lời vượt trội với ROE ${num(st.roe, 1)}%`
                : `${st.symbol} đang ở mức định giá ${
                    st.pe && st.pe < 12 ? 'hấp dẫn' : 'trung bình'
                  } so với ngành ${st.sector}`}
              {st.epsGrowth > 0
                ? ` và tăng trưởng LNST ${num(st.epsGrowth, 1)}%.`
                : `, tăng trưởng LNST hiện ${num(st.epsGrowth, 1)}%.`}
            </p>
            <p style={{ fontSize: 11.5, color: 'var(--tx-mid)', lineHeight: 1.65, marginTop: 7 }}>
              {sector
                ? `Ngành ${st.sector} đang ${sector.pct > 0 ? 'tăng' : 'giảm'} ${num(Math.abs(sector.pct), 2)}% với dòng tiền ròng ${sector.net > 0 ? '+' : ''}${num(sector.net, 0)} tỷ.`
                : ''}
            </p>
            <button className="btn gold" style={{ marginTop: 11, width: '100%' }} onClick={() => onNavigate('copilot')}>
              Phân tích chuyên sâu <IconArrowRight size={13} />
            </button>
          </Card>
        </div>
      </div>

      {/* ---------- Tab nội dung ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)' }}>
        <Card title={tab === 'Tổng quan' ? 'Tóm tắt doanh nghiệp' : tab}>
          {tab === 'Tài chính' ? (
            <BarChart
              data={[18.4, 21.2, 24.6, 27.8, st.epsGrowth]}
              extra={[12.1, 14.4, 16.8, 19.2, st.epsGrowth * 0.82]}
              labels={['2022', '2023', '2024', '2025', '2026E']}
              height={236}
              fmt={(v) => `${num(v, 0)}%`}
              extraColor="#5b8def"
              legend={[
                { label: 'Tăng trưởng LNST', color: '#22c576' },
                { label: 'Tăng trưởng doanh thu', color: '#5b8def' },
              ]}
              yTicks={4}
            />
          ) : tab === 'Kỹ thuật' ? (
            <CandleChart data={candles(st.symbol, 60)} height={250} fmt={(v) => num(v, 0)} volume />
          ) : tab === 'Định giá' ? (
            <GroupedBars
              groups={[
                { label: 'P/E', values: [st.pe || 0, st.pe ? st.pe * 1.18 : 0] },
                { label: 'P/B', values: [st.pb || 0, st.pb ? st.pb * 1.15 : 0] },
              ]}
              seriesNames={[
                { name: st.symbol, color: '#d4af37' },
                { name: `TB ngành ${st.sector}`, color: '#5b8def' },
              ]}
              height={220}
              fmt={(v) => num(v, 1)}
            />
          ) : tab === 'Cổ đông & Giao dịch' ? (
            <table className="data">
              <thead>
                <tr>
                  <th className="l">Cổ đông</th>
                  <th className="l">Loại</th>
                  <th>Tỷ lệ sở hữu</th>
                  <th>Số lượng CP</th>
                  <th>Thay đổi</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { n: 'Tổng công ty Đầu tư SCIC', t: 'Nhà nước', p: 18.4 },
                  { n: 'Quỹ đầu tư nước ngoài', t: 'Nước ngoài', p: 24.6 },
                  { n: 'Ban lãnh đạo & HĐQT', t: 'Nội bộ', p: 8.2 },
                  { n: 'Cổ đông tổ chức trong nước', t: 'Tổ chức', p: 21.4 },
                  { n: 'Cổ đông cá nhân', t: 'Cá nhân', p: 27.4 },
                ].map((s, i) => (
                  <tr key={s.n}>
                    <td className="l" style={{ color: 'var(--tx)' }}>{s.n}</td>
                    <td className="l co-name">{s.t}</td>
                    <td className="num gold" style={{ fontWeight: 600 }}>{num(s.p, 1)}%</td>
                    <td className="num">{num((st.marketCap * 1e9 * s.p) / 100 / st.price / 1000, 0)} nghìn</td>
                    <td className={`num ${i % 2 === 0 ? 'up' : 'down'}`}>
                      {i % 2 === 0 ? '+' : ''}
                      {num((i % 2 === 0 ? 1 : -1) * (0.2 + i * 0.15), 2)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : tab === 'Tin tức' ? (
            <div className="nav-list">
              {NEWS.filter((n) => n.tickers.some((t) => t.symbol === st.symbol) || slug(n.source).includes(slug(st.symbol)))
                .concat(NEWS.slice(0, 4))
                .slice(0, 6)
                .map((n) => (
                  <div className="nav-list-row" key={n.id} onClick={() => onNavigate('news')}>
                    <span className="num" style={{ fontSize: 10, color: 'var(--tx-dim)', flexShrink: 0, width: 34 }}>
                      {n.time}
                    </span>
                    <span className="grow clamp-2">{n.title}</span>
                    <Badge tone={n.catTone as never}>{n.cat}</Badge>
                  </div>
                ))}
            </div>
          ) : tab === 'Luận điểm' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div className="callout">
                <div className="callout-title"><span>◆</span> Luận điểm đầu tư</div>
                <p>
                  {st.name} ({st.symbol}) hoạt động trong ngành {st.sector} với vốn hoá {num(st.marketCap, 0)} tỷ VND.
                  {st.roe >= 18
                    ? ` Doanh nghiệp duy trì ROE cao ${num(st.roe, 1)}% — thuộc nhóm dẫn đầu ngành về hiệu quả sử dụng vốn.`
                    : ` ROE hiện ở mức ${num(st.roe, 1)}%.`}
                </p>
              </div>
              <div>
                <div className="mini-label" style={{ marginBottom: 7 }}>CHẤT XÚC TÁC THEO DÕI</div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    `Tăng trưởng LNST duy trì trên ${Math.max(10, Math.round(st.epsGrowth * 0.8))}%/năm`,
                    `Biên lợi nhuận gộp cải thiện`,
                    `Dòng tiền hoạt động dương và ổn định`,
                    `Kế hoạch mở rộng thị phần trong ngành ${st.sector}`,
                  ].map((t) => (
                    <li key={t} style={{ display: 'flex', gap: 8, fontSize: 11.5, color: 'var(--tx-mid)' }}>
                      <span className="gold" style={{ flexShrink: 0 }}>◆</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <div className="mini-label" style={{ marginBottom: 7 }}>RỦI RO CHÍNH</div>
                <ul style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
                  {[
                    `Biến động của ngành ${st.sector} ảnh hưởng trực tiếp đến kết quả kinh doanh`,
                    st.de > 1 ? `Đòn bẩy tài chính cao (Nợ/VCSH ${num(st.de, 2)})` : `Áp lực cạnh tranh từ các doanh nghiệp cùng ngành`,
                    'Rủi ro thanh khoản thị trường chung',
                  ].map((t) => (
                    <li key={t} style={{ display: 'flex', gap: 8, fontSize: 11.5, color: 'var(--tx-mid)' }}>
                      <span className="down" style={{ flexShrink: 0 }}>⚠</span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
              <button className="btn gold" onClick={() => onNavigate('thesis')}>
                Tạo thesis theo dõi {st.symbol} <IconArrowRight size={13} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <p style={{ fontSize: 12, color: 'var(--tx-mid)', lineHeight: 1.7 }}>
                <strong style={{ color: 'var(--tx-hi)' }}>{st.name}</strong> ({st.symbol}) niêm yết trên sàn {st.exchange},
                hoạt động trong ngành {st.sector}. Vốn hoá hiện tại {num(st.marketCap, 0)} tỷ VND, khối lượng giao dịch
                bình quân {num(st.volume / 1e6, 1)} triệu cổ phiếu/phiên.
              </p>
              <div className="ohlc c3">
                <div className="ohlc-item">
                  <div className="ohlc-label">ROE</div>
                  <div className="ohlc-value up">{num(st.roe, 1)}%</div>
                </div>
                <div className="ohlc-item">
                  <div className="ohlc-label">Tăng trưởng LNST</div>
                  <div className={`ohlc-value ${dirClass(st.epsGrowth)}`}>{num(st.epsGrowth, 1)}%</div>
                </div>
                <div className="ohlc-item">
                  <div className="ohlc-label">Cổ tức</div>
                  <div className="ohlc-value">{st.dividendYield ? `${num(st.dividendYield, 1)}%` : '—'}</div>
                </div>
              </div>
              <div className="callout">
                <div className="callout-title"><IconLightning size={13} /> Điểm đáng chú ý</div>
                <p>
                  {st.roe >= 20 && st.epsGrowth >= 15
                    ? 'Doanh nghiệp thuộc nhóm tăng trưởng chất lượng cao: ROE vượt trội và tăng trưởng lợi nhuận hai chữ số.'
                    : st.pe > 0 && st.pe < 10
                      ? 'Định giá đang ở vùng hấp dẫn so với lịch sử và trung bình ngành.'
                      : 'Cần theo dõi thêm diễn biến kết quả kinh doanh các quý tới để xác nhận xu hướng.'}
                </p>
              </div>
              <button className="btn gold-ghost" onClick={() => onNavigate('report')}>
                Xem báo cáo phân tích đầy đủ <IconArrowRight size={13} />
              </button>
            </div>
          )}
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Cổ phiếu cùng ngành" action={<Chip onClick={() => onNavigate('screener')}>Sàng lọc</Chip>}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {peers.map((p) => (
                <button
                  key={p.symbol}
                  className="row-between gap-10"
                  style={{ background: 'none', padding: '8px 0', borderBottom: '1px solid var(--line-soft)', cursor: 'pointer', width: '100%' }}
                  onClick={() => onNavigate('stock', p.symbol)}
                >
                  <span className="row gap-9" style={{ minWidth: 0, gap: 9 }}>
                    <span className="ticker-cell">{p.symbol}</span>
                    <span className="truncate co-name" style={{ maxWidth: 108 }}>{p.name}</span>
                  </span>
                  <span className="row gap-10" style={{ flexShrink: 0 }}>
                    <span className="num" style={{ fontSize: 11.5, color: 'var(--tx-hi)', fontWeight: 550 }}>
                      {num(p.price, 0)}
                    </span>
                    <span className={`num ${dirClass(p.changePct)}`} style={{ fontSize: 11, fontWeight: 600, width: 48, textAlign: 'right' }}>
                      {p.changePct > 0 ? '+' : ''}
                      {num(p.changePct, 2)}%
                    </span>
                  </span>
                </button>
              ))}
              {peers.length === 0 && (
                <div className="dim" style={{ fontSize: 11, padding: '10px 0' }}>
                  Không có cổ phiếu cùng ngành trong dữ liệu.
                </div>
              )}
            </div>
          </Card>

          <Card title="Vị thế trong danh mục" action={<Chip onClick={() => onNavigate('portfolio')}>Danh mục</Chip>}>
            <div className="ohlc c2">
              <div className="ohlc-item">
                <div className="ohlc-label">Đang nắm giữ</div>
                <div className="ohlc-value">1.000 CP</div>
              </div>
              <div className="ohlc-item">
                <div className="ohlc-label">Tỷ trọng</div>
                <div className="ohlc-value gold">{num(st.symbol === 'FPT' ? 20.2 : 4.8, 1)}%</div>
              </div>
              <div className="ohlc-item">
                <div className="ohlc-label">Giá vốn</div>
                <div className="ohlc-value">{num(st.price * 0.82, 0)}</div>
              </div>
              <div className="ohlc-item">
                <div className="ohlc-label">Lãi/Lỗ</div>
                <div className="ohlc-value up">+{num(21.8, 1)}%</div>
              </div>
            </div>
            <div style={{ marginTop: 12 }}>
              <Donut
                data={[
                  { name: st.symbol, value: 20.2, color: '#d4af37' },
                  { name: 'Còn lại', value: 79.8, color: '#242424' },
                ]}
                size={104}
                thickness={12}
                legend={false}
                center={
                  <>
                    <div className="donut-center-value" style={{ fontSize: 16 }}>20,2%</div>
                    <div className="donut-center-label">danh mục</div>
                  </>
                }
              />
            </div>
          </Card>

          <Card title="Dòng tiền gần đây">
            <BarChart
              data={[12, -8, 24, 16, -4, 32, 18, -6, 26, 20]}
              labels={['', '', '', '', '', '', '', '', '', '']}
              height={120}
              diverging
              fmt={(v) => num(v, 0)}
              yTicks={3}
            />
            <div className="row-between" style={{ marginTop: 8 }}>
              <span className="mini-label">Khối ngoại ròng</span>
              <span className={`num ${dirClass(st.foreignNet)}`} style={{ fontWeight: 650 }}>
                {st.foreignNet > 0 ? '+' : ''}
                {num(st.foreignNet, 0)} tỷ
              </span>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="row gap-10" style={{ flexWrap: 'wrap' }}>
          <Chip onClick={() => onNavigate('screener')}>Sàng lọc cổ phiếu</Chip>
          <Chip onClick={() => onNavigate('sector')}>Ngành {st.sector}</Chip>
          <Chip onClick={() => onNavigate('thesis')}>Theo dõi Thesis</Chip>
          <span className="dim" style={{ fontSize: 10.5 }}>
            Giá trị danh mục tham chiếu: {vnd(st.price * 1000)} VND
          </span>
        </div>
      </div>
    </>
  )
}

export { Sparkline }