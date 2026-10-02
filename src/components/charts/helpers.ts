/* ==========================================================================
   HÌNH HỌC BIỂU ĐỒ
   ========================================================================== */

export type Pt = { x: number; y: number }

/** Khoảng giá trị nhỏ nhất / lớn nhất của nhiều chuỗi */
export function extent(series: number[][]): [number, number] {
  let min = Infinity
  let max = -Infinity
  for (const s of series) {
    for (const v of s) {
      if (v < min) min = v
      if (v > max) max = v
    }
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1]
  if (min === max) return [min - 1, max + 1]
  return [min, max]
}

export type Scale = {
  min: number
  max: number
  step: number
  values: number[]
}

/** Chia trục tung theo bước "đẹp" (1/2/2.5/5/10 × 10^n) */
export function niceScale(min: number, max: number, ticks = 4): Scale {
  let lo = min
  let hi = max
  if (!Number.isFinite(lo) || !Number.isFinite(hi)) {
    lo = 0
    hi = 1
  }
  if (lo === hi) {
    lo -= 1
    hi += 1
  }
  const rawStep = (hi - lo) / Math.max(1, ticks)
  const mag = Math.pow(10, Math.floor(Math.log10(rawStep)))
  const norm = rawStep / mag
  const mult = norm <= 1 ? 1 : norm <= 2 ? 2 : norm <= 2.5 ? 2.5 : norm <= 5 ? 5 : 10
  const step = mult * mag
  const nMin = Math.floor(lo / step) * step
  const nMax = Math.ceil(hi / step) * step
  const values: number[] = []
  for (let v = nMin; v <= nMax + step * 0.5; v += step) {
    values.push(Number(v.toPrecision(12)))
  }
  return { min: nMin, max: nMax, step, values }
}

/** Hàm ánh xạ (index, value) -> toạ độ pixel */
export function makeMapper(
  count: number,
  min: number,
  max: number,
  x0: number,
  y0: number,
  w: number,
  h: number,
): (i: number, v: number) => Pt {
  const span = max - min || 1
  const denom = count > 1 ? count - 1 : 1
  return (i, v) => ({
    x: x0 + (count > 1 ? (i / denom) * w : w / 2),
    y: y0 + h - ((v - min) / span) * h,
  })
}

export const linePath = (pts: Pt[]): string => {
  if (!pts.length) return ''
  let d = ''
  for (let i = 0; i < pts.length; i++) {
    d += `${i ? 'L' : 'M'}${pts[i].x.toFixed(2)} ${pts[i].y.toFixed(2)}`
    if (i < pts.length - 1) d += ' '
  }
  return d
}

/** Đường cong Catmull-Rom quy đổi sang Bezier */
export function smoothPath(pts: Pt[], tension = 0.42): string {
  if (pts.length < 3) return linePath(pts)
  let d = `M${pts[0].x.toFixed(2)} ${pts[0].y.toFixed(2)}`
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i]
    const p1 = pts[i]
    const p2 = pts[i + 1]
    const p3 = pts[i + 2] ?? p2
    const c1x = p1.x + ((p2.x - p0.x) / 6) * tension * 2
    const c1y = p1.y + ((p2.y - p0.y) / 6) * tension * 2
    const c2x = p2.x - ((p3.x - p1.x) / 6) * tension * 2
    const c2y = p2.y - ((p3.y - p1.y) / 6) * tension * 2
    d +=
      ` C${c1x.toFixed(2)} ${c1y.toFixed(2)}` +
      ` ${c2x.toFixed(2)} ${c2y.toFixed(2)}` +
      ` ${p2.x.toFixed(2)} ${p2.y.toFixed(2)}`
  }
  return d
}

/** Vùng tô kín xuống đường cơ sở */
export function areaPath(pts: Pt[], baseY: number, smooth = true): string {
  if (!pts.length) return ''
  const l = smooth ? smoothPath(pts) : linePath(pts)
  const first = pts[0]
  const last = pts[pts.length - 1]
  return `${l} L${last.x.toFixed(2)} ${baseY.toFixed(2)} L${first.x.toFixed(2)} ${baseY.toFixed(2)} Z`
}

/** Cung tròn cho biểu đồ vành khuyên */
export function arcPath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a0: number,
  a1: number,
): string {
  const large = a1 - a0 > Math.PI ? 1 : 0
  const x0 = cx + rOuter * Math.cos(a0)
  const y0 = cy + rOuter * Math.sin(a0)
  const x1 = cx + rOuter * Math.cos(a1)
  const y1 = cy + rOuter * Math.sin(a1)
  const x2 = cx + rInner * Math.cos(a1)
  const y2 = cy + rInner * Math.sin(a1)
  const x3 = cx + rInner * Math.cos(a0)
  const y3 = cy + rInner * Math.sin(a0)
  return [
    `M${x0.toFixed(2)} ${y0.toFixed(2)}`,
    `A${rOuter} ${rOuter} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`,
    `L${x2.toFixed(2)} ${y2.toFixed(2)}`,
    `A${rInner} ${rInner} 0 ${large} 0 ${x3.toFixed(2)} ${y3.toFixed(2)}`,
    'Z',
  ].join(' ')
}

/** Lấy mẫu thưa chuỗi để nhãn trục hoành không chồng nhau */
export function tickIndices(count: number, maxTicks: number): number[] {
  if (count <= 0) return []
  if (count <= maxTicks) return Array.from({ length: count }, (_, i) => i)
  const stride = Math.ceil(count / maxTicks)
  const out: number[] = []
  for (let i = 0; i < count; i += stride) out.push(i)
  const last = count - 1
  if (out[out.length - 1] !== last) out.push(last)
  return out
}

/** Sinh dữ liệu bước ngẫu nhiên có hạt giống (deterministic) */
export function seededSeries(
  seed: number,
  count: number,
  start: number,
  drift: number,
  vol: number,
): number[] {
  let s = seed >>> 0
  const rnd = () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
  const out: number[] = []
  let v = start
  for (let i = 0; i < count; i++) {
    const shock = (rnd() - 0.5) * 2 * vol
    const wave = Math.sin(i / (count / 5.5)) * vol * 0.4
    v = v + drift + shock + wave
    out.push(v)
  }
  return out
}