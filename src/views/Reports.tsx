/* ==========================================================================
   TRANG BÁO CÁO
   ========================================================================== */

import { useState } from 'react'
import type { PageKey } from '../app/nav'
import { Art } from '../components/Art'
import {
  IconArrowRight, IconCalendar, IconCheck, IconDoc, IconDownload, IconMail,
} from '../components/icons'
import { Badge, Card, Chip, Tabs } from '../components/ui'
import {
  REPORTS, REPORT_SUBSCRIPTIONS, REPORT_TOPICS, TOP_REPORTS,
} from '../data/content'
import { num } from '../lib/format'

const TABS = [
  'Tất cả', 'Báo cáo hàng ngày', 'Báo cáo hàng tuần', 'Báo cáo vĩ mô',
  'Báo cáo ngành', 'Báo cáo doanh nghiệp', 'Báo cáo danh mục của tôi',
] as const
type Tab = (typeof TABS)[number]

export function Reports({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Tất cả')
  const [subs, setSubs] = useState(REPORT_SUBSCRIPTIONS)
  const [subscribed, setSubscribed] = useState(false)

  const list = tab === 'Tất cả' ? REPORTS : REPORTS.filter((r) => r.cat === tab)
  const featured = REPORTS.find((r) => r.featured) ?? REPORTS[0]

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
      </div>

      {/* ---------- Báo cáo nổi bật + quan tâm ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.85fr) minmax(0,1fr)' }}>
        <div
          className="card pad-0"
          style={{
            minHeight: 214,
            height: 214,
            borderColor: 'var(--line-gold)',
            backgroundImage: "url('/asset/art/banner_report_city.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => onNavigate('report-template')}
            style={{
              position: 'absolute',
              left: 20,
              bottom: 20,
              width: 140,
              height: 38,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            title="Xem báo cáo"
          />
        </div>

        <Card title="Báo cáo được quan tâm" action={<span />}>
          <div className="nav-list">
            {TOP_REPORTS.map((r) => (
              <div className="nav-list-row" key={r.no} onClick={() => onNavigate('report')}>
                <span className={`rank-no ${r.no <= 2 ? 'top' : ''}`}>{r.no}</span>
                <span className="grow">
                  <span style={{ display: 'block', color: 'var(--tx)', fontSize: 11.5, fontWeight: 500, lineHeight: 1.35 }}>
                    {r.title}
                  </span>
                  <span style={{ display: 'block', fontSize: 10, color: 'var(--tx-dim)', marginTop: 2 }}>
                    {r.cat}
                  </span>
                </span>
                <span className="num" style={{ fontSize: 10, color: 'var(--tx-dim)', flexShrink: 0 }}>
                  {r.date}
                </span>
                <IconDownload size={13} style={{ color: 'var(--tx-faint)', flexShrink: 0 }} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* ---------- Báo cáo mới nhất ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.85fr) minmax(0,1fr)' }}>
        <Card title="Báo cáo mới nhất" action={<span className="card-link">Xem tất cả <IconArrowRight size={12} /></span>}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0,1fr))', gap: 12 }}>
            {list.map((r) => (
              <button
                key={r.id}
                className="card interactive"
                style={{ padding: 14, textAlign: 'left', minHeight: 176 }}
                onClick={() => onNavigate('copilot')}
              >
                <span
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 'var(--r-md)',
                    display: 'grid',
                    placeItems: 'center',
                    marginBottom: 12,
                    background:
                      r.catTone === 'rose' ? 'var(--down-soft)'
                        : r.catTone === 'blue' ? 'var(--acc-blue-soft)'
                          : r.catTone === 'teal' ? 'var(--acc-teal-soft)'
                            : r.catTone === 'violet' ? 'var(--acc-violet-soft)'
                              : r.catTone === 'orange' ? 'var(--acc-orange-soft)'
                                : 'rgba(212,175,55,0.13)',
                    color:
                      r.catTone === 'rose' ? 'var(--down)'
                        : r.catTone === 'blue' ? 'var(--acc-blue)'
                          : r.catTone === 'teal' ? 'var(--acc-teal)'
                            : r.catTone === 'violet' ? 'var(--acc-violet)'
                              : r.catTone === 'orange' ? 'var(--acc-orange)'
                                : 'var(--kg-gold)',
                  }}
                >
                  <IconDoc size={18} />
                </span>

                <span style={{ display: 'block', fontSize: 9.5, letterSpacing: '0.1em', fontWeight: 600, color: 'var(--tx-dim)', textTransform: 'uppercase' }}>
                  {r.cat}
                </span>
                <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: 'var(--tx-hi)', lineHeight: 1.36, marginTop: 5 }}>
                  {r.title}
                </span>
                <span className="clamp-2" style={{ display: 'block', fontSize: 10.5, color: 'var(--tx-mid)', lineHeight: 1.5, marginTop: 5 }}>
                  {r.desc}
                </span>

                <span className="row-between" style={{ marginTop: 'auto', paddingTop: 12 }}>
                  <span className="row gap-6" style={{ fontSize: 10, color: 'var(--tx-dim)' }}>
                    <IconCalendar size={11} /> {r.date}
                  </span>
                  <span className="row gap-6">
                    <Badge tone="down">PDF</Badge>
                    <span style={{ fontSize: 9.5, color: 'var(--tx-dim)' }}>{r.pages} tr</span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Đăng ký nhận báo cáo định kỳ" action={<span />}>
            <p style={{ fontSize: 11, color: 'var(--tx-mid)', marginBottom: 11, lineHeight: 1.5 }}>
              Nhận báo cáo mới nhất qua email theo lịch của bạn.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {subs.map((s, i) => (
                <button
                  key={s.label}
                  className="row gap-9"
                  style={{ background: 'none', padding: '3px 0', cursor: 'pointer', gap: 9 }}
                  onClick={() => setSubs((p) => p.map((x, xi) => (xi === i ? { ...x, on: !x.on } : x)))}
                >
                  <span
                    style={{
                      width: 15,
                      height: 15,
                      borderRadius: 3,
                      display: 'grid',
                      placeItems: 'center',
                      flexShrink: 0,
                      background: s.on ? 'var(--grad-gold-btn)' : '#1c1c1c',
                      border: `1px solid ${s.on ? 'rgba(246,230,180,0.5)' : 'var(--line-strong)'}`,
                      color: '#1d1602',
                    }}
                  >
                    {s.on && <IconCheck size={10} />}
                  </span>
                  <span style={{ fontSize: 11.5, color: s.on ? 'var(--tx-hi)' : 'var(--tx-mid)' }}>{s.label}</span>
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', marginTop: 14, borderRadius: 'var(--r-md)', overflow: 'hidden', minHeight: 84 }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                <Art kind="city" />
              </div>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(6,6,6,0.9), rgba(6,6,6,0.55))' }} />
              <div style={{ position: 'relative', padding: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ color: 'var(--kg-gold)' }}><IconMail size={22} /></span>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: 11,
                    letterSpacing: '0.16em',
                    color: 'rgba(232,201,138,0.8)',
                    lineHeight: 1.7,
                  }}
                >
                  INSIGHTS
                  <br />
                  DELIVERED
                  <br />
                  TO YOU
                </span>
              </div>
            </div>

            <button
              className="btn gold"
              style={{ marginTop: 12, width: '100%' }}
              onClick={() => setSubscribed(true)}
            >
              <IconMail size={13} /> {subscribed ? 'Đã đăng ký thành công' : 'Đăng ký ngay'}
            </button>
          </Card>

          <div
            style={{
              width: '100%',
              height: 173,
              borderRadius: 'var(--r-md)',
              backgroundImage: "url('/asset/art/quote_report.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid var(--line-gold)',
            }}
          />
        </div>
      </div>

      {/* ---------- Báo cáo theo chủ đề ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <Card title="Báo cáo theo chủ đề">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, minmax(0,1fr))', gap: 12 }}>
            {REPORT_TOPICS.map((t) => (
              <button
                key={t.name}
                className="card interactive"
                style={{ padding: 0, overflow: 'hidden', textAlign: 'left', flexDirection: 'row' }}
                onClick={() => onNavigate('report')}
              >
                <span style={{ display: 'block', position: 'relative', minHeight: 96 }}>
                  <span style={{ position: 'absolute', inset: 0 }}>
                    <Art kind={t.art} />
                  </span>
                  <span style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(6,6,6,0.15), rgba(8,8,8,0.82))' }} />
                  <span style={{ position: 'relative', display: 'block', padding: '12px 12px 11px' }}>
                    <span style={{ display: 'block', fontSize: 12.5, fontWeight: 600, color: '#fbf8f1' }}>
                      {t.name}
                    </span>
                    <span style={{ display: 'block', fontSize: 10, color: 'var(--tx-mid)', marginTop: 3, lineHeight: 1.4 }}>
                      {t.desc}
                    </span>
                    <span style={{ display: 'inline-flex', marginTop: 9, color: 'var(--kg-gold)' }}>
                      <IconArrowRight size={14} />
                    </span>
                  </span>
                </span>
              </button>
            ))}
          </div>
        </Card>
      </div>

      {/* ---------- Thống kê thư viện ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0,1fr))' }}>
        {[
          { l: 'Tổng số báo cáo', v: '248', d: '+12 tuần này' },
          { l: 'Báo cáo doanh nghiệp', v: '142', d: '+6 tuần này' },
          { l: 'Báo cáo ngành', v: '56', d: '+3 tuần này' },
          { l: 'Báo cáo cá nhân hoá', v: '18', d: 'Dành riêng cho bạn' },
        ].map((s) => (
          <div className="stat" key={s.l}>
            <div className="stat-label">{s.l}</div>
            <div className="stat-value stat-xl">{s.v}</div>
            <div className="stat-sub">{s.d}</div>
          </div>
        ))}
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr)' }}>
        <div className="row gap-10" style={{ flexWrap: 'wrap' }}>
          <Chip onClick={() => onNavigate('news')}>Tin tức & sự kiện</Chip>
          <Chip onClick={() => onNavigate('ideas')}>Ý tưởng đầu tư</Chip>
          <Chip onClick={() => onNavigate('copilot')}>Hỏi AI về báo cáo</Chip>
          <Badge tone="gold">{num(248, 0)} báo cáo trong thư viện</Badge>
        </div>
      </div>
    </>
  )
}