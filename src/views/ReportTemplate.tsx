/* ==========================================================================
   BẢN MẪU BÁO CÁO DAILY RECAP — CHUẨN ẤN PHẨM KIMQUY INVEST
   Bám sát thiết kế report template.png
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import { Sparkline } from '../components/charts'
import {
  IconArrowLeft, IconArrowRight, IconCalendar, IconCheck, IconChevronDown,
  IconDownload, IconGlobe, IconMail, IconPrinter, IconShare, IconTrendUp,
} from '../components/icons'
import { Art } from '../components/Art'

export function ReportTemplate({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [copied, setCopied] = useState(false)

  const handlePrint = () => {
    window.print()
  }

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="report-template-wrapper" style={{ paddingBottom: 60 }}>
      {/* Thanh công cụ điều khiển đầu trang */}
      <div
        className="no-print"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 20,
          padding: '12px 18px',
          background: 'rgba(18, 22, 26, 0.85)',
          backdropFilter: 'blur(12px)',
          borderRadius: 'var(--r-lg)',
          border: '1px solid var(--line-gold)',
        }}
      >
        <button
          className="btn sm"
          onClick={() => onNavigate('report')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
        >
          <IconArrowLeft size={14} /> Quay lại danh sách báo cáo
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 12, color: 'var(--tx-mid)' }}>Ấn phẩm ngày 23/09/2026 • Số phát hành #284</span>
          <button
            className="btn sm"
            onClick={handleShare}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <IconShare size={13} /> {copied ? 'Đã sao chép link!' : 'Chia sẻ'}
          </button>
          <button
            className="btn sm gold"
            onClick={handlePrint}
            style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <IconPrinter size={13} /> In / Xuất PDF
          </button>
        </div>
      </div>

      {/* TỜ ẤN PHẨM DAILY RECAP (A4 / Presentation Aspect) */}
      <div
        className="daily-recap-poster"
        style={{
          maxWidth: 1080,
          margin: '0 auto',
          background: '#090d10',
          border: '1px solid rgba(212, 175, 55, 0.35)',
          borderRadius: 'var(--r-xl)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.85), 0 0 40px rgba(212,175,55,0.08)',
          overflow: 'hidden',
          position: 'relative',
          padding: '36px 40px',
        }}
      >
        {/* Lớp nền vàng kim hoàng hôn mờ ảo */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 280,
            background: 'radial-gradient(ellipse at 50% -20%, rgba(212,175,55,0.18), transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* ----------------- HEADER BÁO CÁO ----------------- */}
        <header
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
            paddingBottom: 24,
            marginBottom: 28,
            position: 'relative',
          }}
        >
          {/* Logo & Tagline */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <img
              src="/asset/logo-remove-background.png"
              alt="KIMQUY Invest"
              style={{ width: 52, height: 52, objectFit: 'contain', filter: 'drop-shadow(0 0 12px rgba(212,175,55,0.4))' }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 24, fontWeight: 700, letterSpacing: '0.12em', color: '#fbf8f1' }}>
                KIMQUY <span style={{ color: 'var(--kg-gold)' }}>INVEST</span>
              </div>
              <div style={{ fontSize: 10.5, letterSpacing: '0.18em', color: 'rgba(232, 201, 138, 0.8)', textTransform: 'uppercase' }}>
                Intelligence for a Greater Tomorrow
              </div>
              <div style={{ fontSize: 9.5, letterSpacing: '0.22em', color: 'var(--tx-dim)', marginTop: 4, textTransform: 'uppercase' }}>
                DỮ LIỆU &bull; PHÂN TÍCH &bull; GÓC NHÌN &bull; HÀNH ĐỘNG
              </div>
            </div>
          </div>

          {/* Slogan góc phải & Ngày phát hành */}
          <div style={{ textAlign: 'right' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.25)', padding: '5px 12px', borderRadius: 6, marginBottom: 8 }}>
              <IconCalendar size={13} style={{ color: 'var(--kg-gold)' }} />
              <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx-hi)', letterSpacing: '0.04em' }}>
                Thứ Ba, 23/09/2026
              </span>
            </div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: 10, letterSpacing: '0.2em', color: 'rgba(232,201,138,0.7)', textTransform: 'uppercase' }}>
              DISCIPLINE CREATES FREEDOM
            </div>
            <div style={{ fontSize: 11.5, fontStyle: 'italic', color: 'var(--tx-mid)', marginTop: 4 }}>
              &ldquo;Hiểu thị trường để đầu tư tốt hơn.&rdquo;
            </div>
            <div style={{ fontSize: 9.5, letterSpacing: '0.1em', color: 'var(--kg-gold)', fontWeight: 600 }}>
              KIMQUY INVEST
            </div>
          </div>
        </header>

        {/* TIÊU ĐỀ BÁO CÁO TO BẢN */}
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 38,
              fontWeight: 800,
              letterSpacing: '0.16em',
              margin: '0 0 6px',
              background: 'linear-gradient(180deg, #ffffff 0%, #ecd599 70%, #c5a059 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textTransform: 'uppercase',
            }}
          >
            DAILY RECAP
          </h1>
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 600,
              letterSpacing: '0.24em',
              color: 'rgba(232, 201, 138, 0.95)',
              textTransform: 'uppercase',
            }}
          >
            THỊ TRƯỜNG HÔM NAY — CƠ HỘI CHO NGÀY MAI
          </div>
        </div>

        {/* ----------------- NỘI DUNG 8 PHẦN ----------------- */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {/* PHẦN 01: TỔNG QUAN THỊ TRƯỜNG */}
          <section
            style={{
              background: 'rgba(16, 20, 24, 0.7)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 'var(--r-lg)',
              padding: '18px 22px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <span
                style={{
                  display: 'inline-block',
                  background: 'var(--kg-gold)',
                  color: '#080b0e',
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                01
              </span>
              <div>
                <span style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: '#fbf8f1', textTransform: 'uppercase' }}>
                  TỔNG QUAN THỊ TRƯỜNG
                </span>
                <span style={{ fontSize: 11.5, color: 'var(--tx-mid)', marginLeft: 12 }}>
                  Thị trường duy trì đà phục hồi, dòng tiền tập trung vào nhóm vốn hóa lớn.
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr) 1.4fr', gap: 14 }}>
              {/* VN-INDEX */}
              <div
                style={{
                  background: 'rgba(24, 30, 36, 0.65)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: 10.5, color: 'var(--tx-dim)', fontWeight: 600 }}>VN-INDEX</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '4px 0' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--up)' }}>1,285.4</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--up)' }}>+12.6 (+0.99%)</span>
                </div>
                <div style={{ height: 32, margin: '6px 0' }}>
                  <Sparkline data={[1272, 1274, 1276, 1275, 1278, 1280, 1282, 1285.4]} height={32} color="var(--up)" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--tx-dim)', paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>GTGD: <strong style={{ color: 'var(--tx-hi)' }}>23,562 tỷ</strong></span>
                  <span>KLGD: <strong style={{ color: 'var(--tx-hi)' }}>1,025 tr CP</strong></span>
                </div>
              </div>

              {/* HNX-INDEX */}
              <div
                style={{
                  background: 'rgba(24, 30, 36, 0.65)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: 10.5, color: 'var(--tx-dim)', fontWeight: 600 }}>HNX-INDEX</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '4px 0' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--up)' }}>235.1</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--up)' }}>+1.8 (+0.77%)</span>
                </div>
                <div style={{ height: 32, margin: '6px 0' }}>
                  <Sparkline data={[233, 233.5, 234, 233.8, 234.5, 234.8, 235.1]} height={32} color="var(--up)" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--tx-dim)', paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>GTGD: <strong style={{ color: 'var(--tx-hi)' }}>1,984 tỷ</strong></span>
                  <span>KLGD: <strong style={{ color: 'var(--tx-hi)' }}>162 tr CP</strong></span>
                </div>
              </div>

              {/* UPCOM-INDEX */}
              <div
                style={{
                  background: 'rgba(24, 30, 36, 0.65)',
                  border: '1px solid rgba(34, 197, 94, 0.25)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 14px',
                }}
              >
                <div style={{ fontSize: 10.5, color: 'var(--tx-dim)', fontWeight: 600 }}>UPCOM-INDEX</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, margin: '4px 0' }}>
                  <span style={{ fontSize: 20, fontWeight: 700, color: 'var(--up)' }}>96.4</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--up)' }}>+1.8 (+0.31%)</span>
                </div>
                <div style={{ height: 32, margin: '6px 0' }}>
                  <Sparkline data={[94.5, 95, 95.2, 95.8, 96.1, 96.4]} height={32} color="var(--up)" />
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--tx-dim)', paddingTop: 6, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  <span>GTGD: <strong style={{ color: 'var(--tx-hi)' }}>892 tỷ</strong></span>
                  <span>KLGD: <strong style={{ color: 'var(--tx-hi)' }}>78 tr CP</strong></span>
                </div>
              </div>

              {/* DIỄN BIẾN TRONG PHIÊN */}
              <div
                style={{
                  background: 'rgba(24, 30, 36, 0.65)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: 'var(--r-md)',
                  padding: '12px 14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 10.5, fontWeight: 600, color: 'var(--tx-hi)' }}>DIỄN BIẾN TRONG PHIÊN</span>
                  <div style={{ display: 'flex', gap: 8, fontSize: 9.5 }}>
                    <span style={{ color: '#22c55e' }}>● VN-Index +0.99%</span>
                    <span style={{ color: '#38bdf8' }}>● HNX +0.77%</span>
                    <span style={{ color: '#fbbf24' }}>● UPCOM +0.31%</span>
                  </div>
                </div>

                {/* Biểu đồ mô phỏng diễn biến phiên */}
                <div style={{ position: 'relative', height: 48, marginTop: 8 }}>
                  <svg width="100%" height="100%" viewBox="0 0 300 48" preserveAspectRatio="none">
                    <line x1="0" y1="36" x2="300" y2="36" stroke="rgba(255,255,255,0.12)" strokeDasharray="3 3" />
                    <text x="2" y="10" fill="rgba(255,255,255,0.3)" fontSize="8">2%</text>
                    <text x="2" y="24" fill="rgba(255,255,255,0.3)" fontSize="8">1%</text>
                    <text x="2" y="38" fill="rgba(255,255,255,0.3)" fontSize="8">0%</text>
                    <path d="M 20 36 Q 70 30, 120 22 T 220 18 T 290 12" fill="none" stroke="#22c55e" strokeWidth="2" />
                    <path d="M 20 36 Q 80 34, 140 26 T 230 22 T 290 18" fill="none" stroke="#38bdf8" strokeWidth="1.5" />
                    <path d="M 20 36 Q 60 38, 120 32 T 210 28 T 290 26" fill="none" stroke="#fbbf24" strokeWidth="1.5" />
                  </svg>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 9, color: 'var(--tx-dim)' }}>
                  <span>9:00</span>
                  <span>10:00</span>
                  <span>11:00</span>
                  <span>13:00</span>
                  <span>14:00</span>
                  <span>15:00</span>
                </div>
              </div>
            </div>
          </section>

          {/* HÀNG 2 CỘT: 02 ĐỘ RỘNG THỊ TRƯỜNG & 03 TOP 5 ẢNH HƯỞNG CHỈ SỐ */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
            {/* PHẦN 02: ĐỘ RỘNG THỊ TRƯỜNG */}
            <section
              style={{
                background: 'rgba(16, 20, 24, 0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 'var(--r-lg)',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    background: 'var(--kg-gold)',
                    color: '#080b0e',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  02
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: '#fbf8f1', textTransform: 'uppercase' }}>
                    ĐỘ RỘNG THỊ TRƯỜNG
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--tx-mid)' }}>
                    Sắc xanh chiếm ưu thế, tâm lý nhà đầu tư cải thiện.
                  </div>
                </div>
              </div>

              {/* Thanh tỷ lệ Tăng / Đứng / Giảm */}
              <div style={{ margin: '14px 0' }}>
                <div style={{ display: 'flex', height: 28, borderRadius: 6, overflow: 'hidden', fontWeight: 700, fontSize: 11 }}>
                  <div style={{ flex: 236, background: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    236
                  </div>
                  <div style={{ flex: 62, background: '#ca8a04', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    62
                  </div>
                  <div style={{ flex: 182, background: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
                    182
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10.5, color: 'var(--tx-mid)', marginTop: 6 }}>
                  <span style={{ color: '#22c55e' }}>● Tăng giá</span>
                  <span style={{ color: '#eab308' }}>● Không đổi</span>
                  <span style={{ color: '#ef4444' }}>● Giảm giá</span>
                </div>
              </div>

              {/* Thanh khoản theo nhóm vốn hóa */}
              <div style={{ marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--tx-hi)', marginBottom: 10, letterSpacing: '0.04em' }}>
                  THANH KHOẢN THEO NHÓM VỐN HÓA
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: 80, paddingBottom: 6 }}>
                  {/* VN30 */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 60 }}>
                      <div style={{ width: 18, height: 56, background: 'var(--kg-gold)', borderRadius: '2px 2px 0 0' }} title="Hôm nay" />
                      <div style={{ width: 18, height: 42, background: 'rgba(255,255,255,0.2)', borderRadius: '2px 2px 0 0' }} title="TB 20 phiên" />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--tx-mid)', marginTop: 4 }}>VN30</div>
                  </div>
                  {/* Midcap */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 60 }}>
                      <div style={{ width: 18, height: 44, background: 'var(--kg-gold)', borderRadius: '2px 2px 0 0' }} />
                      <div style={{ width: 18, height: 38, background: 'rgba(255,255,255,0.2)', borderRadius: '2px 2px 0 0' }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--tx-mid)', marginTop: 4 }}>Midcap</div>
                  </div>
                  {/* Smallcap */}
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end', height: 60 }}>
                      <div style={{ width: 18, height: 26, background: 'var(--kg-gold)', borderRadius: '2px 2px 0 0' }} />
                      <div style={{ width: 18, height: 24, background: 'rgba(255,255,255,0.2)', borderRadius: '2px 2px 0 0' }} />
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--tx-mid)', marginTop: 4 }}>Smallcap</div>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center', gap: 14, fontSize: 9.5, color: 'var(--tx-dim)', marginTop: 4 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, background: 'var(--kg-gold)', borderRadius: 2 }} /> Hôm nay
                  </span>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <span style={{ width: 8, height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 2 }} /> Trung bình 20 phiên
                  </span>
                </div>
              </div>
            </section>

            {/* PHẦN 03: TOP 5 ẢNH HƯỞNG CHỈ SỐ */}
            <section
              style={{
                background: 'rgba(16, 20, 24, 0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 'var(--r-lg)',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    background: 'var(--kg-gold)',
                    color: '#080b0e',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  03
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: '#fbf8f1', textTransform: 'uppercase' }}>
                    TOP 5 ẢNH HƯỞNG CHỈ SỐ
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                {/* Đóng góp tích cực */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#22c55e', marginBottom: 10, paddingBottom: 4, borderBottom: '1px solid rgba(34,197,94,0.3)' }}>
                    Đóng góp tích cực (+6.8 điểm)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { sym: 'VCB', pt: '+2.1', w: 90 },
                      { sym: 'FPT', pt: '+1.8', w: 78 },
                      { sym: 'HPG', pt: '+1.2', w: 54 },
                      { sym: 'TCB', pt: '+1.0', w: 45 },
                      { sym: 'BID', pt: '+0.7', w: 32 },
                    ].map((row) => (
                      <div key={row.sym} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                        <span style={{ fontWeight: 600, color: '#fbf8f1', width: 34 }}>{row.sym}</span>
                        <div style={{ flex: 1, margin: '0 8px', background: 'rgba(255,255,255,0.05)', height: 10, borderRadius: 2, overflow: 'hidden' }}>
                          <div style={{ width: `${row.w}%`, height: '100%', background: '#22c55e', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontWeight: 600, color: '#22c55e', width: 28, textAlign: 'right' }}>{row.pt}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Đóng góp tiêu cực */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#ef4444', marginBottom: 10, paddingBottom: 4, borderBottom: '1px solid rgba(239,68,68,0.3)' }}>
                    Đóng góp tiêu cực (-0.9 điểm)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { sym: 'VHM', pt: '-0.4', w: 60 },
                      { sym: 'GAS', pt: '-0.2', w: 35 },
                      { sym: 'MSN', pt: '-0.1', w: 20 },
                      { sym: 'SAB', pt: '-0.1', w: 18 },
                      { sym: 'BCM', pt: '-0.1', w: 15 },
                    ].map((row) => (
                      <div key={row.sym} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 11 }}>
                        <span style={{ fontWeight: 600, color: '#fbf8f1', width: 34 }}>{row.sym}</span>
                        <div style={{ flex: 1, margin: '0 8px', background: 'rgba(255,255,255,0.05)', height: 10, borderRadius: 2, overflow: 'hidden', display: 'flex', justifyContent: 'flex-start' }}>
                          <div style={{ width: `${row.w}%`, height: '100%', background: '#ef4444', borderRadius: 2 }} />
                        </div>
                        <span style={{ fontWeight: 600, color: '#ef4444', width: 28, textAlign: 'right' }}>{row.pt}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>

          {/* HÀNG 2 CỘT: 04 DIỄN BIẾN THEO NGÀNH & 05 TIN TỨC NỔI BẬT */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 18 }}>
            {/* PHẦN 04: DIỄN BIẾN THEO NGÀNH */}
            <section
              style={{
                background: 'rgba(16, 20, 24, 0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 'var(--r-lg)',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    background: 'var(--kg-gold)',
                    color: '#080b0e',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  04
                </span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: '#fbf8f1', textTransform: 'uppercase' }}>
                    DIỄN BIẾN THEO NGÀNH
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--tx-mid)' }}>
                    Phần lớn các nhóm ngành tăng điểm, dẫn dắt bởi Ngân hàng, Công nghệ và Bất động sản.
                  </div>
                </div>
              </div>

              {/* Biểu đồ cột ngành */}
              <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', height: 130, padding: '10px 4px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                {[
                  { name: 'Ngân hàng', val: '+2.1%', h: 90, up: true },
                  { name: 'Công nghệ', val: '+1.8%', h: 78, up: true },
                  { name: 'Bất động sản', val: '+1.5%', h: 65, up: true },
                  { name: 'Hàng tiêu dùng', val: '+1.2%', h: 52, up: true },
                  { name: 'Chứng khoán', val: '+0.8%', h: 36, up: true },
                  { name: 'Xây dựng VLXD', val: '+0.6%', h: 28, up: true },
                  { name: 'Khu công nghiệp', val: '+0.4%', h: 18, up: true },
                  { name: 'Dầu khí', val: '-0.2%', h: 12, up: false },
                  { name: 'Điện, nước', val: '-0.4%', h: 20, up: false },
                  { name: 'Y tế', val: '-0.6%', h: 28, up: false },
                ].map((s) => (
                  <div key={s.name} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '9%' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: s.up ? '#22c55e' : '#ef4444', marginBottom: 4 }}>
                      {s.val}
                    </span>
                    <div
                      style={{
                        width: '100%',
                        height: `${s.h}px`,
                        background: s.up ? 'linear-gradient(180deg, #22c55e 0%, #15803d 100%)' : 'linear-gradient(180deg, #ef4444 0%, #b91c1c 100%)',
                        borderRadius: '3px 3px 0 0',
                      }}
                    />
                    <span
                      style={{
                        fontSize: 8.5,
                        color: 'var(--tx-mid)',
                        marginTop: 6,
                        textAlign: 'center',
                        lineHeight: 1.15,
                        display: 'block',
                        wordBreak: 'break-word',
                      }}
                    >
                      {s.name}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* PHẦN 05: TIN TỨC NỔI BẬT TRONG NGÀY */}
            <section
              style={{
                background: 'rgba(16, 20, 24, 0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 'var(--r-lg)',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <span
                  style={{
                    background: 'var(--kg-gold)',
                    color: '#080b0e',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  05
                </span>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: '#fbf8f1', textTransform: 'uppercase' }}>
                  TIN TỨC NỔI BẬT TRONG NGÀY
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { id: 1, text: 'NHNN tiếp tục duy trì định hướng nới lỏng tiền tệ, hỗ trợ tăng trưởng cuối năm.', tag: 'Vĩ mô', time: '08:12' },
                  { id: 2, text: 'FDI đăng ký vào Việt Nam 9 tháng đạt 24.8 tỷ USD, tăng 11.6% so với cùng kỳ.', tag: 'Vĩ mô', time: '09:03' },
                  { id: 3, text: 'Nhiều doanh nghiệp công bố kết quả kinh doanh quý III tích cực, vượt kỳ vọng.', tag: 'Doanh nghiệp', time: '10:21' },
                  { id: 4, text: 'Thị trường chứng khoán châu Á đồng loạt tăng điểm sau tín hiệu hạ lãi suất từ Fed.', tag: 'Quốc tế', time: '14:05' },
                  { id: 5, text: 'Giá dầu giảm nhẹ do lo ngại dư cung, vàng duy trì trên 3,700 USD/oz.', tag: 'Hàng hóa', time: '15:30' },
                ].map((item) => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'flex-start', gap: 8, fontSize: 11, lineHeight: 1.4 }}>
                    <span
                      style={{
                        background: 'rgba(212,175,55,0.2)',
                        color: 'var(--kg-gold)',
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        display: 'grid',
                        placeItems: 'center',
                        fontSize: 9.5,
                        fontWeight: 700,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {item.id}
                    </span>
                    <span style={{ color: 'var(--tx-hi)', flex: 1 }}>{item.text}</span>
                    <span style={{ fontSize: 9.5, color: 'var(--tx-dim)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 3, flexShrink: 0 }}>
                      {item.tag} {item.time}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* PHẦN 06: GÓC NHÌN KIMQUY INVEST */}
          <section
            style={{
              background: 'linear-gradient(90deg, rgba(28, 22, 12, 0.75) 0%, rgba(16, 20, 24, 0.85) 100%)',
              border: '1px solid var(--line-gold)',
              borderRadius: 'var(--r-lg)',
              padding: '22px 26px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <span
                style={{
                  background: 'var(--kg-gold)',
                  color: '#080b0e',
                  fontSize: 12,
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontFamily: 'var(--font-mono)',
                }}
              >
                06
              </span>
              <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.08em', color: 'var(--kg-gold)', textTransform: 'uppercase' }}>
                GÓC NHÌN KIMQUY INVEST
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <p
                  style={{
                    fontSize: 13,
                    fontStyle: 'italic',
                    color: '#fbf8f1',
                    lineHeight: 1.68,
                    margin: 0,
                  }}
                >
                  &ldquo;Thị trường đang trong giai đoạn tích lũy tích cực với thanh khoản cải thiện. Dòng tiền có dấu hiệu quay lại nhóm vốn hóa lớn, đặc biệt là Ngân hàng và Công nghệ. Nhà đầu tư nên duy trì tỷ trọng hợp lý, ưu tiên các cổ phiếu có nền tảng cơ bản tốt và triển vọng tăng trưởng rõ ràng.&rdquo;
                </p>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--kg-gold)', marginTop: 8 }}>
                  — Đội ngũ phân tích KIMQUY INVEST
                </div>
              </div>

              <div
                style={{
                  textAlign: 'right',
                  fontFamily: 'var(--font-display)',
                  fontSize: 11.5,
                  letterSpacing: '0.18em',
                  color: 'rgba(232,201,138,0.7)',
                  lineHeight: 1.8,
                  flexShrink: 0,
                }}
              >
                LONG-TERM
                <br />
                THINKING
                <br />
                BETTER
                <br />
                RETURNS
              </div>
            </div>
          </section>

          {/* HÀNG 2 CỘT: 07 HÀNH ĐỘNG GỢI Ý & 08 LỊCH SỰ KIỆN SẮP TỚI */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 18 }}>
            {/* PHẦN 07: HÀNH ĐỘNG GỢI Ý */}
            <section
              style={{
                background: 'rgba(16, 20, 24, 0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 'var(--r-lg)',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span
                  style={{
                    background: 'var(--kg-gold)',
                    color: '#080b0e',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  07
                </span>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: '#fbf8f1', textTransform: 'uppercase' }}>
                  HÀNH ĐỘNG GỢI Ý
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                {/* Nắm giữ */}
                <div style={{ background: 'rgba(34, 197, 94, 0.08)', border: '1px solid rgba(34, 197, 94, 0.25)', borderRadius: 'var(--r-md)', padding: '12px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#22c55e', fontSize: 11.5, fontWeight: 700, marginBottom: 8 }}>
                    <span>↗</span> Nắm giữ
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10.5, color: 'var(--tx-mid)', lineHeight: 1.5 }}>
                    <li>Các cổ phiếu đầu ngành, nền tảng cơ bản tốt</li>
                    <li>Hưởng lợi từ chính sách nới lỏng tiền tệ và phục hồi nhu cầu</li>
                  </ul>
                </div>

                {/* Theo dõi */}
                <div style={{ background: 'rgba(234, 179, 8, 0.08)', border: '1px solid rgba(234, 179, 8, 0.25)', borderRadius: 'var(--r-md)', padding: '12px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#eab308', fontSize: 11.5, fontWeight: 700, marginBottom: 8 }}>
                    <span>+</span> Theo dõi
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10.5, color: 'var(--tx-mid)', lineHeight: 1.5 }}>
                    <li>Nhóm bất động sản, chứng khoán (đang có tín hiệu hồi phục)</li>
                    <li>Cổ phiếu có kết quả kinh doanh quý III sắp công bố</li>
                  </ul>
                </div>

                {/* Cẩn trọng */}
                <div style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.25)', borderRadius: 'var(--r-md)', padding: '12px 10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#ef4444', fontSize: 11.5, fontWeight: 700, marginBottom: 8 }}>
                    <span>✕</span> Cẩn trọng
                  </div>
                  <ul style={{ margin: 0, paddingLeft: 14, fontSize: 10.5, color: 'var(--tx-mid)', lineHeight: 1.5 }}>
                    <li>Các cổ phiếu đã tăng nóng</li>
                    <li>Nhóm chịu áp lực từ giá hàng hóa đầu vào tăng (dầu khí, phân bón)</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* PHẦN 08: LỊCH SỰ KIỆN SẮP TỚI */}
            <section
              style={{
                background: 'rgba(16, 20, 24, 0.7)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 'var(--r-lg)',
                padding: '18px 20px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <span
                  style={{
                    background: 'var(--kg-gold)',
                    color: '#080b0e',
                    fontSize: 12,
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: 4,
                    fontFamily: 'var(--font-mono)',
                  }}
                >
                  08
                </span>
                <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '0.06em', color: '#fbf8f1', textTransform: 'uppercase' }}>
                  LỊCH SỰ KIỆN SẮP TỚI
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { date: '24/09', event: 'PCE Mỹ (thước đo lạm phát quan trọng)' },
                  { date: '25/09', event: 'Họp báo NHNN Việt Nam' },
                  { date: '26/09', event: 'Đáo hạn phái sinh tháng 9' },
                  { date: '29/09', event: 'Công bố PMI Việt Nam tháng 9' },
                ].map((ev) => (
                  <div key={ev.date} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11 }}>
                    <span
                      style={{
                        background: 'rgba(212,175,55,0.15)',
                        color: 'var(--kg-gold)',
                        padding: '2px 8px',
                        borderRadius: 4,
                        fontWeight: 700,
                        fontSize: 10.5,
                        fontFamily: 'var(--font-mono)',
                        flexShrink: 0,
                      }}
                    >
                      {ev.date}
                    </span>
                    <span style={{ color: 'var(--tx-hi)', lineHeight: 1.4 }}>{ev.event}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* ----------------- FOOTER BÁO CÁO ----------------- */}
        <footer
          style={{
            marginTop: 34,
            paddingTop: 24,
            borderTop: '1px solid rgba(212, 175, 55, 0.25)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {/* Logo & Brand text */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <img
              src="/asset/logo-remove-background.png"
              alt="KIMQUY Invest"
              style={{ width: 38, height: 38, objectFit: 'contain' }}
            />
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 14, fontWeight: 700, color: '#fbf8f1' }}>
                KIMQUY INVEST
              </div>
              <div style={{ fontSize: 9.5, color: 'var(--tx-dim)' }}>
                Intelligence for a Greater Tomorrow
              </div>
            </div>
          </div>

          {/* Slogan giữa */}
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontStyle: 'italic',
              fontSize: 13,
              color: 'var(--kg-gold)',
              letterSpacing: '0.04em',
            }}
          >
            &ldquo;Kiến thức hôm nay, Giá trị cho ngày mai.&rdquo;
          </div>

          {/* Liên hệ & Mạng xã hội */}
          <div style={{ display: 'flex', gap: 18, fontSize: 10.5, color: 'var(--tx-mid)' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <IconGlobe size={12} style={{ color: 'var(--kg-gold)' }} />
              kimquyinvest.vn
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <IconMail size={12} style={{ color: 'var(--kg-gold)' }} />
              contact@kimquyinvest.vn
            </span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span style={{ color: '#ef4444' }}>▶</span>
              KIMQUY Invest
            </span>
          </div>
        </footer>
      </div>
    </div>
  )
}
