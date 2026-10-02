/* ==========================================================================
   TRANG KỊCH BẢN & STRESS TEST
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import { AreaChart, SensitivityChart, Sparkline } from '../components/charts'
import { Art } from '../components/Art'
import {
  IconArrowRight, IconCalendar, IconLightning, IconPlay, IconRefresh,
} from '../components/icons'
import { Badge, Card, Chip, Segmented, Tabs } from '../components/ui'
import {
  SCENARIO_INPUTS, SCENARIO_NOTES, SCENARIO_TABLE, SCENARIOS, SENSITIVITY,
  STRESS_TESTS, TEST_HISTORY,
} from '../data/content'
import { performanceSeries } from '../data/market'
import { dirClass, num } from '../lib/format'
import {
  IconDrop, IconFlame, IconGold2, IconOil, IconTrendDown, IconWarning,
} from '../components/icons.extra'

const TABS = ['Tổng quan', 'Kịch bản vĩ mô', 'Stress test danh mục', 'Phân tích độ nhạy', 'Lịch sử kiểm thử'] as const
type Tab = (typeof TABS)[number]

const ICONS = {
  down: IconTrendDown,
  gold: IconGold2,
  sky: IconDrop,
  oil: IconOil,
  flame: IconFlame,
  warn: IconWarning,
}

/* Sinh 4 đường kịch bản */
function scenarioSeries(kind: 'base' | 'bull' | 'bear' | 'crisis'): number[] {
  const end = SCENARIOS.find((s) => s.key === kind)!.pct
  return performanceSeries(`scenario-${kind}`, '1Y', end)
}

function yearLabels(): string[] {
  const n = 252
  const out: string[] = []
  const now = new Date(2026, 8, 22)
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() - ((365 * (n - 1 - i)) / (n - 1)) * 86400000)
    out.push(`${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`)
  }
  return out
}

export function Scenario({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Tổng quan')
  const [inputs, setInputs] = useState(SCENARIO_INPUTS)
  const [active, setActive] = useState<'base' | 'bull' | 'bear' | 'crisis'>('base')
  const [sensVar, setSensVar] = useState<'Lãi suất' | 'Tỷ giá' | 'Giá dầu' | 'Tăng trưởng GDP'>('Lãi suất')

  const reset = () => setInputs(SCENARIO_INPUTS)

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <div className="row gap-10">
          <Chip>Danh mục: Core Portfolio</Chip>
          <button className="btn sm ghost">
            <IconCalendar size={13} /> 22/09/2026
          </button>
          <button className="btn sm gold">
            <IconPlay size={12} /> Chạy kịch bản mới
          </button>
        </div>
      </div>

      {/* ---------- 4 thẻ kịch bản ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {SCENARIOS.map((s) => {
          const isActive = active === s.key
          return (
            <button
              key={s.key}
              className={`card ${isActive ? 'gold' : ''}`}
              style={{
                textAlign: 'left',
                cursor: 'pointer',
                borderColor: isActive ? 'var(--line-gold-strong)' : undefined,
              }}
              onClick={() => setActive(s.key)}
            >
              <div className="row gap-9" style={{ marginBottom: 9, gap: 9 }}>
                <span
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 'var(--r-sm)',
                    display: 'grid',
                    placeItems: 'center',
                    flexShrink: 0,
                    background: s.pct > 0 ? 'var(--up-soft)' : 'var(--down-soft)',
                    color: s.pct > 0 ? 'var(--up)' : 'var(--down)',
                  }}
                >
                  {s.pct > 0 ? '↗' : '↘'}
                </span>
                <span style={{ minWidth: 0 }}>
                  <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--tx-hi)' }}>
                    {s.title}
                  </span>
                  <span style={{ display: 'block', fontSize: 9.5, color: 'var(--tx-dim)' }}>
                    {s.key === 'base' ? '(Base case)' : s.key === 'bull' ? '(Bull case)' : s.key === 'bear' ? '(Bear case)' : '(Crisis case)'}
                  </span>
                </span>
              </div>

              <p style={{ fontSize: 10.5, color: 'var(--tx-mid)', lineHeight: 1.5, minHeight: 32 }}>
                {s.sub}
              </p>

              <div className={`num ${dirClass(s.pct)}`} style={{ fontSize: 27, fontWeight: 700, letterSpacing: '-0.02em', marginTop: 8 }}>
                {s.pct > 0 ? '+' : ''}
                {num(s.pct, 1)}%
              </div>
              <div style={{ fontSize: 10, color: 'var(--tx-dim)', marginBottom: 6 }}>LN kỳ vọng (1 năm)</div>

              <div style={{ margin: '-2px -13px -13px' }}>
                <Sparkline data={scenarioSeries(s.key)} height={44} color={s.pct > 0 ? '#22c576' : '#e5484d'} />
              </div>
            </button>
          )
        })}
      </div>

      {/* ---------- So sánh + bảng kết quả ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.55fr) minmax(0,1fr)' }}>
        <Card
          title="So sánh hiệu suất danh mục theo kịch bản"
          action={<Segmented options={['1Y', '3Y']} value="1Y" onChange={() => {}} />}
        >
          <AreaChart
            series={SCENARIOS.map((s) => ({
              id: s.key,
              name: s.title,
              data: scenarioSeries(s.key),
              color:
                s.key === 'bull' ? '#e8b44a' : s.key === 'base' ? '#5b8def' : s.key === 'bear' ? '#f59e6b' : '#e5484d',
              dashed: s.key !== 'base',
              area: s.key === 'base',
              width: s.key === 'base' ? 2 : 1.5,
            }))}
            labels={yearLabels()}
            height={262}
            fmt={(v) => `${num(v, 0)}%`}
            refLine={0}
            xTicks={7}
            legend
          />
        </Card>

        <Card title="Bảng kết quả kịch bản">
          <table className="matrix">
            <thead>
              <tr>
                <th>Chỉ tiêu</th>
                <th className="hl">Cơ sở</th>
                <th className="c-pos">Tích cực</th>
                <th className="c-neg">Tiêu cực</th>
                <th className="c-neg">Khủng hoảng</th>
              </tr>
            </thead>
            <tbody>
              {SCENARIO_TABLE.map((r) => (
                <tr key={r.label}>
                  <td>{r.label}</td>
                  {(['base', 'bull', 'bear', 'crisis'] as const).map((k) => {
                    const v = r[k]
                    const cls = r.tone === 'plain' ? '' : dirClass(v)
                    return (
                      <td key={k} className={cls}>
                        {r.tone === 'pct'
                          ? `${v > 0 ? '+' : ''}${num(v, 1)}%`
                          : r.tone === 'prob'
                            ? `${num(v, 0)}%`
                            : num(v, 2)}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="dim" style={{ fontSize: 10, marginTop: 8, lineHeight: 1.5 }}>
            Lợi nhuận danh mục là kỳ vọng 1 năm theo mô hình phân tích nhân tố vĩ mô của KIMQUY.
          </div>
        </Card>
      </div>

      {/* ---------- Stress test + độ nhạy + tùy chỉnh ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.2fr) minmax(0,1fr) minmax(0,1fr)' }}>
        <Card title="Stress test với các cú sốc thị trường" sub="Đánh giá tác động của các biến động cực đoan đến danh mục hiện tại.">
          <table className="data">
            <thead>
              <tr>
                <th className="l">Kịch bản cú sốc</th>
                <th className="l">Giả định thay đổi</th>
                <th>Tác động ước tính đến danh mục</th>
              </tr>
            </thead>
            <tbody>
              {STRESS_TESTS.map((s) => {
                const Icon = ICONS[s.icon]
                return (
                  <tr key={s.name}>
                    <td className="l">
                      <span className="row gap-8">
                        <span
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 'var(--r-xs)',
                            display: 'grid',
                            placeItems: 'center',
                            flexShrink: 0,
                            background: 'var(--down-soft)',
                            color: 'var(--down)',
                          }}
                        >
                          <Icon size={12} />
                        </span>
                        <span style={{ color: 'var(--tx)' }}>{s.name}</span>
                      </span>
                    </td>
                    <td className="l co-name">{s.assumption}</td>
                    <td className="num down" style={{ fontWeight: 650 }}>
                      {num(s.impact, 1)}%
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>

        <Card
          title="Phân tích độ nhạy"
          sub="Độ nhạy của lợi nhuận danh mục với các yếu tố vĩ mô."
          action={<span />}
        >
          <Segmented
            options={['Lãi suất', 'Tỷ giá', 'Giá dầu', 'Tăng trưởng GDP'] as const}
            value={sensVar}
            onChange={setSensVar}
          />
          <div style={{ marginTop: 12 }}>
            <SensitivityChart
              points={SENSITIVITY}
              height={196}
              fmtY={(n) => `${num(n, 0)}%`}
              fmtX={(n) => `${n > 0 ? '+' : ''}${num(n, 1)}%`}
              highlight={1}
            />
          </div>
          <div className="dim" style={{ fontSize: 10, textAlign: 'center', marginTop: 2 }}>
            Thay đổi {sensVar.toLowerCase()} (%)
          </div>
        </Card>

        <Card
          title="Tùy chỉnh kịch bản"
          action={
            <button className="btn xs ghost" onClick={reset}>
              <IconRefresh size={12} /> Đặt lại
            </button>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11 }}>
            {inputs.map((inp, i) => (
              <div className="row-between gap-10" key={inp.key}>
                <label style={{ fontSize: 11, color: 'var(--tx-mid)' }} htmlFor={`in-${inp.key}`}>
                  {inp.label}
                </label>
                <span className="row gap-7" style={{ flexShrink: 0, gap: 7 }}>
                  <input
                    id={`in-${inp.key}`}
                    className="input sm num"
                    style={{ width: 82, textAlign: 'right' }}
                    value={inp.value}
                    onChange={(e) =>
                      setInputs((p) =>
                        p.map((x, xi) => (xi === i ? { ...x, value: Number(e.target.value.replace(/\D/g, '')) || 0 } : x)),
                      )
                    }
                  />
                  <span style={{ fontSize: 10.5, color: 'var(--tx-dim)', width: 34 }}>{inp.unit}</span>
                </span>
              </div>
            ))}
          </div>

          <button className="btn gold" style={{ marginTop: 14, width: '100%' }}>
            <IconPlay size={12} /> Chạy kịch bản
          </button>

          <div className="callout" style={{ marginTop: 12 }}>
            <div className="callout-title">
              <span>✦</span> Gợi ý từ AI KIMQUY
            </div>
            <ul>
              {SCENARIO_NOTES.map((n, i) => (
                <li key={i} style={{ color: n.tone === 'up' ? 'var(--up-200)' : 'var(--tx)' }}>
                  {n.text}
                </li>
              ))}
            </ul>
          </div>
        </Card>
      </div>

      {/* ---------- Lịch sử kiểm thử ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <Card title="Lịch sử kiểm thử" action={<span className="card-link">Xem tất cả <IconArrowRight size={12} /></span>}>
          <table className="data">
            <thead>
              <tr>
                <th className="l">Ngày</th>
                <th className="l">Tên kịch bản</th>
                <th className="l">Loại</th>
                <th className="l">Kết quả</th>
                <th>Tác động đến danh mục</th>
                <th className="l" style={{ width: 90 }}>Diễn biến</th>
              </tr>
            </thead>
            <tbody>
              {TEST_HISTORY.map((t) => (
                <tr key={t.date}>
                  <td className="l num">{t.date}</td>
                  <td className="l" style={{ color: 'var(--tx-hi)', fontWeight: 500 }}>{t.name}</td>
                  <td className="l co-name">{t.type}</td>
                  <td className="l">
                    <Badge tone="up">✓ {t.result}</Badge>
                  </td>
                  <td className={`num ${dirClass(t.pct)}`} style={{ fontWeight: 650 }}>
                    {t.pct > 0 ? '+' : ''}
                    {num(t.pct, 1)}%
                  </td>
                  <td className="l">
                    <span style={{ display: 'inline-block', width: 66 }}>
                      <Sparkline
                        data={[0, t.pct * 0.4, t.pct * 0.7, t.pct, t.pct * 0.9, t.pct]}
                        height={20}
                        fill={false}
                        color={t.pct > 0 ? '#22c576' : '#e5484d'}
                      />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="quote-block" style={{ minHeight: 96 }}>
          <div style={{ position: 'absolute', inset: 0, opacity: 0.5 }}>
            <Art kind="mountain" />
          </div>
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,6,6,0.95), rgba(6,6,6,0.6))' }} />
          <div className="inner row-between" style={{ position: 'relative', gap: 20 }}>
            <div>
              <div className="hero-quote-mark">“</div>
              <div className="hero-quote-text" style={{ fontSize: 13 }}>
                Thử thách hôm nay, chuẩn bị cho cơ hội ngày mai.
              </div>
              <div className="hero-quote-by">KIMQUY INVEST</div>
            </div>
            <div className="row gap-8">
              <Badge tone="down">Kịch bản xấu nhất: -32,5%</Badge>
              <Badge tone="up">Kịch bản tốt nhất: +28,6%</Badge>
              <Badge tone="gold">Xác suất cơ sở: 50%</Badge>
            </div>
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="row gap-10" style={{ flexWrap: 'wrap' }}>
          <Chip onClick={() => onNavigate('risk')}>Quản trị rủi ro</Chip>
          <Chip onClick={() => onNavigate('performance')}>Phân tích hiệu suất</Chip>
          <Chip onClick={() => onNavigate('copilot')}>Hỏi AI về kịch bản</Chip>
          <span className="row gap-6" style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>
            <IconLightning size={12} style={{ color: 'var(--kg-gold)' }} /> Mô hình: KIMQUY Macro Factor v2.4
          </span>
        </div>
      </div>
    </>
  )
}