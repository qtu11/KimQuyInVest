/* ==========================================================================
   TRANG CẢNH BÁO & CÀI ĐẶT
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import { IconBell, IconCheck, IconLightning, IconPlus, IconSettings, IconShield } from '../components/icons'
import { Badge, Card, Chip, Segmented, Tabs } from '../components/ui'
import { NOTICES } from '../data/portfolio'
import { STOCKS } from '../data/market'
import { dirClass, num } from '../lib/format'

/* ==========================================================================
   CẢNH BÁO
   ========================================================================== */

const ATABS = ['Tất cả', 'Giá & Khối lượng', 'Danh mục', 'Sự kiện', 'Đã tắt'] as const
type ATab = (typeof ATABS)[number]

type Rule = {
  id: number
  symbol: string
  type: string
  condition: string
  channel: string
  on: boolean
  hits: number
  last?: string
}

const RULES: Rule[] = [
  { id: 1, symbol: 'FPT', type: 'Giá', condition: 'Vượt 130.000 VND', channel: 'Email + App', on: true, hits: 1, last: '22/09/2026 10:15' },
  { id: 2, symbol: 'HSG', type: 'Giá', condition: 'Giảm dưới 20.000 VND', channel: 'App', on: true, hits: 3, last: '22/09/2026 09:42' },
  { id: 3, symbol: 'MWG', type: 'Khối lượng', condition: 'KLGD > 2× TB20', channel: 'Email', on: true, hits: 0 },
  { id: 4, symbol: 'Core Portfolio', type: 'Danh mục', condition: 'Tỷ trọng ngành > 35%', channel: 'Email + App', on: true, hits: 0 },
  { id: 5, symbol: 'Core Portfolio', type: 'Danh mục', condition: 'Drawdown > -15%', channel: 'App', on: true, hits: 0 },
  { id: 6, symbol: 'HPG', type: 'Sự kiện', condition: 'ĐHCĐ bất thường 24/09', channel: 'Email', on: true, hits: 0 },
  { id: 7, symbol: 'VCB', type: 'Giá', condition: 'Giảm về 88.000 VND', channel: 'App', on: false, hits: 2, last: '18/09/2026 14:20' },
  { id: 8, symbol: 'TCB', type: 'RSI', condition: 'RSI < 30 (quá bán)', channel: 'App', on: true, hits: 0 },
]

export function Alerts({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<ATab>('Tất cả')
  const [rules, setRules] = useState(RULES)

  const list = rules.filter((r) => {
    if (tab === 'Đã tắt') return !r.on
    if (tab === 'Tất cả') return true
    if (tab === 'Giá & Khối lượng') return r.type === 'Giá' || r.type === 'Khối lượng' || r.type === 'RSI'
    if (tab === 'Danh mục') return r.type === 'Danh mục'
    if (tab === 'Sự kiện') return r.type === 'Sự kiện'
    return true
  })

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={ATABS} value={tab} onChange={setTab} />
        <button className="btn sm gold">
          <IconPlus size={13} /> Tạo cảnh báo mới
        </button>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {[
          { l: 'Cảnh báo đang bật', v: String(rules.filter((r) => r.on).length), d: 'Đang hoạt động' },
          { l: 'Kích hoạt hôm nay', v: '2', d: 'FPT · HSG' },
          { l: 'Kích hoạt 7 ngày', v: '6', d: 'Xu hướng tăng nhẹ' },
          { l: 'Tỷ lệ chính xác', v: '92%', d: '11/12 tín hiệu hữu ích' },
        ].map((s) => (
          <div className="stat" key={s.l}>
            <div className="stat-label">{s.l}</div>
            <div className="stat-value stat-xl">{s.v}</div>
            <div className="stat-sub">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.7fr) minmax(0,1fr)' }}>
        <Card title="Danh sách cảnh báo" action={<Segmented options={['Tất cả', 'Đang bật', 'Đã tắt']} value="Tất cả" onChange={() => {}} />}>
          <div className="table-wrap" style={{ maxHeight: 430 }}>
            <table className="data">
              <thead>
                <tr>
                  <th className="l">Mã / Đối tượng</th>
                  <th className="l">Loại</th>
                  <th className="l">Điều kiện</th>
                  <th className="l">Kênh nhận</th>
                  <th>Số lần</th>
                  <th className="l">Lần cuối</th>
                  <th className="l" style={{ width: 70 }}>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {list.map((r) => (
                  <tr key={r.id}>
                    <td className="l ticker-cell">{r.symbol}</td>
                    <td className="l">
                      <Badge tone={r.type === 'Giá' ? 'blue' : r.type === 'Danh mục' ? 'violet' : r.type === 'Sự kiện' ? 'teal' : 'gold'}>
                        {r.type}
                      </Badge>
                    </td>
                    <td className="l" style={{ color: 'var(--tx)' }}>{r.condition}</td>
                    <td className="l co-name">{r.channel}</td>
                    <td className="num">{r.hits}</td>
                    <td className="l num co-name">{r.last ?? '—'}</td>
                    <td className="l">
                      <button
                        onClick={() => setRules((p) => p.map((x) => (x.id === r.id ? { ...x, on: !x.on } : x)))}
                        style={{
                          width: 34,
                          height: 18,
                          borderRadius: 9,
                          background: r.on ? 'var(--grad-gold-btn)' : '#262626',
                          border: `1px solid ${r.on ? 'rgba(246,230,180,0.45)' : 'var(--line-strong)'}`,
                          position: 'relative',
                          cursor: 'pointer',
                          flexShrink: 0,
                        }}
                        aria-label={r.on ? 'Tắt cảnh báo' : 'Bật cảnh báo'}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            top: 1.5,
                            left: r.on ? 17 : 2,
                            width: 13,
                            height: 13,
                            borderRadius: '50%',
                            background: r.on ? '#1d1602' : '#6b6b6b',
                            transition: 'left var(--dur-2) var(--ease)',
                          }}
                        />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Thông báo gần đây">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {NOTICES.map((n) => (
                <div
                  key={n.id}
                  className="row gap-9"
                  style={{ padding: '9px 0', borderBottom: '1px solid var(--line-soft)', alignItems: 'flex-start', gap: 9 }}
                >
                  <span
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      marginTop: 6,
                      flexShrink: 0,
                      background: n.tone === 'up' ? 'var(--up)' : n.tone === 'down' ? 'var(--down)' : 'var(--kg-gold)',
                    }}
                  />
                  <span style={{ minWidth: 0, flex: 1 }}>
                    <span style={{ display: 'block', fontSize: 11.5, color: n.read ? 'var(--tx-mid)' : 'var(--tx-hi)', fontWeight: n.read ? 400 : 550 }}>
                      {n.title}
                    </span>
                    <span className="clamp-2" style={{ display: 'block', fontSize: 10.5, color: 'var(--tx-dim)', marginTop: 2, lineHeight: 1.45 }}>
                      {n.body}
                    </span>
                    <span style={{ display: 'block', fontSize: 10, color: 'var(--tx-faint)', marginTop: 3 }}>{n.time}</span>
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card
            className="gold"
            title={
              <div className="ai-head">
                <IconLightning size={14} /> Gợi ý cảnh báo từ AI
              </div>
            }
            action={<button className="btn xs gold-ghost" onClick={() => onNavigate('copilot')}>Hỏi AI</button>}
          >
            <div className="ai-list">
              {[
                'Đặt cảnh báo khi tỷ trọng Ngân hàng vượt 33% — hiện đang ở 32%.',
                'Theo dõi FPT quanh vùng 130.000 VND để cân nhắc chốt lời một phần.',
                'Cảnh báo khi HSG giảm dưới 18.000 VND — vi phạm ngưỡng cắt lỗ -8%.',
                'Theo dõi sự kiện Fed họp chính sách hôm nay lúc 23:00.',
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

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)' }}>
        <Card title="Biến động đáng chú ý hôm nay">
          <table className="data">
            <thead>
              <tr>
                <th className="l">Mã</th>
                <th className="l">Tín hiệu</th>
                <th>Giá</th>
                <th>Thay đổi</th>
                <th className="l">Mức độ</th>
              </tr>
            </thead>
            <tbody>
              {[
                { s: 'HSG', sig: 'Giảm sàn, khối lượng đột biến', lv: 5 },
                { s: 'FPT', sig: 'Vượt đỉnh 52 tuần', lv: 4 },
                { s: 'MWG', sig: 'Khối lượng gấp 2,4× trung bình', lv: 4 },
                { s: 'HVN', sig: 'Tăng trần, dòng tiền vào mạnh', lv: 3 },
                { s: 'VIX', sig: 'Breakout khỏi nền tích luỹ', lv: 3 },
              ].map((r) => {
                const st = STOCKS.find((x) => x.symbol === r.s)!
                return (
                  <tr key={r.s} className="clickable" onClick={() => onNavigate('stock', r.s)}>
                    <td className="l ticker-cell">{r.s}</td>
                    <td className="l co-name">{r.sig}</td>
                    <td className="num">{num(st.price, 0)}</td>
                    <td className={`num ${dirClass(st.changePct)}`} style={{ fontWeight: 600 }}>
                      {st.changePct > 0 ? '+' : ''}
                      {num(st.changePct, 2)}%
                    </td>
                    <td className="l">
                      <span className="seg-meter">
                        {Array.from({ length: 5 }, (_, i) => (
                          <i key={i} className={i < r.lv ? `on ${r.lv >= 4 ? 'lv-high' : 'lv-mid'}` : ''} style={{ width: 9, height: 5 }} />
                        ))}
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>

        <Card title="Kênh nhận thông báo">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {[
              { n: 'Email', d: 'nguyen.hoang@email.com', on: true },
              { n: 'Ứng dụng di động', d: 'Thông báo đẩy', on: true },
              { n: 'Zalo', d: 'Chưa liên kết', on: false },
              { n: 'Telegram', d: 'Chưa liên kết', on: false },
            ].map((c) => (
              <div className="row-between gap-10" key={c.n}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 11.5, color: 'var(--tx)', fontWeight: 550 }}>{c.n}</div>
                  <div className="truncate" style={{ fontSize: 10, color: 'var(--tx-dim)' }}>{c.d}</div>
                </div>
                <Badge tone={c.on ? 'up' : 'flat'}>{c.on ? 'Đang bật' : 'Tắt'}</Badge>
              </div>
            ))}
          </div>
          <button className="btn gold-ghost" style={{ marginTop: 13, width: '100%' }}>
            <IconBell size={13} /> Cấu hình kênh nhận
          </button>
        </Card>
      </div>
    </>
  )
}

/* ==========================================================================
   CÀI ĐẶT
   ========================================================================== */

const STABS = ['Hồ sơ & Mục tiêu', 'Khẩu vị rủi ro', 'Thông báo', 'Giao diện', 'Bảo mật', 'Gói dịch vụ'] as const
type STab = (typeof STABS)[number]

export function Settings() {
  const [tab, setTab] = useState<STab>('Hồ sơ & Mục tiêu')
  const [risk, setRisk] = useState(62)
  const [theme, setTheme] = useState('Tối (mặc định)')
  const [density, setDensity] = useState('Tiêu chuẩn')
  const [notif, setNotif] = useState([
    { l: 'Cảnh báo giá & khối lượng', on: true },
    { l: 'Thay đổi tỷ trọng danh mục', on: true },
    { l: 'Báo cáo định kỳ qua email', on: true },
    { l: 'Sự kiện doanh nghiệp', on: true },
    { l: 'Tin tức vĩ mô quan trọng', on: false },
    { l: 'Gợi ý từ AI KIMQUY', on: true },
  ])

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <Tabs tabs={STABS} value={tab} onChange={setTab} />
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.5fr) minmax(0,1fr)' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Hồ sơ nhà đầu tư">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
              <div className="field">
                <label className="field-label">Họ và tên</label>
                <input className="input" defaultValue="Nguyễn Hoàng" />
              </div>
              <div className="field">
                <label className="field-label">Email</label>
                <input className="input" defaultValue="nguyen.hoang@email.com" />
              </div>
              <div className="field">
                <label className="field-label">Số điện thoại</label>
                <input className="input" defaultValue="0912 345 678" />
              </div>
              <div className="field">
                <label className="field-label">Gói dịch vụ</label>
                <select className="input" defaultValue="Diamond">
                  {['Basic', 'Premium', 'Diamond'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </Card>

          <Card title="Mục tiêu đầu tư">
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 13 }}>
              <div className="field">
                <label className="field-label">Mục tiêu tài chính</label>
                <select className="input" defaultValue="Tăng trưởng dài hạn">
                  {['Tăng trưởng dài hạn', 'Thu nhập cổ tức', 'Bảo toàn vốn', 'Đầu cơ ngắn hạn'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Thời gian đầu tư</label>
                <select className="input" defaultValue="Trên 5 năm">
                  {['Dưới 1 năm', '1 – 3 năm', '3 – 5 năm', 'Trên 5 năm'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Mục tiêu lợi nhuận / năm</label>
                <input className="input" defaultValue="15%" />
              </div>
              <div className="field">
                <label className="field-label">Ngưỡng cắt lỗ tối đa</label>
                <input className="input" defaultValue="-8%" />
              </div>
            </div>
          </Card>

          <Card title="Khẩu vị rủi ro">
            <div className="row-between" style={{ marginBottom: 12 }}>
              <span className="mini-label">Mức chấp nhận rủi ro</span>
              <span className="gold" style={{ fontSize: 14, fontWeight: 650 }}>
                {risk < 34 ? 'Thấp' : risk < 67 ? 'Trung bình' : 'Cao'}
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={risk}
              onChange={(e) => setRisk(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--kg-gold)' }}
              aria-label="Mức chấp nhận rủi ro"
            />
            <div className="row-between" style={{ marginTop: 5 }}>
              <span style={{ fontSize: 10, color: 'var(--tx-dim)' }}>Thấp</span>
              <span style={{ fontSize: 10, color: 'var(--tx-dim)' }}>Trung bình</span>
              <span style={{ fontSize: 10, color: 'var(--tx-dim)' }}>Cao</span>
            </div>

            <div className="callout" style={{ marginTop: 14 }}>
              <div className="callout-title"><IconShield size={13} /> Phân bổ khuyến nghị theo khẩu vị hiện tại</div>
              <ul>
                <li>Cổ phiếu: {risk < 34 ? '40%' : risk < 67 ? '60%' : '75%'}</li>
                <li>Trái phiếu: {risk < 34 ? '40%' : risk < 67 ? '25%' : '10%'}</li>
                <li>Tiền mặt & tương đương: {risk < 34 ? '15%' : risk < 67 ? '10%' : '10%'}</li>
                <li>Vàng & tài sản khác: {risk < 34 ? '5%' : risk < 67 ? '5%' : '5%'}</li>
              </ul>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Thông báo">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notif.map((n, i) => (
                <button
                  key={n.l}
                  className="row-between gap-10"
                  style={{ background: 'none', cursor: 'pointer', width: '100%' }}
                  onClick={() => setNotif((p) => p.map((x, xi) => (xi === i ? { ...x, on: !x.on } : x)))}
                >
                  <span style={{ fontSize: 11.5, color: n.on ? 'var(--tx)' : 'var(--tx-mid)', textAlign: 'left' }}>
                    {n.l}
                  </span>
                  <span
                    style={{
                      width: 34,
                      height: 18,
                      borderRadius: 9,
                      background: n.on ? 'var(--grad-gold-btn)' : '#262626',
                      border: `1px solid ${n.on ? 'rgba(246,230,180,0.45)' : 'var(--line-strong)'}`,
                      position: 'relative',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: 1.5,
                        left: n.on ? 17 : 2,
                        width: 13,
                        height: 13,
                        borderRadius: '50%',
                        background: n.on ? '#1d1602' : '#6b6b6b',
                        transition: 'left var(--dur-2) var(--ease)',
                      }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </Card>

          <Card title="Giao diện">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 13 }}>
              <div className="field">
                <label className="field-label">Chủ đề màu</label>
                <select className="input sm" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  {['Tối (mặc định)', 'Tối – Tương phản cao', 'Theo hệ thống'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="field">
                <label className="field-label">Mật độ hiển thị</label>
                <Segmented options={['Gọn', 'Tiêu chuẩn', 'Thoáng'] as const} value={density as never} onChange={setDensity} />
              </div>
              <div className="field">
                <label className="field-label">Trang mặc định</label>
                <select className="input sm" defaultValue="Tổng quan">
                  {['Tổng quan', 'Thị trường', 'Danh mục của tôi', 'Tin tức & Sự kiện'].map((o) => <option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
          </Card>

          <Card
            className="gold"
            title={
              <div className="ai-head">
                <span>◆</span> KIMQUY Diamond
              </div>
            }
          >
            <p style={{ fontSize: 11, color: 'var(--tx-mid)', lineHeight: 1.6 }}>
              Exclusive insights. Priority opportunities. A higher perspective.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, marginTop: 11 }}>
              {['Báo cáo chuyên sâu không giới hạn', 'AI Copilot ưu tiên', 'Cảnh báo thời gian thực', 'Hỗ trợ chuyên gia 1:1'].map((f) => (
                <div className="row gap-7" key={f} style={{ fontSize: 11, color: 'var(--tx)' }}>
                  <span style={{ color: 'var(--kg-gold)', flexShrink: 0 }}><IconCheck size={12} /></span>
                  {f}
                </div>
              ))}
            </div>
            <div className="row-between" style={{ marginTop: 13 }}>
              <Badge tone="gold">Đang sử dụng</Badge>
              <span className="dim" style={{ fontSize: 10.5 }}>Hiệu lực đến 22/09/2027</span>
            </div>
          </Card>

          <Card title="Bảo mật">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
              {[
                { l: 'Xác thực 2 yếu tố (2FA)', s: 'Đang bật' },
                { l: 'Thiết bị tin cậy', s: '2 thiết bị' },
                { l: 'Lần đăng nhập gần nhất', s: '22/09/2026 08:12' },
                { l: 'Mã hoá dữ liệu', s: 'AES-256' },
              ].map((r) => (
                <div className="row-between gap-10" key={r.l}>
                  <span style={{ fontSize: 11.5, color: 'var(--tx-mid)' }}>{r.l}</span>
                  <span className="num" style={{ fontSize: 11, color: 'var(--tx-hi)', fontWeight: 550 }}>{r.s}</span>
                </div>
              ))}
            </div>
            <button className="btn gold-ghost" style={{ marginTop: 13, width: '100%' }}>
              <IconSettings size={13} /> Quản lý bảo mật
            </button>
          </Card>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="row gap-10" style={{ justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <Chip>Đặt lại mặc định</Chip>
          <button className="btn gold">
            <IconCheck size={13} /> Lưu thay đổi
          </button>
        </div>
      </div>
    </>
  )
}