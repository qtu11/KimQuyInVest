/* ==========================================================================
   TRANG Ý TƯỞNG ĐẦU TƯ
   ========================================================================== */

import { useMemo, useState } from 'react'
import type { PageKey } from '../app/nav'
import { Art } from '../components/Art'
import {
  IconArrowRight, IconBookmark, IconComment, IconLightning, IconPlus, IconSearch, IconTrendDown,
} from '../components/icons'
import { Badge, Card, Chip, Segmented, Tabs } from '../components/ui'
import { IDEAS, IDEA_SECTORS, IDEA_TOPICS } from '../data/content'
import { dirClass, num, slug } from '../lib/format'

const TABS = ['Tất cả', 'Ý tưởng nổi bật', 'Theo ngành', 'Theo chủ đề', 'Danh sách theo dõi'] as const
type Tab = (typeof TABS)[number]

const LISTS = [
  { name: 'Năng lượng xanh', count: 12, pct: 18.6, art: 'leaf' as const, tone: 'up' as const },
  { name: 'Công nghệ & Bán dẫn', count: 8, pct: 15.2, art: 'chip' as const, tone: 'violet' as const },
  { name: 'Tài chính – Ngân hàng', count: 10, pct: 12.4, art: 'bank' as const, tone: 'up' as const },
  { name: 'Tiêu dùng nội địa', count: 7, pct: 11.8, art: 'cart' as const, tone: 'up' as const },
  { name: 'Hạ tầng – Đầu tư công', count: 9, pct: 14.1, art: 'highway' as const, tone: 'up' as const },
  { name: 'Xuất khẩu & Logistics', count: 6, pct: 10.5, art: 'ship' as const, tone: 'teal' as const },
]

const IDEA_THUMBS: Record<number, string> = {
  1: '/asset/art/idea_semiconductor.png',
  2: '/asset/art/idea_solar.png',
  3: '/asset/art/idea_bank.png',
  4: '/asset/art/idea_retail.png',
  5: '/asset/art/idea_port.png',
}

export function Ideas({ onNavigate }: { onNavigate: (p: PageKey, s?: string) => void }) {
  const [tab, setTab] = useState<Tab>('Tất cả')
  const [listTab, setListTab] = useState('Mới nhất')
  const [sector, setSector] = useState('Tất cả')
  const [topic, setTopic] = useState('Tất cả')
  const [horizon, setHorizon] = useState('Tất cả')
  const [type, setType] = useState('Tất cả')
  const [q, setQ] = useState('')
  const [saved, setSaved] = useState<number[]>([1])

  const list = useMemo(() => {
    let out = IDEAS
    if (q) out = out.filter((i) => slug(i.title + i.desc + i.tags.join(' ')).includes(slug(q)))
    if (sector !== 'Tất cả') out = out.filter((i) => i.sector === sector)
    if (topic !== 'Tất cả') out = out.filter((i) => i.topic === topic)
    if (horizon !== 'Tất cả') out = out.filter((i) => i.horizon === horizon)
    if (tab === 'Danh sách theo dõi') out = out.filter((i) => saved.includes(i.id))
    if (tab === 'Ý tưởng nổi bật') out = [...out].sort((a, b) => b.votes - a.votes)
    else if (listTab === 'Mới nhất') out = [...out]
    else if (listTab === 'Tiềm năng cao') out = [...out].sort((a, b) => b.votes - a.votes)
    else if (listTab === 'Được quan tâm') out = [...out].sort((a, b) => b.comments - a.comments)
    else if (listTab === 'Hiệu suất tốt') out = [...out].sort((a, b) => b.riskLevel - a.riskLevel)
    return out
  }, [q, sector, topic, horizon, tab, listTab, saved])

  const featured = IDEAS[0]

  return (
    <>
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1fr) auto', alignItems: 'center' }}>
        <Tabs tabs={TABS} value={tab} onChange={setTab} />
        <button className="btn sm gold">
          <IconPlus size={13} /> Đóng góp ý tưởng
        </button>
      </div>

      {/* ---------- Ý tưởng nổi bật ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.75fr) minmax(0,1fr)' }}>
        <div
          className="card pad-0"
          style={{
            minHeight: 216,
            height: 216,
            borderColor: 'var(--line-gold)',
            backgroundImage: "url('/asset/art/banner_power.png')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={() => onNavigate('topic')}
            style={{
              position: 'absolute',
              left: 20,
              bottom: 20,
              width: 135,
              height: 38,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
            title="Xem chi tiết"
          />
        </div>

        <Card
          title="Bộ lọc ý tưởng"
          action={<button className="card-link" onClick={() => { setSector('Tất cả'); setTopic('Tất cả'); setHorizon('Tất cả'); setType('Tất cả') }}>Đặt lại</button>}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 11 }}>
            <div className="field">
              <label className="field-label">Ngành</label>
              <select className="input sm" value={sector} onChange={(e) => setSector(e.target.value)}>
                {IDEA_SECTORS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Chủ đề</label>
              <select className="input sm" value={topic} onChange={(e) => setTopic(e.target.value)}>
                {IDEA_TOPICS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Thời gian</label>
              <select className="input sm" value={horizon} onChange={(e) => setHorizon(e.target.value)}>
                {['Tất cả', 'Ngắn hạn', 'Trung hạn', 'Dài hạn'].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
            <div className="field">
              <label className="field-label">Loại ý tưởng</label>
              <select className="input sm" value={type} onChange={(e) => setType(e.target.value)}>
                {['Tất cả', 'Ngành', 'Cổ phiếu', 'Chủ đề'].map((o) => <option key={o}>{o}</option>)}
              </select>
            </div>
          </div>

          <div className="row gap-8" style={{ marginTop: 12 }}>
            <input
              className="input sm"
              placeholder="Tìm ý tưởng theo từ khóa..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              aria-label="Tìm ý tưởng"
            />
            <button className="btn sm gold" style={{ flexShrink: 0 }}>
              <IconSearch size={13} /> Tìm kiếm
            </button>
          </div>
        </Card>
      </div>

      {/* ---------- Danh sách ý tưởng + chủ đề ---------- */}
      <div className="grid" style={{ gridTemplateColumns: 'minmax(0,1.75fr) minmax(0,1fr)' }}>
        <Card
          title="Danh sách ý tưởng đầu tư"
          action={
            <div className="row gap-6">
              <Tabs tabs={['Mới nhất', 'Tiềm năng cao', 'Được quan tâm', 'Hiệu suất tốt'] as const} value={listTab as never} onChange={setListTab} />
              <button className="card-link">Xem tất cả <IconArrowRight size={12} /></button>
            </div>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {list.map((idea) => (
              <article
                key={idea.id}
                className="row gap-12"
                style={{ padding: '13px 0', borderBottom: '1px solid var(--line-soft)', alignItems: 'flex-start', cursor: 'pointer' }}
                onClick={() => onNavigate('topic')}
              >
                <div
                  style={{
                    width: 108,
                    height: 72,
                    borderRadius: 'var(--r-sm)',
                    overflow: 'hidden',
                    flexShrink: 0,
                    border: '1px solid var(--line)',
                    backgroundImage: `url('${IDEA_THUMBS[idea.id] || '/asset/art/idea_semiconductor.png'}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--tx-hi)', lineHeight: 1.4 }}>
                    {idea.title}
                  </h3>
                  <p className="clamp-2" style={{ fontSize: 11, color: 'var(--tx-mid)', lineHeight: 1.5, marginTop: 4 }}>
                    {idea.desc}
                  </p>
                  <div className="row gap-6" style={{ marginTop: 8, flexWrap: 'wrap' }}>
                    {idea.tags.map((t) => (
                      <Chip key={t}>{t}</Chip>
                    ))}
                  </div>
                </div>

                <div style={{ width: 108, flexShrink: 0, textAlign: 'left' }}>
                  <div className="mini-label">Mức độ tiềm năng</div>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      marginTop: 2,
                      color: idea.risk === 'Cao' ? 'var(--up)' : 'var(--kg-gold)',
                    }}
                  >
                    {idea.risk}
                  </div>
                  <div className="seg-meter" style={{ marginTop: 5 }}>
                    {Array.from({ length: 4 }, (_, i) => (
                      <i
                        key={i}
                        className={i < idea.riskLevel ? `on ${idea.risk === 'Cao' ? 'lv-high' : 'lv-mid'}` : ''}
                        style={{ width: 15, height: 5 }}
                      />
                    ))}
                  </div>
                </div>

                <div style={{ width: 84, flexShrink: 0 }}>
                  <div className="mini-label">Cập nhật</div>
                  <div className="num" style={{ fontSize: 11, color: 'var(--tx)', marginTop: 2 }}>
                    {idea.updated}
                  </div>
                </div>

                <div className="row gap-10" style={{ flexShrink: 0 }}>
                  <span className="row gap-4" style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>
                    <IconComment size={12} /> {idea.comments}
                  </span>
                  <span className="row gap-4" style={{ fontSize: 10.5, color: 'var(--tx-dim)' }}>
                    <IconTrendDown size={12} /> {idea.votes}
                  </span>
                  <button
                    className="icon-btn"
                    style={{ width: 24, height: 24 }}
                    aria-label="Lưu ý tưởng"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSaved((s) => (s.includes(idea.id) ? s.filter((x) => x !== idea.id) : [...s, idea.id]))
                    }}
                  >
                    <IconBookmark size={13} style={{ color: saved.includes(idea.id) ? 'var(--kg-gold)' : 'var(--tx-faint)' }} />
                  </button>
                </div>
              </article>
            ))}
            {list.length === 0 && (
              <div className="empty">
                <IconSearch size={22} />
                <span>Không có ý tưởng phù hợp với bộ lọc hiện tại.</span>
              </div>
            )}
          </div>
        </Card>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Card title="Chủ đề đầu tư nổi bật" action={<span className="card-link" onClick={() => onNavigate('topic')}>Xem tất cả <IconArrowRight size={12} /></span>}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {LISTS.map((l) => (
                <div
                  className="row gap-10"
                  key={l.name}
                  style={{ cursor: 'pointer', padding: '4px 0' }}
                  onClick={() => onNavigate('topic')}
                >
                  <span style={{ width: 30, height: 30, borderRadius: 'var(--r-sm)', overflow: 'hidden', flexShrink: 0, border: '1px solid var(--line)' }}>
                    <Art kind={l.art} />
                  </span>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ display: 'block', fontSize: 11.5, color: 'var(--tx-hi)', fontWeight: 550 }}>
                      {l.name}
                    </span>
                    <span style={{ display: 'block', fontSize: 10, color: 'var(--tx-dim)' }}>
                      {l.count} ý tưởng
                    </span>
                  </span>
                  <span className={`num ${dirClass(l.pct)}`} style={{ fontSize: 11.5, fontWeight: 600, flexShrink: 0 }}>
                    +{num(l.pct, 1)}%
                  </span>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Ý tưởng được quan tâm nhiều nhất" action={<span className="card-link" onClick={() => onNavigate('topic')}>Xem tất cả <IconArrowRight size={12} /></span>}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              {[...IDEAS].sort((a, b) => b.votes - a.votes).slice(0, 5).map((idea, i) => (
                <div className="rank-row" key={idea.id} onClick={() => onNavigate('topic')}>
                  <span className={`rank-no ${i === 0 ? 'top' : ''}`}>{i + 1}</span>
                  <span className="rank-title clamp-2">{idea.title}</span>
                  <span className="rank-val gold">{idea.votes}</span>
                  <span className="rank-trend" style={{ color: 'var(--tx-dim)', fontSize: 11 }}>
                    💬
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Thẻ quote triết lý chuẩn mockup */}
          <div
            style={{
              width: '100%',
              height: 190,
              borderRadius: 'var(--r-md)',
              backgroundImage: "url('/asset/art/quote_ideas.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              border: '1px solid var(--line-gold)',
            }}
          />
        </div>
      </div>
    </>
  )
}