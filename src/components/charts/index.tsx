/* ==========================================================================
   BỘ BIỂU ĐỒ KIMQUY — SVG thuần, không phụ thuộc thư viện ngoài
   ========================================================================== */

import { useMemo, useState, type ReactNode } from 'react'
import {
  arcPath,
  areaPath,
  extent,
  linePath,
  makeMapper,
  niceScale,
  smoothPath,
  tickIndices,
  type Pt,
} from './helpers'
import { num } from '../../lib/format'

/* -------------------------------------------------------------------------- */
/* Bảng màu chuỗi dữ liệu                                                     */
/* -------------------------------------------------------------------------- */

export const PALETTE = [
  '#2ec27b',
  '#d4af37',
  '#5b8def',
  '#8b7cf6',
  '#2dd4bf',
  '#f59e6b',
  '#ec6a8a',
  '#56b6e8',
  '#a3c94a',
  '#cf9f5a',
  '#7f8fa6',
  '#6b7280',
]

export const colorAt = (i: number): string => PALETTE[i % PALETTE.length]

const UP = '#22c576'
const DOWN = '#e5484d'
const GOLD = '#d4af37'

export const upDownColor = (v: number, flat = '#8b8b8b'): string =>
  v > 0 ? UP : v < 0 ? DOWN : flat

/* -------------------------------------------------------------------------- */
/* Thanh trượt nhỏ (sparkline)                                                */
/* -------------------------------------------------------------------------- */

type SparkProps = {
  data: number[]
  color?: string
  tone?: 'up' | 'down' | 'gold' | 'flat' | string
  height?: number
  width?: number
  fill?: boolean
  strokeWidth?: number
  showLast?: boolean
}

export function Sparkline({
  data,
  color,
  tone,
  height = 38,
  width = 120,
  fill = true,
  strokeWidth = 1.4,
  showLast = false,
}: SparkProps) {
  const id = useMemo(() => `sp${Math.random().toString(36).slice(2, 9)}`, [])
  if (data.length < 2) return <div style={{ height }} />

  const [lo, hi] = extent([data])
  const pad = (hi - lo) * 0.14 || 1
  const min = lo - pad
  const max = hi + pad
  const map = makeMapper(data.length, min, max, 0, strokeWidth, width, height - strokeWidth * 2)
  const pts = data.map((v, i) => map(i, v))

  const rising = data[data.length - 1] >= data[0]
  const resolvedColor = color ?? (tone === 'up' ? UP : tone === 'down' ? DOWN : tone === 'gold' ? GOLD : rising ? UP : DOWN)
  const stroke = resolvedColor
  const last = pts[pts.length - 1]

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      height={height}
      preserveAspectRatio="none"
      style={{ width: '100%' }}
      aria-hidden="true"
    >
      {fill && (
        <>
          <defs>
            <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.32" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={areaPath(pts, height)} fill={`url(#${id})`} />
        </>
      )}
      <path
        d={smoothPath(pts)}
        fill="none"
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      {showLast && <circle cx={last.x} cy={last.y} r={2.2} fill={stroke} />}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Đường rất nhỏ (dùng trong bảng, thẻ chủ đề)                                */
/* -------------------------------------------------------------------------- */

export function LineMini({
  data,
  height = 22,
  width = 62,
  color,
  strokeWidth = 1.2,
}: {
  data: number[]
  height?: number
  width?: number
  color?: string
  strokeWidth?: number
}) {
  if (data.length < 2) return <div style={{ height }} />
  const [lo, hi] = extent([data])
  const pad = (hi - lo) * 0.16 || 1
  const map = makeMapper(data.length, lo - pad, hi + pad, 0, strokeWidth, width, height - strokeWidth * 2)
  const pts = data.map((v, i) => map(i, v))
  const rising = data[data.length - 1] >= data[0]
  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      height={height}
      preserveAspectRatio="none"
      style={{ width: '100%' }}
      aria-hidden="true"
    >
      <path
        d={smoothPath(pts)}
        fill="none"
        stroke={color ?? (rising ? UP : DOWN)}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Biểu đồ vùng nhiều chuỗi (có trục, lưới, tooltip)                          */
/* -------------------------------------------------------------------------- */

export type Series = {
  id: string
  name: string
  data: number[]
  color: string
  dashed?: boolean
  width?: number
  area?: boolean
  dots?: boolean
}

type AreaProps = {
  series: Series[]
  labels: string[]
  height?: number
  fmt?: (n: number) => string
  yTicks?: number
  xTicks?: number
  volume?: number[]
  refLine?: number
  legend?: boolean
  areaGradient?: boolean
  yPadPct?: number
  yMin?: number
  yMax?: number
  endTag?: string
  smooth?: boolean
  className?: string
}

export function AreaChart({
  series,
  labels,
  height = 190,
  fmt = (n) => num(n, 0),
  yTicks = 4,
  xTicks = 6,
  volume,
  refLine,
  legend = false,
  areaGradient = true,
  yPadPct = 0.08,
  yMin,
  yMax,
  endTag,
  smooth = true,
}: AreaProps) {
  const uid = useMemo(() => `ac${Math.random().toString(36).slice(2, 9)}`, [])
  const [hover, setHover] = useState<number | null>(null)

  const W = 800
  const H = height
  const padL = 44
  const padR = 8
  const padT = 8
  const volH = volume ? 30 : 0
  const gapVol = volume ? 8 : 0
  const padB = 20
  const plotW = W - padL - padR
  const plotH = H - padT - padB - volH - gapVol

  const all = series.map((s) => s.data)
  const [lo, hi] = extent(refLine !== undefined ? [...all, [refLine]] : all)
  const pad = (hi - lo) * yPadPct || 1
  const scale = niceScale(yMin ?? lo - pad, yMax ?? hi + pad, yTicks)
  const count = Math.max(...series.map((s) => s.data.length), 1)
  const map = makeMapper(count, scale.min, scale.max, padL, padT, plotW, plotH)

  const volMax = volume ? Math.max(...volume, 1) : 1
  const volBase = padT + plotH + gapVol
  const bw = Math.max(1.5, (plotW / Math.max(volume?.length ?? 1, 1)) * 0.55)

  const flip = (clientX: number, el: SVGSVGElement): number => {
    const r = el.getBoundingClientRect()
    const ratio = ((clientX - r.left) / r.width) * W
    const i = Math.round(((ratio - padL) / plotW) * (count - 1))
    return Math.max(0, Math.min(count - 1, i))
  }

  const labelIdx = tickIndices(labels.length, xTicks)

  return (
    <div className="chart" style={{ position: 'relative' }}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        height={H}
        preserveAspectRatio="none"
        onMouseMove={(e) => setHover(flip(e.clientX, e.currentTarget))}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={series.map((s) => s.name).join(', ')}
      >
        <defs>
          {series.map((s) => (
            <linearGradient key={s.id} id={`${uid}-${s.id}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={s.color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={s.color} stopOpacity="0.015" />
            </linearGradient>
          ))}
        </defs>

        {/* lưới ngang + nhãn trục tung */}
        {scale.values.map((v) => {
          const y = map(0, v).y
          if (y < padT - 1 || y > padT + plotH + 1) return null
          return (
            <g key={v}>
              <line
                x1={padL}
                x2={W - padR}
                y1={y}
                y2={y}
                stroke="rgba(255,255,255,0.055)"
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={padL - 7}
                y={y + 3}
                textAnchor="end"
                fontSize="9.5"
                fill="#6f6a60"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {fmt(v)}
              </text>
            </g>
          )
        })}

        {/* đường tham chiếu */}
        {refLine !== undefined && (
          <line
            x1={padL}
            x2={W - padR}
            y1={map(0, refLine).y}
            y2={map(0, refLine).y}
            stroke="rgba(255,255,255,0.24)"
            strokeWidth="1"
            strokeDasharray="4 3"
            vectorEffect="non-scaling-stroke"
          />
        )}

        {/* khối lượng giao dịch */}
        {volume &&
          volume.map((v, i) => {
            const h = (v / volMax) * volH
            const x = map(i, scale.min).x - bw / 2
            const rising = i === 0 || v >= volume[i - 1]
            return (
              <rect
                key={i}
                x={x}
                y={volBase + volH - h}
                width={bw}
                height={Math.max(0.6, h)}
                fill={rising ? UP : DOWN}
                opacity="0.5"
                rx="0.6"
              />
            )
          })}

        {/* nhãn trục hoành */}
        {labelIdx.map((i) => (
          <text
            key={i}
            x={map(i, scale.min).x}
            y={H - 5}
            textAnchor="middle"
            fontSize="9.5"
            fill="#6f6a60"
          >
            {labels[i] ?? ''}
          </text>
        ))}

        {/* vùng + đường */}
        {series.map((s) => {
          const pts: Pt[] = s.data.map((v, i) => map(i, v))
          return (
            <g key={s.id}>
              {areaGradient && s.area !== false && (
                <path d={areaPath(pts, padT + plotH, smooth)} fill={`url(#${uid}-${s.id})`} />
              )}
              <path
                d={smooth ? smoothPath(pts) : pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(' ')}
                fill="none"
                stroke={s.color}
                strokeWidth={s.width ?? 1.7}
                strokeDasharray={s.dashed ? '4 3' : undefined}
                strokeLinecap="round"
                strokeLinejoin="round"
                vectorEffect="non-scaling-stroke"
              />
              {s.dots &&
                pts.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="2.6" fill={s.color} />)}
            </g>
          )
        })}

        {/* nhãn giá tại điểm cuối */}
        {endTag !== undefined && series[0] && (() => {
          const s = series[0]
          const lastIdx = s.data.length - 1
          const p = map(lastIdx, s.data[lastIdx] ?? 0)
          const tw = endTag.length * 5.7 + 14
          const x = Math.min(W - padR - tw, p.x + 6)
          const y = Math.max(padT + 1, p.y - 19)
          return (
            <g pointerEvents="none">
              <rect x={x} y={y} width={tw} height={16} rx={8} fill="#0f3323" stroke="#22c576" strokeWidth="1" />
              <text
                x={x + tw / 2}
                y={y + 11.5}
                textAnchor="middle"
                fontSize="9.5"
                fill="#7ee2b0"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {endTag}
              </text>
            </g>
          )
        })()}

        {/* con trỏ */}
        {hover !== null && (
          <g pointerEvents="none">
            <line
              x1={map(hover, scale.min).x}
              x2={map(hover, scale.min).x}
              y1={padT}
              y2={padT + plotH}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth="1"
              strokeDasharray="3 3"
              vectorEffect="non-scaling-stroke"
            />
            {series.map((s) => (
              <circle
                key={s.id}
                cx={map(hover, s.data[hover] ?? scale.min).x}
                cy={map(hover, s.data[hover] ?? scale.min).y}
                r="3.4"
                fill={s.color}
                stroke="#0c0c0c"
                strokeWidth="1.6"
              />
            ))}
          </g>
        )}
      </svg>

      {hover !== null && (
        <div
          className="tip"
          style={{
            left: `${(map(hover, scale.min).x / W) * 100}%`,
            top: 4,
            transform: 'translate(-50%, 0)',
          }}
        >
          <div style={{ color: '#a9a397', fontSize: 10, marginBottom: 2 }}>
            {labels[hover] ?? ''}
          </div>
          {series.map((s) => (
            <div key={s.id} style={{ display: 'flex', gap: 8, justifyContent: 'space-between' }}>
              <span style={{ color: s.color }}>{s.name}</span>
              <b style={{ color: '#f7f3eb' }}>{fmt(s.data[hover] ?? 0)}</b>
            </div>
          ))}
        </div>
      )}

      {legend && (
        <div className="chart-legend">
          {series.map((s) => (
            <span className="legend-item" key={s.id}>
              <i className="legend-dot" style={{ background: s.color }} />
              {s.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Biểu đồ cột                                                                */
/* -------------------------------------------------------------------------- */

type BarProps = {
  data: number[]
  labels: string[]
  height?: number
  fmt?: (n: number) => string
  color?: string
  diverging?: boolean
  yTicks?: number
  yMin?: number
  yMax?: number
  legend?: { label: string; color: string }[]
  extra?: number[]
  extraColor?: string
  lineSeries?: { data: number[]; color: string; name: string }
  className?: string
}

export function BarChart({
  data,
  labels,
  height = 190,
  fmt = (n) => num(n, 0),
  color = UP,
  diverging = false,
  yTicks = 4,
  yMin,
  yMax,
  legend,
  extra,
  extraColor = DOWN,
  lineSeries,
}: BarProps) {
  const W = 800
  const H = height
  const padL = 44
  const padR = 8
  const padT = 8
  const padB = 22
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const stacks: number[][] = [data, ...(extra ? [extra] : [])]
  const bounds: number[][] = [...stacks]
  if (diverging) bounds.push([0])
  if (lineSeries) bounds.push(lineSeries.data)
  const [lo, hi] = extent(bounds)
  const scale = niceScale(
    yMin ?? (diverging ? Math.min(lo, 0) : 0),
    yMax ?? Math.max(hi, 0),
    yTicks,
  )
  const map = makeMapper(Math.max(labels.length, 1), scale.min, scale.max, padL, padT, plotW, plotH)

  const slot = plotW / Math.max(labels.length, 1)
  const groupW = slot * 0.62
  const n = stacks.length
  const bw = groupW / n
  const zeroY = map(0, 0).y

  const linePts: Pt[] | null = lineSeries
    ? lineSeries.data.map((v, i) => {
        const x = padL + slot * (i + 0.5)
        return { x, y: map(0, v).y }
      })
    : null

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} height={H} preserveAspectRatio="none" role="img">
        {scale.values.map((v) => {
          const y = map(0, v).y
          if (y < padT - 1 || y > padT + plotH + 1) return null
          return (
            <g key={v}>
              <line
                x1={padL}
                x2={W - padR}
                y1={y}
                y2={y}
                stroke={v === 0 && diverging ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.055)'}
                strokeWidth="1"
                vectorEffect="non-scaling-stroke"
              />
              <text
                x={padL - 7}
                y={y + 3}
                textAnchor="end"
                fontSize="9.5"
                fill="#6f6a60"
                style={{ fontVariantNumeric: 'tabular-nums' }}
              >
                {fmt(v)}
              </text>
            </g>
          )
        })}

        {labels.map((lab, i) => {
          const cx = padL + slot * (i + 0.5)
          return (
            <g key={i}>
              {stacks.map((arr, k) => {
                const v = arr[i] ?? 0
                const y = map(0, v).y
                const top = Math.min(y, zeroY)
                const h = Math.max(1, Math.abs(zeroY - y))
                const x = cx - groupW / 2 + bw * k + bw * 0.11
                return (
                  <rect
                    key={k}
                    x={x}
                    y={top}
                    width={bw * 0.78}
                    height={h}
                    rx="1"
                    fill={k === 0 ? (diverging ? upDownColor(v) : color) : extraColor}
                    opacity={k === 0 ? 0.95 : 0.85}
                  />
                )
              })}
              <text x={cx} y={H - 6} textAnchor="middle" fontSize="9.5" fill="#6f6a60">
                {lab}
              </text>
            </g>
          )
        })}

        {linePts && (
          <>
            <path
              d={linePath(linePts)}
              fill="none"
              stroke={lineSeries!.color}
              strokeWidth="1.7"
              vectorEffect="non-scaling-stroke"
            />
            {linePts.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="2.6" fill="#0d0d0d" stroke={lineSeries!.color} strokeWidth="1.6" />
            ))}
          </>
        )}
      </svg>

      {legend && (
        <div className="chart-legend">
          {legend.map((l) => (
            <span className="legend-item" key={l.label}>
              <i className="legend-swatch" style={{ background: l.color }} />
              {l.label}
            </span>
          ))}
          {lineSeries && (
            <span className="legend-item">
              <i className="legend-line" style={{ background: lineSeries.color }} />
              {lineSeries.name}
            </span>
          )}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Cột nhỏ không trục (trong thẻ số liệu)                                     */
/* -------------------------------------------------------------------------- */

export function MiniBars({
  data,
  height = 46,
  color,
  gap = 2,
  diverging = false,
}: {
  data: number[]
  height?: number
  color?: string
  gap?: number
  diverging?: boolean
}) {
  const W = Math.max(data.length * 3, 20)
  const H = height
  if (!data.length) return <div style={{ height }} />

  const [lo, hi] = extent(diverging ? [data, [0]] : [data.map(Math.abs)])
  const min = diverging ? Math.min(lo, 0) : 0
  const max = Math.max(hi, 0)
  const span = max - min || 1
  const zeroY = H - ((0 - min) / span) * H
  const bw = (W - gap * (data.length - 1)) / data.length

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      height={H}
      preserveAspectRatio="none"
      style={{ width: '100%' }}
      aria-hidden="true"
    >
      {data.map((v, i) => {
        const h = Math.max(1.5, (Math.abs(v) / span) * H)
        const x = i * (bw + gap)
        const y = diverging ? (v >= 0 ? zeroY - h : zeroY) : H - h
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={bw}
            height={h}
            rx="0.8"
            fill={color ?? (diverging ? upDownColor(v) : UP)}
            opacity="0.88"
          />
        )
      })}
    </svg>
  )
}

/* -------------------------------------------------------------------------- */
/* Biểu đồ vành khuyên                                                        */
/* -------------------------------------------------------------------------- */

export type DonutSlice = { name: string; value: number; color?: string }

export function Donut({
  data,
  size = 150,
  thickness = 27,
  center,
  legend = true,
  legendFmt = (v: number) => `${num(v, 0)}%`,
  startAngle = -Math.PI / 2,
  gap = 0.012,
}: {
  data: DonutSlice[]
  size?: number
  thickness?: number
  center?: ReactNode
  legend?: boolean
  legendFmt?: (v: number) => string
  startAngle?: number
  gap?: number
}) {
  const total = data.reduce((s, d) => s + Math.max(0, d.value), 0) || 1
  const cx = size / 2
  const cy = size / 2
  const rOuter = size / 2 - 1
  const rInner = rOuter - thickness

  let angle = startAngle
  const arcs = data.map((d, i) => {
    const sweep = (Math.max(0, d.value) / total) * Math.PI * 2
    const a0 = angle + gap / 2
    const a1 = angle + sweep - gap / 2
    angle += sweep
    return {
      ...d,
      color: d.color ?? colorAt(i),
      d: a1 > a0 ? arcPath(cx, cy, rOuter, rInner, a0, a1) : '',
    }
  })

  return (
    <div className="donut-wrap">
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img">
          <circle cx={cx} cy={cy} r={(rOuter + rInner) / 2} fill="none" stroke="#1a1a1a" strokeWidth={thickness} />
          {arcs.map((a) => (
            <path key={a.name} d={a.d} fill={a.color} />
          ))}
        </svg>
        {center && (
          <div
            style={{
              position: 'absolute',
              inset: 0,
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
            }}
          >
            {center}
          </div>
        )}
      </div>

      {legend && (
        <div className="donut-legend">
          {arcs.map((a) => (
            <div className="donut-legend-row" key={a.name}>
              <i className="legend-dot" style={{ background: a.color }} />
              <span className="donut-legend-name">{a.name}</span>
              <span className="donut-legend-val">{legendFmt(a.value)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Danh sách thanh ngang                                                      */
/* -------------------------------------------------------------------------- */

export function BarList({
  rows,
  max,
  fmt = (v: number) => num(v, 0),
  barWidth = 96,
}: {
  rows: { name: string; value: number; color?: string }[]
  max?: number
  fmt?: (v: number) => string
  barWidth?: number
}) {
  const hi = max ?? Math.max(...rows.map((r) => Math.abs(r.value)), 1)
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
      {rows.map((r, i) => {
        const w = Math.max(2, (Math.abs(r.value) / hi) * barWidth)
        const c = r.color ?? colorAt(i)
        return (
          <div key={r.name} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 11 }}>
            <span
              className="truncate"
              style={{ flex: 1, minWidth: 0, color: 'var(--tx-mid)' }}
            >
              {r.name}
            </span>
            <span
              className="bar-track"
              style={{ width: barWidth, display: 'flex', justifyContent: 'flex-end' }}
            >
              <i style={{ width: w, background: c }} />
            </span>
            <span
              className="num"
              style={{ width: 54, textAlign: 'right', flexShrink: 0, color: c, fontWeight: 600 }}
            >
              {fmt(r.value)}
            </span>
          </div>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Biểu đồ nến                                                                */
/* -------------------------------------------------------------------------- */

export type Candle = { o: number; h: number; l: number; c: number; v?: number }

export function CandleChart({
  data,
  height = 220,
  fmt = (n: number) => num(n, 1),
  yTicks = 4,
  volume = false,
}: {
  data: Candle[]
  height?: number
  fmt?: (n: number) => string
  yTicks?: number
  volume?: boolean
}) {
  const W = 800
  const H = height
  const padL = 46
  const padR = 8
  const padT = 8
  const volH = volume ? 34 : 0
  const padB = 18
  const plotW = W - padL - padR
  const plotH = H - padT - padB - volH - (volume ? 8 : 0)

  if (!data.length) return <div style={{ height }} />

  const lows = data.map((d) => d.l)
  const highs = data.map((d) => d.h)
  const scale = niceScale(Math.min(...lows), Math.max(...highs), yTicks)
  const slot = plotW / data.length
  const bw = Math.max(1.5, slot * 0.62)
  const yOf = (v: number) =>
    padT + plotH - ((v - scale.min) / (scale.max - scale.min || 1)) * plotH

  const volMax = volume ? Math.max(...data.map((d) => d.v ?? 0), 1) : 1
  const volBase = padT + plotH + 8

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} height={H} preserveAspectRatio="none" role="img">
        {scale.values.map((v) => (
          <g key={v}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yOf(v)}
              y2={yOf(v)}
              stroke="rgba(255,255,255,0.055)"
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={padL - 7}
              y={yOf(v) + 3}
              textAnchor="end"
              fontSize="9.5"
              fill="#6f6a60"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {fmt(v)}
            </text>
          </g>
        ))}
        {data.map((d, i) => {
          const cx = padL + slot * (i + 0.5)
          const rising = d.c >= d.o
          const col = rising ? UP : DOWN
          const top = yOf(Math.max(d.o, d.c))
          const bot = yOf(Math.min(d.o, d.c))
          return (
            <g key={i}>
              <line
                x1={cx}
                x2={cx}
                y1={yOf(d.h)}
                y2={yOf(d.l)}
                stroke={col}
                strokeWidth="1"
                opacity="0.85"
                vectorEffect="non-scaling-stroke"
              />
              <rect
                x={cx - bw / 2}
                y={top}
                width={bw}
                height={Math.max(1, bot - top)}
                fill={rising ? col : col}
                opacity={rising ? 0.95 : 0.95}
                rx="0.5"
              />
              {volume && (
                <rect
                  x={cx - bw / 2}
                  y={volBase + volH - ((d.v ?? 0) / volMax) * volH}
                  width={bw}
                  height={Math.max(0.6, ((d.v ?? 0) / volMax) * volH)}
                  fill={col}
                  opacity="0.45"
                  rx="0.5"
                />
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Biểu đồ cột so sánh nhóm (Performance vs benchmark)                        */
/* -------------------------------------------------------------------------- */

export function GroupedBars({
  groups,
  height = 170,
  fmt = (n: number) => num(n, 1),
  seriesNames,
}: {
  groups: { label: string; values: number[] }[]
  height?: number
  fmt?: (n: number) => string
  seriesNames: { name: string; color: string }[]
}) {
  const W = 800
  const H = height
  const padL = 46
  const padR = 8
  const padT = 10
  const padB = 26
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const all = groups.flatMap((g) => g.values)
  const scale = niceScale(Math.min(...all, 0), Math.max(...all, 0), 4)
  const yOf = (v: number) =>
    padT + plotH - ((v - scale.min) / (scale.max - scale.min || 1)) * plotH
  const zeroY = yOf(0)

  const slot = plotW / Math.max(groups.length, 1)
  const groupW = slot * 0.6
  const n = seriesNames.length
  const bw = groupW / n

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} height={H} preserveAspectRatio="none" role="img">
        {scale.values.map((v) => (
          <g key={v}>
            <line
              x1={padL}
              x2={W - padR}
              y1={yOf(v)}
              y2={yOf(v)}
              stroke={Math.abs(v) < 1e-9 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.055)'}
              vectorEffect="non-scaling-stroke"
            />
            <text
              x={padL - 7}
              y={yOf(v) + 3}
              textAnchor="end"
              fontSize="9.5"
              fill="#6f6a60"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              {fmt(v)}
            </text>
          </g>
        ))}
        {groups.map((g, gi) => {
          const cx = padL + slot * (gi + 0.5)
          return (
            <g key={g.label}>
              {g.values.map((v, k) => {
                const y = yOf(v)
                const top = Math.min(y, zeroY)
                const h = Math.max(1.5, Math.abs(zeroY - y))
                const x = cx - groupW / 2 + bw * k + bw * 0.12
                const label = `${fmt(v)}`
                return (
                  <g key={k}>
                    <rect
                      x={x}
                      y={top}
                      width={bw * 0.76}
                      height={h}
                      rx="1.5"
                      fill={seriesNames[k]?.color ?? colorAt(k)}
                    />
                    <text
                      x={x + bw * 0.38}
                      y={v >= 0 ? top - 4 : top + h + 11}
                      textAnchor="middle"
                      fontSize="9.5"
                      fill={seriesNames[k]?.color ?? colorAt(k)}
                      style={{ fontVariantNumeric: 'tabular-nums' }}
                    >
                      {label}
                    </text>
                  </g>
                )
              })}
              <text x={cx} y={H - 8} textAnchor="middle" fontSize="9.5" fill="#6f6a60">
                {g.label}
              </text>
            </g>
          )
        })}
      </svg>
      <div className="chart-legend">
        {seriesNames.map((s) => (
          <span className="legend-item" key={s.name}>
            <i className="legend-swatch" style={{ background: s.color }} />
            {s.name}
          </span>
        ))}
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Biểu đồ độ nhạy (đường + điểm)                                             */
/* -------------------------------------------------------------------------- */

export function SensitivityChart({
  points,
  height = 180,
  fmtY = (n: number) => `${num(n, 0)}%`,
  fmtX = (n: number) => num(n, 0),
  color = '#d4af37',
  highlight,
}: {
  points: { x: number; y: number }[]
  height?: number
  fmtY?: (n: number) => string
  fmtX?: (n: number) => string
  color?: string
  highlight?: number
}) {
  const W = 800
  const H = height
  const padL = 48
  const padR = 12
  const padT = 12
  const padB = 26
  const plotW = W - padL - padR
  const plotH = H - padT - padB

  const xs = points.map((p) => p.x)
  const ys = points.map((p) => p.y)
  const sx = niceScale(Math.min(...xs), Math.max(...xs), 4)
  const sy = niceScale(Math.min(...ys, 0), Math.max(...ys, 0), 4)
  const px = (v: number) => padL + ((v - sx.min) / (sx.max - sx.min || 1)) * plotW
  const py = (v: number) => padT + plotH - ((v - sy.min) / (sy.max - sy.min || 1)) * plotH
  const pts = points.map((p) => ({ x: px(p.x), y: py(p.y) }))
  const hi = highlight !== undefined ? points.find((p) => p.x === highlight) : undefined

  return (
    <div className="chart">
      <svg viewBox={`0 0 ${W} ${H}`} height={H} preserveAspectRatio="none" role="img">
        {sy.values.map((v) => (
          <g key={`y${v}`}>
            <line
              x1={padL}
              x2={W - padR}
              y1={py(v)}
              y2={py(v)}
              stroke={Math.abs(v) < 1e-9 ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.055)'}
              vectorEffect="non-scaling-stroke"
            />
            <text x={padL - 7} y={py(v) + 3} textAnchor="end" fontSize="9.5" fill="#6f6a60">
              {fmtY(v)}
            </text>
          </g>
        ))}
        {sx.values.map((v) => (
          <text key={`x${v}`} x={px(v)} y={H - 7} textAnchor="middle" fontSize="9.5" fill="#6f6a60">
            {fmtX(v)}
          </text>
        ))}
        <path d={linePath(pts)} fill="none" stroke={color} strokeWidth="1.8" vectorEffect="non-scaling-stroke" />
        {pts.map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#0d0d0d" stroke={color} strokeWidth="1.6" />
        ))}
        {hi && (
          <>
            <line
              x1={px(hi.x)}
              x2={px(hi.x)}
              y1={py(hi.y)}
              y2={py(0)}
              stroke={color}
              strokeDasharray="3 3"
              opacity="0.5"
              vectorEffect="non-scaling-stroke"
            />
            <rect
              x={px(hi.x) + 6}
              y={py(hi.y) - 24}
              width="72"
              height="20"
              rx="3"
              fill="#1e1e1e"
              stroke="rgba(255,255,255,0.12)"
            />
            <text x={px(hi.x) + 42} y={py(hi.y) - 10} textAnchor="middle" fontSize="10" fill="#f7f3eb">
              {`Lãi suất ${fmtX(hi.x)}`}
            </text>
            <text x={px(hi.x) + 42} y={py(hi.y) + 14} textAnchor="middle" fontSize="10.5" fill={color} fontWeight="600">
              {fmtY(hi.y)}
            </text>
          </>
        )}
      </svg>
    </div>
  )
}