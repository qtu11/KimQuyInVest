/* ==========================================================================
   HÌNH MINH HOẠ KIMQUY — cảnh quan SVG vẽ tay thay cho ảnh chụp
   Tông màu: hoàng hôn vàng đồng trên nền mực đen, đồng bộ nhận diện thương hiệu
   ========================================================================== */

import { useMemo, type CSSProperties } from 'react'

export type ArtKind =
  | 'mountain'
  | 'power'
  | 'solar'
  | 'bank'
  | 'cart'
  | 'port'
  | 'chip'
  | 'city'
  | 'factory'
  | 'oil'
  | 'plane'
  | 'exchange'
  | 'phone'
  | 'leaf'
  | 'highway'
  | 'bridge'
  | 'fed'
  | 'building'
  | 'ship'
  | 'tower'
  | 'gold'
  | 'recycle'
  | 'brick'
  | 'tools'

/* -------------------------------------------------------------------------- */
/* Bầu trời & mặt trời dùng chung                                             */
/* -------------------------------------------------------------------------- */

function Sky({ u, warm = 0 }: { u: string; warm?: number }) {
  const mid = warm > 0.5 ? '#231a0f' : '#191410'
  return (
    <>
      <defs>
        <linearGradient id={`${u}-sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#07070a" />
          <stop offset="42%" stopColor={mid} />
          <stop offset="74%" stopColor="#4a3418" />
          <stop offset="100%" stopColor="#7d5620" />
        </linearGradient>
        <radialGradient id={`${u}-sun`} cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#ffe6a8" stopOpacity="0.95" />
          <stop offset="38%" stopColor="#f0c05a" stopOpacity="0.5" />
          <stop offset="100%" stopColor="#c98b28" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="160" height="100" fill={`url(#${u}-sky)`} />
      <circle cx="106" cy="58" r="34" fill={`url(#${u}-sun)`} />
      <circle cx="106" cy="58" r="9" fill="#ffd98a" opacity="0.5" />
    </>
  )
}

/** Dải mây mờ */
function Haze({ y = 52, o = 0.16 }: { y?: number; o?: number }) {
  return (
    <>
      <ellipse cx="48" cy={y} rx="60" ry="4.5" fill="#e8c98a" opacity={o} />
      <ellipse cx="122" cy={y + 8} rx="46" ry="3.5" fill="#e8c98a" opacity={o * 0.75} />
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Các cảnh                                                                   */
/* -------------------------------------------------------------------------- */

function Scene({ kind, u }: { kind: ArtKind; u: string }) {
  switch (kind) {
    /* -------- Núi non hùng vĩ (ảnh chủ đạo) -------- */
    case 'mountain':
      return (
        <>
          <Sky u={u} warm={1} />
          <path d="M0 74 18 60l9 5 12-11 11 8 13-14 10 9 8-5 14 12 12-7 15 11 14-8 24 14v28H0z" fill="#2a2117" opacity="0.85" />
          <Haze y={62} o={0.2} />
          <path d="M0 84 22 68l12 7 15-15 14 11 12-8 16 15 14-9 18 13 12-6 25 13v11H0z" fill="#120e09" />
          <path d="M22 68l15 22M49 60l16 30M91 65l16 25" stroke="#8a6a2c" strokeWidth="0.6" opacity="0.35" />
          <path d="M0 92 30 82l18 6 22-9 20 8 24-7 26 9 20-5v16H0z" fill="#060504" />
        </>
      )

    /* -------- Điện & hạ tầng năng lượng -------- */
    case 'power':
      return (
        <>
          <Sky u={u} />
          <Haze y={56} />
          {/* cột điện cao thế */}
          {[26, 74, 124].map((x, i) => (
            <g key={x} opacity={0.95 - i * 0.12}>
              <path d={`M${x} 92V${38 + i * 5}M${x} ${38 + i * 5}l-9 9M${x} ${38 + i * 5}l9 9`} stroke="#0c0a08" strokeWidth="1.5" fill="none" />
              <path d={`M${x - 13} ${44 + i * 5}h26M${x - 9} ${50 + i * 5}h18`} stroke="#0c0a08" strokeWidth="1.2" />
            </g>
          ))}
          <path d="M26 44 74 48M74 48l50 5M26 50l48 3" stroke="#0c0a08" strokeWidth="0.7" fill="none" opacity="0.8" />
          <path d="M0 92h160v8H0z" fill="#060504" />
        </>
      )

    /* -------- Điện mặt trời -------- */
    case 'solar':
      return (
        <>
          <Sky u={u} warm={1} />
          <Haze y={50} />
          <path d="M0 72h160v28H0z" fill="#0a0806" />
          {[
            [14, 68],
            [48, 71],
            [82, 69],
            [116, 72],
          ].map(([x, y], i) => (
            <g key={i} transform={`translate(${x} ${y}) skewX(-16)`}>
              <rect width="26" height="17" fill="#141b22" stroke="#3d5a6e" strokeWidth="0.6" />
              <path d="M0 5.6h26M0 11.2h26M8.6 0v17M17.3 0v17" stroke="#3d5a6e" strokeWidth="0.4" opacity="0.7" />
            </g>
          ))}
          <path d="M27 85v5M61 88v4M95 86v5M129 89v4" stroke="#0a0806" strokeWidth="1.4" />
        </>
      )

    /* -------- Ngân hàng -------- */
    case 'bank':
      return (
        <>
          <Sky u={u} warm={0.7} />
          <Haze y={54} o={0.14} />
          <g fill="#0d0b09">
            <path d="M30 46 80 26l50 20z" />
            <rect x="36" y="46" width="88" height="36" />
            <rect x="28" y="82" width="104" height="5" />
            <rect x="24" y="87" width="112" height="4" />
          </g>
          {[46, 60, 74, 88, 102, 116].map((x) => (
            <rect key={x} x={x} y="50" width="5.5" height="30" fill="#1c1710" />
          ))}
          <circle cx="80" cy="38" r="3.2" fill="#d4af37" opacity="0.55" />
        </>
      )

    /* -------- Bán lẻ / siêu thị -------- */
    case 'cart':
      return (
        <>
          <Sky u={u} warm={0.4} />
          <rect x="0" y="58" width="160" height="42" fill="#0b0a09" />
          {/* kệ hàng */}
          {[10, 44, 78, 112].map((x, i) => (
            <g key={x} opacity={0.9 - i * 0.1}>
              <rect x={x} y="62" width="28" height="30" fill="#131009" />
              <path d={`M${x} 72h28M${x} 82h28`} stroke="#3a2f18" strokeWidth="0.7" />
              {[0, 1, 2].map((r) =>
                [0, 1, 2, 3].map((c) => (
                  <rect key={`${r}${c}`} x={x + 2 + c * 6.6} y={64 + r * 10} width="5" height="6" rx="0.6" fill={['#c9922f', '#8a6a2c', '#e0b45a'][(r + c) % 3]} opacity="0.5" />
                )),
              )}
            </g>
          ))}
          <rect x="0" y="92" width="160" height="8" fill="#050504" />
          <path d="M20 51h52l-6 7H20z" fill="#0e0c08" opacity="0.6" />
        </>
      )

    /* -------- Cảng & container -------- */
    case 'port':
      return (
        <>
          <Sky u={u} warm={0.8} />
          <Haze y={52} o={0.18} />
          {/* cần cẩu */}
          <path d="M18 92V30h4v62zM22 32l40 6M22 38l30 4" stroke="#0c0a08" strokeWidth="2" fill="none" />
          <path d="M62 38v10" stroke="#0c0a08" strokeWidth="1" />
          {/* container xếp lớp */}
          {[
            [70, 74, '#8a4a2a'],
            [86, 74, '#2f5a6e'],
            [102, 74, '#7a6a2a'],
            [70, 62, '#3a5a3a'],
            [86, 62, '#8a4a2a'],
            [102, 62, '#2f4a6e'],
            [86, 50, '#6a5a2a'],
          ].map(([x, y, c], i) => (
            <g key={i}>
              <rect x={x as number} y={y as number} width="15" height="10" fill={c as string} opacity="0.55" />
              <path d={`M${x} ${(y as number) + 3}h15M${x} ${(y as number) + 7}h15`} stroke="#070605" strokeWidth="0.5" />
            </g>
          ))}
          <rect x="0" y="86" width="160" height="14" fill="#070605" />
          <path d="M118 92V64l8-6h20v34" fill="#0d0b08" />
          <path d="M4 92h56" stroke="#1a1510" strokeWidth="1" />
        </>
      )

    /* -------- Bán dẫn / chip -------- */
    case 'chip':
      return (
        <>
          <defs>
            <linearGradient id={`${u}-bd`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#10202e" />
              <stop offset="100%" stopColor="#0a1219" />
            </linearGradient>
          </defs>
          <rect width="160" height="100" fill="#06080b" />
          <rect width="160" height="100" fill={`url(#${u}-bd)`} opacity="0.9" />
          {/* đường mạch */}
          {[
            'M6 18h30v16h20M6 44h22v22h26M6 74h40v-14h18M154 22h-28v14h-22M154 52h-34v18h-16M154 80h-44v-16h-14',
          ].map((d, i) => (
            <path key={i} d={d} stroke="#2f6f8f" strokeWidth="0.7" fill="none" opacity="0.55" />
          ))}
          {[
            [36, 34],
            [28, 66],
            [46, 60],
            [126, 36],
            [120, 70],
            [110, 64],
          ].map(([x, y], i) => (
            <circle key={i} cx={x} cy={y} r="1.6" fill="#4fa8d8" opacity="0.7" />
          ))}
          {/* chip */}
          <rect x="54" y="26" width="52" height="48" rx="3" fill="#0d1620" stroke="#3d7ea6" strokeWidth="0.9" />
          <rect x="62" y="34" width="36" height="32" rx="2" fill="#132434" stroke="#4a94bd" strokeWidth="0.6" />
          <text x="80" y="55" textAnchor="middle" fontSize="15" fontFamily="Georgia, serif" fill="#7fc4e8" opacity="0.92">
            AI
          </text>
          {[30, 38, 46, 54, 62, 70].map((y) => (
            <g key={y}>
              <path d={`M54 ${y + 4}h-8M106 ${y + 4}h8`} stroke="#3d7ea6" strokeWidth="1" />
            </g>
          ))}
        </>
      )

    /* -------- Đô thị / tài chính -------- */
    case 'city':
      return (
        <>
          <Sky u={u} warm={0.85} />
          <Haze y={54} o={0.2} />
          {[
            [4, 52, 15, 48],
            [22, 40, 13, 60],
            [38, 58, 11, 42],
            [52, 30, 16, 70],
            [71, 48, 12, 52],
            [86, 36, 14, 64],
            [103, 56, 11, 44],
            [117, 44, 15, 56],
            [135, 60, 12, 40],
            [150, 50, 10, 50],
          ].map(([x, y, w, h], i) => (
            <g key={i}>
              <rect x={x} y={y} width={w} height={h} fill={i % 3 === 0 ? '#0b0a09' : '#100d0a'} />
              {Array.from({ length: Math.floor(h / 7) }).map((_, r) =>
                Array.from({ length: Math.floor(w / 5) }).map((_, c) => (
                  <rect
                    key={`${r}${c}`}
                    x={x + 1.6 + c * 5}
                    y={y + 3 + r * 7}
                    width="2.2"
                    height="3"
                    fill="#e8c274"
                    opacity={((i * 7 + r * 3 + c * 5) % 4) / 9 + 0.1}
                  />
                )),
              )}
            </g>
          ))}
          <path d="M0 96h160v4H0z" fill="#050504" />
        </>
      )

    /* -------- Nhà máy -------- */
    case 'factory':
      return (
        <>
          <Sky u={u} warm={0.5} />
          <rect x="0" y="62" width="160" height="38" fill="#0b0a08" />
          <path d="M18 62V24h5v38zM23 26h14v4H23z" fill="#100d09" />
          <path d="M23 32h14v4H23z" fill="#100d09" opacity="0.7" />
          {[40, 74, 108, 140].map((x, i) => (
            <g key={x}>
              <path d={`M${x} 62V42l14 8V42l14 8v12z`} fill="#131009" />
              <rect x={x + 3} y={50} width="5" height="6" fill="#e8c274" opacity={0.22 + i * 0.05} />
            </g>
          ))}
          <path d="M52 62V50h56v12" fill="#0f0c08" />
          <rect x="64" y="52" width="14" height="8" fill="#e8c274" opacity="0.3" />
          <rect x="84" y="52" width="14" height="8" fill="#e8c274" opacity="0.22" />
        </>
      )

    /* -------- Dầu khí -------- */
    case 'oil':
      return (
        <>
          <Sky u={u} warm={0.6} />
          <path d="M0 74h160v26H0z" fill="#0a0908" />
          {/* giàn khoan */}
          <path d="M64 74 74 30h12l10 44z" fill="none" stroke="#141009" strokeWidth="1.4" />
          <path d="M68 74 76 34M76 74 82 34M80 74 86 34" stroke="#141009" strokeWidth="0.9" />
          <path d="M70 60h20M72 50h16M75 42h10" stroke="#141009" strokeWidth="1" />
          <circle cx="80" cy="30" r="2" fill="#e8a33a" opacity="0.7" />
          <path d="M0 74h60M92 74h68" stroke="#1a1510" strokeWidth="1.2" />
          <ellipse cx="80" cy="86" rx="34" ry="5" fill="#141009" opacity="0.6" />
        </>
      )

    /* -------- Hàng không / vận tải -------- */
    case 'plane':
      return (
        <>
          <Sky u={u} warm={0.75} />
          <Haze y={46} o={0.2} />
          <path d="M96 40l26-6 6 3-24 8 2 10-5 2-6-9-14 4-3-3 12-6-2-9 4-1z" fill="#0d0b09" />
          <path d="M0 78h160v22H0z" fill="#080706" />
          <path d="M0 78h160" stroke="#3a2f18" strokeWidth="0.6" />
          {[16, 52, 118].map((x, i) => (
            <path key={x} d={`M${x} 78V66h18v12`} fill="#0d0b08" opacity={0.9 - i * 0.15} />
          ))}
          <path d="M132 78V56h6v22z" fill="#0d0b08" />
        </>
      )

    /* -------- Sàn giao dịch -------- */
    case 'exchange':
      return (
        <>
          <rect width="160" height="100" fill="#06070a" />
          <defs>
            <linearGradient id={`${u}-scr`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0d1a26" />
              <stop offset="100%" stopColor="#060a10" />
            </linearGradient>
          </defs>
          <rect x="12" y="14" width="136" height="72" rx="3" fill={`url(#${u}-scr)`} stroke="#1d3446" strokeWidth="0.8" />
          <path
            d="M18 68l14-9 11 5 13-16 12 8 14-22 12 10 14-16 12 6 14-12"
            fill="none"
            stroke="#2ec27b"
            strokeWidth="1.5"
            opacity="0.85"
          />
          <path
            d="M18 78l14-4 11 6 13-7 12 5 14-9 12 4 14-6 12 3 14-5"
            fill="none"
            stroke="#3d7ea6"
            strokeWidth="1"
            opacity="0.5"
          />
          <text x="80" y="34" textAnchor="middle" fontSize="13" fontFamily="Georgia, serif" fill="#d4af37" opacity="0.85" letterSpacing="2">
            NASDAQ
          </text>
        </>
      )

    /* -------- Công nghệ / thiết bị -------- */
    case 'phone':
      return (
        <>
          <defs>
            <linearGradient id={`${u}-ph`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#12151b" />
              <stop offset="100%" stopColor="#080a0e" />
            </linearGradient>
          </defs>
          <rect width="160" height="100" fill="#06070a" />
          <rect width="160" height="100" fill={`url(#${u}-ph)`} />
          <circle cx="118" cy="30" r="26" fill="#d4af37" opacity="0.09" />
          <rect x="58" y="16" width="44" height="72" rx="7" fill="#0a0d12" stroke="#2b3a4a" strokeWidth="1" />
          <rect x="63" y="22" width="34" height="56" rx="3" fill="#0f1620" />
          <path d="M67 62l7-8 6 5 8-13 6 7" stroke="#2ec27b" strokeWidth="1.2" fill="none" opacity="0.8" />
          <rect x="72" y="18.5" width="16" height="1.6" rx="0.8" fill="#2b3a4a" />
        </>
      )

    /* -------- Năng lượng xanh -------- */
    case 'leaf':
      return (
        <>
          <Sky u={u} warm={0.55} />
          <path d="M0 76h160v24H0z" fill="#080a07" />
          <path d="M22 92V64M22 70l-9-6M22 76l9-6M22 82l-8-5" stroke="#16301c" strokeWidth="1.6" fill="none" />
          <path d="M84 92V56l-8-6h16zM84 74h-16l8-7zM84 66h16l-8-7z" stroke="#1d4028" strokeWidth="1.4" fill="none" />
          <path d="M138 92V62M138 68l-8-6M138 76l8-6" stroke="#16301c" strokeWidth="1.5" fill="none" />
          <ellipse cx="80" cy="94" rx="60" ry="6" fill="#0f1d12" opacity="0.5" />
          <path d="M0 92h160" stroke="#1a2b1c" strokeWidth="0.7" />
        </>
      )

    /* -------- Hạ tầng / cao tốc -------- */
    case 'highway':
      return (
        <>
          <Sky u={u} warm={0.9} />
          <path d="M0 62 40 50l30 6 34-12 30 8 26-6v14l-26 8-30-8-34 12-30-6-40 10z" fill="#141009" opacity="0.9" />
          <path d="M0 72 46 62h30l30-8 30 4 24-4v10l-24 6-30-4-30 8H46L0 82z" fill="#0a0806" />
          <path d="M64 100 74 72M96 100 86 72" stroke="#3a2f18" strokeWidth="1.2" />
          <path d="M80 86v6M78 74h4" stroke="#d4af37" strokeWidth="1.4" opacity="0.5" />
          <path d="M0 72h52M108 66h52" stroke="#4a3a1c" strokeWidth="1.4" />
          <path d="M0 100h160v-4H0z" fill="#050504" />
        </>
      )

    /* -------- Cầu / kết nối -------- */
    case 'bridge':
      return (
        <>
          <Sky u={u} warm={0.8} />
          <Haze y={50} o={0.16} />
          <path d="M0 66h160v6H0z" fill="#100d08" />
          <path d="M0 72c26-26 54-26 80-26s54 0 80 26" fill="none" stroke="#100d08" strokeWidth="1.6" />
          <path d="M8 72V58M36 72V50M64 72V46M96 72V46M124 72V50M152 72V58" stroke="#100d08" strokeWidth="1.2" />
          <path d="M0 78h160v22H0z" fill="#080706" />
          <path d="M0 78h160" stroke="#3a2f18" strokeWidth="0.6" />
          <ellipse cx="80" cy="84" rx="40" ry="3" fill="#141009" opacity="0.5" />
        </>
      )

    /* -------- Fed / ngân hàng trung ương -------- */
    case 'fed':
      return (
        <>
          <defs>
            <linearGradient id={`${u}-fed`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a20" />
              <stop offset="100%" stopColor="#0a0a0d" />
            </linearGradient>
          </defs>
          <rect width="160" height="100" fill={`url(#${u}-fed)`} />
          <ellipse cx="80" cy="60" rx="70" ry="34" fill="#d4af37" opacity="0.05" />
          <g fill="#141419">
            <path d="M34 40 80 22l46 18z" />
            <rect x="40" y="40" width="80" height="34" />
            <rect x="32" y="74" width="96" height="6" />
            <rect x="26" y="80" width="108" height="6" />
          </g>
          {[50, 63, 76, 89, 102, 115].map((x) => (
            <rect key={x} x={x} y="46" width="6" height="26" fill="#242432" />
          ))}
          <circle cx="80" cy="33" r="3" fill="#d4af37" opacity="0.5" />
          <circle cx="80" cy="60" r="14" fill="none" stroke="#d4af37" strokeWidth="1" opacity="0.28" />
          <text x="80" y="65" textAnchor="middle" fontSize="13" fontFamily="Georgia, serif" fill="#d4af37" opacity="0.65">
            $
          </text>
        </>
      )

    /* -------- Tòa nhà doanh nghiệp -------- */
    case 'building':
      return (
        <>
          <Sky u={u} warm={0.65} />
          <Haze y={52} o={0.16} />
          <g>
            <rect x="44" y="26" width="42" height="70" fill="#0c0b0a" />
            {Array.from({ length: 9 }).map((_, r) =>
              Array.from({ length: 5 }).map((_, c) => (
                <rect
                  key={`${r}${c}`}
                  x={48 + c * 7.6}
                  y={30 + r * 7.4}
                  width="5"
                  height="4"
                  fill="#e8c274"
                  opacity={((r * 3 + c * 5) % 5) / 11 + 0.08}
                />
              )),
            )}
            <rect x="26" y="46" width="18" height="50" fill="#0a0908" />
            <rect x="86" y="38" width="22" height="58" fill="#0e0c0a" />
            {Array.from({ length: 7 }).map((_, r) => (
              <rect key={r} x="90" y={42 + r * 7.6} width="14" height="4" fill="#e8c274" opacity="0.16" />
            ))}
            {Array.from({ length: 6 }).map((_, r) => (
              <rect key={r} x="30" y={50 + r * 7.6} width="10" height="4" fill="#e8c274" opacity="0.12" />
            ))}
          </g>
          <path d="M108 100V62h16v38z" fill="#0b0a08" />
          <path d="M0 96h160v4H0z" fill="#050504" />
        </>
      )

    /* -------- Tàu vận tải -------- */
    case 'ship':
      return (
        <>
          <Sky u={u} warm={0.7} />
          <Haze y={54} o={0.16} />
          <path d="M0 76h160v24H0z" fill="#0a0b0d" />
          <path d="M28 76h104l-12 12H40z" fill="#0d0c0a" />
          <rect x="60" y="58" width="34" height="18" fill="#100e0b" />
          <rect x="70" y="46" width="14" height="12" fill="#100e0b" />
          <path d="M74 46V38h6v8" fill="#100e0b" />
          {[30, 44, 58].map((x, i) => (
            <rect key={x} x={x} y="68" width="12" height="8" fill="#8a6a2c" opacity={0.4 - i * 0.08} />
          ))}
          <path d="M0 88c20-3 40 3 60 0s40-3 60 0 20 2 40 0v12H0z" fill="#0a0b0d" opacity="0.8" />
        </>
      )

    /* -------- Tháp viễn thông -------- */
    case 'tower':
      return (
        <>
          <Sky u={u} warm={0.5} />
          <path d="M0 78h160v22H0z" fill="#08090b" />
          <path d="M78 78 84 26h4l6 52z" fill="none" stroke="#101418" strokeWidth="1.5" />
          <path d="M80 78 86 32M86 78 88 32M84 78 87 32" stroke="#101418" strokeWidth="0.9" />
          <path d="M74 56h24M70 44h32M66 34h40" stroke="#101418" strokeWidth="1" />
          <path d="M86 26V18" stroke="#101418" strokeWidth="1.2" />
          <circle cx="86" cy="17" r="2" fill="#e5484d" opacity="0.8" />
          <circle cx="86" cy="17" r="6" fill="none" stroke="#e5484d" strokeWidth="0.7" opacity="0.35" />
          <circle cx="86" cy="17" r="11" fill="none" stroke="#e5484d" strokeWidth="0.6" opacity="0.18" />
        </>
      )

    /* -------- Vàng / kim loại quý -------- */
    case 'gold':
      return (
        <>
          <rect width="160" height="100" fill="#0a0805" />
          <defs>
            <radialGradient id={`${u}-au`} cx="0.42" cy="0.34" r="0.7">
              <stop offset="0%" stopColor="#f6e6b4" />
              <stop offset="45%" stopColor="#d4af37" />
              <stop offset="100%" stopColor="#7a5f16" />
            </radialGradient>
          </defs>
          {[
            [46, 60, 22],
            [86, 62, 20],
            [66, 42, 24],
          ].map(([cx, cy, r], i) => (
            <g key={i}>
              <ellipse cx={cx} cy={cy + 10} rx={r} ry={r * 0.32} fill="#2a2008" />
              <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.72} fill={`url(#${u}-au)`} opacity="0.9" />
            </g>
          ))}
          <ellipse cx="80" cy="86" rx="46" ry="5" fill="#1a1405" opacity="0.6" />
        </>
      )

    /* -------- Kinh tế tuần hoàn / tái chế -------- */
    case 'recycle':
      return (
        <>
          <Sky u={u} warm={0.45} />
          <path d="M0 78h160v22H0z" fill="#080a08" />
          <path d="M80 26a26 26 0 1 0 22 12" fill="none" stroke="#2e7a45" strokeWidth="2.4" opacity="0.65" />
          <path d="M102 38l6-8-10-2" fill="none" stroke="#2e7a45" strokeWidth="2.4" opacity="0.65" />
          <path d="M80 40v20M66 62l14 12 14-12" fill="none" stroke="#d4af37" strokeWidth="1.4" opacity="0.55" />
          <path d="M0 78h160" stroke="#16281a" strokeWidth="0.8" />
        </>
      )

    /* -------- Vật liệu xây dựng -------- */
    case 'brick':
      return (
        <>
          <Sky u={u} warm={0.75} />
          <path d="M0 70h160v30H0z" fill="#0b0907" />
          <path d="M42 70V34h6v36zM42 36h34v5H42zM48 41v10" stroke="#0f0c09" strokeWidth="1.6" fill="none" />
          {Array.from({ length: 4 }).map((_, r) =>
            Array.from({ length: 8 }).map((_, c) => (
              <rect
                key={`${r}${c}`}
                x={70 + c * 11 + (r % 2) * 5.5}
                y={70 + r * 7}
                width="10"
                height="6"
                rx="0.6"
                fill="#5c3520"
                opacity={(0.34 + ((r * 3 + c) % 4) * 0.07).toFixed(2) as unknown as number}
              />
            )),
          )}
          <path d="M0 70h160" stroke="#3a2f18" strokeWidth="0.6" />
          <rect x="0" y="96" width="160" height="4" fill="#050504" />
        </>
      )

    /* -------- Công cụ / sản xuất -------- */
    case 'tools':
      return (
        <>
          <Sky u={u} warm={0.6} />
          <path d="M0 72h160v28H0z" fill="#090807" />
          <path d="M14 72V40h6v32z" stroke="#100d09" strokeWidth="1.6" fill="none" />
          <path d="M20 44 54 60 20 60z" fill="#131009" opacity="0.9" />
          <path d="M80 72V52M80 52l24-10v10z" fill="#131009" />
          <circle cx="120" cy="62" r="12" fill="none" stroke="#1a1510" strokeWidth="3" />
          <path d="M120 50v-6M120 74v6M108 62h-6M132 62h6" stroke="#1a1510" strokeWidth="1.6" />
          <path d="M0 72h160" stroke="#3a2f18" strokeWidth="0.6" />
        </>
      )
  }
}

/* -------------------------------------------------------------------------- */
/* Bản đồ ảnh thực tế chất lượng cao từ thiết kế gốc                          */
/* -------------------------------------------------------------------------- */

const PHOTO_MAP: Partial<Record<string, string>> = {
  power: '/asset/art/banner_power.png',
  city: '/asset/art/banner_report_city.png',
  chip: '/asset/art/topic_chip_detail.png',
  solar: '/asset/art/idea_solar.png',
  bank: '/asset/art/idea_bank.png',
  cart: '/asset/art/idea_retail.png',
  port: '/asset/art/idea_port.png',
  fed: '/asset/art/thumb_fed.png',
  oil: '/asset/art/thumb_oil.png',
  highway: '/asset/art/thumb_highway.png',
  mountain: '/asset/art/hero_mountain.png',
  gold: '/asset/art/quote_turtle_mountain.png',
  turtle: '/asset/art/quote_turtle_mountain.png',
}

/* -------------------------------------------------------------------------- */
/* Thành phần công khai                                                       */
/* -------------------------------------------------------------------------- */

export function Art({
  kind,
  className,
  style,
  ratio,
}: {
  kind: ArtKind | string
  className?: string
  style?: CSSProperties
  ratio?: string
}) {
  const photo = PHOTO_MAP[kind]
  if (photo) {
    return (
      <img
        src={photo}
        alt={kind}
        className={className}
        style={{
          width: '100%',
          height: ratio ? undefined : '100%',
          aspectRatio: ratio,
          objectFit: 'cover',
          display: 'block',
          ...style,
        }}
      />
    )
  }

  return (
    <svg
      viewBox="0 0 160 100"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      style={{ width: '100%', height: ratio ? undefined : '100%', aspectRatio: ratio, ...style }}
      aria-hidden="true"
    >
      <Scene kind={kind as ArtKind} u={`art-${kind}`} />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Cảnh núi lớn cho phần đầu trang                                            */
/* -------------------------------------------------------------------------- */

export function HeroScene({ variant = 'ridge' }: { variant?: 'ridge' | 'road' | 'lake' }) {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/asset/art/hero_mountain.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 20%',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, rgba(6,6,6,0.94) 0%, rgba(6,6,6,0.82) 34%, rgba(6,6,6,0.2) 65%, rgba(6,6,6,0.72) 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: '25%',
          top: '32%',
          fontFamily: 'var(--font-display)',
          fontSize: 10,
          letterSpacing: '0.24em',
          color: 'rgba(232, 201, 138, 0.45)',
          textTransform: 'uppercase',
          textAlign: 'center',
          lineHeight: 1.8,
          pointerEvents: 'none',
        }}
      >
        INVEST WITH INTELLIGENCE
        <br />
        LIVE A GREATER TOMORROW
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Rồng thần / Kim Quy thần thoại cho màn hình AI Copilot                     */
/* -------------------------------------------------------------------------- */

export function DragonScene() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        backgroundImage: "url('/asset/art/copilot_turtle_god.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'right 20%',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(90deg, #050608 0%, rgba(5,6,8,0.88) 32%, rgba(5,6,8,0.18) 65%, rgba(5,6,8,0.45) 100%)',
        }}
      />
    </div>
  )
}