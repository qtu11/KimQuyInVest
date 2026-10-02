/* ==========================================================================
   TRANG THEO DÕI THESIS
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import { AreaChart, BarList, Donut, Sparkline } from '../components/charts'
import { Art } from '../components/Art'
import { IconArrowRight, IconLightning, IconPlus, IconThesis } from '../components/icons'
import { Badge, Card, Chip, SearchInput, Tabs } from '../components/ui'
import { performanceSeries } from '../data/market'
import { dirClass, num } from '../lib/format'

const TABS = ['Đang theo dõi', 'Chờ xác nhận', 'Đã đóng', 'Tất cả'] as const
type Tab = (typeof TABS)[number]

type Thesis = {
  id: number
  symbol: string
  title: string
  status: 'Đang theo dõi' | 'Chờ xác nhận' | 'Đã đóng'
  health: number
  opened: string
  due: string
  entry: number
  target: number
  stop: number
  current: number
  conviction: 'Cao' | 'Trung bình' | 'Thấp'
  catalysts: { text: string; done: boolean }[]
  risks: string[]
  art: 'chip' | 'bank' | 'cart' | 'highway' | 'leaf' | 'factory'
  note: string
}

const THESES: Thesis[] = [
  {
    id: 1, symbol: 'FPT', title: 'FPT – Động lực từ AI và chuyển đổi số toàn cầu',
    status: 'Đang theo dõi', health: 86, opened: '12/05/2026', due: '15/12/2026',
    entry: 100000, target: 145000, stop: 92000, current: 126500, conviction: 'Cao', art: 'chip',
    catalysts: [
      { text: 'Hợp đồng AI 100 triệu USD với đối tác Nhật', done: true },
      { text: 'Tăng trưởng LNST trên 20% trong Q3', done: true },
      { text: 'Mở rộng thị trường Nhật Bản và Hàn Quốc', done: false },
      { text: 'Biên lợi nhuận mảng AI duy trì trên 25%', done: false },
    ],
    risks: ['Cạnh tranh từ các tập đoàn công nghệ Ấn Độ', 'Tỷ giá JPY/VND biến động', 'Chi phí nhân sự tăng'],
    note: 'Đang đi đúng luận điểm. Có thể nâng giá mục tiêu nếu Q3 vượt kỳ vọng.',
  },
  {
    id: 2, symbol: 'TCB', title: 'TCB – Chất lượng tài sản dẫn đầu ngành ngân hàng',
    status: 'Đang theo dõi', health: 74, opened: '03/06/2026', due: '20/01/2027',
    entry: 28000, target: 42000, stop: 25000, current: 34200, conviction: 'Cao', art: 'bank',
    catalysts: [
      { text: 'Tỷ lệ nợ xấu giảm dưới 1,1%', done: true },
      { text: 'NIM mở rộng lên trên 4,2%', done: false },
      { text: 'Hoàn tất tăng vốn cho công ty chứng khoán', done: true },
      { text: 'Tín dụng tăng trưởng trên 15%', done: false },
    ],
    risks: ['Áp lực NIM từ lãi suất huy động', 'Rủi ro trái phiếu doanh nghiệp', 'Cạnh tranh lãi suất cho vay'],
    note: 'NIM là biến số cần theo dõi sát. Hai quý tới là giai đoạn quyết định.',
  },
  {
    id: 3, symbol: 'MWG', title: 'MWG – Bách Hoá Xanh đạt điểm hoà vốn',
    status: 'Đang theo dõi', health: 81, opened: '18/06/2026', due: '15/12/2026',
    entry: 50000, target: 78000, stop: 45000, current: 62100, conviction: 'Cao', art: 'cart',
    catalysts: [
      { text: 'BHX đạt EBITDA dương', done: true },
      { text: 'Hợp tác Nvidia về AI Store', done: true },
      { text: 'Biên lợi nhuận gộp duy trì trên 21%', done: true },
      { text: 'Đóng góp lợi nhuận dương từ BHX từ Q4', done: false },
    ],
    risks: ['Tiêu dùng phục hồi chậm', 'Cạnh tranh giá từ FRT/DGW', 'Chi phí thuê mặt bằng tăng'],
    note: 'Luận điểm đang diễn ra tốt. Chất xúc tác chính đã hoàn thành 3/4.',
  },
  {
    id: 4, symbol: 'HPG', title: 'HPG – Chu kỳ phục hồi sản lượng thép',
    status: 'Chờ xác nhận', health: 58, opened: '12/09/2026', due: '30/03/2027',
    entry: 27100, target: 38000, stop: 24000, current: 28650, conviction: 'Trung bình', art: 'factory',
    catalysts: [
      { text: 'Sản lượng tiêu thụ nội địa tăng trên 8%', done: true },
      { text: 'Giá HRC hồi phục trên 550 USD/tấn', done: false },
      { text: 'Biên lợi nhuận gộp trên 15%', done: false },
      { text: 'Khởi công dự án Dung Quất giai đoạn 2', done: false },
    ],
    risks: ['Hàng nhập khẩu giá rẻ từ Trung Quốc', 'Giá quặng sắt biến động', 'Nhu cầu bất động sản yếu'],
    note: 'Cần thêm xác nhận từ giá HRC trước khi tăng tỷ trọng.',
  },
  {
    id: 5, symbol: 'HHV', title: 'HHV – Hưởng lợi từ làn sóng đầu tư công',
    status: 'Đang theo dõi', health: 69, opened: '20/08/2026', due: '30/06/2027',
    entry: 12000, target: 19000, stop: 10500, current: 13600, conviction: 'Trung bình', art: 'highway',
    catalysts: [
      { text: 'Backlog ký mới trên 5.000 tỷ', done: true },
      { text: 'Giải ngân đầu tư công tăng 20%', done: false },
      { text: 'Biên lợi nhuận xây lắp cải thiện', done: false },
      { text: 'Thu hồi công nợ từ các dự án BOT', done: false },
    ],
    risks: ['Tiến độ giải ngân chậm', 'Nợ phải thu cao', 'Giá vật liệu tăng'],
    note: 'Theo dõi chỉ số giải ngân đầu tư công hàng tháng.',
  },
  {
    id: 6, symbol: 'VHM', title: 'VHM – Bàn giao nhà tại đại dự án',
    status: 'Đã đóng', health: 100, opened: '10/02/2026', due: '10/09/2026',
    entry: 38000, target: 46000, stop: 34000, current: 45800, conviction: 'Cao', art: 'highway',
    catalysts: [
      { text: 'Bàn giao Vinhomes Ocean Park', done: true },
      { text: 'Doanh thu vượt kế hoạch', done: true },
      { text: 'Giá mục tiêu đạt được', done: true },
      { text: 'Chốt lời theo kế hoạch', done: true },
    ],
    risks: ['Đã chốt vị thế — không còn rủi ro'],
    note: 'Đóng thesis với lợi nhuận +20,5%. Luận điểm đã hoàn thành đầy đủ.',
  },
]

const STATUS_TONE: Record<Thesis['status'], 'up' | 'gold' | 'flat'> = {
  'Đang theo dõi': 'up',
  'Chờ xác nhận': 'gold',
  'Đã đóng': 'flat',
}

export function ThesisPage({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Đang theo dõi')
  const [q, setQ] = useState('')
  const [open, setOpen] = useState<number | null>(1)

  const list = THESES.filter((t) => {
    if (tab === 'Đang theo dõi' && t.status !== 'Đang theo dõi') return false
    if (tab === 'Chờ xác nhận' && t.status !== 'Chờ xác nhận') return false
    if (tab === 'Đã đóng' && t.status !== 'Đã đóng') return false
    if (q && !t.symbol.toLowerCase().includes(q.toLowerCase()) && !t.title.toLowerCase().includes(q.toLowerCase())) return false
    return true
  })

  const idx = list.findIndex((t) => t.id === open)
  const active = idx >= 0 ? list[idx] : list[0]

  const stats = [
    { l: 'Tổng số thesis', v: String(THESES.length), d: '3 đang hoạt động mạnh' },
    { l: 'Đang theo dõi', v: String(THESES.filter((t) => t.status === 'Đang theo dõi').length), d: 'Sức khoẻ TB 77,5' },
    { l: 'Đã đóng', v: String(THESES.filter((t) => t.status === 'Đã đóng').length), d: 'Tỷ lệ thắng 100%' },
    { l: 'Tỷ lệ luận điểm đúng', v: '83%', d: '5/6 thesis thành công' },
  ]

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <button className="btn sm gold">
          <IconPlus size={13} /> Tạo thesis mới
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {stats.map((s) => (
          <div className="stat" key={s.l}>
            <div className="stat-label">{s.l}</div>
            <div className="stat-value stat-xl">{s.v}</div>
            <div className="stat-sub">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1.35fr)' }}>
        {/* Danh sách */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Danh sách thesis">
            <SearchInput value={q} onChange={setQ} placeholder="Tìm theo mã hoặc tên..." size="sm" />
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 10 }}>
              {list.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setOpen(t.id)}
                  style={{
                    display: 'flex',
                    gap: 11,
                    padding: '11px 10px',
                    borderRadius: 'var(--r-md)',
                    textAlign: 'left',
                    alignItems: 'center',
                    background: active?.id === t.id ? 'rgba(212,175,55,0.09)' : 'transparent',
                    border: `1px solid ${active?.id === t.id ? 'var(--line-gold)' : 'transparent'}`,
                    marginBottom: 4,
                    cursor: 'pointer',
                  }}
                >
                  <span style={{ width: 38, height: 30, borderRadius: 4, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--line)' }}>
                    <Art kind={t.art} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span className="row gap-6" style={{ marginBottom: 3 }}>
                      <span className="ticker-cell gold" style={{ fontSize: 12 }}>{t.symbol}</span>
                      <Badge tone={STATUS_TONE[t.status]}>{t.status}</Badge>
                    </span>
                    <span className="clamp-2" style={{ display: 'block', fontSize: 11, color: 'var(--tx-mid)', lineHeight: 1.4 }}>
                      {t.title.replace(`${t.symbol} – `, '')}
                    </span>
                  </span>
                  <span style={{ textAlign: 'right', flexShrink: 0 }}>
                    <span className={`num ${dirClass(t.current - t.entry)}`} style={{ display: 'block', fontSize: 12, fontWeight: 650 }}>
                      {num(((t.current - t.entry) / t.entry) * 100, 1)}%
                    </span>
                    <span style={{ display: 'block', fontSize: 9, color: 'var(--tx-dim)' }}>sức khoẻ {t.health}</span>
                  </span>
                </button>
              ))}
              {list.length === 0 && (
                <div className="empty">
                  <IconThesis size={22} />
                  <span>Không có thesis nào trong mục này.</span>
                </div>
              )}
            </div>
          </Card>

          <Card title="Sức khoẻ luận điểm">
            <BarList
              rows={THESES.slice(0, 5).map((t) => ({
                name: t.symbol,
                value: t.health,
                color: t.health >= 80 ? '#2ec27b' : t.health >= 65 ? '#d4af37' : '#e5484d',
              }))}
              fmt={(v) => `${num(v, 0)}/100`}
              barWidth={84}
            />
          </Card>
        </div>

        {/* Chi tiết */}
        {active && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <Card
              title={
                <div className="row gap-9" style={{ gap: 9 }}>
                  <span className="ticker-cell gold" style={{ fontSize: 15 }}>{active.symbol}</span>
                  <Badge tone={STATUS_TONE[active.status]}>{active.status}</Badge>
                  <Badge tone="gold">Độ tin cậy: {active.conviction}</Badge>
                </div>
              }
              action={<button className="btn xs ghost" onClick={() => onNavigate('stock', active.symbol)}>Xem cổ phiếu</button>}
            >
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 16, fontWeight: 700, color: 'var(--tx-hi)', lineHeight: 1.35, marginBottom: 12 }}>
                {active.title}
              </h3>

              <div className="ohlc c5" style={{ marginBottom: 13 }}>
                <div className="ohlc-item">
                  <div className="ohlc-label">Giá vào</div>
                  <div className="ohlc-value">{num(active.entry, 0)}</div>
                </div>
                <div className="ohlc-item">
                  <div className="ohlc-label">Giá hiện tại</div>
                  <div className={`ohlc-value ${dirClass(active.current - active.entry)}`}>
                    {num(active.current, 0)}
                  </div>
                </div>
                <div className="ohlc-item">
                  <div className="ohlc-label">Mục tiêu</div>
                  <div className="ohlc-value up">{num(active.target, 0)}</div>
                </div>
                <div className="ohlc-item">
                  <div className="ohlc-label">Cắt lỗ</div>
                  <div className="ohlc-value down">{num(active.stop, 0)}</div>
                </div>
                <div className="ohlc-item">
                  <div className="ohlc-label">Lợi nhuận</div>
                  <div className={`ohlc-value ${dirClass(active.current - active.entry)}`}>
                    {num(((active.current - active.entry) / active.entry) * 100, 1)}%
                  </div>
                </div>
              </div>

              <div className="row-between" style={{ marginBottom: 6 }}>
                <span className="mini-label">Sức khoẻ luận điểm</span>
                <span className="num" style={{ fontSize: 12, fontWeight: 650, color: active.health >= 80 ? 'var(--up)' : 'var(--kg-gold)' }}>
                  {active.health}/100
                </span>
              </div>
              <span className="bar-track" style={{ display: 'block', width: '100%' }}>
                <i
                  style={{
                    width: `${active.health}%`,
                    background: active.health >= 80 ? 'var(--up)' : active.health >= 65 ? 'var(--kg-gold)' : 'var(--down)',
                  }}
                />
              </span>

              <div className="row gap-10" style={{ marginTop: 12, flexWrap: 'wrap' }}>
                <span className="mini-label">Mở: <span className="num" style={{ color: 'var(--tx)' }}>{active.opened}</span></span>
                <span className="mini-label">Đánh giá lại: <span className="num gold">{active.due}</span></span>
              </div>
            </Card>

            <Card title="Chất xúc tác & mốc kiểm chứng">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                {active.catalysts.map((c, i) => (
                  <div className="row gap-9" key={i} style={{ alignItems: 'flex-start', gap: 9 }}>
                    <span
                      style={{
                        width: 16,
                        height: 16,
                        borderRadius: 3,
                        display: 'grid',
                        placeItems: 'center',
                        flexShrink: 0,
                        marginTop: 1,
                        background: c.done ? 'var(--grad-gold-btn)' : '#1c1c1c',
                        border: `1px solid ${c.done ? 'rgba(246,230,180,0.5)' : 'var(--line-strong)'}`,
                        color: '#1d1602',
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                    >
                      {c.done ? '✓' : ''}
                    </span>
                    <span
                      style={{
                        fontSize: 11.5,
                        color: c.done ? 'var(--tx)' : 'var(--tx-mid)',
                        lineHeight: 1.5,
                        textDecoration: c.done ? 'none' : undefined,
                      }}
                    >
                      {c.text}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Rủi ro & điều kiện vô hiệu hoá">
              <ul style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {active.risks.map((r, i) => (
                  <li key={i} style={{ display: 'flex', gap: 8, fontSize: 11.5, color: 'var(--tx-mid)', lineHeight: 1.5 }}>
                    <span className="down" style={{ flexShrink: 0 }}>⚠</span>
                    {r}
                  </li>
                ))}
              </ul>
              <div className="callout" style={{ marginTop: 12 }}>
                <div className="callout-title"><span>✦</span> Ghi chú theo dõi</div>
                <p>{active.note}</p>
              </div>
            </Card>

            <Card title="Diễn biến giá từ khi mở thesis">
              <AreaChart
                series={[
                  {
                    id: 'th',
                    name: active.symbol,
                    data: performanceSeries(`thesis-${active.symbol}`, '1Y', ((active.current - active.entry) / active.entry) * 100),
                    color: '#e8b44a',
                  },
                ]}
                labels={yearLabels()}
                height={168}
                fmt={(v) => `${num(v, 0)}%`}
                refLine={0}
                xTicks={6}
              />
            </Card>
          </div>
        )}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0,1fr))' }}>
        <Card title="Phân bổ thesis theo trạng thái">
          <Donut
            data={[
              { name: 'Đang theo dõi', value: THESES.filter((t) => t.status === 'Đang theo dõi').length, color: '#2ec27b' },
              { name: 'Chờ xác nhận', value: THESES.filter((t) => t.status === 'Chờ xác nhận').length, color: '#d4af37' },
              { name: 'Đã đóng', value: THESES.filter((t) => t.status === 'Đã đóng').length, color: '#6b7280' },
            ]}
            size={132}
            thickness={25}
            center={
              <>
                <div className="donut-center-value">{THESES.length}</div>
                <div className="donut-center-label">thesis</div>
              </>
            }
            legendFmt={(v) => `${v}`}
          />
        </Card>

        <Card
          className="gold"
          title={
            <div className="ai-head">
              <IconLightning size={14} /> AI kiểm tra luận điểm
            </div>
          }
          action={<button className="btn xs gold-ghost" onClick={() => onNavigate('copilot')}>Hỏi AI</button>}
        >
          <div className="ai-list">
            {[
              'FPT: 2/4 chất xúc tác đã hoàn thành, luận điểm đang đi đúng hướng.',
              'TCB: NIM là biến số cần theo dõi — chưa có xác nhận trong Q3.',
              'HPG: Cần giá HRC trên 550 USD/tấn để xác nhận chu kỳ phục hồi.',
              'VHM: Đã đạt giá mục tiêu, nên xem xét đóng vị thế.',
            ].map((t, i) => (
              <div className="ai-row" key={i} onClick={() => onNavigate('copilot')}>
                <span style={{ color: 'var(--kg-gold)', flexShrink: 0 }}>✦</span>
                <span className="grow">{t}</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Hiệu suất các thesis đang mở" action={<Chip>Đang mở</Chip>}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {THESES.filter((t) => t.status !== 'Đã đóng').map((t) => {
              const pct = ((t.current - t.entry) / t.entry) * 100
              return (
                <div className="row gap-10" key={t.id}>
                  <span className="ticker-cell" style={{ width: 40, fontSize: 11.5 }}>{t.symbol}</span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Sparkline
                      data={performanceSeries(`thesis-${t.symbol}`, '6M', pct)}
                      height={22}
                      color={pct > 0 ? '#22c576' : '#e5484d'}
                    />
                  </span>
                  <span className={`num ${dirClass(pct)}`} style={{ width: 52, textAlign: 'right', fontSize: 11.5, fontWeight: 650 }}>
                    {pct > 0 ? '+' : ''}
                    {num(pct, 1)}%
                  </span>
                </div>
              )
            })}
          </div>
          <div className="card-foot" style={{ borderTop: '1px solid var(--line)' }}>
            <div className="row-between">
              <span className="mini-label">Hiệu suất trung bình</span>
              <span className="num up" style={{ fontWeight: 650 }}>
                +{num(
                  THESES.filter((t) => t.status !== 'Đã đóng').reduce((a, b) => a + ((b.current - b.entry) / b.entry) * 100, 0) /
                    THESES.filter((t) => t.status !== 'Đã đóng').length,
                  1,
                )}%
              </span>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="row gap-10" style={{ flexWrap: 'wrap' }}>
          <Chip onClick={() => onNavigate('portfolio')}>Danh mục của tôi</Chip>
          <Chip onClick={() => onNavigate('ideas')}>Ý tưởng đầu tư</Chip>
          <Chip onClick={() => onNavigate('report')}>Báo cáo doanh nghiệp</Chip>
          <span className="row gap-6" style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>
            <IconArrowRight size={12} style={{ color: 'var(--kg-gold)' }} /> Ghi lại luận điểm, theo dõi diễn biến, kết thúc có kỷ luật.
          </span>
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

export { ThesisPage as Thesis }