/* ==========================================================================
   TRANG TỔNG QUAN
   ========================================================================== */

import { useState, useMemo } from 'react'
import type { PageKey } from '../app/nav'
import { AreaChart, BarChart, Donut, MiniBars, Sparkline } from '../components/charts'
import { Art } from '../components/Art'
import {
  IconArrowRight, IconIdea, IconLightning, IconReport, IconSend, IconTrendUp,
} from '../components/icons'
import { Badge, Card, Chip, Segmented, Stat, Tabs, Trend } from '../components/ui'
import { OVERVIEW_NEWS, TODAY_IDEAS, TODAY_REPORTS, TODAY_THEMES } from '../data/content'
import { AI_QUESTIONS, ALLOC_ASSET, ALLOC_SECTOR, ALLOC_STRATEGY, PORTFOLIO, benchmarkSeries, portfolioSeries } from '../data/portfolio'
import { FOREIGN, INDICES, INTRADAY_LABELS, LIQUIDITY, SECTORS, intraday, intradayVolume, type RangeKey } from '../data/market'
import { compactVnd, dirClass, num, ty } from '../lib/format'

const RANGE: RangeKey[] = ['1M', '3M', '6M', '1Y', 'ALL']

/** 8 nhóm ngành theo mẫu thiết kế */
const FLOW_SECTORS = [
  { name: 'Ngân hàng', net: 342 },
  { name: 'Chứng khoán', net: 286 },
  { name: 'Công nghệ', net: 156 },
  { name: 'Bán lẻ', net: 98 },
  { name: 'Thép', net: 76 },
  { name: 'Dầu khí', net: -32 },
  { name: 'Bất động sản', net: -45 },
  { name: 'Hàng tiêu dùng', net: -62 },
]

export function Overview({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [idxTab, setIdxTab] = useState('VN-Index')
  const [flowTab, setFlowTab] = useState<'Giá trị mua ròng' | '% Thay đổi' | 'Thanh khoản'>('Giá trị mua ròng')
  const [mixTab, setMixTab] = useState<'Theo ngành' | 'Theo chiến lược' | 'Theo tài sản'>('Theo ngành')
  const [range, setRange] = useState<RangeKey>('1Y')
  const [ask, setAsk] = useState('')

  const active = INDICES.find((i) => i.code.toUpperCase().startsWith(idxTab.replace('NNX', 'HNX'))) ?? INDICES[0]
  const intradayPts = intraday('vnindex', active.changePct, active.ref, 45)
  const volPts = intradayVolume('vnindex', 45)
  const labels = Array.from({ length: 45 }, (_, i) => INTRADAY_LABELS[Math.min(INTRADAY_LABELS.length - 1, Math.floor((i / 44) * 10))])

  const flowRows = FLOW_SECTORS.map((s) => {
    const src = SECTORS.find((x) => x.name === s.name)
    return {
      ...s,
      value:
        flowTab === 'Giá trị mua ròng'
          ? s.net
          : flowTab === '% Thay đổi'
            ? (src?.pct ?? 0)
            : (src?.turnover ?? 0),
    }
  })

  const flowMax = Math.max(...flowRows.map((r) => Math.abs(r.value)))

  const mixData = useMemo(() => {
    if (mixTab === 'Theo ngành') return ALLOC_SECTOR
    if (mixTab === 'Theo chiến lược') return ALLOC_STRATEGY
    return ALLOC_ASSET
  }, [mixTab])

  return (
    <>
      {/* ---------- Hàng 1: chỉ số + trạng thái thị trường ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr)) 340px' }}>
        {INDICES.slice(0, 4).map((ix) => (
          <button
            key={ix.code}
            className="stat"
            onClick={() => onNavigate('market')}
            style={{ textAlign: 'left', cursor: 'pointer' }}
          >
            <div className="stat-label">{ix.code}</div>
            <div className="stat-value">
              <span>{num(ix.value, 2)}</span>
              <span className={`stat-delta ${dirClass(ix.changePct)}`}>
                {ix.change > 0 ? '+' : ''}
                {num(ix.change, 2)} ({ix.changePct > 0 ? '+' : ''}
                {num(ix.changePct, 2)}%)
              </span>
            </div>
            <div className="stat-spark">
              <Sparkline data={intraday(ix.seed, ix.changePct, ix.ref, 40)} height={26} />
            </div>
          </button>
        ))}

        <div className="card gold" style={{ justifyContent: 'center' }}>
          <div className="row gap-12">
            <span
              style={{
                width: 44,
                height: 44,
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                background: 'radial-gradient(circle at 30% 30%, rgba(34,197,118,0.3), rgba(34,197,118,0.06))',
                border: '1px solid rgba(34,197,118,0.35)',
                color: 'var(--up)',
                flexShrink: 0,
              }}
            >
              <IconTrendUp size={20} />
            </span>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 10.5, color: 'var(--tx-mid)', letterSpacing: '0.04em' }}>
                Thị trường hôm nay
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  color: 'var(--up)',
                  margin: '0 0 2px',
                }}
              >
                TÍCH CỰC
              </div>
              <div style={{ fontSize: 10.5, color: 'var(--tx-mid)', lineHeight: 1.35 }}>
                Thanh khoản cải thiện, dòng tiền lan toả sang nhóm ngân hàng và chứng khoán.
              </div>
            </div>
            <button className="icon-btn" onClick={() => onNavigate('market')} aria-label="Xem thị trường">
              <IconArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* ---------- Hàng 2: biến động · dòng tiền · tin nổi bật ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.55fr) minmax(0,1fr) 330px' }}>
        <Card title="Biến động thị trường">
          <div className="row-between gap-12" style={{ marginBottom: 10, flexWrap: 'wrap' }}>
            <Tabs tabs={['VN-Index', 'VN30', 'HNX', 'UPCOM']} value={idxTab} onChange={setIdxTab} />
            <Segmented options={['1D', '1W', '1M', '3M', '1Y', '5Y']} value="1D" onChange={() => {}} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 146px', gap: 14, alignItems: 'stretch' }}>
            <div>
              <div className="stat-value stat-hero" style={{ color: 'var(--tx-hi)', marginBottom: 6, fontSize: 24, fontWeight: 700 }}>
                {num(active.value, 2)}
                <span className={`stat-delta ${dirClass(active.changePct)}`} style={{ fontSize: 13, marginLeft: 8, fontWeight: 600 }}>
                  {active.change > 0 ? '+' : ''}
                  {num(active.change, 2)} ({active.changePct > 0 ? '+' : ''}
                  {num(active.changePct, 2)}%)
                </span>
              </div>
              <AreaChart
                series={[{ id: 'ix', name: active.code, data: intradayPts, color: '#22c576' }]}
                labels={labels}
                height={104}
                volume={volPts}
                fmt={(v) => num(v, 1)}
                xTicks={6}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', paddingLeft: 12, borderLeft: '1px solid var(--line-soft)', paddingBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, color: 'var(--tx-dim)', marginBottom: 3 }}>Thanh khoản</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--tx-hi)', whiteSpace: 'nowrap' }}>
                  {ty(LIQUIDITY.turnover)}{' '}
                  <span className="up" style={{ fontSize: 11, fontWeight: 600 }}>
                    +{num(LIQUIDITY.turnoverPct, 1)}%
                  </span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--tx-dim)', marginBottom: 3 }}>Khối ngoại</div>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--up)', whiteSpace: 'nowrap' }}>
                  +{num(LIQUIDITY.netFlow, 0)} tỷ{' '}
                  <span style={{ fontSize: 10, color: 'var(--up)', fontWeight: 500 }}>Mua ròng</span>
                </div>
              </div>

              <div>
                <div style={{ fontSize: 10, color: 'var(--tx-dim)', marginBottom: 3 }}>Số mã tăng / giảm</div>
                <div style={{ fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
                  <span className="up">248</span> <span style={{ color: 'var(--tx-dim)', margin: '0 2px' }}>/</span>{' '}
                  <span className="down">121</span>
                </div>
                <div style={{ display: 'flex', gap: 2, marginTop: 5, width: '100%' }}>
                  <span style={{ height: 4, borderRadius: 2, background: 'var(--up)', width: '67%' }} />
                  <span style={{ height: 4, borderRadius: 2, background: 'var(--down)', width: '33%' }} />
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card
          title="Dòng tiền theo ngành"
          action={
            <button className="card-link" onClick={() => onNavigate('sector')}>
              Xem chi tiết <IconArrowRight size={12} />
            </button>
          }
        >
          <Tabs
            tabs={['Giá trị mua ròng', '% Thay đổi', 'Thanh khoản'] as const}
            value={flowTab}
            onChange={(v) => setFlowTab(v as any)}
            className=""
          />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginTop: 8 }}>
            {flowRows.map((r) => {
              const w = Math.max(2, (Math.abs(r.value) / flowMax) * 100)
              const c = r.value > 0 ? 'var(--up)' : 'var(--down)'
              return (
                <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11, lineHeight: 1.1 }}>
                  <span className="truncate" style={{ flex: 1, minWidth: 0, color: 'var(--tx-mid)' }}>
                    {r.name}
                  </span>
                  <span className="bar-track" style={{ width: 120, height: 10, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden', display: 'flex', justifyContent: 'flex-start', flexShrink: 0 }}>
                    <i style={{ width: `${w}%`, height: '100%', background: c, borderRadius: 2, display: 'block' }} />
                  </span>
                  <span className={`num ${dirClass(r.value)}`} style={{ width: 58, textAlign: 'right', flexShrink: 0, fontWeight: 600 }}>
                    {r.value > 0 ? '+' : ''}
                    {flowTab === '% Thay đổi' ? `${num(r.value, 2)}%` : `${num(r.value, 0)} tỷ`}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>

        <Card
          title="Tin nổi bật hôm nay"
          action={
            <button className="card-link" onClick={() => onNavigate('news')}>
              Xem tất cả <IconArrowRight size={12} />
            </button>
          }
        >
          <div>
            {OVERVIEW_NEWS.slice(0, 5).map((n, i) => {
              const thumbs = [
                '/asset/art/thumb_fed.png',
                '/asset/art/thumb_oil.png',
                '/asset/art/thumb_highway.png',
                '/asset/art/thumb_fpt.png',
                '/asset/art/thumb_bank.png',
              ]
              return (
                <div className="news-mini" key={i} onClick={() => onNavigate('news')}>
                  <div
                    className="news-mini-art"
                    style={{
                      backgroundImage: `url('${thumbs[i] || thumbs[0]}')`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                    }}
                  />
                  <div style={{ minWidth: 0 }}>
                    <div className="news-mini-title clamp-2">{n.title}</div>
                    <div className="news-mini-meta">
                      {n.time} · {n.cat}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      {/* ---------- Hàng 3: danh mục · phân bổ · copilot ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1.15fr) 340px' }}>
        {/* Cột 1: Danh mục của tôi */}
        <Card
          title={
            <div className="row gap-8" style={{ alignItems: 'center' }}>
              <span className="card-title" style={{ fontSize: 13, fontWeight: 600 }}>Danh mục của tôi</span>
              <span style={{ fontSize: 10, color: 'var(--tx-dim)' }}>▾</span>
              <span
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 6,
                  padding: '2px 8px',
                  fontSize: 11,
                  color: 'var(--tx-mid)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                Core Portfolio <span style={{ fontSize: 9 }}>▾</span>
              </span>
            </div>
          }
        >
          {/* Header metric 1 hàng ngang chuẩn */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
              <span style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--tx-hi)' }}>
                1,250,000,000 VND
              </span>
              <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
                <span className="up" style={{ fontSize: 12.5, fontWeight: 600 }}>+12.4%</span>
                <span style={{ fontSize: 9.5, color: 'var(--tx-dim)' }}>Lợi nhuận (YTD)</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8 }}>
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 6,
                  padding: '2px 9px',
                  textAlign: 'center',
                  minWidth: 78,
                }}
              >
                <div style={{ fontSize: 9.5, color: 'var(--tx-dim)' }}>Sharpe Ratio</div>
                <div style={{ fontSize: 13, fontWeight: 650, color: 'var(--tx-hi)', marginTop: 1 }}>0.82</div>
              </div>
              <div
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 6,
                  padding: '2px 9px',
                  textAlign: 'center',
                  minWidth: 62,
                }}
              >
                <div style={{ fontSize: 9.5, color: 'var(--tx-dim)' }}>Beta</div>
                <div style={{ fontSize: 13, fontWeight: 650, color: 'var(--tx-hi)', marginTop: 1 }}>1.18</div>
              </div>
            </div>
          </div>

          <div className="row-between" style={{ marginBottom: 4, alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 11 }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--tx-mid)' }}>
                <i style={{ width: 12, height: 2, background: '#d4af37', display: 'inline-block' }} /> Danh mục
              </span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--tx-dim)' }}>
                <i style={{ width: 12, height: 2, background: '#8b8b8b', display: 'inline-block' }} /> VN-Index
              </span>
            </div>
            <Segmented options={RANGE} value={range} onChange={(v) => setRange(v as RangeKey)} />
          </div>

          <AreaChart
            series={[
              { id: 'p', name: 'Danh mục của tôi', data: portfolioSeries(range), color: '#d4af37' },
              { id: 'b', name: 'VN-Index', data: benchmarkSeries(range), color: '#737373', dashed: true, area: false },
            ]}
            labels={rangeLabelsLocal(range)}
            height={82}
            fmt={(v) => `${num(v, 0)}%`}
            xTicks={5}
            refLine={0}
            legend={false}
          />
        </Card>

        {/* Cột 2: Phân bổ danh mục */}
        <Card
          title="Phân bổ danh mục"
          action={
            <button className="card-link" onClick={() => onNavigate('portfolio')}>
              Xem chi tiết <IconArrowRight size={12} />
            </button>
          }
        >
          {/* Tabs segmented viền vàng sang trọng */}
          <div
            style={{
              display: 'inline-flex',
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: 8,
              padding: 3,
              gap: 3,
              marginBottom: 8,
            }}
          >
            {(['Theo ngành', 'Theo chiến lược', 'Theo tài sản'] as const).map((t) => {
              const active = mixTab === t
              return (
                <button
                  key={t}
                  type="button"
                  onClick={() => setMixTab(t)}
                  style={{
                    background: active ? 'rgba(212, 175, 55, 0.16)' : 'transparent',
                    border: active ? '1px solid rgba(212, 175, 55, 0.45)' : '1px solid transparent',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: active ? 600 : 400,
                    color: active ? '#f5ecd5' : 'var(--tx-dim)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {t}
                </button>
              )
            })}
          </div>

          {/* Donut Chart + Legend 6 dòng hài hòa */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 18,
              flex: 1,
            }}
          >
            <div style={{ position: 'relative', width: 128, height: 128, flexShrink: 0 }}>
              <Donut
                data={mixData}
                size={128}
                thickness={28}
                legend={false}
                gap={0.016}
                center={
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: 17.5, fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
                      1.25B
                    </div>
                    <div style={{ fontSize: 9.5, color: '#8b8474', letterSpacing: '0.08em', marginTop: 2 }}>
                      VND
                    </div>
                  </div>
                }
              />
            </div>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
                minWidth: 0,
                height: 126,
              }}
            >
              {mixData.map((d) => (
                <div
                  key={d.name}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 11.5,
                    gap: 8,
                  }}
                >
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 7, minWidth: 0 }}>
                    <i
                      style={{
                        width: 7.5,
                        height: 7.5,
                        borderRadius: '50%',
                        background: d.color,
                        flexShrink: 0,
                        display: 'inline-block',
                      }}
                    />
                    <span className="truncate" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
                      {d.name}
                    </span>
                  </span>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.95)',
                      fontWeight: 600,
                      fontVariantNumeric: 'tabular-nums',
                      flexShrink: 0,
                    }}
                  >
                    {d.value}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Cột 3: AI KIMQUY Copilot */}
        <Card
          className="gold"
          title={
            <div className="ai-head" style={{ textTransform: 'uppercase', letterSpacing: '0.03em' }}>
              <span style={{ color: '#d4af37', fontSize: 15 }}>✦</span> AI KIMQUY Copilot
            </div>
          }
          action={
            <button
              className="icon-btn"
              onClick={() => onNavigate('copilot')}
              aria-label="Mở Copilot"
              style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}
            >
              <IconArrowRight size={13} />
            </button>
          }
        >
          <p style={{ fontSize: 11, color: 'var(--tx-mid)', marginBottom: 3, lineHeight: 1.4 }}>
            Hỏi sâu hơn. Nhận góc nhìn rõ ràng hơn.
          </p>
          <div className="ai-list" style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {AI_QUESTIONS.slice(0, 4).map((q, idx) => (
              <div
                key={q}
                onClick={() => onNavigate('copilot')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '2px 9px',
                  borderRadius: 20,
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(212, 175, 55, 0.22)',
                  fontSize: 10,
                  color: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ color: '#d4af37', fontSize: 11, flexShrink: 0 }}>
                  {idx % 2 === 0 ? '✓' : '↗'}
                </span>
                <span style={{ minWidth: 0, lineHeight: 1.3 }}>{q}</span>
              </div>
            ))}
          </div>

          <form
            className="row gap-8"
            style={{ marginTop: 6 }}
            onSubmit={(e) => {
              e.preventDefault()
              onNavigate('copilot')
            }}
          >
            <input
              className="input"
              placeholder="Đặt câu hỏi cho KIMQUY..."
              value={ask}
              onChange={(e) => setAsk(e.target.value)}
              aria-label="Câu hỏi cho KIMQUY"
              style={{ height: 26, fontSize: 11 }}
            />
            <button
              className="composer-send"
              type="submit"
              style={{
                width: 28,
                height: 28,
                marginLeft: 0,
                background: '#d4af37',
                color: '#050608',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                flexShrink: 0,
              }}
              aria-label="Gửi câu hỏi"
            >
              <IconSend size={13} />
            </button>
          </form>
        </Card>
      </div>

      {/* ---------- Hàng 4: chủ đề · ý tưởng · báo cáo · trích dẫn ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr)) 300px' }}>
        <Card
          title={
            <div className="row gap-8">
              <IconIdea size={15} style={{ color: 'var(--kg-gold)' }} />
              <h2 className="card-title">Chủ đề đáng chú ý</h2>
            </div>
          }
          action={
            <button className="icon-btn" onClick={() => onNavigate('topic')} aria-label="Xem chủ đề">
              <IconArrowRight size={15} />
            </button>
          }
        >
          <p style={{ fontSize: 11, color: 'var(--tx-mid)', marginBottom: 6 }}>
            Đón đầu xu hướng, nắm bắt cơ hội.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
            {TODAY_THEMES.map((t) => (
              <Chip key={t.symbol} onClick={() => onNavigate('topic')}>
                {t.symbol}
              </Chip>
            ))}
          </div>
        </Card>

        <Card
          title={
            <div className="row gap-8">
              <IconIdea size={15} style={{ color: 'var(--kg-gold)' }} />
              <h2 className="card-title">Ý tưởng đầu tư</h2>
            </div>
          }
          action={
            <button className="icon-btn" onClick={() => onNavigate('ideas')} aria-label="Xem ý tưởng">
              <IconArrowRight size={15} />
            </button>
          }
        >
          <p style={{ fontSize: 11, color: 'var(--tx-mid)', marginBottom: 6 }}>
            Được chọn lọc bởi AI &amp; chuyên gia.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
            {TODAY_IDEAS.map((t) => (
              <button
                key={t.symbol}
                className="chip clickable"
                onClick={() => onNavigate('stock', t.symbol)}
                style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 0, padding: '2px 8px' }}
              >
                <span className="ticker-cell gold" style={{ fontSize: 11.5 }}>
                  {t.symbol}
                </span>
                <span
                  style={{
                    fontSize: 9.5,
                    color: t.tone === 'up' ? 'var(--up)' : 'var(--kg-gold)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  {t.tone === 'up' ? '↗' : '◆'} {t.label}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card
          title={
            <div className="row gap-8">
              <IconReport size={15} style={{ color: 'var(--kg-gold)' }} />
              <h2 className="card-title">Báo cáo mới nhất</h2>
            </div>
          }
          action={
            <button className="icon-btn" onClick={() => onNavigate('report')} aria-label="Xem báo cáo">
              <IconArrowRight size={15} />
            </button>
          }
        >
          <p style={{ fontSize: 11, color: 'var(--tx-mid)', marginBottom: 6 }}>
            Insight mới tay từ đội phân tích KIMQUY.
          </p>
          <div className="nav-list">
            {TODAY_REPORTS.map((r) => (
              <div className="nav-list-row" key={r.title} onClick={() => onNavigate('report')}>
                <IconReport size={14} style={{ color: 'var(--tx-dim)', flexShrink: 0 }} />
                <span className="grow">{r.title}</span>
                <span className="num" style={{ fontSize: 10.5, color: 'var(--tx-dim)', flexShrink: 0 }}>
                  {r.date}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <div
          className="quote-block pad-0"
          style={{
            minHeight: 132,
            borderRadius: 'var(--r-md)',
            border: '1px solid var(--line-gold)',
            backgroundImage: "url('/asset/art/quote_turtle_mountain.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            overflow: 'hidden',
          }}
        />
      </div>
    </>
  )
}

/* Nhãn trục thời gian cho danh mục */
function rangeLabelsLocal(range: RangeKey): string[] {
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

export { MiniBars, Badge, BarChart, Stat, Trend, compactVnd }