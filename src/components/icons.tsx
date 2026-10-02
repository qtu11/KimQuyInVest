/* ==========================================================================
   BỘ BIỂU TƯỢNG KIMQUY — SVG nét mảnh, đồng nhất 24×24
   ========================================================================== */

import type { SVGProps } from 'react'

type P = SVGProps<SVGSVGElement> & { size?: number }

function Ico({ size = 16, children, ...rest }: P & { children: React.ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

/* ---------------- Điều hướng ---------------- */

export const IconHome = (p: P) => (
  <Ico {...p}>
    <path d="M3 10.2 12 3l9 7.2" />
    <path d="M5 9.6V20h14V9.6" />
    <path d="M9.5 20v-5.5h5V20" />
  </Ico>
)

export const IconMarket = (p: P) => (
  <Ico {...p}>
    <path d="M3 21h18" />
    <path d="M6 21V11.5" />
    <path d="M11 21V6.5" />
    <path d="M16 21v-6.8" />
    <path d="M21 21V9" />
    <circle cx="6" cy="8.6" r="1.5" />
    <circle cx="11" cy="4.4" r="1.5" />
    <circle cx="16" cy="11.4" r="1.5" />
  </Ico>
)

export const IconSector = (p: P) => (
  <Ico {...p}>
    <path d="M3 21h18" />
    <path d="M5 21V8l5-3v16" />
    <path d="M10 21V11l5 2.5V21" />
    <path d="M15 21V15l4 1.6V21" />
    <path d="M7 11h.01M7 14h.01M7 17h.01M12 15h.01M12 18h.01" />
  </Ico>
)

export const IconNews = (p: P) => (
  <Ico {...p}>
    <path d="M4 5.5h12.5v14H5.5A1.5 1.5 0 0 1 4 18z" />
    <path d="M16.5 9H20v9a1.5 1.5 0 0 1-1.5 1.5h-2" />
    <path d="M7 8.8h6.5M7 12h6.5M7 15.2h4" />
  </Ico>
)

export const IconFilter = (p: P) => (
  <Ico {...p}>
    <circle cx="11" cy="11" r="6.4" />
    <path d="M20.5 20.5 15.6 15.6" />
    <path d="M9 11h4M11 9v4" />
  </Ico>
)

export const IconIdea = (p: P) => (
  <Ico {...p}>
    <path d="M9.2 17.5a6.2 6.2 0 1 1 5.6 0" />
    <path d="M9.4 17.5h5.2M10 20.5h4" />
    <path d="M12 8.2v3.6" />
  </Ico>
)

export const IconBriefcase = (p: P) => (
  <Ico {...p}>
    <rect x="3" y="7.4" width="18" height="12.6" rx="2" />
    <path d="M8.6 7.4V5.6A1.6 1.6 0 0 1 10.2 4h3.6a1.6 1.6 0 0 1 1.6 1.6v1.8" />
    <path d="M3 12.4h18" />
    <path d="M11 12.4v2.2h2v-2.2" />
  </Ico>
)

export const IconPerformance = (p: P) => (
  <Ico {...p}>
    <path d="M3.5 15.5 9 10l3.6 3.4L20.5 5.8" />
    <path d="M20.5 10.6V5.8h-4.8" />
    <path d="M3.5 20.5h17" />
  </Ico>
)

export const IconShield = (p: P) => (
  <Ico {...p}>
    <path d="M12 3.2 5 6v6c0 4.1 2.9 7.6 7 8.8 4.1-1.2 7-4.7 7-8.8V6z" />
    <path d="m9.2 12 2 2 3.6-3.9" />
  </Ico>
)

export const IconScenario = (p: P) => (
  <Ico {...p}>
    <path d="M3.5 20.5h17" />
    <path d="M4.5 16.5c3-1 4.5-4 6-7.5s3.4-5.5 6-5.5" />
    <path d="M20.5 20.5V9.8" strokeDasharray="2.5 2.5" />
    <circle cx="10.5" cy="9" r="1.4" />
    <circle cx="16.5" cy="3.5" r="1.4" />
  </Ico>
)

export const IconReport = (p: P) => (
  <Ico {...p}>
    <path d="M13.5 3.5H7A2 2 0 0 0 5 5.5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V9z" />
    <path d="M13.5 3.5V9H19" />
    <path d="M8.6 13.6h6.8M8.6 16.6h4.6" />
  </Ico>
)

export const IconThesis = (p: P) => (
  <Ico {...p}>
    <path d="M12 3.4 3.5 8 12 12.6 20.5 8z" />
    <path d="M6.5 10v5.2c0 1.6 2.6 3 5.5 3s5.5-1.4 5.5-3V10" />
  </Ico>
)

export const IconCopilot = (p: P) => (
  <Ico {...p}>
    <path d="M12 3.6 13.7 9l5.4 1.7-5.4 1.7L12 17.8l-1.7-5.4L4.9 10.7 10.3 9z" />
    <path d="M18.6 16.4l.7 2.1 2.1.7-2.1.7-.7 2.1-.7-2.1-2.1-.7 2.1-.7z" />
  </Ico>
)

export const IconResearch = (p: P) => (
  <Ico {...p}>
    <circle cx="10" cy="10" r="6.6" />
    <path d="m15.2 15.2 5 5" />
    <path d="M10 7.2a2.8 2.8 0 0 0-2.8 2.8" />
  </Ico>
)

export const IconBell = (p: P) => (
  <Ico {...p}>
    <path d="M6.4 10.2a5.6 5.6 0 0 1 11.2 0c0 4.4 1.6 5.6 1.6 5.6H4.8s1.6-1.2 1.6-5.6z" />
    <path d="M10.3 19a2 2 0 0 0 3.4 0" />
  </Ico>
)

export const IconSettings = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M19.6 14.6a1.6 1.6 0 0 0 .3 1.8l.1.1a1.9 1.9 0 1 1-2.7 2.7l-.1-.1a1.6 1.6 0 0 0-2.7 1.1v.3a1.9 1.9 0 1 1-3.8 0v-.2a1.6 1.6 0 0 0-2.8-1.1l-.1.1a1.9 1.9 0 1 1-2.7-2.7l.1-.1a1.6 1.6 0 0 0-1.1-2.7H4a1.9 1.9 0 1 1 0-3.8h.2a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a1.9 1.9 0 1 1 2.7-2.7l.1.1a1.6 1.6 0 0 0 2.7-1.1V4a1.9 1.9 0 1 1 3.8 0v.2a1.6 1.6 0 0 0 2.8 1.1l.1-.1a1.9 1.9 0 1 1 2.7 2.7l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.3a1.9 1.9 0 1 1 0 3.8h-.2a1.6 1.6 0 0 0-1.4 1z" />
  </Ico>
)

/* ---------------- Hành động ---------------- */

export const IconSearch = (p: P) => (
  <Ico {...p}>
    <circle cx="11" cy="11" r="6.6" />
    <path d="m20 20-4.3-4.3" />
  </Ico>
)

export const IconArrowRight = (p: P) => (
  <Ico {...p}>
    <path d="M4.5 12h14" />
    <path d="m13 6.5 5.5 5.5L13 17.5" />
  </Ico>
)

export const IconArrowLeft = (p: P) => (
  <Ico {...p}>
    <path d="M19.5 12h-14" />
    <path d="m11 6.5-5.5 5.5 5.5 5.5" />
  </Ico>
)

export const IconShare = (p: P) => (
  <Ico {...p}>
    <circle cx="18" cy="5" r="3" />
    <circle cx="6" cy="12" r="3" />
    <circle cx="18" cy="19" r="3" />
    <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
    <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
  </Ico>
)

export const IconPrinter = (p: P) => (
  <Ico {...p}>
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </Ico>
)

export const IconChevronRight = (p: P) => (
  <Ico {...p}>
    <path d="m9 5.5 6.5 6.5L9 18.5" />
  </Ico>
)

export const IconChevronLeft = (p: P) => (
  <Ico {...p}>
    <path d="M15 5.5 8.5 12 15 18.5" />
  </Ico>
)

export const IconChevronDown = (p: P) => (
  <Ico {...p}>
    <path d="m5.5 9 6.5 6.5L18.5 9" />
  </Ico>
)

export const IconChevronUp = (p: P) => (
  <Ico {...p}>
    <path d="M5.5 15 12 8.5 18.5 15" />
  </Ico>
)

export const IconPlus = (p: P) => (
  <Ico {...p}>
    <path d="M12 5v14M5 12h14" />
  </Ico>
)

export const IconClose = (p: P) => (
  <Ico {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Ico>
)

export const IconCheck = (p: P) => (
  <Ico {...p}>
    <path d="m5 12.5 4.5 4.5L19 7.5" />
  </Ico>
)

export const IconMinus = (p: P) => (
  <Ico {...p}>
    <path d="M5 12h14" />
  </Ico>
)

export const IconDownload = (p: P) => (
  <Ico {...p}>
    <path d="M12 3.5v11" />
    <path d="m7.5 10 4.5 4.5L16.5 10" />
    <path d="M4.5 19.5h15" />
  </Ico>
)

export const IconUpload = (p: P) => (
  <Ico {...p}>
    <path d="M12 15.5v-11" />
    <path d="m7.5 9 4.5-4.5L16.5 9" />
    <path d="M4.5 19.5h15" />
  </Ico>
)

export const IconFilterLines = (p: P) => (
  <Ico {...p}>
    <path d="M3.5 6.5h17M6.5 12h11M10 17.5h4" />
  </Ico>
)

export const IconRefresh = (p: P) => (
  <Ico {...p}>
    <path d="M20 11.5a8 8 0 1 0-2.4 6" />
    <path d="M20 5.5v6h-6" />
  </Ico>
)

export const IconPlay = (p: P) => (
  <Ico {...p}>
    <path d="M7.5 5.5 18 12 7.5 18.5z" />
  </Ico>
)

export const IconExternal = (p: P) => (
  <Ico {...p}>
    <path d="M14 4.5h5.5V10" />
    <path d="m19.5 4.5-8 8" />
    <path d="M18.5 14v5a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 19V7.5A1.5 1.5 0 0 1 5.5 6h5" />
  </Ico>
)

export const IconBookmark = (p: P) => (
  <Ico {...p}>
    <path d="M6.5 3.8h11a1 1 0 0 1 1 1v15.4L12 16.6l-6.5 3.6V4.8a1 1 0 0 1 1-1z" />
  </Ico>
)

export const IconComment = (p: P) => (
  <Ico {...p}>
    <path d="M20.5 12.4c0 4-3.8 7.2-8.5 7.2a10 10 0 0 1-2.6-.3L4.5 21l1.2-3.6A6.9 6.9 0 0 1 3.5 12.4c0-4 3.8-7.2 8.5-7.2s8.5 3.2 8.5 7.2z" />
  </Ico>
)

export const IconMore = (p: P) => (
  <Ico {...p}>
    <circle cx="5.5" cy="12" r="1.3" fill="currentColor" />
    <circle cx="12" cy="12" r="1.3" fill="currentColor" />
    <circle cx="18.5" cy="12" r="1.3" fill="currentColor" />
  </Ico>
)

export const IconStar = (p: P) => (
  <Ico {...p}>
    <path d="m12 3.6 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </Ico>
)

export const IconSend = (p: P) => (
  <Ico {...p}>
    <path d="M20.5 3.5 3.5 10.6l6.4 2.5 2.5 6.4z" />
    <path d="m9.9 13.1 4.6-4.6" />
  </Ico>
)

export const IconMic = (p: P) => (
  <Ico {...p}>
    <rect x="9.2" y="3.2" width="5.6" height="10.4" rx="2.8" />
    <path d="M5.8 11.4a6.2 6.2 0 0 0 12.4 0" />
    <path d="M12 17.6v3.2" />
  </Ico>
)

export const IconTarget = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <circle cx="12" cy="12" r="4.6" />
    <circle cx="12" cy="12" r="1.2" fill="currentColor" />
  </Ico>
)

export const IconLayers = (p: P) => (
  <Ico {...p}>
    <path d="m12 3.4 8.5 4.3-8.5 4.3-8.5-4.3z" />
    <path d="m3.5 12 8.5 4.3 8.5-4.3" />
    <path d="m3.5 16.3 8.5 4.3 8.5-4.3" />
  </Ico>
)

export const IconUser = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="8.2" r="3.7" />
    <path d="M4.8 20.2a7.4 7.4 0 0 1 14.4 0" />
  </Ico>
)

export const IconLock = (p: P) => (
  <Ico {...p}>
    <rect x="4.6" y="10.2" width="14.8" height="10.4" rx="2" />
    <path d="M8.2 10.2V7.6a3.8 3.8 0 0 1 7.6 0v2.6" />
    <path d="M12 14.4v2.4" />
  </Ico>
)

export const IconBuild = (p: P) => (
  <Ico {...p}>
    <path d="M4 20.5V5.5A1.5 1.5 0 0 1 5.5 4h7A1.5 1.5 0 0 1 14 5.5v15" />
    <path d="M14 10h4.5A1.5 1.5 0 0 1 20 11.5v9" />
    <path d="M3 20.5h18" />
    <path d="M7 8h4M7 11.5h4M7 15h4M17 13.5h.01M17 17h.01" />
  </Ico>
)

export const IconPie = (p: P) => (
  <Ico {...p}>
    <path d="M12 3.5v8.5h8.5A8.5 8.5 0 0 0 12 3.5z" />
    <path d="M9.6 5.2A8.5 8.5 0 1 0 18.8 14.4H11V6.6z" />
  </Ico>
)

export const IconActivity = (p: P) => (
  <Ico {...p}>
    <path d="M3.5 12.5h4l2.5-7 4 14 2.5-7h4" />
  </Ico>
)

export const IconCalendar = (p: P) => (
  <Ico {...p}>
    <rect x="3.8" y="5.2" width="16.4" height="15" rx="2" />
    <path d="M3.8 10h16.4M8.5 3.5v3.4M15.5 3.5v3.4" />
  </Ico>
)

export const IconClock = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 7.4V12l3 1.8" />
  </Ico>
)

export const IconGlobe = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M3.6 12h16.8" />
    <path d="M12 3.6c2.2 2.4 3.3 5.2 3.3 8.4s-1.1 6-3.3 8.4c-2.2-2.4-3.3-5.2-3.3-8.4S9.8 6 12 3.6z" />
  </Ico>
)

export const IconFlame = (p: P) => (
  <Ico {...p}>
    <path d="M12 21c3.6 0 6-2.4 6-5.7 0-4.2-4.4-5.6-4-11.3-2.6 1.1-4.4 3.4-4.4 6 0 1.4-.9 1.9-1.6 1.9-.9 0-1.6-.8-1.9-1.8a7.6 7.6 0 0 0-.6 3c0 4.5 2.9 7.9 6.5 7.9z" />
  </Ico>
)

export const IconMail = (p: P) => (
  <Ico {...p}>
    <rect x="3.2" y="5.4" width="17.6" height="13.2" rx="2" />
    <path d="m3.6 6.8 8.4 6 8.4-6" />
  </Ico>
)

export const IconEye = (p: P) => (
  <Ico {...p}>
    <path d="M2.5 12S6 5.8 12 5.8 21.5 12 21.5 12 18 18.2 12 18.2 2.5 12 2.5 12z" />
    <circle cx="12" cy="12" r="3.1" />
  </Ico>
)

export const IconTrendUp = (p: P) => (
  <Ico {...p}>
    <path d="m3.5 16.5 5.5-5.5 3.5 3.5 7.5-7.5" />
    <path d="M20 11V7h-4" />
  </Ico>
)

export const IconTrendDown = (p: P) => (
  <Ico {...p}>
    <path d="m3.5 7.5 5.5 5.5 3.5-3.5 7.5 7.5" />
    <path d="M20 13v4h-4" />
  </Ico>
)

export const IconSwap = (p: P) => (
  <Ico {...p}>
    <path d="M7 4.5 3.5 8 7 11.5" />
    <path d="M3.5 8H16a4.5 4.5 0 0 1 0 9h-1" />
    <path d="m17 19.5 3.5-3.5L17 12.5" />
  </Ico>
)

export const IconWarning = (p: P) => (
  <Ico {...p}>
    <path d="M10.3 4.3 2.6 17.6a1.9 1.9 0 0 0 1.7 2.9h15.4a1.9 1.9 0 0 0 1.7-2.9L13.7 4.3a1.9 1.9 0 0 0-3.4 0z" />
    <path d="M12 9.5v4.2M12 17.2h.01" />
  </Ico>
)

export const IconInfo = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 11v5.5M12 7.8h.01" />
  </Ico>
)

export const IconGrid = (p: P) => (
  <Ico {...p}>
    <rect x="3.6" y="3.6" width="7" height="7" rx="1.4" />
    <rect x="13.4" y="3.6" width="7" height="7" rx="1.4" />
    <rect x="3.6" y="13.4" width="7" height="7" rx="1.4" />
    <rect x="13.4" y="13.4" width="7" height="7" rx="1.4" />
  </Ico>
)

export const IconDoc = (p: P) => (
  <Ico {...p}>
    <path d="M13.6 3.5H7A2 2 0 0 0 5 5.5v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.9z" />
    <path d="M13.6 3.5V8.9H19" />
  </Ico>
)

export const IconScale = (p: P) => (
  <Ico {...p}>
    <path d="M12 4v16M7 20h10" />
    <path d="M12 7 5 9l2.6 4.5a3 3 0 0 1-5.2 0L5 9" />
    <path d="m12 7 7 2-2.6 4.5a3 3 0 0 0 5.2 0L19 9" />
  </Ico>
)

export const IconGauge = (p: P) => (
  <Ico {...p}>
    <path d="M4 17.5a9 9 0 1 1 16 0" />
    <path d="m12 13.5 4-3.8" />
    <circle cx="12" cy="14.4" r="1.4" fill="currentColor" />
  </Ico>
)

export const IconWallet = (p: P) => (
  <Ico {...p}>
    <path d="M3.5 8.2A2.2 2.2 0 0 1 5.7 6h11.6a2.2 2.2 0 0 1 2.2 2.2v8.6a2.2 2.2 0 0 1-2.2 2.2H5.7a2.2 2.2 0 0 1-2.2-2.2z" />
    <path d="M3.5 9.6h13.8a1.8 1.8 0 0 1 1.8 1.8v1.2a1.8 1.8 0 0 1-1.8 1.8H3.5" />
    <path d="M16.4 12.6h.01" />
  </Ico>
)

export const IconRobot = (p: P) => (
  <Ico {...p}>
    <rect x="4.2" y="7.6" width="15.6" height="11.4" rx="3" />
    <path d="M12 3.6v4M9 12.4h.01M15 12.4h.01M9.5 15.8h5" />
  </Ico>
)

export const IconLightning = (p: P) => (
  <Ico {...p}>
    <path d="M13.4 2.5 4.8 13.4h6.2l-1.4 8.1 8.6-10.9h-6.2z" />
  </Ico>
)

export const IconLeaf = (p: P) => (
  <Ico {...p}>
    <path d="M4.5 19.5c0-8 5-13 15-13.5.5 9.5-4.5 14-12 14" />
    <path d="M4.5 19.5c3-4 6.5-6.5 10.5-8" />
  </Ico>
)

export const IconChip = (p: P) => (
  <Ico {...p}>
    <rect x="6.8" y="6.8" width="10.4" height="10.4" rx="2" />
    <path d="M10 3.4v3.4M14 3.4v3.4M10 17.2v3.4M14 17.2v3.4M3.4 10h3.4M3.4 14h3.4M17.2 10h3.4M17.2 14h3.4" />
  </Ico>
)

export const IconBank = (p: P) => (
  <Ico {...p}>
    <path d="M3.5 9.5 12 4l8.5 5.5" />
    <path d="M5.5 10.5v8M9.5 10.5v8M14.5 10.5v8M18.5 10.5v8" />
    <path d="M3 20.5h18" />
  </Ico>
)

export const IconCart = (p: P) => (
  <Ico {...p}>
    <path d="M2.8 3.5h2.4l2.4 10.6h9.6l2.2-7.6H6" />
    <circle cx="9" cy="18.6" r="1.5" />
    <circle cx="16.6" cy="18.6" r="1.5" />
  </Ico>
)

export const IconTruck = (p: P) => (
  <Ico {...p}>
    <path d="M2.8 6.5h10.4v9.8H2.8z" />
    <path d="M13.2 9.4h3.6l3.4 3.4v3.5h-7z" />
    <circle cx="7" cy="18.4" r="1.5" />
    <circle cx="16.6" cy="18.4" r="1.5" />
  </Ico>
)

export const IconTower = (p: P) => (
  <Ico {...p}>
    <path d="M8.5 20.5 11 3.5h2l2.5 17" />
    <path d="M6 12.4h12M7 8.2h10M9.6 16.4h4.8" />
  </Ico>
)

export const IconOil = (p: P) => (
  <Ico {...p}>
    <path d="M6.5 20.5h11" />
    <path d="M8.5 20.5V9l3.5-2.6L15.5 9v11.5" />
    <path d="M8.5 12.6h7M12 3.4v3" />
  </Ico>
)

export const IconDrop = (p: P) => (
  <Ico {...p}>
    <path d="M12 3.5c3.4 4.2 5.6 7.2 5.6 10a5.6 5.6 0 0 1-11.2 0c0-2.8 2.2-5.8 5.6-10z" />
  </Ico>
)

export const IconHandshake = (p: P) => (
  <Ico {...p}>
    <path d="m3.5 11.8 4-4 4 1.4 4.6 4.4" />
    <path d="M20.5 9.4 17 5.9l-2.4 1.2" />
    <path d="m11.5 9.2 4.4 4.2-2.6 2.6-1.8-1.7" />
    <path d="M7.5 7.8 3.5 11.8l3 3" />
  </Ico>
)

export const IconDiamond = (p: P) => (
  <Ico {...p}>
    <path d="M7 3.5h10l4 5.5L12 20.5 3 9z" />
    <path d="M3 9h18M12 20.5 8.5 9 12 3.5 15.5 9z" />
  </Ico>
)

export const IconLogo = ({ size = 34, ...rest }: P) => (
  <svg width={size} height={size} viewBox="0 0 48 48" fill="none" aria-hidden="true" {...rest}>
    <defs>
      <linearGradient id="kgG" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#f6e6b4" />
        <stop offset="45%" stopColor="#d4af37" />
        <stop offset="100%" stopColor="#94761f" />
      </linearGradient>
    </defs>
    <path
      d="M24 3.5 27.2 10h6.4l4.6 4.6-2.6 6.5 3.4 6.4-5.4 4.4-6.6 1.6-6.6-1.6-5.4-4.4 3.4-6.4-2.6-6.5L20.4 10h6.4z"
      stroke="url(#kgG)"
      strokeWidth="1.5"
      fill="none"
    />
    <path d="M24 9v30" stroke="url(#kgG)" strokeWidth="2.6" strokeLinecap="round" />
    <path d="M24 9l3.4 3.4L24 15.8 20.6 12.4z" fill="url(#kgG)" />
    <path d="M13 17.5 24 22l11-4.5" stroke="url(#kgG)" strokeWidth="1.5" fill="none" />
    <circle cx="24" cy="24" r="13" stroke="url(#kgG)" strokeWidth="1.1" fill="none" opacity="0.5" />
  </svg>
)

export const IconPortfolio = IconBriefcase
export const IconSecurity = IconShield