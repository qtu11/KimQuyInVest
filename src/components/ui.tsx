/* ==========================================================================
   THÀNH PHẦN GIAO DIỆN DÙNG CHUNG
   ========================================================================== */

import {
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react'
import { dirClass, num } from '../lib/format'
import { IconArrowRight, IconChevronDown, IconSearch } from './icons'

/* -------------------------------------------------------------------------- */
/* Thẻ                                                                        */
/* -------------------------------------------------------------------------- */

export function Card({
  title,
  sub,
  action,
  children,
  className = '',
  bodyClass = '',
  onAction,
  padded = true,
  style,
}: {
  title?: ReactNode
  sub?: ReactNode
  action?: ReactNode
  children?: ReactNode
  className?: string
  bodyClass?: string
  onAction?: () => void
  padded?: boolean
  style?: CSSProperties
}) {
  return (
    <section className={`card ${padded ? '' : 'pad-0'} ${className}`} style={style}>
      {(title || action) && (
        <header className={`card-head ${padded ? '' : 'px'} `} style={padded ? undefined : { padding: '14px 15px 0', marginBottom: 12 }}>
          <div style={{ minWidth: 0 }}>
            {typeof title === 'string' ? <h2 className="card-title">{title}</h2> : title}
            {sub && <div className="card-sub">{sub}</div>}
          </div>
          {action ??
            (onAction && (
              <button className="card-link" onClick={onAction}>
                Xem chi tiết <IconArrowRight size={12} />
              </button>
            ))}
        </header>
      )}
      <div className={bodyClass} style={{ minWidth: 0, display: 'flex', flexDirection: 'column', flex: 1 }}>
        {children}
      </div>
    </section>
  )
}

/* -------------------------------------------------------------------------- */
/* Thẻ số liệu                                                                */
/* -------------------------------------------------------------------------- */

export function Stat({
  label,
  value,
  delta,
  deltaTone,
  sub,
  spark,
  icon,
  className = '',
  valueClass = '',
}: {
  label: ReactNode
  value: ReactNode
  delta?: ReactNode
  deltaTone?: 'up' | 'down' | 'flat' | 'gold'
  sub?: ReactNode
  spark?: ReactNode
  icon?: ReactNode
  className?: string
  valueClass?: string
}) {
  const tone =
    deltaTone === 'gold' ? 'gold' : deltaTone === 'up' ? 'up' : deltaTone === 'down' ? 'down' : deltaTone === 'flat' ? 'flat' : ''
  return (
    <div className={`stat ${className}`}>
      <div className="stat-label">
        {icon}
        {label}
      </div>
      <div className={`stat-value ${valueClass}`}>
        <span>{value}</span>
        {delta !== undefined && <span className={`stat-delta ${tone}`}>{delta}</span>}
      </div>
      {sub && <div className="stat-sub">{sub}</div>}
      {spark && <div className="stat-spark">{spark}</div>}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Thẻ chỉ số có sparkline                                                    */
/* -------------------------------------------------------------------------- */

export function IndexCard({
  code,
  value,
  change,
  changePct,
  spark,
  compact = false,
}: {
  code: string
  value: string
  change?: string
  changePct: number
  spark?: ReactNode
  compact?: boolean
}) {
  const c = dirClass(changePct)
  return (
    <div className="stat" style={{ padding: compact ? '9px 12px 7px' : undefined }}>
      <div className="stat-label">{code}</div>
      <div className="stat-value" style={{ fontSize: compact ? 15 : 19 }}>
        <span>{value}</span>
        <span className={`stat-delta ${c}`} style={{ fontSize: compact ? 11 : 12 }}>
          {change ? `${change} ` : ''}
          {changePct > 0 ? '+' : ''}
          {num(changePct, 2)}%
        </span>
      </div>
      {spark && <div style={{ margin: compact ? '5px -12px -7px' : '6px -13px -9px' }}>{spark}</div>}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Tab                                                                            */
/* -------------------------------------------------------------------------- */

export function Tabs<T extends string = string>({
  tabs,
  value,
  onChange,
  className = '',
}: {
  tabs: readonly (T | string)[] | { key: T | string; label: string }[] | readonly { key: T | string; label: string }[]
  value?: T | string
  onChange?: (v: any) => void
  className?: string
}) {
  const list = (tabs as unknown[]).map((t) =>
    typeof t === 'string' ? { key: t, label: t } : (t as { key: string; label: string }),
  )
  return (
    <div className={`tabs ${className}`} role="tablist">
      {list.map((t) => (
        <button
          key={t.key}
          role="tab"
          aria-selected={t.key === value}
          className={`tab ${t.key === value ? 'active' : ''}`}
          onClick={() => onChange?.(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Nhóm nút chọn (segmented)                                                  */
/* -------------------------------------------------------------------------- */

export function Segmented<T extends string = string>({
  options,
  value,
  onChange,
  className = '',
}: {
  options: readonly (T | string)[]
  value?: T | string
  onChange?: (v: any) => void
  className?: string
}) {
  return (
    <div className={`seg ${className}`} role="group">
      {options.map((o) => (
        <button
          key={o}
          className={o === value ? 'active' : ''}
          aria-pressed={o === value}
          onClick={() => onChange?.(o)}
        >
          {o}
        </button>
      ))}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Huy hiệu                                                                   */
/* -------------------------------------------------------------------------- */

export type Tone = 'blue' | 'teal' | 'violet' | 'orange' | 'rose' | 'sky' | 'lime' | 'gold' | 'up' | 'down' | 'flat'

export function Badge({ tone = 'gold', children }: { tone?: Tone; children: ReactNode }) {
  return <span className={`badge ${tone}`}>{children}</span>
}

export function Chip({
  children,
  tone,
  onClick,
  active,
}: {
  children: ReactNode
  tone?: 'gold' | 'up' | 'down'
  onClick?: () => void
  active?: boolean
}) {
  return (
    <button
      className={`chip ${onClick ? 'clickable' : ''} ${tone ?? ''} ${active ? 'gold' : ''}`}
      onClick={onClick}
      type="button"
      style={active ? { borderColor: 'var(--line-gold)', color: 'var(--kg-gold-200)' } : undefined}
    >
      {children}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/* Ô tìm kiếm                                                                 */
/* -------------------------------------------------------------------------- */

export function SearchInput({
  value,
  onChange,
  placeholder = 'Tìm kiếm...',
  className = '',
  size = 'md',
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  size?: 'sm' | 'md'
}) {
  return (
    <div
      className={`searchbox ${className}`}
      style={size === 'sm' ? { height: 30, maxWidth: 'none' } : { maxWidth: 'none' }}
    >
      <IconSearch size={size === 'sm' ? 13 : 15} />
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={size === 'sm' ? { fontSize: 11.5 } : undefined}
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Đồng hồ thời gian thực                                                     */
/* -------------------------------------------------------------------------- */

export function useClock(intervalMs = 1000, fixed?: Date) {
  // Mốc mặc định đồng bộ SSR chuẩn thiết kế KIMQUY
  const [now, setNow] = useState<Date>(() => fixed ?? new Date(2026, 8, 22, 15, 27, 18))

  useEffect(() => {
    if (fixed) return
    setNow(new Date())
    const t = setInterval(() => setNow(new Date()), intervalMs)
    return () => clearInterval(t)
  }, [intervalMs, fixed])

  return now
}

/* -------------------------------------------------------------------------- */
/* Menu thả xuống                                                             */
/* -------------------------------------------------------------------------- */

export function Dropdown({
  trigger,
  children,
  align = 'right',
}: {
  trigger: (props: { open: boolean; toggle: () => void }) => ReactNode
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {trigger({ open, toggle: () => setOpen((o) => !o) })}
      {open && (
        <div className="menu" style={align === 'left' ? { left: 0, right: 'auto' } : undefined}>
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Thanh tỷ trọng                                                             */
/* -------------------------------------------------------------------------- */

export function BarLine({
  value,
  max,
  color,
  width = 92,
  label,
  labelWidth = 54,
  fmt = (v: number) => num(v, 2),
}: {
  value: number
  max: number
  color: string
  width?: number
  label?: string
  labelWidth?: number
  fmt?: (v: number) => string
}) {
  const w = Math.max(1.5, (Math.abs(value) / (max || 1)) * width)
  return (
    <div className="bar-line">
      <span className="bar-track" style={{ width, display: 'flex', justifyContent: 'flex-end' }}>
        <i style={{ width: w, background: color }} />
      </span>
      <span
        className="num"
        style={{ width: labelWidth, textAlign: 'right', flexShrink: 0, color, fontWeight: 600, fontSize: 11 }}
      >
        {label ?? fmt(value)}
      </span>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Mức độ (ô vuông)                                                           */
/* -------------------------------------------------------------------------- */

export function SegMeter({ level, of = 5 }: { level: number; of?: number }) {
  const cls = level >= 4 ? 'lv-high' : level >= 3 ? 'lv-mid' : 'lv-low'
  return (
    <span className="seg-meter">
      {Array.from({ length: of }, (_, i) => (
        <i key={i} className={i < level ? `on ${cls}` : ''} />
      ))}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Huy hiệu xu hướng (mũi tên + %)                                            */
/* -------------------------------------------------------------------------- */

export function Trend({ value, digits = 2, showArrow = false }: { value: number; digits?: number; showArrow?: boolean }) {
  const c = dirClass(value)
  const arrow = value > 0 ? '▲' : value < 0 ? '▼' : '—'
  return (
    <span className={`num ${c}`} style={{ fontWeight: 600 }}>
      {showArrow && <span style={{ marginRight: 3, fontSize: '0.85em' }}>{arrow}</span>}
      {value > 0 ? '+' : ''}
      {num(value, digits)}%
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Tooltip cho vùng biểu đồ                                                   */
/* -------------------------------------------------------------------------- */

export function Tip({
  children,
  text,
}: {
  children: ReactNode
  text: ReactNode
}) {
  const [show, setShow] = useState(false)
  const id = useId()
  return (
    <span
      className="tip-host"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      style={{ display: 'inline-flex' }}
      aria-describedby={id}
    >
      {children}
      {show && (
        <span className="tip" id={id} role="tooltip">
          {text}
        </span>
      )}
    </span>
  )
}

/* -------------------------------------------------------------------------- */
/* Hộp thoại                                                                  */
/* -------------------------------------------------------------------------- */

export function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  width,
}: {
  open: boolean
  onClose: () => void
  title: ReactNode
  children: ReactNode
  footer?: ReactNode
  width?: number
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null
  return (
    <>
      <div className="scrim" onClick={onClose} />
      <div className="modal" style={width ? { width: `min(${width}px, calc(100vw - 40px))` } : undefined} role="dialog" aria-modal="true">
        <header className="modal-head">
          <span className="modal-title">{title}</span>
          <button className="icon-btn" onClick={onClose} aria-label="Đóng">
            ✕
          </button>
        </header>
        <div className="modal-body">{children}</div>
        {footer && <footer className="modal-foot">{footer}</footer>}
      </div>
    </>
  )
}

/* -------------------------------------------------------------------------- */
/* Danh sách gợi ý AI                                                         */
/* -------------------------------------------------------------------------- */

export function AiSuggestions({
  items,
  title = 'Gợi ý từ AI KIMQUY',
  onMore,
}: {
  items: { text: string; tone?: 'up' | 'down' | 'gold' | 'blue' }[]
  title?: string
  onMore?: () => void
}) {
  const toneColor: Record<string, string> = {
    up: 'var(--up)',
    down: 'var(--down)',
    gold: 'var(--kg-gold)',
    blue: 'var(--acc-blue)',
  }
  return (
    <Card
      className="gold"
      title={
        <div className="ai-head">
          <span style={{ color: 'var(--kg-gold)' }}>✦</span> {title}
        </div>
      }
      action={
        onMore && (
          <button className="card-link" onClick={onMore}>
            {title.includes('Gợi ý') ? 'Hỏi AI' : 'Xem thêm'} <IconArrowRight size={12} />
          </button>
        )
      }
    >
      <div className="ai-list">
        {items.map((it, i) => (
          <div className="ai-row" key={i}>
            <span style={{ color: toneColor[it.tone ?? 'gold'], fontSize: 11, flexShrink: 0 }}>
              {it.tone === 'up' ? '📈' : it.tone === 'down' ? '⚠️' : '💡'}
            </span>
            <span className="grow">{it.text}</span>
          </div>
        ))}
      </div>
    </Card>
  )
}

/* -------------------------------------------------------------------------- */
/* Trích dẫn có nền cảnh                                                      */
/* -------------------------------------------------------------------------- */

export function QuoteBlock({
  text,
  author = 'KIMQUY INVEST',
  art,
}: {
  text: string
  author?: string
  art?: ReactNode
}) {
  return (
    <div className="quote-block">
      {art && <div style={{ position: 'absolute', inset: 0 }}>{art}</div>}
      <div className="inner" style={{ position: 'relative' }}>
        <div className="hero-quote-mark">“</div>
        <div className="hero-quote-text" style={{ fontSize: 13 }}>
          {text}
        </div>
        <div className="hero-quote-by">{author}</div>
      </div>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* Bảng dữ liệu với tiêu đề dính                                              */
/* -------------------------------------------------------------------------- */

export function useStickyShadow<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  useLayoutEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const head = el.querySelector('thead th') as HTMLElement | null
      if (head) head.style.boxShadow = el.scrollTop > 2 ? '0 6px 12px -8px rgba(0,0,0,0.9)' : 'none'
    }
    el.addEventListener('scroll', onScroll)
    return () => el.removeEventListener('scroll', onScroll)
  }, [])
  return ref
}

export function Switch({
  checked,
  onChange,
  disabled = false,
  label,
}: {
  checked: boolean
  onChange: (c: boolean) => void
  disabled?: boolean
  label?: string
}) {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: 8, cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        style={{
          width: 36,
          height: 20,
          borderRadius: 10,
          background: checked ? 'var(--kg-gold)' : 'rgba(255,255,255,0.15)',
          position: 'relative',
          transition: 'background 0.2s',
          border: 'none',
          padding: 0,
          cursor: disabled ? 'not-allowed' : 'pointer',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: checked ? 18 : 2,
            width: 16,
            height: 16,
            borderRadius: '50%',
            background: checked ? '#111' : '#fff',
            transition: 'left 0.2s, background 0.2s',
          }}
        />
      </button>
      {label && <span style={{ fontSize: 12, color: 'var(--tx)' }}>{label}</span>}
    </label>
  )
}

export { IconChevronDown }