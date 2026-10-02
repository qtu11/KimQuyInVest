/* ==========================================================================
   TRANG CHỦ ĐỀ ĐẦU TƯ
   ========================================================================== */

import { useMemo, useState } from 'react'
import type { PageKey } from '../app/nav'
import { AreaChart, BarList, LineMini } from '../components/charts'
import { Art } from '../components/Art'
import { IconArrowRight, IconBookmark, IconChevronLeft, IconChevronRight } from '../components/icons'
import { Badge, Card, SearchInput, Tabs } from '../components/ui'
import { TOPICS } from '../data/content'
import { performanceSeries } from '../data/market'
import { dirClass, num, slug } from '../lib/format'

const TABS = ['Tất cả chủ đề', 'Xu hướng nổi bật', 'Chủ đề dài hạn', 'Chủ đề ngắn hạn', 'Theo ngành', 'Theo giai đoạn'] as const
type Tab = (typeof TABS)[number]

const TOPIC_CARDS_IMG: Record<number, string> = {
  1: '/asset/art/topic_ai.png',
  2: '/asset/art/topic_wind.png',
  3: '/asset/art/topic_infra.png',
  4: '/asset/art/topic_mall.png',
  5: '/asset/art/topic_port.png',
  6: '/asset/art/idea_bank.png',
  7: '/asset/art/topic_infra.png',
  8: '/asset/art/topic_ai.png',
}

export function Topics({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Tất cả chủ đề')
  const [q, setQ] = useState('')
  const [sector, setSector] = useState('Tất cả ngành')
  const [phase, setPhase] = useState('Tất cả giai đoạn')
  const [sort, setSort] = useState('Hiệu suất 6T')
  const [selected, setSelected] = useState(TOPICS[0].id)
  const [detailTab, setDetailTab] = useState('Tổng quan')
  const [saved, setSaved] = useState<number[]>([1])

  const list = useMemo(() => {
    let out = TOPICS
    if (q) out = out.filter((t) => slug(t.name + t.desc).includes(slug(q)))
    if (sector !== 'Tất cả ngành') out = out.filter((t) => t.name === sector)
    const s = [...out]
    if (sort === 'Hiệu suất 6T') s.sort((a, b) => b.pct6M - a.pct6M)
    if (sort === 'Hiệu suất 3T') s.sort((a, b) => b.pct3M - a.pct3M)
    if (sort === 'Mức độ quan tâm') s.sort((a, b) => b.interest - a.interest)
    if (sort === 'Số cổ phiếu') s.sort((a, b) => b.stocks - a.stocks)
    return s
  }, [q, sector, sort])

  const cur = TOPICS.find((t) => t.id === selected) ?? TOPICS[0]
  const hot = [...TOPICS].sort((a, b) => b.pct6M - a.pct6M).slice(0, 5)

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <div style={{ width: 230 }}>
          <SearchInput value={q} onChange={setQ} placeholder="Tìm chủ đề đầu tư..." size="sm" />
        </div>
      </div>

      {/* ---------- Chủ đề nổi bật (carousel) ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <Card
          title="Chủ đề nổi bật"
          action={
            <div className="row gap-4">
              <button className="icon-btn" style={{ width: 26, height: 26 }} aria-label="Trước"><IconChevronLeft size={14} /></button>
              <button className="icon-btn" style={{ width: 26, height: 26 }} aria-label="Sau"><IconChevronRight size={14} /></button>
            </div>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, minmax(0,1fr))', gap: 11 }}>
            {hot.map((t) => (
              <button
                key={t.id}
                className="card interactive"
                style={{ padding: 0, overflow: 'hidden', textAlign: 'left' }}
                onClick={() => {
                  setSelected(t.id)
                  setDetailTab('Tổng quan')
                }}
              >
                <div
                  style={{
                    height: 88,
                    position: 'relative',
                    backgroundImage: `url('${TOPIC_CARDS_IMG[t.id] || '/asset/art/topic_ai.png'}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,6,6,0.1), rgba(10,10,10,0.85))' }} />
                </div>
                <div style={{ padding: '10px 11px 11px' }}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--tx-hi)', lineHeight: 1.32 }}>
                    {t.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--tx-dim)', marginTop: 3, lineHeight: 1.4 }}>
                    {t.desc}
                  </div>
                  <div className="row-between" style={{ marginTop: 8, alignItems: 'flex-end' }}>
                    <div>
                      <div
                        className={`num ${dirClass(t.pct6M)}`}
                        style={{ fontSize: 15, fontWeight: 680, letterSpacing: '-0.01em' }}
                      >
                        {t.pct6M > 0 ? '+' : ''}
                        {num(t.pct6M, 1)}%
                      </div>
                      <div style={{ fontSize: 9, color: 'var(--tx-dim)' }}>Hiệu suất 6 tháng</div>
                    </div>
                    <span style={{ width: 54 }}>
                      <LineMini data={performanceSeries(`topic-${t.id}`, '6M', t.pct6M)} height={26} color={t.pct6M > 0 ? '#22c576' : '#e5484d'} />
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* ---------- Danh sách + phân tích ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.75fr) minmax(0,1fr)' }}>
        <Card
          title="Danh sách chủ đề đầu tư"
          action={
            <div className="row gap-8">
              <select className="input sm" value={sector} onChange={(e) => setSector(e.target.value)} style={{ width: 130 }}>
                {['Tất cả ngành', ...TOPICS.map((t) => t.name)].map((o) => <option key={o}>{o}</option>)}
              </select>
              <select className="input sm" value={phase} onChange={(e) => setPhase(e.target.value)} style={{ width: 130 }}>
                {['Tất cả giai đoạn', 'Ngắn hạn', 'Trung hạn', 'Dài hạn'].map((o) => <option key={o}>{o}</option>)}
              </select>
              <select className="input sm" value={sort} onChange={(e) => setSort(e.target.value)} style={{ width: 150 }}>
                {['Hiệu suất 6T', 'Hiệu suất 3T', 'Mức độ quan tâm', 'Số cổ phiếu'].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          }
        >
          <div className="table-wrap" style={{ maxHeight: 420 }}>
            <table className="data">
              <thead>
                <tr>
                  <th style={{ width: 26 }}>#</th>
                  <th className="l" style={{ width: 210 }}>Chủ đề</th>
                  <th>Số CP liên quan</th>
                  <th>Hiệu suất 3T</th>
                  <th>Hiệu suất 6T</th>
                  <th className="l" style={{ width: 86 }}>Xu hướng</th>
                  <th className="l" style={{ width: 130 }}>Mức độ quan tâm</th>
                  <th style={{ width: 34 }}></th>
                </tr>
              </thead>
              <tbody>
                {list.map((t, i) => (
                  <tr
                    key={t.id}
                    className="clickable"
                    onClick={() => setSelected(t.id)}
                    style={selected === t.id ? { background: 'rgba(212,175,55,0.06)' } : undefined}
                  >
                    <td className="idx num">{i + 1}</td>
                    <td className="l">
                      <span className="row gap-8">
                        <span
                          style={{
                            width: 32,
                            height: 24,
                            borderRadius: 4,
                            overflow: 'hidden',
                            flexShrink: 0,
                            border: '1px solid var(--line)',
                            backgroundImage: `url('${TOPIC_CARDS_IMG[t.id] || '/asset/art/topic_ai.png'}')`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                          }}
                        />
                        <span style={{ minWidth: 0 }}>
                          <span style={{ display: 'block', color: 'var(--tx-hi)', fontWeight: 550, fontSize: 11.5 }}>
                            {t.name}
                          </span>
                          <span style={{ display: 'block', fontSize: 10, color: 'var(--tx-dim)' }}>{t.desc}</span>
                        </span>
                      </span>
                    </td>
                    <td className="num">{t.stocks}</td>
                    <td className={`num ${dirClass(t.pct3M)}`} style={{ fontWeight: 600 }}>
                      {t.pct3M > 0 ? '+' : ''}
                      {num(t.pct3M, 1)}%
                    </td>
                    <td className={`num ${dirClass(t.pct6M)}`} style={{ fontWeight: 600 }}>
                      {t.pct6M > 0 ? '+' : ''}
                      {num(t.pct6M, 1)}%
                    </td>
                    <td className="l">
                      <span style={{ display: 'inline-block', width: 62 }}>
                        <LineMini data={performanceSeries(`topic-${t.id}`, '6M', t.pct6M)} height={22} color={t.pct6M > 0 ? '#22c576' : '#e5484d'} />
                      </span>
                    </td>
                    <td className="l">
                      <span className="row gap-8">
                        <span className="bar-track" style={{ width: 68 }}>
                          <i style={{ width: `${t.interest}%`, background: 'var(--kg-gold)' }} />
                        </span>
                      </span>
                    </td>
                    <td>
                      <button
                        className="icon-btn"
                        style={{ width: 24, height: 24 }}
                        aria-label="Lưu chủ đề"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSaved((s) => (s.includes(t.id) ? s.filter((x) => x !== t.id) : [...s, t.id]))
                        }}
                      >
                        <IconBookmark
                          size={13}
                          style={{ color: saved.includes(t.id) ? 'var(--kg-gold)' : 'var(--tx-faint)' }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="row-between" style={{ marginTop: 11 }}>
            <span className="dim" style={{ fontSize: 10.5 }}>
              Hiển thị 1 – {list.length} của {TOPICS.length} chủ đề
            </span>
            <div className="row gap-4">
              {['1', '2', '3', '…'].map((p, i) => (
                <button
                  key={p}
                  className="icon-btn"
                  style={{ width: 26, height: 26, fontSize: 11, background: i === 0 ? 'rgba(212,175,55,0.16)' : undefined, color: i === 0 ? 'var(--kg-gold-200)' : undefined }}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* ---------- Phân tích chủ đề ---------- */}
        <Card
          title={`Phân tích chủ đề: ${cur.name}`}
          action={<span className="card-link">Xem chi tiết <IconArrowRight size={12} /></span>}
        >
          <div className="row gap-11" style={{ marginBottom: 12 }}>
            <div
              style={{
                width: 88,
                height: 68,
                borderRadius: 'var(--r-sm)',
                overflow: 'hidden',
                flexShrink: 0,
                border: '1px solid var(--line-gold)',
                backgroundImage: "url('/asset/art/topic_chip_detail.png')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--tx-hi)' }}>
                {cur.name}
              </div>
              <p style={{ fontSize: 10.5, color: 'var(--tx-mid)', lineHeight: 1.5, marginTop: 3 }}>{cur.desc}</p>
              <div className="row gap-6" style={{ marginTop: 6, flexWrap: 'wrap' }}>
                <Badge tone="gold">{cur.tag}</Badge>
                <Badge tone="teal">{cur.scope}</Badge>
              </div>
            </div>
          </div>

          <div className="ohlc c4" style={{ marginBottom: 13 }}>
            <div className="ohlc-item">
              <div className="ohlc-value up" style={{ fontSize: 16 }}>
                {cur.pct6M > 0 ? '+' : ''}
                {num(cur.pct6M, 1)}%
              </div>
              <div className="ohlc-label" style={{ marginTop: 2 }}>Hiệu suất 6 tháng</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-value up" style={{ fontSize: 16 }}>
                {cur.pct3M > 0 ? '+' : ''}
                {num(cur.pct3M, 1)}%
              </div>
              <div className="ohlc-label" style={{ marginTop: 2 }}>Hiệu suất 3 tháng</div>
            </div>
            <div className="ohlc-item">
              <div className="ohlc-value" style={{ fontSize: 16 }}>{cur.stocks}</div>
              <div className="ohlc-label" style={{ marginTop: 2 }}>Cổ phiếu liên quan</div>
            </div>
            <div className="ohlc-item">
              <div className="row gap-6">
                <span style={{ color: 'var(--up)', fontSize: 13 }}>▮▮▮</span>
                <span className="ohlc-value up" style={{ fontSize: 15 }}>
                  {cur.interest >= 80 ? 'Cao' : cur.interest >= 65 ? 'Trung bình' : 'Thấp'}
                </span>
              </div>
              <div className="ohlc-label" style={{ marginTop: 2 }}>Mức độ quan tâm</div>
            </div>
          </div>

          <Tabs
            tabs={['Tổng quan', 'Cổ phiếu tiêu biểu', 'Biểu đồ', 'Tin tức liên quan'] as const}
            value={detailTab as never}
            onChange={setDetailTab}
          />

          <div style={{ marginTop: 12, minHeight: 150 }}>
            {detailTab === 'Tổng quan' ? (
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {cur.points.map((p, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 11.5, color: 'var(--tx-mid)', lineHeight: 1.55 }}>
                    <span style={{ color: p.startsWith('Rủi ro') ? 'var(--down)' : 'var(--kg-gold)', flexShrink: 0 }}>
                      {p.startsWith('Rủi ro') ? '⚠' : '◆'}
                    </span>
                    {p}
                  </li>
                ))}
              </ul>
            ) : detailTab === 'Biểu đồ' ? (
              <AreaChart
                series={[{ id: 't', name: cur.name, data: performanceSeries(`topic-${cur.id}`, '1Y', cur.pct6M * 1.4), color: '#e8b44a' }]}
                labels={monthLabels()}
                height={150}
                fmt={(v) => `${num(v, 0)}%`}
                refLine={0}
                xTicks={5}
              />
            ) : (
              <div className="nav-list">
                {['Nhu cầu hạ tầng AI tăng mạnh trong 2026', 'Dòng vốn FDI vào Việt Nam đạt kỷ lục', 'Chính phủ công bố quy hoạch điện VIII điều chỉnh'].map((t) => (
                  <div className="nav-list-row" key={t} onClick={() => onNavigate('news')}>
                    <span className="grow clamp-2">{t}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button className="btn gold" style={{ marginTop: 13, width: '100%' }} onClick={() => onNavigate('screener')}>
            Xem phân tích chi tiết <IconArrowRight size={13} />
          </button>
        </Card>
      </div>

      {/* ---------- Hiệu suất & dòng tiền theo chủ đề ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)' }}>
        <Card
          title="Hiệu suất các chủ đề (YTD)"
          action={
            <select className="input sm" defaultValue="YTD" style={{ width: 78 }}>
              {['1M', '3M', '6M', 'YTD', '1Y'].map((o) => <option key={o}>{o}</option>)}
            </select>
          }
        >
          <AreaChart
            series={TOPICS.slice(0, 5).map((t, i) => ({
              id: `t${t.id}`,
              name: t.name,
              data: performanceSeries(`topic-${t.id}`, 'YTD', t.pct6M * 1.2),
              color: ['#2ec27b', '#e8b44a', '#5b8def', '#8b7cf6', '#2dd4bf'][i],
              area: false,
            }))}
            labels={monthLabels()}
            height={196}
            fmt={(v) => `${num(v, 0)}%`}
            refLine={0}
            xTicks={6}
            legend
          />
        </Card>

        <Card title="Dòng tiền theo chủ đề (30 ngày)" action={<span className="card-link">Đơn vị: Tỷ VND</span>}>
          <BarList
            rows={[
              { name: 'AI & Bán dẫn', value: 5240, color: '#d4af37' },
              { name: 'Hạ tầng & Đầu tư công', value: 3120, color: '#2ec27b' },
              { name: 'Ngân hàng & Tài chính', value: 2680, color: '#5b8def' },
              { name: 'Chuyển đổi năng lượng', value: 2450, color: '#2dd4bf' },
              { name: 'Tiêu dùng nội địa', value: 1980, color: '#8b7cf6' },
              { name: 'Bất động sản KCN', value: 1520, color: '#f59e6b' },
              { name: 'Khác', value: 980, color: '#6b7280' },
            ]}
            fmt={(v) => num(v, 0)}
            barWidth={96}
          />
        </Card>

        <Card title="Ý tưởng đầu tư theo chủ đề" action={<span className="card-link">Xem tất cả <IconArrowRight size={12} /></span>}>
          <div className="nav-list">
            {[
              { t: '5 cổ phiếu hưởng lợi từ làn sóng AI toàn cầu', tag: 'AI & Bán dẫn', d: '22/09/2026', img: '/asset/art/topic_ai.png' },
              { t: 'Cơ hội đầu tư trong chu kỳ đầu tư công 2026–2030', tag: 'Hạ tầng', d: '21/09/2026', img: '/asset/art/topic_infra.png' },
              { t: 'Những doanh nghiệp dẫn đầu xu hướng năng lượng sạch', tag: 'Năng lượng', d: '20/09/2026', img: '/asset/art/topic_wind.png' },
              { t: 'Bán lẻ hiện đại: Sức bật từ tầng lớp trung lưu', tag: 'Tiêu dùng', d: '19/09/2026', img: '/asset/art/topic_mall.png' },
            ].map((r) => (
              <div className="nav-list-row" key={r.t} onClick={() => onNavigate('ideas')}>
                <span
                  style={{
                    width: 38,
                    height: 28,
                    borderRadius: 4,
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid var(--line)',
                    backgroundImage: `url('${r.img}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <span className="grow clamp-2">{r.t}</span>
                <span style={{ fontSize: 9.5, color: 'var(--tx-dim)', flexShrink: 0, textAlign: 'right' }}>
                  {r.tag}
                  <br />
                  {r.d}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  )
}

function monthLabels(): string[] {
  const n = 190
  const out: string[] = []
  const now = new Date(2026, 8, 22)
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() - ((265 * (n - 1 - i)) / (n - 1)) * 86400000)
    out.push(`${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`)
  }
  return out
}