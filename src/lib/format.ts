/* ==========================================================================
   ĐỊNH DẠNG SỐ LIỆU — chuẩn quốc tế (dấu , ngăn nghìn, dấu . thập phân)
   ========================================================================== */

const nfCache = new Map<number, Intl.NumberFormat>()

function nfOf(digits: number): Intl.NumberFormat {
  let f = nfCache.get(digits)
  if (!f) {
    f = new Intl.NumberFormat('en-US', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
    nfCache.set(digits, f)
  }
  return f
}

/** 1245.32 -> "1.245,32" */
export const num = (n: number, digits = 0): string =>
  Number.isFinite(n) ? nfOf(digits).format(n) : '—'

const nfViCache = new Map<number, Intl.NumberFormat>()

function nfViOf(digits: number): Intl.NumberFormat {
  let f = nfViCache.get(digits)
  if (!f) {
    f = new Intl.NumberFormat('vi-VN', {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    })
    nfViCache.set(digits, f)
  }
  return f
}

/** 28.6 -> "28,60" (chuẩn Việt Nam: dấu phẩy thập phân) */
export const numVi = (n: number, digits = 2): string =>
  Number.isFinite(n) ? nfViOf(digits).format(n) : '—'

/** 0.83 -> "+0,83%" */
export const pct = (n: number, digits = 2): string =>
  Number.isFinite(n) ? `${n > 0 ? '+' : ''}${nfOf(digits).format(n)}%` : '—'

/** 0.83 -> "0,83%" (không dấu +) */
export const pctAbs = (n: number, digits = 2): string =>
  Number.isFinite(n) ? `${nfOf(digits).format(n)}%` : '—'

/** 1250000000 -> "1.250.000.000" */
export const vnd = (n: number): string => num(n, 0)

/** Rút gọn tiền VND: 1.250.000.000 -> "1,25 tỷ" */
export const compactVnd = (n: number): string => {
  const a = Math.abs(n)
  if (a >= 1e12) return `${num(n / 1e12, 2)} nghìn tỷ`
  if (a >= 1e9) return `${num(n / 1e9, 2)} tỷ`
  if (a >= 1e6) return `${num(n / 1e6, 1)} tr`
  if (a >= 1e3) return `${num(n / 1e3, 0)} ng`
  return num(n, 0)
}

/** Giá trị đã ở đơn vị "tỷ": 18532 -> "18.532 tỷ" */
export const ty = (n: number, digits = 0): string => `${num(n, digits)} tỷ`

/** Giá trị đã ở đơn vị "triệu" */
export const tr = (n: number, digits = 0): string => `${num(n, digits)} tr`

/** 18532 -> "18,5 nghìn tỷ" */
export const tyShort = (n: number): string =>
  Math.abs(n) >= 1000 ? `${num(n / 1000, 1)} nghìn tỷ` : `${num(n, 0)} tỷ`

/** Ký hiệu tăng/giảm */
export type Dir = 'up' | 'down' | 'flat'
export const dir = (n: number, eps = 0.0001): Dir =>
  n > eps ? 'up' : n < -eps ? 'down' : 'flat'

/** Lớp CSS theo hướng */
export const dirClass = (n: number): string => {
  const d = dir(n)
  return d === 'up' ? 'up' : d === 'down' ? 'down' : 'flat'
}

/** Dấu + / − tường minh */
export const signed = (n: number, digits = 2): string =>
  `${n > 0 ? '+' : ''}${num(n, digits)}`

/** Khối lượng: 812400000 -> "812,4 triệu CP" */
export const volume = (n: number): string => {
  if (n >= 1e9) return `${num(n / 1e9, 2)} tỷ CP`
  if (n >= 1e6) return `${num(n / 1e6, 1)} triệu CP`
  if (n >= 1e3) return `${num(n / 1e3, 0)} nghìn CP`
  return `${num(n, 0)} CP`
}

/** 2.6843 -> "2.684,30" (chỉ số) */
export const index = (n: number): string => num(n, 2)

/* -------------------------------------------------------------------------- */
/* Thời gian                                                                  */
/* -------------------------------------------------------------------------- */

const pad = (n: number) => String(n).padStart(2, '0')

export const fmtDate = (d: Date): string =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`

export const fmtDDMM = (d: Date): string =>
  `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`

export const fmtTime = (d: Date): string =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}`

export const fmtClock = (d: Date): string =>
  `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`

export const WEEKDAYS = [
  'Chủ Nhật',
  'Thứ Hai',
  'Thứ Ba',
  'Thứ Tư',
  'Thứ Năm',
  'Thứ Sáu',
  'Thứ Bảy',
]

export const WEEKDAYS_SHORT = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

export const fmtLongDate = (d: Date): string =>
  `${WEEKDAYS[d.getDay()]}, ${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`

/** Chuỗi thời gian tương đối: "3 giờ trước" */
export const ago = (d: Date, now = new Date()): string => {
  const s = Math.max(0, (now.getTime() - d.getTime()) / 1000)
  if (s < 60) return 'vừa xong'
  if (s < 3600) return `${Math.floor(s / 60)} phút trước`
  if (s < 86400) return `${Math.floor(s / 3600)} giờ trước`
  const days = Math.floor(s / 86400)
  if (days < 30) return `${days} ngày trước`
  return fmtDate(d)
}

/* -------------------------------------------------------------------------- */
/* Tiện ích khác                                                              */
/* -------------------------------------------------------------------------- */

export const clamp = (n: number, lo: number, hi: number): number =>
  Math.min(hi, Math.max(lo, n))

export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t

/** Bỏ dấu tiếng Việt để tìm kiếm */
export const slug = (s: string): string =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()
    .trim()

/** Tìm kiếm không dấu */
export const matches = (haystack: string, needle: string): boolean =>
  slug(haystack).includes(slug(needle))

export const initials = (name: string): string =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(-2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

/** Nhãn số lượng lớn: 124 -> "124" */
export const count = (n: number): string => num(n, 0)