/* ==========================================================================
   AI COPILOT — Cùng KimQuy kiến tạo giá trị lớn hơn
   ========================================================================== */

import { useEffect, useRef, useState } from 'react'
import { DragonScene } from '../components/Art'
import {
  IconArrowRight, IconBuild, IconDoc, IconIdea, IconLayers, IconLightning, IconLock,
  IconMic, IconSearch, IconSend, IconTarget, IconUser,
} from '../components/icons'
import { Badge, Chip } from '../components/ui'
import { AI_QUESTIONS, COPILOT_MODES } from '../data/portfolio'
import { PORTFOLIO } from '../data/portfolio'
import { BREADTH, INDICES, SECTORS } from '../data/market'
import { dirClass, num } from '../lib/format'

/* -------------------------------------------------------------------------- */
/* Thẻ năng lực                                                               */
/* -------------------------------------------------------------------------- */

const CARDS = [
  {
    icon: IconSearch,
    title: 'Phân tích chuyên sâu',
    desc: 'Phân tích doanh nghiệp, ngành, xu hướng thị trường',
    prompt: 'Phân tích chuyên sâu cổ phiếu FPT: định giá, tăng trưởng và rủi ro',
  },
  {
    icon: IconIdea,
    title: 'Gợi ý ý tưởng đầu tư',
    desc: 'Khám phá cơ hội phù hợp với khẩu vị rủi ro của bạn',
    prompt: 'Gợi ý 5 ý tưởng đầu tư phù hợp với khẩu vị rủi ro trung bình – cao',
  },
  {
    icon: IconDoc,
    title: 'Tóm tắt báo cáo',
    desc: 'Tóm tắt nhanh báo cáo vĩ mô, ngành, doanh nghiệp',
    prompt: 'Tóm tắt báo cáo vĩ mô Việt Nam tháng 9/2026',
  },
  {
    icon: IconBuild,
    title: 'Hỗ trợ xây dựng Thesis',
    desc: 'Cùng bạn phát triển và kiểm chứng luận điểm đầu tư',
    prompt: 'Hỗ trợ tôi xây dựng thesis cho MWG',
  },
]

const FEATURES = [
  { icon: IconTarget, label: 'Chính xác' },
  { icon: IconLayers, label: 'Đa chiều' },
  { icon: IconUser, label: 'Cá nhân hóa' },
  { icon: IconLock, label: 'Bảo mật' },
]

/* -------------------------------------------------------------------------- */
/* Nội dung trả lời mẫu                                                       */
/* -------------------------------------------------------------------------- */

type Msg =
  | { role: 'user'; text: string }
  | { role: 'ai'; text: string; bullets?: string[]; table?: { cols: string[]; rows: string[][] }; footer?: string }

function answerFor(q: string): Msg {
  const lower = q.toLowerCase()

  if (lower.includes('danh mục') && lower.includes('rủi ro')) {
    return {
      role: 'ai',
      text: `Dựa trên danh mục **${PORTFOLIO.name}** hiện tại (${num(PORTFOLIO.totalValue, 0)} VND, ${PORTFOLIO.positions} mã), tôi nhận diện 4 nhóm rủi ro chính:`,
      bullets: [
        '**Tập trung ngành cao:** Ngân hàng chiếm 32% và Công nghệ 24% — 56% danh mục nằm ở 2 nhóm. Nếu nhóm ngân hàng điều chỉnh 10%, danh mục có thể mất khoảng 3,2%.',
        '**Beta 1,18:** Danh mục biến động mạnh hơn VN-Index 18%. Với VN-Index giảm 20%, ước tính danh mục giảm ~16,8%.',
        '**Rủi ro tập trung vị thế:** Top 3 mã (FPT, TCB, HPG) chiếm 46,8% giá trị. Nên khống chế mỗi vị thế dưới 20%.',
        '**Rủi ro thanh khoản & tỷ giá:** Tỷ trọng tiền mặt chỉ 5,0%. Nếu tỷ giá USD/VND tăng 5%, ước tính tác động -6,2% lên danh mục.',
      ],
      footer: 'Đề xuất: nâng tiền mặt lên 8–10%, giảm tỷ trọng Bất động sản (15% → 10%) và bổ sung 1–2 mã phòng thủ (Điện nước, Tiêu dùng thiết yếu).',
    }
  }

  if (lower.includes('so sánh') || lower.includes('định giá')) {
    return {
      role: 'ai',
      text: 'So sánh nhanh ba cổ phiếu bạn hỏi, dựa trên dữ liệu phiên 22/09/2026:',
      table: {
        cols: ['Chỉ tiêu', 'FPT', 'VCB', 'HPG'],
        rows: [
          ['Giá (VND)', '126.500', '88.300', '28.650'],
          ['Thay đổi', '+2,50%', '-0,34%', '+1,21%'],
          ['P/E', '22,1', '14,7', '15,4'],
          ['P/B', '5,2', '2,8', '1,6'],
          ['ROE', '26,8%', '18,5%', '18,9%'],
          ['Tăng trưởng LNST', '20,4%', '12,5%', '25,1%'],
          ['Nợ/VCSH', '0,42', '1,30', '0,68'],
          ['Cổ tức', '1,8%', '2,1%', '2,4%'],
        ],
      },
      bullets: [
        '**FPT** — Chất lượng tăng trưởng tốt nhất: ROE 26,8%, LNST +20,4%, nợ thấp. Định giá cao (P/E 22,1; P/B 5,2) nhưng xứng đáng với tốc độ tăng trưởng.',
        '**VCB** — Định giá hợp lý nhất trong nhóm ngân hàng (P/E 14,7), nền tảng CASA tốt. Tăng trưởng chậm hơn (12,5%) và đòn bẩy cao (1,30).',
        '**HPG** — Đang ở pha phục hồi chu kỳ: LNST +25,1%, P/B chỉ 1,6. Rủi ro đến từ giá HRC và hàng nhập khẩu giá rẻ.',
      ],
      footer: 'Nếu ưu tiên tăng trưởng bền vững → FPT. Nếu ưu tiên định giá và cổ tức → VCB. Nếu chấp nhận chu kỳ → HPG.',
    }
  }

  if (lower.includes('lãi suất') && lower.includes('ngân hàng')) {
    return {
      role: 'ai',
      text: 'Tác động của việc lãi suất giảm đến nhóm ngành ngân hàng — phân tích theo 3 lớp:',
      bullets: [
        '**Lớp 1 — NIM (biên lãi ròng):** Lãi suất cho vay giảm nhanh hơn lãi suất huy động trong 1–2 quý đầu, NIM có thể thu hẹp 15–30 điểm cơ bản. Ngân hàng có CASA cao (VCB, TCB, MBB) chịu ít áp lực hơn.',
        '**Lớp 2 — Nhu cầu tín dụng:** Lãi suất thấp kích thích vay tiêu dùng và bất động sản. Độ trễ thường 2–3 quý. Nhóm bán lẻ (VIB, TPB, HDB) hưởng lợi rõ nhất.',
        '**Lớp 3 — Chất lượng tài sản:** Chi phí vốn giảm giúp doanh nghiệp trả nợ tốt hơn, giảm hình thành nợ xấu mới. Đây là yếu tố hỗ trợ dài hạn quan trọng nhất.',
        '**Định giá:** P/E ngành hiện 8,4× — thấp hơn trung bình 5 năm (10,2×). Kịch bản lãi suất giảm thường dẫn tới việc định giá lại (re-rating) nhóm ngân hàng.',
      ],
      footer: 'Ưu tiên: nhóm ngân hàng bán lẻ có CASA cao và tỷ lệ bao phủ nợ xấu tốt. Theo dõi VCB, TCB, MBB.',
    }
  }

  if (lower.includes('fed') || lower.includes('vĩ mô')) {
    return {
      role: 'ai',
      text: 'Kịch bản Fed và tác động truyền dẫn tới thị trường Việt Nam:',
      bullets: [
        '**Kênh tỷ giá:** Fed giữ lãi suất cao duy trì áp lực lên USD/VND. Tỷ giá hiện 24.620 (+0,12%). Nếu Fed cắt giảm vào Q2/2026, dư địa nới lỏng của NHNN mở rộng.',
        '**Kênh dòng vốn:** Khối ngoại mua ròng +675 tỷ trong phiên gần nhất, 5 phiên liên tiếp. Fed nới lỏng thường kéo dòng vốn quay lại thị trường mới nổi.',
        '**Kênh hàng hoá:** Giá dầu Brent +3,2% lên 92,15 USD/thùng do căng thẳng địa chính trị — hỗ trợ nhóm dầu khí nhưng gây áp lực lạm phát.',
        '**Định giá thị trường:** VN-Index P/E hiện 13,2×, chiết khấu so với trung bình 5 năm (14,8×). Đây là vùng định giá hấp dẫn cho tích luỹ dài hạn.',
      ],
      footer: `Trạng thái hiện tại: VN-Index ${num(INDICES[0].value, 2)} (${INDICES[0].changePct > 0 ? '+' : ''}${num(INDICES[0].changePct, 2)}%), độ rộng ${BREADTH.up}/${BREADTH.down} mã tăng/giảm — thị trường đang ở trạng thái tích cực.`,
    }
  }

  if (lower.includes('đầu tư công')) {
    return {
      role: 'ai',
      text: 'Nhóm hưởng lợi từ đẩy mạnh đầu tư công — phân theo mức độ trực tiếp:',
      bullets: [
        '**Hưởng lợi trực tiếp — Xây dựng hạ tầng:** VCG (Vinaconex), HHV (Đèo Cả), C4G (CIENCO4). Backlog lớn từ cao tốc Bắc–Nam giai đoạn 2 và sân bay Long Thành.',
        '**Hưởng lợi gián tiếp — Vật liệu:** HPG, HT1, VGC. Sản lượng thép và xi măng tăng theo tiến độ thi công.',
        '**Hưởng lợi hạ tầng phụ trợ:** PVS, GMD, HAH — vận tải và dịch vụ kỹ thuật cho dự án trọng điểm.',
        '**Rủi ro:** Tiến độ giải ngân thực tế thường chậm hơn kế hoạch; giá nguyên vật liệu biến động; nợ phải thu của các nhà thầu.',
      ],
      footer: 'Theo dõi chỉ số giải ngân vốn đầu tư công hàng tháng — đây là chất xúc tác chính cho nhóm này.',
    }
  }

  if (lower.includes('tháng 9') || lower.includes('tóm tắt')) {
    return {
      role: 'ai',
      text: 'Tóm tắt báo cáo vĩ mô Việt Nam tháng 9/2026:',
      bullets: [
        '**Tăng trưởng:** GDP 9 tháng ước đạt 7,4% — cao hơn kế hoạch nhờ xuất khẩu và đầu tư công.',
        '**Lạm phát:** CPI bình quân 3,2%, nằm trong mục tiêu Quốc hội (dưới 4%).',
        '**Chính sách tiền tệ:** NHNN bơm ròng 12.400 tỷ qua OMO tuần thứ ba liên tiếp; lãi suất điều hành giữ 5,5%.',
        '**Tín dụng:** Tăng 10,2% so với đầu năm — hướng tới mục tiêu 14–15% cả năm.',
        '**FDI:** Giải ngân 9 tháng đạt 24,8 tỷ USD (+11,6% cùng kỳ) — mức cao nhất 5 năm.',
        '**Tỷ giá:** USD/VND quanh 24.620, ổn định nhờ cung ngoại tệ dồi dào.',
      ],
      footer: 'Hàm ý đầu tư: vĩ mô hỗ trợ kịch bản tích cực cho thị trường; ưu tiên nhóm hưởng lợi từ tín dụng và đầu tư công.',
    }
  }

  if (lower.includes('thesis') || lower.includes('luận điểm')) {
    return {
      role: 'ai',
      text: 'Khung thesis cho MWG (Thế Giới Di Động) — bạn có thể điều chỉnh theo quan điểm của mình:',
      bullets: [
        '**Luận điểm cốt lõi:** Chuỗi Bách Hoá Xanh đạt điểm hoà vốn EBITDA, chuyển từ giai đoạn đốt tiền sang tạo lợi nhuận. Đây là chất xúc tác định giá lại quan trọng nhất.',
        '**Chất xúc tác:** (1) Đóng góp dương từ BHX từ Q4/2026; (2) Hợp tác Nvidia về AI Store mở 50 cửa hàng; (3) Biên lợi nhuận ngành bán lẻ ICT cải thiện.',
        '**Bằng chứng cần theo dõi:** Doanh thu BHX/tháng, số cửa hàng mới, biên lợi nhuận gộp hợp nhất (hiện 21,2%).',
        '**Rủi ro & điều kiện vô hiệu:** (1) BHX không đạt hoà vốn trong 2 quý tới; (2) Cạnh tranh giá từ FRT/DGW làm xói mòn biên; (3) Tiêu dùng phục hồi chậm.',
        '**Định giá & kịch bản:** P/E hiện 15,4×; ROE 21,2%; LNST +17,2%. Mục tiêu cơ sở: 72.000–78.000 VND; kịch bản tích cực: 88.000 VND.',
      ],
      footer: 'Bạn muốn tôi ghi thesis này vào mục Theo dõi Thesis và đặt nhắc nhở kiểm tra vào 15/12/2026?',
    }
  }

  return {
    role: 'ai',
    text: `Tôi đã phân tích câu hỏi "${q}" dựa trên dữ liệu thị trường phiên 22/09/2026. Dưới đây là những điểm chính:`,
    bullets: [
      `**Bối cảnh thị trường:** VN-Index ${num(INDICES[0].value, 2)} điểm (${INDICES[0].changePct > 0 ? '+' : ''}${num(INDICES[0].changePct, 2)}%), thanh khoản 18.532 tỷ (+18,4%), độ rộng tích cực với ${BREADTH.up} mã tăng so với ${BREADTH.down} mã giảm.`,
      `**Dòng tiền dẫn dắt:** ${SECTORS[0].name} (+${num(SECTORS[0].pct, 2)}%), ${SECTORS[1].name} (+${num(SECTORS[1].pct, 2)}%), ${SECTORS[2].name} (+${num(SECTORS[2].pct, 2)}%) — nhóm hút ròng mạnh nhất.`,
      '**Hàm ý cho danh mục:** Danh mục của bạn đang nghiêng về Ngân hàng và Công nghệ — hai nhóm đang dẫn dắt, nên tiếp tục nắm giữ.',
      '**Điểm cần lưu ý:** Fed họp chính sách hôm nay (23:00) và GDP Mỹ Q3 công bố 25/09 — hai sự kiện có thể gây biến động ngắn hạn.',
    ],
    footer: 'Bạn muốn tôi đào sâu vào khía cạnh nào? Tôi có thể phân tích định lượng, so sánh peer hoặc dựng kịch bản.',
  }
}

function initialMessages(): Msg[] {
  return [
    {
      role: 'user',
      text: 'Danh mục của tôi đang chịu rủi ro gì?',
    },
    answerFor('danh mục rủi ro'),
  ]
}

/* -------------------------------------------------------------------------- */
/* Thành phần chính                                                           */
/* -------------------------------------------------------------------------- */

export function Copilot() {
  const [chat, setChat] = useState(false)
  const [messages, setMessages] = useState<Msg[]>(initialMessages)
  const [input, setInput] = useState('')
  const [thinking, setThinking] = useState(false)
  const [mode, setMode] = useState<string | null>(null)
  const endRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages, thinking])

  const send = (text: string) => {
    const q = text.trim()
    if (!q) return
    setChat(true)
    setMessages((m) => [...m, { role: 'user', text: q }])
    setInput('')
    setThinking(true)
    const reply = answerFor(q)
    window.setTimeout(() => {
      setMessages((m) => [...m, reply])
      setThinking(false)
    }, 900)
  }

  /* -------------------- Chế độ trò chuyện -------------------- */
  if (chat) {
    return (
      <div className="copilot" style={{ height: 'auto' }}>
        <div className="scroller" style={{ flex: 1 }}>
          <div className="chat">
            <div className="row-between" style={{ marginBottom: 4 }}>
              <div className="row gap-10">
                <span className="msg-avatar ai" style={{ width: 34, height: 34 }}>
                  ✦
                </span>
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: 17, fontWeight: 700, color: 'var(--tx-hi)' }}>
                    AI KIMQUY Copilot
                  </div>
                  <div className="row gap-6">
                    <span className="live-dot" />
                    <span style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>
                      Đang hoạt động · Dữ liệu cập nhật 22/09/2026 15:27
                    </span>
                  </div>
                </div>
              </div>
              <button className="btn sm ghost" onClick={() => setChat(false)}>
                Về trang chủ Copilot
              </button>
            </div>

            {messages.map((m, i) => (
              <div className={`msg ${m.role}`} key={i}>
                <span className={`msg-avatar ${m.role === 'ai' ? 'ai' : 'me'}`}>
                  {m.role === 'ai' ? '✦' : 'NH'}
                </span>
                <div className="msg-bubble">
                  <p>{renderBold(m.text)}</p>

                  {m.role === 'ai' && m.table && (
                    <div className="msg-table">
                      <table className="data">
                        <thead>
                          <tr>
                            {m.table.cols.map((c, ci) => (
                              <th key={c} className={ci === 0 ? 'l' : undefined}>{c}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {m.table.rows.map((r) => (
                            <tr key={r[0]}>
                              {r.map((cell, ci) => (
                                <td key={ci} className={ci === 0 ? 'l' : `num ${dirClass(parseFloat(cell.replace(/\./g, '').replace(',', '.')))}`}>
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {m.role === 'ai' && m.bullets && (
                    <ul style={{ marginTop: 9 }}>
                      {m.bullets.map((b, bi) => (
                        <li key={bi}>{renderBold(b)}</li>
                      ))}
                    </ul>
                  )}

                  {m.role === 'ai' && m.footer && (
                    <div className="callout" style={{ marginTop: 11 }}>
                      <p>{renderBold(m.footer)}</p>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {thinking && (
              <div className="msg">
                <span className="msg-avatar ai">✦</span>
                <div className="msg-bubble">
                  <div className="typing">
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
        </div>

        <div style={{ padding: '0 30px 16px' }}>
          <Composer
            value={input}
            onChange={setInput}
            onSend={send}
            mode={mode}
            setMode={setMode}
            compact
          />
        </div>
      </div>
    )
  }

  /* -------------------- Màn hình chào -------------------- */
  /* -------------------- Màn hình chào đón gốc 100% mockup -------------------- */
  return (
    <div
      className="copilot-welcome-stage"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: 'calc(100vh - 50px)',
        height: 'calc(100vh - 50px)',
        backgroundImage: "url('/asset/art/copilot_full_bg.png')",
        backgroundSize: '100% 100%',
        backgroundPosition: 'top left',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      {/* 4 Cards năng lực tương tác */}
      <div
        style={{
          position: 'absolute',
          top: '37%',
          left: '2.8%',
          width: '88.5%',
          height: '19.5%',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '14px',
          zIndex: 5,
        }}
      >
        {CARDS.map((c) => (
          <button
            key={c.title}
            onClick={() => send(c.prompt)}
            style={{
              background: 'transparent',
              border: '1px solid transparent',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.4)'
              e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.05)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'transparent'
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
            title={`Bấm để ${c.title}`}
          />
        ))}
      </div>

      {/* Vùng chip gợi ý tương tác */}
      <div
        style={{
          position: 'absolute',
          top: '63.5%',
          left: '2.8%',
          width: '70%',
          height: '12%',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          zIndex: 5,
        }}
      >
        {/* Hàng 1 */}
        <div style={{ display: 'flex', gap: '10px', height: '45%' }}>
          {[
            'Phân tích triển vọng HPG năm 2026',
            'So sánh TCB và MBB về định giá',
            'Tóm tắt báo cáo vĩ mô mới nhất',
            'Gợi ý danh mục phòng thủ',
          ].map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              style={{
                flex: '1 1 auto',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)'
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              title={q}
            />
          ))}
        </div>
        {/* Hàng 2 */}
        <div style={{ display: 'flex', gap: '10px', height: '45%', width: '75%' }}>
          {[
            'Đánh giá tác động của Fed đến thị trường Việt Nam',
            'Xây dựng kịch bản cho ngành ngân hàng năm 2026',
          ].map((q) => (
            <button
              key={q}
              onClick={() => send(q)}
              style={{
                flex: '1 1 auto',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(212, 175, 55, 0.45)'
                e.currentTarget.style.backgroundColor = 'rgba(212, 175, 55, 0.08)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
              title={q}
            />
          ))}
        </div>
      </div>

      {/* Khung nhập Composer tương tác */}
      <div
        style={{
          position: 'absolute',
          top: '80.5%',
          left: '2.8%',
          width: '71%',
          height: '13.5%',
          zIndex: 10,
        }}
      >
        <form
          onSubmit={(e) => {
            e.preventDefault()
            send(input)
          }}
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderRadius: '20px',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            background: 'rgba(10, 10, 12, 0.75)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.5)',
          }}
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Hỏi KimQuy bất cứ điều gì về đầu tư, thị trường, báo cáo..."
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#fff',
              fontSize: '14px',
              fontFamily: 'inherit',
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--tx-dim)',
                cursor: 'pointer',
                padding: '4px',
              }}
            >
              <IconDoc size={16} />
            </button>
            {['Phân tích', 'So sánh', 'Tóm tắt', 'Ý tưởng', 'Xây dựng Thesis'].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(mode === m ? null : m)}
                style={{
                  background: mode === m ? 'rgba(212, 175, 55, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                  border: `1px solid ${mode === m ? 'var(--kg-gold)' : 'rgba(255, 255, 255, 0.1)'}`,
                  color: mode === m ? 'var(--kg-gold-200)' : 'var(--tx-mid)',
                  borderRadius: '12px',
                  padding: '3px 10px',
                  fontSize: '11px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {m}
              </button>
            ))}
            <div style={{ flex: 1 }} />
            <button
              type="submit"
              disabled={!input.trim()}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #e6b84d, #b8860b)',
                border: 'none',
                color: '#1a1405',
                display: 'grid',
                placeItems: 'center',
                cursor: input.trim() ? 'pointer' : 'default',
                opacity: input.trim() ? 1 : 0.6,
                boxShadow: '0 2px 8px rgba(212, 175, 55, 0.3)',
                transition: 'all 0.2s',
              }}
            >
              <IconSend size={14} />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Ô soạn câu hỏi                                                             */
/* -------------------------------------------------------------------------- */

function Composer({
  value,
  onChange,
  onSend,
  mode,
  setMode,
  compact,
}: {
  value: string
  onChange: (v: string) => void
  onSend: (v: string) => void
  mode: string | null
  setMode: (m: string | null) => void
  compact?: boolean
}) {
  return (
    <form
      className="composer"
      style={compact ? { margin: 0 } : undefined}
      onSubmit={(e) => {
        e.preventDefault()
        onSend(value)
      }}
    >
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Hỏi KimQuy bất cứ điều gì về đầu tư, thị trường, báo cáo..."
        rows={compact ? 1 : 2}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            onSend(value)
          }
        }}
        aria-label="Câu hỏi cho KimQuy"
      />
      <div className="composer-actions">
        <button type="button" className="icon-btn" style={{ width: 30, height: 30 }} aria-label="Nhập bằng giọng nói">
          <IconMic size={15} />
        </button>
        {COPILOT_MODES.map((m) => (
          <button
            key={m}
            type="button"
            className={`chip ${mode === m ? 'gold' : ''} clickable`}
            onClick={() => setMode(mode === m ? null : m)}
          >
            {m}
          </button>
        ))}
        <button className="composer-send" type="submit" disabled={!value.trim()} aria-label="Gửi">
          <IconSend size={16} />
        </button>
      </div>
    </form>
  )
}

/* -------------------------------------------------------------------------- */
/* In đậm **...** trong văn bản                                               */
/* -------------------------------------------------------------------------- */

function renderBold(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? (
      <strong key={i}>{p.slice(2, -2)}</strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  )
}

export { IconLightning }