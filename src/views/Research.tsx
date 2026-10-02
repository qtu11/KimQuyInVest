/* ==========================================================================
   TRANG TRỢ LÝ NGHIÊN CỨU
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import { BarList, Sparkline } from '../components/charts'
import { Art } from '../components/Art'
import { IconArrowRight, IconDoc, IconLightning, IconResearch, IconSearch } from '../components/icons'
import { Badge, Card, Chip, SearchInput, Tabs } from '../components/ui'
import { NEWS } from '../data/content'
import { SECTORS, STOCKS } from '../data/market'
import { dirClass, num } from '../lib/format'

const TABS = ['Tra cứu', 'So sánh doanh nghiệp', 'Dữ liệu ngành', 'Nguồn tham chiếu'] as const
type Tab = (typeof TABS)[number]

const SOURCES = [
  { name: 'Báo cáo thường niên doanh nghiệp', count: 428, tone: 'blue' as const, art: 'building' as const },
  { name: 'Báo cáo tài chính hợp nhất', count: 1246, tone: 'teal' as const, art: 'bank' as const },
  { name: 'Nghị quyết HĐQT & ĐHCĐ', count: 862, tone: 'violet' as const, art: 'exchange' as const },
  { name: 'Báo cáo phân tích KIMQUY', count: 248, tone: 'gold' as const, art: 'city' as const },
  { name: 'Dữ liệu vĩ mô (GSO, NHNN)', count: 186, tone: 'orange' as const, art: 'factory' as const },
  { name: 'Tin tức & sự kiện thị trường', count: 3418, tone: 'sky' as const, art: 'exchange' as const },
]

export function Research({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Tra cứu')
  const [q, setQ] = useState('')

  const hits = q
    ? STOCKS.filter((s) => s.symbol.toLowerCase().includes(q.toLowerCase()) || s.name.toLowerCase().includes(q.toLowerCase()))
    : []

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <span className="row gap-6" style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>
          <IconResearch size={13} style={{ color: 'var(--kg-gold)' }} /> 6.388 tài liệu được lập chỉ mục
        </span>
      </div>

      {/* ---------- Ô tra cứu ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <Card className="gold">
          <div className="row gap-10">
            <div style={{ flex: 1 }}>
              <SearchInput
                value={q}
                onChange={setQ}
                placeholder="Tra cứu doanh nghiệp, ngành, chỉ tiêu tài chính, sự kiện..."
              />
            </div>
            <button className="btn gold" style={{ flexShrink: 0 }}>
              <IconSearch size={13} /> Tra cứu
            </button>
          </div>

          <div className="row gap-7" style={{ marginTop: 11, flexWrap: 'wrap', gap: 7 }}>
            {['ROE ngành ngân hàng', 'Biên lợi nhuận gộp HPG', 'Cơ cấu doanh thu FPT', 'Nợ vay VHM', 'Dòng tiền MWG'].map((s) => (
              <Chip key={s} onClick={() => setQ(s.split(' ').pop() ?? '')}>
                {s}
              </Chip>
            ))}
          </div>

          {hits.length > 0 && (
            <div style={{ marginTop: 14, borderTop: '1px solid var(--line)', paddingTop: 12 }}>
              <div className="mini-label" style={{ marginBottom: 8 }}>KẾT QUẢ TRA CỨU</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 10 }}>
                {hits.slice(0, 6).map((s) => (
                  <button
                    key={s.symbol}
                    className="card interactive"
                    style={{ padding: 12, textAlign: 'left', flexDirection: 'row', alignItems: 'center', gap: 11 }}
                    onClick={() => onNavigate('stock', s.symbol)}
                  >
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <span className="row gap-8" style={{ marginBottom: 3 }}>
                        <span className="ticker-cell gold">{s.symbol}</span>
                        <span className={`num ${dirClass(s.changePct)}`} style={{ fontSize: 10.5, fontWeight: 600 }}>
                          {s.changePct > 0 ? '+' : ''}
                          {num(s.changePct, 2)}%
                        </span>
                      </span>
                      <span className="truncate" style={{ display: 'block', fontSize: 11, color: 'var(--tx-mid)' }}>
                        {s.name}
                      </span>
                      <span className="row gap-8" style={{ marginTop: 4, fontSize: 10, color: 'var(--tx-dim)' }}>
                        <span>ROE {num(s.roe, 1)}%</span>
                        <span>P/E {num(s.pe, 1)}</span>
                      </span>
                    </span>
                    <IconArrowRight size={14} style={{ color: 'var(--tx-faint)', flexShrink: 0 }} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ---------- Nguồn dữ liệu ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(6, minmax(0,1fr))' }}>
        {SOURCES.map((s) => (
          <button key={s.name} className="card interactive" style={{ padding: 0, overflow: 'hidden', textAlign: 'left' }}>
            <span style={{ display: 'block', height: 58, position: 'relative' }}>
              <Art kind={s.art} />
              <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,6,6,0.2), rgba(10,10,10,0.8))' }} />
            </span>
            <span style={{ display: 'block', padding: '10px 11px 12px' }}>
              <span style={{ display: 'block', fontSize: 11, fontWeight: 550, color: 'var(--tx-hi)', lineHeight: 1.35, minHeight: 30 }}>
                {s.name}
              </span>
              <span className="row gap-6" style={{ marginTop: 6 }}>
                <span className="num gold" style={{ fontSize: 14, fontWeight: 680 }}>
                  {num(s.count, 0)}
                </span>
                <span style={{ fontSize: 9.5, color: 'var(--tx-dim)' }}>tài liệu</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* ---------- So sánh + ngành + ghi chú ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.4fr) minmax(0,1fr) minmax(0,1fr)' }}>
        <Card title="So sánh doanh nghiệp nhanh" action={<span className="card-link" onClick={() => onNavigate('screener')}>Mở sàng lọc <IconArrowRight size={12} /></span>}>
          <table className="matrix">
            <thead>
              <tr>
                <th>Chỉ tiêu</th>
                <th className="hl">FPT</th>
                <th>TCB</th>
                <th>HPG</th>
                <th>MWG</th>
              </tr>
            </thead>
            <tbody>
              {[
                { l: 'Giá (VND)', k: 'price', d: 0 },
                { l: 'P/E', k: 'pe', d: 1 },
                { l: 'P/B', k: 'pb', d: 1 },
                { l: 'ROE (%)', k: 'roe', d: 1 },
                { l: 'Tăng trưởng LNST (%)', k: 'epsGrowth', d: 1 },
                { l: 'Nợ/VCSH', k: 'de', d: 2 },
                { l: 'Cổ tức (%)', k: 'dividendYield', d: 1 },
                { l: 'Vốn hoá (tỷ)', k: 'marketCap', d: 0 },
              ].map((row) => (
                <tr key={row.l}>
                  <td>{row.l}</td>
                  {['FPT', 'TCB', 'HPG', 'MWG'].map((sym) => {
                    const s = STOCKS.find((x) => x.symbol === sym)!
                    const v = s[row.k as keyof typeof s] as number
                    return (
                      <td key={sym} className={row.k === 'roe' || row.k === 'epsGrowth' ? 'up' : ''}>
                        {num(v, row.d)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </Card>

        <Card title="Dữ liệu ngành tổng hợp" action={<Chip>18 ngành</Chip>}>
          <BarList
            rows={SECTORS.slice(0, 8).map((s) => ({
              name: s.name,
              value: s.turnover,
              color: s.pct > 0 ? '#2ec27b' : '#e5484d',
            }))}
            fmt={(v) => num(v, 0)}
            barWidth={86}
          />
          <div className="dim" style={{ fontSize: 10, marginTop: 8 }}>Thanh khoản theo ngành (tỷ VND)</div>
        </Card>

        <Card
          className="gold"
          title={
            <div className="ai-head">
              <IconLightning size={14} /> Trợ lý nghiên cứu AI
            </div>
          }
          action={<button className="btn xs gold-ghost" onClick={() => onNavigate('copilot')}>Mở Copilot</button>}
        >
          <div className="ai-list">
            {[
              'Tổng hợp 12 báo cáo phân tích về FPT trong 3 tháng gần nhất.',
              'So sánh chỉ số tài chính 4 doanh nghiệp cùng ngành bán lẻ.',
              'Đối chiếu số liệu KQKD với dữ liệu vĩ mô đã công bố.',
              'Kiểm chứng thông tin từ 3 nguồn độc lập trước khi kết luận.',
            ].map((t, i) => (
              <div className="ai-row" key={i} onClick={() => onNavigate('copilot')}>
                <span style={{ color: 'var(--kg-gold)', flexShrink: 0 }}>✦</span>
                <span className="grow">{t}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ---------- Tài liệu gần đây ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' }}>
        <Card title="Tài liệu nghiên cứu gần đây" action={<span className="card-link">Xem tất cả <IconArrowRight size={12} /></span>}>
          <div className="nav-list">
            {NEWS.slice(0, 6).map((n) => (
              <div className="nav-list-row" key={n.id} onClick={() => onNavigate('news')}>
                <IconDoc size={14} style={{ color: 'var(--tx-dim)', flexShrink: 0 }} />
                <span className="grow clamp-2">{n.title}</span>
                <span className="num" style={{ fontSize: 10, color: 'var(--tx-dim)', flexShrink: 0 }}>
                  {n.time}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Xu hướng tìm kiếm trong tuần">
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {[
              { t: 'Tác động Fed đến thị trường Việt Nam', c: 428 },
              { t: 'Cổ phiếu hưởng lợi đầu tư công', c: 362 },
              { t: 'Định giá ngành ngân hàng 2026', c: 318 },
              { t: 'AI & bán dẫn – cơ hội đầu tư', c: 296 },
              { t: 'Chiến lược phòng thủ Q4/2026', c: 214 },
            ].map((r) => (
              <div className="rank-row" key={r.t} onClick={() => setQ('')}>
                <span style={{ flex: 1, minWidth: 0, fontSize: 11.5, color: 'var(--tx)', lineHeight: 1.4 }}>{r.t}</span>
                <span className="row gap-6" style={{ flexShrink: 0 }}>
                  <span style={{ width: 42 }}>
                    <Sparkline data={[3, 5, 4, 7, 6, 9, 8]} height={16} fill={false} color="#d4af37" />
                  </span>
                  <span className="num" style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>{r.c}</span>
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="row gap-10" style={{ flexWrap: 'wrap' }}>
          <Badge tone="gold">6.388 tài liệu</Badge>
          <Badge tone="up">Cập nhật liên tục</Badge>
          <Badge tone="blue">Nguồn: HOSE, HNX, UPCoM, GSO, NHNN</Badge>
          <Chip onClick={() => onNavigate('report')}>Báo cáo KIMQUY</Chip>
        </div>
      </div>
    </>
  )
}