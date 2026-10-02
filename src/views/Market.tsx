/* ==========================================================================
   TRANG THỊ TRƯỜNG
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import { AreaChart, BarChart, Donut, Sparkline } from '../components/charts'
import { Art } from '../components/Art'
import { IconArrowRight, IconExternal } from '../components/icons'
import { Badge, Card, Chip, Segmented, Tabs } from '../components/ui'
import {
  BREADTH, CAP_GROUPS, COMMODITIES, CURRENCIES, EVENTS, FOREIGN, GAINERS, INDICES,
  INTRADAY_LABELS, LIQUIDITY, LOSERS, PROP, SECTORS, SESSIONS, WORLD,
  intraday, intradayVolume,
} from '../data/market'
import { dirClass, num, numVi, ty } from '../lib/format'
import { heatLevel } from '../data/market'

const TABS = ['Tổng quan', 'Chỉ số', 'Thanh khoản', 'Khối ngoại', 'Độ rộng', 'Biểu đồ kỹ thuật', 'Lịch sử'] as const
type Tab = (typeof TABS)[number]
const EX = ['HOSE', 'HNX', 'UPCOM'] as const

/** Bản đồ nhiệt trang Thị trường: thứ tự + giá trị theo REF market (khác bảng SECTORS) */
const HEAT_FIRST = [
  'Ngân hàng', 'Chứng khoán', 'Bất động sản', 'Thép', 'Công nghệ', 'Bán lẻ',
  'Hàng tiêu dùng', 'Dầu khí', 'Hóa chất', 'Điện nước', 'Xây dựng', 'Vận tải',
]
const HEAT_PCT: Record<string, number> = {
  'Bất động sản': -0.62,
  'Thép': 1.12,
  'Bán lẻ': 0.76,
  'Dầu khí': 1.21,
}
const HEAT_CELLS = [
  ...HEAT_FIRST.map((name) => ({
    name: name === 'Điện nước' ? 'Điện, nước' : name,
    pct: HEAT_PCT[name] ?? SECTORS.find((s) => s.name === name)?.pct ?? 0,
  })),
  ...SECTORS.filter((s) => !HEAT_FIRST.includes(s.name)).map((s) => ({ name: s.name, pct: s.pct })),
]

/** Nhãn trục X của biểu đồ dòng tiền (20 phiên: 15/09 → 22/09) */
const FLOW_LABELS = ['15/09', '', '', '', '16/09', '', '', '', '17/09', '', '', '', '18/09', '', '', '', '19/09', '', '', '22/09']

export function Market({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Tổng quan')
  const [topTab, setTopTab] = useState<(typeof EX)[number]>('HOSE')
  const [breadthEx, setBreadthEx] = useState<(typeof EX)[number]>('HOSE')
  const [flowPeriod, setFlowPeriod] = useState<'Theo ngày' | 'Theo tuần' | 'Theo tháng'>('Theo ngày')
  const [heatMode, setHeatMode] = useState<'Hiệu suất %' | 'Vốn hóa'>('Hiệu suất %')
  const [heatEx, setHeatEx] = useState<'Tất cả' | typeof EX[number]>('Tất cả')
  const [idxRange, setIdxRange] = useState('1D')

  const vn = INDICES[0]
  const intradayData = intraday(vn.seed, vn.changePct, vn.ref, 45)
  const vol = intradayVolume(vn.seed, 45)
  const labels = Array.from({ length: 45 }, (_, i) => INTRADAY_LABELS[Math.round((i / 44) * 10)])

  const breadthTotal = BREADTH.up + BREADTH.down + BREADTH.flat

  return (
    <>
      <div className="grid" style={{ alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
      </div>

      {/* ---------- HÀNG 1: VN-INDEX LỚN (trái) · 4 CHỈ SỐ PHỤ + ĐỘ RỘNG & THANH KHOẢN (phải) ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1.45fr) minmax(0, 1.25fr)', gap: 12, alignItems: 'stretch' }}>
        {/* Cột trái: VN-Index lớn */}
        <Card padded style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="row-between" style={{ marginBottom: 10 }}>
            <div className="row gap-8" style={{ alignItems: 'baseline' }}>
              <h2 className="card-title" style={{ fontSize: 16 }}>{vn.code}</h2>
              <span className="stat-value" style={{ fontSize: 22, fontWeight: 700, color: 'var(--tx-hi)', marginLeft: 8 }}>
                {num(vn.value, 2)}
              </span>
              <span className={`stat-delta ${dirClass(vn.changePct)}`} style={{ fontSize: 13, fontWeight: 600, marginLeft: 6 }}>
                +{num(vn.change, 2)} (+{num(vn.changePct, 2)}%)
              </span>
            </div>
            <div className="row gap-8">
              <Segmented options={['1D', '1W', '1M', '3M', '1Y', '5Y']} value={idxRange} onChange={setIdxRange} />
              <button className="icon-btn" aria-label="Mở rộng">
                <IconExternal size={14} />
              </button>
            </div>
          </div>

          <div className="ohlc c5" style={{ marginBottom: 10 }}>
            <div className="ohlc-item">
              <div className="ohlc-label">Mở cửa</div>
              <div className="ohlc-value">{num(vn.open, 2)}</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Cao nhất</div>
              <div className="ohlc-value up">{num(vn.high, 2)}</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Thấp nhất</div>
              <div className="ohlc-value">{num(vn.low, 2)}</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Khối lượng</div>
              <div className="ohlc-value">{num(vn.volume / 1e6, 1)} triệu</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Giá trị</div>
              <div className="ohlc-value">{ty(vn.turnover)}</div>
            </div>
          </div>

          <div style={{ flex: 1, minHeight: 185 }}>
            <AreaChart
              series={[{ id: 'vn', name: 'VN-INDEX', data: intradayData, color: '#22c576' }]}
              labels={labels}
              height={195}
              volume={vol}
              fmt={(v) => num(v, 0)}
              xTicks={6}
              yTicks={5}
              yMin={1225}
              yMax={1250}
              endTag={num(vn.value, 2)}
              smooth={false}
            />
          </div>
        </Card>

        {/* Cột phải: 4 mini index cards + Độ rộng & Thanh khoản */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {/* 4 mini index cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: 8 }}>
            {INDICES.slice(0, 4).map((ix) => {
              const showDelta = ix.code !== 'VN-INDEX'
              return (
                <button className="stat" key={ix.code} onClick={() => onNavigate('market')} style={{ textAlign: 'left', padding: '8px 10px' }}>
                  <div className="stat-label" style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>
                    {ix.code}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 4, marginTop: 2 }}>
                    <span style={{ minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 4, flexWrap: 'nowrap' }}>
                      <span className="stat-value" style={{ fontSize: 13, fontWeight: 700 }}>{num(ix.value, 2)}</span>
                      {showDelta && (
                        <span className={`stat-delta ${dirClass(ix.changePct)}`} style={{ fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap' }}>
                          {ix.change > 0 ? '+' : ''}{num(ix.change, 2)} ({ix.changePct > 0 ? '+' : ''}{num(ix.changePct, 2)}%)
                        </span>
                      )}
                    </span>
                    <span className="stat-spark" style={{ flex: '0 0 auto', width: 42 }}>
                      <Sparkline
                        data={Array.from({ length: 24 }, (_, i) => ix.ref + (ix.value - ix.ref) * Math.pow(i / 23, 0.7) + Math.sin(i / 2.8) * (ix.value * 0.0009))}
                        height={26}
                        color={ix.changePct >= 0 ? undefined : '#e5484d'}
                      />
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {/* 2 cards: Độ rộng thị trường + Thanh khoản thị trường */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flex: 1 }}>
            <Card
              title="Độ rộng thị trường"
              action={<Tabs tabs={EX} value={breadthEx} onChange={setBreadthEx} />}
            >
              <Donut
                data={[
                  { name: 'Tăng giá', value: BREADTH.up, color: '#22c576' },
                  { name: 'Giảm giá', value: BREADTH.down, color: '#e5484d' },
                  { name: 'Đứng giá', value: BREADTH.flat, color: '#d4af37' },
                ]}
                size={110}
                thickness={20}
                center={
                  <>
                    <div className="donut-center-value" style={{ fontSize: 17 }}>{breadthTotal}</div>
                    <div className="donut-center-label" style={{ fontSize: 9.5 }}>mã</div>
                  </>
                }
                legendFmt={(v) => `${v} (${Math.round((v / breadthTotal) * 1000) / 10}%)`}
              />
            </Card>

            <Card title="Thanh khoản thị trường" action={<span className="card-link" style={{ fontSize: 10.5 }}>Xem chi tiết →</span>}>
              <div className="stat-value" style={{ fontSize: 16, fontWeight: 700, color: 'var(--tx-hi)', marginBottom: 4 }}>
                {ty(LIQUIDITY.turnover)}
                <span className="stat-delta up" style={{ fontSize: 11, marginLeft: 6 }}>
                  +{num(LIQUIDITY.turnoverPct, 1)}%
                </span>
              </div>
              <BarChart
                data={[14.2, 13.6, 15.8, 12.4, 16.2, 17.1, 15.2, 18.4, 16.8, 19.2, 17.4, 18.5]}
                labels={['', '', '', '', '', '', '', '', '', '', '', '']}
                height={70}
                fmt={(v) => `${num(v, 0)}k`}
                diverging
                yTicks={2}
              />
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  gap: 2,
                  marginTop: 6,
                  fontSize: 10,
                  color: 'var(--tx-dim)',
                }}
              >
                <span>Khối lượng</span>
                <span className="num" style={{ color: 'var(--tx-hi)', textAlign: 'right' }}>
                  {num(LIQUIDITY.volume / 1e6, 1)} triệu CP{' '}
                  <span className="up" style={{ fontWeight: 600 }}>+{num(LIQUIDITY.volumePct, 1)}%</span>
                </span>
                <span>GTGD TB 20 phiên</span>
                <span className="num" style={{ color: 'var(--tx-hi)', textAlign: 'right' }}>{ty(LIQUIDITY.avg20)}</span>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* ---------- HÀNG 2: BẢN ĐỒ NHIỆT THEO NGÀNH · TOP TĂNG GIÁ · TOP GIẢM GIÁ ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1.4fr) minmax(0, 1fr) minmax(0, 1fr)', gap: 12 }}>
        <Card
          title="Bản đồ nhiệt theo ngành"
          action={
            <div className="row gap-8">
              <Tabs tabs={['Tất cả', ...EX]} value={heatEx} onChange={setHeatEx} />
              <Segmented options={['Hiệu suất %', 'Vốn hóa']} value={heatMode} onChange={setHeatMode} />
            </div>
          }
        >
          <div className="heatmap" style={{ gridTemplateColumns: 'repeat(6, minmax(0, 1fr))', gap: 6 }}>
            {HEAT_CELLS.slice(0, 18).map((s) => (
              <button
                key={s.name}
                className={`heat-cell ${heatLevel(s.pct)}`}
                onClick={() => onNavigate('sector')}
                style={{ minHeight: 48, padding: '5px 6px', textAlign: 'left' }}
              >
                <span
                  className="hc-name"
                  style={{ fontSize: 9.5, display: 'block', lineHeight: 1.2, wordBreak: 'break-word' }}
                >
                  {s.name}
                </span>
                <span className="hc-pct" style={{ fontSize: 11, fontWeight: 700 }}>
                  {s.pct > 0 ? '+' : ''}
                  {num(s.pct, 2)}%
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card
          title="Top tăng giá"
          action={
            <div className="row gap-8">
              <Tabs tabs={EX} value={topTab} onChange={setTopTab} />
              <button className="card-link" onClick={() => onNavigate('screener')}>
                Xem thêm <IconArrowRight size={12} />
              </button>
            </div>
          }
        >
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: 22 }}>#</th>
                <th className="l">Mã</th>
                <th>Giá</th>
                <th>+/-</th>
                <th>%</th>
                <th>KLGD</th>
              </tr>
            </thead>
            <tbody>
              {GAINERS.slice(0, 5).map((s, i) => (
                <tr key={s.symbol} className="clickable" onClick={() => onNavigate('stock', s.symbol)}>
                  <td className="idx num">{i + 1}</td>
                  <td className="l ticker-cell">{s.symbol}</td>
                  <td className="num">{numVi(s.price / 1000, 2)}</td>
                  <td className="num up">+{numVi(s.change / 1000, 2)}</td>
                  <td className="num up" style={{ fontWeight: 600 }}>+{numVi(s.changePct, 2)}%</td>
                  <td className="num">{num(s.volume / 1e6, 1)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card
          title="Top giảm giá"
          action={
            <div className="row gap-8">
              <Tabs tabs={EX} value={topTab} onChange={setTopTab} />
              <button className="card-link" onClick={() => onNavigate('screener')}>
                Xem thêm <IconArrowRight size={12} />
              </button>
            </div>
          }
        >
          <table className="data">
            <thead>
              <tr>
                <th style={{ width: 22 }}>#</th>
                <th className="l">Mã</th>
                <th>Giá</th>
                <th>+/-</th>
                <th>%</th>
                <th>KLGD</th>
              </tr>
            </thead>
            <tbody>
              {LOSERS.slice(0, 5).map((s, i) => (
                <tr key={s.symbol} className="clickable" onClick={() => onNavigate('stock', s.symbol)}>
                  <td className="idx num">{i + 1}</td>
                  <td className="l ticker-cell">{s.symbol}</td>
                  <td className="num">{numVi(s.price / 1000, 2)}</td>
                  <td className="num down">{s.change < 0 ? '−' : ''}{numVi(Math.abs(s.change) / 1000, 2)}</td>
                  <td className="num down" style={{ fontWeight: 600 }}>{numVi(s.changePct, 2)}%</td>
                  <td className="num">{num(s.volume / 1e6, 1)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      {/* ---------- HÀNG 3: KHỐI NGOẠI · TỰ DOANH · THẾ GIỚI · CARD TRIẾT LÝ ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr) 265px', gap: 12 }}>
        <Card
          title="Khối ngoại"
          action={<span className="card-link">Xem chi tiết →</span>}
        >
          <div className="row-between" style={{ marginBottom: 8 }}>
            <Tabs tabs={EX} value={topTab} onChange={setTopTab} />
            <Segmented options={['Theo ngày', 'Theo tuần', 'Theo tháng']} value={flowPeriod} onChange={setFlowPeriod} />
          </div>
          <div className="ohlc c2" style={{ marginBottom: 6 }}>
            <div className="ohlc-item">
              <div className="ohlc-label">Giá trị mua</div>
              <div className="ohlc-value up" style={{ fontSize: 14 }}>{num(FOREIGN.buy, 0)} tỷ</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Giá trị ròng</div>
              <div className="ohlc-value down" style={{ fontSize: 14 }}>+{num(FOREIGN.net, 0)} tỷ</div>
            </div>
          </div>
          <BarChart
            data={FOREIGN.series}
            labels={FLOW_LABELS}
            height={90}
            diverging
            fmt={(v) => num(v, 0)}
            yTicks={2}
            yMin={-2000}
            yMax={2000}
          />
        </Card>

        <Card
          title="Tự doanh"
          action={<span className="card-link">Xem chi tiết →</span>}
        >
          <div className="row-between" style={{ marginBottom: 8 }}>
            <Tabs tabs={EX} value={topTab} onChange={setTopTab} />
            <Segmented options={['Theo ngày', 'Theo tuần', 'Theo tháng']} value={flowPeriod} onChange={setFlowPeriod} />
          </div>
          <div className="ohlc c3" style={{ marginBottom: 6 }}>
            <div className="ohlc-item">
              <div className="ohlc-label">Giá trị mua</div>
              <div className="ohlc-value up" style={{ fontSize: 14 }}>{num(PROP.buy, 0)} tỷ</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">Giá trị bán</div>
              <div className="ohlc-value down" style={{ fontSize: 14 }}>{num(PROP.sell, 0)} tỷ</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-label">&nbsp;</div>
              <div className="ohlc-value up" style={{ fontSize: 14 }}>+{num(PROP.net, 0)} tỷ</div>
            </div>
          </div>
          <BarChart
            data={PROP.series}
            labels={FLOW_LABELS}
            height={90}
            diverging
            fmt={(v) => num(v, 0)}
            yTicks={2}
            yMin={-2000}
            yMax={2000}
          />
        </Card>

        <Card title="Diễn biến thế giới" action={<span className="card-link">Xem thêm <IconArrowRight size={12} /></span>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
            {WORLD.slice(0, 5).map((w) => (
              <div className="row-between gap-8" key={w.name}>
                <span className="row gap-6" style={{ minWidth: 0 }}>
                  <span style={{ fontSize: 13 }}>{w.flag}</span>
                  <span style={{ fontSize: 11, color: 'var(--tx)' }}>{w.name}</span>
                </span>
                <span className="row gap-8">
                  <span className="num" style={{ fontSize: 11, color: 'var(--tx-hi)', fontWeight: 550 }}>
                    {num(w.value, 2)}
                  </span>
                  <span className={`num ${dirClass(w.changePct)}`} style={{ fontSize: 10.5, fontWeight: 600, width: 48, textAlign: 'right' }}>
                    {w.changePct > 0 ? '+' : ''}
                    {num(w.changePct, 2)}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </Card>

        {/* Card Triết lý Dữ liệu hôm nay kiến tạo cơ hội ngày mai */}
        <div
          style={{
            borderRadius: 10,
            overflow: 'hidden',
            border: '1px solid var(--line-gold)',
            backgroundImage: "url('/asset/art/quote_market.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: 180,
          }}
        />
      </div>

      {/* ---------- Lịch sử phiên + sự kiện ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.6fr) minmax(0,1fr)' }}>
        <Card title="Lịch sử phiên giao dịch" action={<span className="card-link">10 phiên gần nhất</span>}>
          <table className="data">
            <thead>
              <tr>
                <th className="l">Ngày</th>
                <th>VN-Index</th>
                <th>HNX-Index</th>
                <th>UPCoM</th>
                <th>GTGD (tỷ)</th>
                <th className="l" style={{ width: 90 }}>Diễn biến</th>
              </tr>
            </thead>
            <tbody>
              {SESSIONS.map((s) => (
                <tr key={s.date}>
                  <td className="l num">{s.date}</td>
                  <td className={`num ${dirClass(s.vn)}`} style={{ fontWeight: 600 }}>
                    {s.vn > 0 ? '+' : ''}
                    {num(s.vn, 2)}%
                  </td>
                  <td className={`num ${dirClass(s.hnx)}`}>{s.hnx > 0 ? '+' : ''}{num(s.hnx, 2)}%</td>
                  <td className={`num ${dirClass(s.upcom)}`}>{s.upcom > 0 ? '+' : ''}{num(s.upcom, 2)}%</td>
                  <td className="num">{num(s.turnover, 0)}</td>
                  <td className="l">
                    <span style={{ display: 'inline-block', width: 66 }}>
                      <Sparkline
                        data={[s.vn * 0.4, s.vn * 0.8, s.vn * 0.5, s.vn, s.vn * 1.1, s.vn * 0.95]}
                        height={20}
                        fill={false}
                        color={s.vn > 0 ? '#22c576' : '#e5484d'}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card
          title="Sự kiện sắp diễn ra"
          action={
            <button className="card-link" onClick={() => onNavigate('news')}>
              Xem tất cả <IconArrowRight size={12} />
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {EVENTS.slice(0, 6).map((e, i) => (
              <div
                key={i}
                className="row gap-12"
                style={{ padding: '9px 0', borderBottom: i < 5 ? '1px solid var(--line-soft)' : 'none' }}
              >
                <div style={{ textAlign: 'center', width: 34, flexShrink: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 650, color: 'var(--tx-hi)', lineHeight: 1.1 }} className="num">
                    {e.day}
                  </div>
                  <div style={{ fontSize: 9.5, color: 'var(--tx-dim)' }}>{e.month}</div>
                </div>
                <div className="grow">
                  <div style={{ fontSize: 11.5, color: 'var(--tx)', lineHeight: 1.4 }}>{e.title}</div>
                  <div className="row gap-6" style={{ marginTop: 4, flexWrap: 'wrap' }}>
                    <span className="num" style={{ fontSize: 10, color: 'var(--tx-dim)' }}>{e.time}</span>
                    <Badge tone={e.source === 'Vĩ mô' ? 'violet' : e.source === 'Doanh nghiệp' ? 'blue' : e.source === 'Thị trường' ? 'teal' : 'orange'}>
                      {e.source}
                    </Badge>
                    <span style={{ fontSize: 10, color: e.impact === 'Cao' ? 'var(--down-200)' : 'var(--tx-dim)' }}>
                      {e.impact === 'Cao' ? '⚡' : ''} Ảnh hưởng {e.impact.toLowerCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="row gap-12" style={{ flexWrap: 'wrap' }}>
          <Chip onClick={() => onNavigate('screener')}>Sàng lọc cổ phiếu</Chip>
          <Chip onClick={() => onNavigate('sector')}>Phân tích ngành</Chip>
          <Chip onClick={() => onNavigate('scenario')}>Kịch bản & Stress test</Chip>
          <Chip onClick={() => onNavigate('report')}>Báo cáo thị trường</Chip>
        </div>
      </div>
    </>
  )
}