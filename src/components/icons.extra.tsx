/* ==========================================================================
   BIỂU TƯỢNG BỔ SUNG — dùng cho kịch bản & rủi ro
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

export const IconTrendDown = (p: P) => (
  <Ico {...p}>
    <path d="m3.5 7.5 5.5 5.5 3.5-3.5 7.5 7.5" />
    <path d="M20 13v4h-4" />
  </Ico>
)

export const IconGold2 = (p: P) => (
  <Ico {...p}>
    <ellipse cx="12" cy="15.5" rx="8" ry="3.4" />
    <path d="M4 15.5v2c0 1.9 3.6 3.4 8 3.4s8-1.5 8-3.4v-2" />
    <ellipse cx="12" cy="8.4" rx="8" ry="3.4" />
    <path d="M4 8.4v7.1M20 8.4v7.1" />
  </Ico>
)

export const IconDrop = (p: P) => (
  <Ico {...p}>
    <path d="M12 3.5c3.4 4.2 5.6 7.2 5.6 10a5.6 5.6 0 0 1-11.2 0c0-2.8 2.2-5.8 5.6-10z" />
  </Ico>
)

export const IconOil = (p: P) => (
  <Ico {...p}>
    <path d="M6.5 20.5h11" />
    <path d="M8.5 20.5V9l3.5-2.6L15.5 9v11.5" />
    <path d="M8.5 12.6h7M12 3.4v3" />
  </Ico>
)

export const IconFlame = (p: P) => (
  <Ico {...p}>
    <path d="M12 21c3.6 0 6-2.4 6-5.7 0-4.2-4.4-5.6-4-11.3-2.6 1.1-4.4 3.4-4.4 6 0 1.4-.9 1.9-1.6 1.9-.9 0-1.6-.8-1.9-1.8a7.6 7.6 0 0 0-.6 3c0 4.5 2.9 7.9 6.5 7.9z" />
  </Ico>
)

export const IconWarning = (p: P) => (
  <Ico {...p}>
    <path d="M10.3 4.3 2.6 17.6a1.9 1.9 0 0 0 1.7 2.9h15.4a1.9 1.9 0 0 0 1.7-2.9L13.7 4.3a1.9 1.9 0 0 0-3.4 0z" />
    <path d="M12 9.5v4.2M12 17.2h.01" />
  </Ico>
)

export const IconGauge = (p: P) => (
  <Ico {...p}>
    <path d="M4 17.5a9 9 0 1 1 16 0" />
    <path d="m12 13.5 4-3.8" />
    <circle cx="12" cy="14.4" r="1.4" fill="currentColor" />
  </Ico>
)

export const IconScale = (p: P) => (
  <Ico {...p}>
    <path d="M12 4v16M7 20h10" />
    <path d="M12 7 5 9l2.6 4.5a3 3 0 0 1-5.2 0L5 9" />
    <path d="m12 7 7 2-2.6 4.5a3 3 0 0 0 5.2 0L19 9" />
  </Ico>
)

export const IconShieldCheck = (p: P) => (
  <Ico {...p}>
    <path d="M12 3.2 5 6v6c0 4.1 2.9 7.6 7 8.8 4.1-1.2 7-4.7 7-8.8V6z" />
    <path d="m9.2 12 2 2 3.6-3.9" />
  </Ico>
)

export const IconCrosshair = (p: P) => (
  <Ico {...p}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 2.5v4M12 17.5v4M2.5 12h4M17.5 12h4" />
    <circle cx="12" cy="12" r="2.4" />
  </Ico>
)

export const IconStack = (p: P) => (
  <Ico {...p}>
    <rect x="3.6" y="4.2" width="16.8" height="4.2" rx="1.2" />
    <rect x="3.6" y="10" width="16.8" height="4.2" rx="1.2" />
    <rect x="3.6" y="15.8" width="16.8" height="4.2" rx="1.2" />
  </Ico>
)

export const IconPulse = (p: P) => (
  <Ico {...p}>
    <path d="M3.5 12.5h4l2.5-7 4 14 2.5-7h4" />
  </Ico>
)

export const IconBolt = (p: P) => (
  <Ico {...p}>
    <path d="M13.4 2.5 4.8 13.4h6.2l-1.4 8.1 8.6-10.9h-6.2z" />
  </Ico>
)