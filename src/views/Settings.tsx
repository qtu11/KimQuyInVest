/* ==========================================================================
   TRANG CÀI ĐẶT HỆ THỐNG — KIMQUY INVEST
   Quản lý hồ sơ, gói VIP Diamond, kết nối dữ liệu CTCK, cấu hình rủi ro & giao diện
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import {
  IconBell, IconCheck, IconChevronDown, IconClose, IconDoc, IconDownload,
  IconEye, IconGlobe, IconIdea, IconMail, IconPerformance, IconPortfolio,
  IconSecurity, IconSettings, IconShield, IconTrendUp, IconUser,
} from '../components/icons'
import { Badge, Card, Switch } from '../components/ui'

export function Settings({ onNavigate }: { onNavigate?: (p: PageKey, s?: string) => void }) {
  const [activeTab, setActiveTab] = useState<'profile' | 'broker' | 'risk' | 'notify' | 'appearance'>('profile')

  // State các cài đặt
  const [fullName, setFullName] = useState('Nguyễn Hoàng')
  const [email, setEmail] = useState('nguyenhoang.invest@kimquy.vn')
  const [phone, setPhone] = useState('0988 *** 999')
  const [riskProfile, setRiskProfile] = useState<'aggressive' | 'moderate' | 'conservative'>('aggressive')
  const [maxStockWeight, setMaxStockWeight] = useState(25)
  const [stopLossThreshold, setStopLossThreshold] = useState(7)
  const [takeProfitThreshold, setTakeProfitThreshold] = useState(20)

  // Thông báo
  const [emailReport, setEmailReport] = useState(true)
  const [telegramAlert, setTelegramAlert] = useState(true)
  const [priceVolAlert, setPriceVolAlert] = useState(true)
  const [copilotSignal, setCopilotSignal] = useState(true)

  // CTCK
  const [vpsConnected, setVpsConnected] = useState(true)
  const [tcbsConnected, setTcbsConnected] = useState(false)
  const [ssiConnected, setSsiConnected] = useState(false)

  const [savedNotice, setSavedNotice] = useState(false)

  const handleSave = () => {
    setSavedNotice(true)
    setTimeout(() => setSavedNotice(false), 2500)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Thông báo lưu thành công */}
      {savedNotice && (
        <div
          style={{
            background: 'rgba(34, 197, 94, 0.15)',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            color: '#22c55e',
            padding: '12px 18px',
            borderRadius: 'var(--r-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: 12.5,
          }}
        >
          <span>Đã lưu thành công các thay đổi cấu hình tài khoản và hệ thống.</span>
          <button
            onClick={() => setSavedNotice(false)}
            style={{ background: 'none', border: 'none', color: '#22c55e', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Grid Tabs và Nội dung cài đặt */}
      <div className="grid" style={{ gridTemplateColumns: '260px 1fr', gap: 20 }}>
        {/* Cột trái: Danh mục cài đặt */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            { id: 'profile', label: 'Hồ sơ & Gói Diamond', icon: IconUser },
            { id: 'broker', label: 'Kết nối CTCK & Dữ liệu', icon: IconTrendUp },
            { id: 'risk', label: 'Khẩu vị rủi ro & Danh mục', icon: IconShield },
            { id: 'notify', label: 'Thông báo & Tín hiệu', icon: IconBell },
            { id: 'appearance', label: 'Giao diện & Hệ thống', icon: IconSettings },
          ].map((tab) => {
            const Icon = tab.icon
            const active = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as never)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 'var(--r-md)',
                  background: active ? 'linear-gradient(90deg, rgba(212,175,55,0.18) 0%, rgba(212,175,55,0.04) 100%)' : 'rgba(255,255,255,0.02)',
                  border: `1px solid ${active ? 'var(--line-gold)' : 'transparent'}`,
                  color: active ? 'var(--kg-gold)' : 'var(--tx-mid)',
                  fontWeight: active ? 600 : 500,
                  fontSize: 12.5,
                  textAlign: 'left',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            )
          })}

          {/* Hộp thông tin gói Diamond */}
          <div
            style={{
              marginTop: 18,
              padding: 16,
              borderRadius: 'var(--r-lg)',
              background: 'linear-gradient(145deg, rgba(30, 24, 14, 0.8) 0%, rgba(15, 18, 22, 0.95) 100%)',
              border: '1px solid var(--line-gold)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--kg-gold)', fontSize: 12, fontWeight: 700 }}>
              <span>◆</span> KIMQUY DIAMOND VIP
            </div>
            <p style={{ fontSize: 10.5, color: 'var(--tx-mid)', lineHeight: 1.5, margin: '8px 0 12px' }}>
              Bạn đang sử dụng quyền lợi cao nhất: Truy cập mô hình AI Copilot 24/7, khuyến nghị độc quyền và phòng họp chiến lược.
            </p>
            <div style={{ fontSize: 10, color: 'var(--tx-dim)' }}>
              Hiệu lực đến: <strong style={{ color: 'var(--tx-hi)' }}>31/12/2027</strong>
            </div>
          </div>
        </div>

        {/* Cột phải: Form chi tiết theo Tab */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* TAB 1: PROFILE */}
          {activeTab === 'profile' && (
            <Card title="Thông tin hồ sơ cá nhân">
              <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--line)' }}>
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #e8c98a 0%, #a67c2e 100%)',
                    display: 'grid',
                    placeItems: 'center',
                    color: '#1a1405',
                    fontSize: 24,
                    fontWeight: 800,
                    boxShadow: '0 0 20px rgba(212,175,55,0.4)',
                  }}
                >
                  NH
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: 17, fontWeight: 700, color: '#fbf8f1' }}>{fullName}</span>
                    <Badge tone="gold">Diamond Member</Badge>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--tx-mid)', marginTop: 4 }}>
                    ID: KQ-888999 &bull; Tham gia từ: Tháng 10/2024 &bull; IP đăng nhập gần nhất: 118.70.12.*
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--tx-dim)', marginBottom: 6 }}>Họ và tên</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r-md)',
                      padding: '10px 14px',
                      color: '#fbf8f1',
                      fontSize: 12,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--tx-dim)', marginBottom: 6 }}>Địa chỉ Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r-md)',
                      padding: '10px 14px',
                      color: '#fbf8f1',
                      fontSize: 12,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--tx-dim)', marginBottom: 6 }}>Số điện thoại (Nhận OTP)</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    style={{
                      width: '100%',
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid var(--line)',
                      borderRadius: 'var(--r-md)',
                      padding: '10px 14px',
                      color: '#fbf8f1',
                      fontSize: 12,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: 'var(--tx-dim)', marginBottom: 6 }}>Xác thực 2 bước (2FA)</label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: 'var(--r-md)' }}>
                    <span style={{ fontSize: 11.5, color: '#22c55e', fontWeight: 600 }}>Đã kích hoạt Google Authenticator</span>
                    <button className="btn xs">Quản lý</button>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: 24, display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
                <button className="btn sm gold" onClick={handleSave}>Lưu thông tin</button>
              </div>
            </Card>
          )}

          {/* TAB 2: BROKER & CTCK */}
          {activeTab === 'broker' && (
            <Card title="Kết nối tài khoản Công ty Chứng khoán (CTCK)">
              <p style={{ fontSize: 11.5, color: 'var(--tx-mid)', marginBottom: 18, lineHeight: 1.6 }}>
                Đồng bộ danh mục thực tế, lịch sử lệnh và tỷ trọng margin theo thời gian thực qua Open API bảo mật cấp ngân hàng.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {/* VPS */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#dc2626', display: 'grid', placeItems: 'center', fontWeight: 800, color: '#fff', fontSize: 13 }}>
                      VPS
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fbf8f1' }}>VPS Securities (Tiểu khoản 01 - Đuôi 1)</div>
                      <div style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>Tài khoản: 182736 &bull; Đồng bộ lần cuối: 2 phút trước</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Badge tone="up">Đang kết nối</Badge>
                    <button className="btn xs" onClick={() => setVpsConnected(!vpsConnected)}>
                      {vpsConnected ? 'Ngắt kết nối' : 'Kết nối lại'}
                    </button>
                  </div>
                </div>

                {/* TCBS */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#1d4ed8', display: 'grid', placeItems: 'center', fontWeight: 800, color: '#fff', fontSize: 13 }}>
                      TCBS
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fbf8f1' }}>Techcom Securities (iCopy / iInvest)</div>
                      <div style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>Chưa liên kết tài khoản giao dịch</div>
                    </div>
                  </div>
                  <button className="btn xs gold" onClick={() => setTcbsConnected(true)}>
                    + Kết nối TCBS
                  </button>
                </div>

                {/* SSI */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 8, background: '#059669', display: 'grid', placeItems: 'center', fontWeight: 800, color: '#fff', fontSize: 13 }}>
                      SSI
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#fbf8f1' }}>SSI Securities (iBoard FastConnect)</div>
                      <div style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>Chưa liên kết tài khoản giao dịch</div>
                    </div>
                  </div>
                  <button className="btn xs gold" onClick={() => setSsiConnected(true)}>
                    + Kết nối SSI
                  </button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 3: RISK PROFILE */}
          {activeTab === 'risk' && (
            <Card title="Khẩu vị rủi ro & Quản trị kỷ luật">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--tx-hi)', marginBottom: 8 }}>
                    Chiến lược đầu tư chủ đạo
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      { id: 'aggressive', title: 'Tăng trưởng chủ động', desc: 'Tập trung cổ phiếu dẫn dắt (Leader), xu hướng mạnh, chấp nhận biến động ngắn hạn' },
                      { id: 'moderate', title: 'Cân bằng & Linh hoạt', desc: 'Kết hợp cổ phiếu vốn hóa lớn, cổ tức đều đặn và một phần tăng trưởng' },
                      { id: 'conservative', title: 'Bảo toàn & Phòng thủ', desc: 'Ưu tiên tiền gửi, trái phiếu và cổ phiếu tiện ích giá trị ổn định' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setRiskProfile(opt.id as never)}
                        style={{
                          padding: '14px 12px',
                          borderRadius: 'var(--r-md)',
                          background: riskProfile === opt.id ? 'rgba(212,175,55,0.12)' : 'rgba(255,255,255,0.03)',
                          border: `1px solid ${riskProfile === opt.id ? 'var(--line-gold)' : 'var(--line)'}`,
                          textAlign: 'left',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: riskProfile === opt.id ? 'var(--kg-gold)' : '#fbf8f1' }}>
                          {opt.title}
                        </div>
                        <div style={{ fontSize: 10.5, color: 'var(--tx-mid)', marginTop: 6, lineHeight: 1.4 }}>
                          {opt.desc}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, paddingTop: 14, borderTop: '1px solid var(--line)' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--tx-dim)', marginBottom: 6 }}>
                      Tỷ trọng tối đa cho 1 cổ phiếu
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number"
                        value={maxStockWeight}
                        onChange={(e) => setMaxStockWeight(Number(e.target.value))}
                        style={{ width: 80, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', color: '#fff', fontSize: 12 }}
                      />
                      <span style={{ fontSize: 12, color: 'var(--tx-mid)' }}>% NAV</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--tx-dim)', marginBottom: 6 }}>
                      Ngưỡng cắt lỗ kỷ luật
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number"
                        value={stopLossThreshold}
                        onChange={(e) => setStopLossThreshold(Number(e.target.value))}
                        style={{ width: 80, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', color: '#ef4444', fontSize: 12 }}
                      />
                      <span style={{ fontSize: 12, color: 'var(--tx-mid)' }}>% giá vốn</span>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--tx-dim)', marginBottom: 6 }}>
                      Ngưỡng chốt lời từng phần
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <input
                        type="number"
                        value={takeProfitThreshold}
                        onChange={(e) => setTakeProfitThreshold(Number(e.target.value))}
                        style={{ width: 80, padding: '8px 10px', background: 'rgba(255,255,255,0.04)', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', color: '#22c55e', fontSize: 12 }}
                      />
                      <span style={{ fontSize: 12, color: 'var(--tx-mid)' }}>% giá vốn</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                  <button className="btn sm gold" onClick={handleSave}>Lưu cấu hình rủi ro</button>
                </div>
              </div>
            </Card>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notify' && (
            <Card title="Cấu hình nhận thông báo & Tín hiệu thị trường">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { state: emailReport, setter: setEmailReport, title: 'Báo cáo Daily Recap qua Email', desc: 'Nhận bản tóm tắt thị trường, dòng tiền và cơ hội lúc 17:30 mỗi ngày giao dịch.' },
                  { state: telegramAlert, setter: setTelegramAlert, title: 'Cảnh báo biến động nhanh qua Telegram / App', desc: 'Thông báo tức thì khi cổ phiếu trong danh mục tăng/giảm trên 3% hoặc thanh khoản đột biến.' },
                  { state: copilotSignal, setter: setCopilotSignal, title: 'Tín hiệu AI Copilot khuyến nghị mới', desc: 'Thông báo khi AI phân tích phát hiện điểm mua vượt đỉnh hoặc tín hiệu phân kỳ rủi ro.' },
                  { state: priceVolAlert, setter: setPriceVolAlert, title: 'Thông báo khối ngoại và tự doanh mua ròng đột biến', desc: 'Báo cáo ngay khi dòng tiền lớn giải ngân trên 200 tỷ vào một mã hoặc nhóm ngành.' },
                ].map((n, i) => (
                  <div
                    key={i}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: 'rgba(255,255,255,0.03)',
                      borderRadius: 'var(--r-md)',
                      border: '1px solid var(--line)',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fbf8f1' }}>{n.title}</div>
                      <div style={{ fontSize: 10.5, color: 'var(--tx-mid)', marginTop: 2 }}>{n.desc}</div>
                    </div>
                    <button
                      className="btn xs"
                      onClick={() => n.setter(!n.state)}
                      style={{
                        background: n.state ? 'var(--kg-gold)' : 'rgba(255,255,255,0.1)',
                        color: n.state ? '#121212' : '#fff',
                        fontWeight: 700,
                      }}
                    >
                      {n.state ? 'BẬT' : 'TẮT'}
                    </button>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* TAB 5: APPEARANCE */}
          {activeTab === 'appearance' && (
            <Card title="Giao diện & Trải nghiệm hệ thống">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11.5, fontWeight: 600, color: 'var(--tx-hi)', marginBottom: 8 }}>
                    Chủ đề giao diện (Theme)
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div style={{ padding: 14, background: '#0a0d10', border: '2px solid var(--kg-gold)', borderRadius: 'var(--r-md)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--kg-gold)' }}>KIMQUY Obsidian Gold (Mặc định)</span>
                        <Badge tone="gold">Đang chọn</Badge>
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--tx-mid)', marginTop: 6 }}>
                        Tối ưu cho nhà đầu tư chuyên nghiệp: Giảm mỏi mắt khi quan sát bảng giá thời gian dài.
                      </div>
                    </div>
                    <div style={{ padding: 14, background: '#14181c', border: '1px solid var(--line)', borderRadius: 'var(--r-md)', opacity: 0.6 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--tx-hi)' }}>Deep Cyber Platinum</span>
                        <span style={{ fontSize: 10, color: 'var(--tx-dim)' }}>Sắp ra mắt</span>
                      </div>
                      <div style={{ fontSize: 10.5, color: 'var(--tx-dim)', marginTop: 6 }}>
                        Tông màu xám bạch kim hiện đại chuẩn phong cách Wall Street.
                      </div>
                    </div>
                  </div>
                </div>

                <div style={{ paddingTop: 14, borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 12.5, fontWeight: 600, color: '#fbf8f1' }}>Băng thông dữ liệu thời gian thực (Live Ticker)</div>
                    <div style={{ fontSize: 10.5, color: 'var(--tx-mid)' }}>Hiển thị dải chỉ số VN-Index, HNX, UPCOM, Hàng hóa liên tục ở chân trang.</div>
                  </div>
                  <Badge tone="up">BẬT</Badge>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}