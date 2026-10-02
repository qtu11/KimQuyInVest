/* ==========================================================================
   CẤU HÌNH ĐIỀU HƯỚNG
   ========================================================================== */

import type { ReactNode } from 'react'
import {
  IconActivity, IconBell, IconBriefcase, IconCopilot, IconFilter, IconHome, IconIdea,
  IconMarket, IconPerformance, IconReport, IconResearch, IconScenario, IconSector,
  IconSettings, IconShield, IconThesis,
} from '../components/icons'

export type PageKey =
  | 'overview'
  | 'market'
  | 'sector'
  | 'news'
  | 'screener'
  | 'topic'
  | 'portfolio'
  | 'performance'
  | 'risk'
  | 'scenario'
  | 'report'
  | 'report-template'
  | 'ideas'
  | 'thesis'
  | 'copilot'
  | 'research'
  | 'alerts'
  | 'settings'
  | 'stock'

export type NavItem = {
  key: PageKey
  label: string
  icon: (p: { size?: number }) => ReactNode
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const NAV: NavGroup[] = [
  {
    label: '',
    items: [{ key: 'overview', label: 'Tổng quan', icon: IconHome }],
  },
  {
    label: 'THỊ TRƯỜNG',
    items: [
      { key: 'market', label: 'Thị trường', icon: IconMarket },
      { key: 'sector', label: 'Ngành & Dòng tiền', icon: IconSector },
      { key: 'news', label: 'Tin tức & Sự kiện', icon: IconBell },
      { key: 'screener', label: 'Sàng lọc cổ phiếu', icon: IconFilter },
      { key: 'topic', label: 'Chủ đề đầu tư', icon: IconIdea },
    ],
  },
  {
    label: 'DANH MỤC',
    items: [
      { key: 'portfolio', label: 'Danh mục của tôi', icon: IconBriefcase },
      { key: 'performance', label: 'Phân tích hiệu suất', icon: IconPerformance },
      { key: 'risk', label: 'Quản trị rủi ro', icon: IconShield },
      { key: 'scenario', label: 'Kịch bản & Stress test', icon: IconScenario },
    ],
  },
  {
    label: 'NGHIÊN CỨU',
    items: [
      { key: 'report', label: 'Báo cáo', icon: IconReport },
      { key: 'ideas', label: 'Ý tưởng đầu tư', icon: IconIdea },
      { key: 'thesis', label: 'Theo dõi Thesis', icon: IconThesis },
    ],
  },
  {
    label: 'AI KIMQUY',
    items: [
      { key: 'copilot', label: 'AI Copilot', icon: IconCopilot },
      { key: 'research', label: 'Trợ lý nghiên cứu', icon: IconResearch },
    ],
  },
  {
    label: 'CÁ NHÂN',
    items: [
      { key: 'alerts', label: 'Cảnh báo', icon: IconActivity },
      { key: 'settings', label: 'Cài đặt', icon: IconSettings },
    ],
  },
]

export const ALL_NAV: NavItem[] = NAV.flatMap((g) => g.items)

export function pageTitle(key: PageKey): string {
  return ALL_NAV.find((n) => n.key === key)?.label ?? 'KIMQUY Invest'
}

/** Tiêu đề & mô tả hiển thị trên phần đầu trang */
export const PAGE_META: Record<PageKey, { title: string; desc: string; motto: string; mottoLines: string[] }> = {
  overview: {
    title: 'Chào buổi sáng, Nguyễn Hoàng',
    desc: 'Thị trường luôn có cơ hội cho những người chuẩn bị tốt.',
    motto: 'Kỷ luật hôm nay,\nthịnh vượng ngày mai.',
    mottoLines: ['Invest', 'with intelligence', 'live a greater tomorrow'],
  },
  market: {
    title: 'Thị trường',
    desc: 'Cập nhật toàn cảnh thị trường Việt Nam theo thời gian thực, với phân tích chuyên sâu và góc nhìn dữ liệu.',
    motto: 'Cơ hội luôn xuất hiện\ntrong những biến động.',
    mottoLines: ['Live', 'the market', 'seize the moment'],
  },
  sector: {
    title: 'Ngành & Dòng tiền',
    desc: 'Theo dòng tiền. Hiểu xu hướng. Đón cơ hội sớm.',
    motto: 'Dòng tiền luôn tìm đến\nnơi có cầu chuyện tốt nhất.',
    mottoLines: ['Follow', 'the flow', 'find the value'],
  },
  news: {
    title: 'Tin tức & Sự kiện',
    desc: 'Cập nhật nhanh. Phân tích sâu. Kết nối tác động.',
    motto: 'Tin tức là dữ liệu.\nSự kiện là cơ hội.',
    mottoLines: ['Stay', 'ahead with', 'real insights'],
  },
  screener: {
    title: 'Sàng lọc cổ phiếu',
    desc: 'Tìm kiếm cơ hội đầu tư theo tiêu chí của riêng bạn.',
    motto: 'Lọc đúng cơ hội,\nđầu tư đúng thời điểm.',
    mottoLines: ['Better', 'insights', 'bigger possibilities'],
  },
  topic: {
    title: 'Chủ đề đầu tư',
    desc: 'Khám phá những câu chuyện lớn. Đón đầu xu hướng. Tạo lợi thế dài hạn.',
    motto: 'Những xu hướng lớn\nluôn tạo ra cơ hội lớn.',
    mottoLines: ['Invest', 'the next', 'story'],
  },
  portfolio: {
    title: 'Danh mục của tôi',
    desc: 'Theo dõi. Phân tích. Tối ưu. Đồng hành cùng mục tiêu tài chính của bạn.',
    motto: 'Quản trị tốt hôm nay,\ntự do hơn ngày mai.',
    mottoLines: ['Disciplined', 'portfolio', 'brighter tomorrow'],
  },
  performance: {
    title: 'Phân tích hiệu suất',
    desc: 'Đo lường. Hiểu nguyên nhân. Tối ưu để tăng trưởng bền vững.',
    motto: 'Hiệu suất hôm nay,\nđổi tự do ngày mai.',
    mottoLines: ['Performance', 'creates', 'freedom'],
  },
  risk: {
    title: 'Quản trị rủi ro',
    desc: 'Nhận diện rủi ro. Kiểm soát tổn thất. Bảo vệ thành quả đầu tư.',
    motto: 'Biết rủi ro trước,\ngiữ vững thành quả sau.',
    mottoLines: ['Protect', 'the downside', 'compound the upside'],
  },
  scenario: {
    title: 'Kịch bản & Stress test',
    desc: 'Dự phòng nhiều kịch bản. Kiểm tra sức chịu đựng. Chủ động trước biến động.',
    motto: 'Thử thách hôm nay,\nchuẩn bị cho cơ hội ngày mai.',
    mottoLines: ['Test today', 'stronger', 'tomorrow'],
  },
  report: {
    title: 'Báo cáo',
    desc: 'Cập nhật những phân tích chuyên sâu, góc nhìn thị trường và báo cáo cá nhân hoá dành riêng cho bạn.',
    motto: 'Thông tin hôm nay\nTạo lợi thế ngày mai.',
    mottoLines: ['Insights', 'drive', 'better decisions'],
  },
  'report-template': {
    title: 'DAILY RECAP — Thị trường hôm nay, Cơ hội cho ngày mai',
    desc: 'Bản mẫu báo cáo tóm lược thị trường, phân tích độ rộng, dòng tiền và hành động gợi ý chuẩn ấn phẩm KIMQUY Invest.',
    motto: 'Hiểu thị trường\nđể đầu tư tốt hơn.',
    mottoLines: ['Discipline', 'creates', 'freedom'],
  },
  ideas: {
    title: 'Ý tưởng đầu tư',
    desc: 'Khám phá cơ hội. Biến ý tưởng thành lợi thế.',
    motto: 'Ý tưởng tốt đến từ\nsự quan sát khác biệt.',
    mottoLines: ['Good ideas', 'better', 'returns'],
  },
  thesis: {
    title: 'Theo dõi Thesis',
    desc: 'Ghi lại luận điểm. Theo dõi diễn biến. Kết thúc có kỷ luật.',
    motto: 'Luận điểm rõ ràng,\nhành động nhất quán.',
    mottoLines: ['Thesis', 'discipline', 'results'],
  },
  copilot: {
    title: 'Cùng KimQuy kiến tạo giá trị lớn hơn',
    desc: 'Trợ lý AI đồng hành cùng bạn trong hành trình đầu tư — phân tích sâu sắc, góc nhìn đa chiều, quyết định sáng suốt.',
    motto: 'Không chỉ nhìn thấy dữ liệu,\nmà nhìn xa hơn giá trị thực.',
    mottoLines: ['A higher', 'perspective', 'a brighter tomorrow'],
  },
  research: {
    title: 'Trợ lý nghiên cứu',
    desc: 'Tổng hợp, đối chiếu và kiểm chứng thông tin từ nhiều nguồn dữ liệu.',
    motto: 'Nghiên cứu kỹ,\nquyết định nhanh.',
    mottoLines: ['Research', 'deeper', 'decide better'],
  },
  alerts: {
    title: 'Cảnh báo',
    desc: 'Thiết lập ngưỡng cảnh báo cho giá, khối lượng, tỷ trọng và sự kiện.',
    motto: 'Chủ động trước biến động,\nkhông phản ứng sau thị trường.',
    mottoLines: ['Act', 'before', 'the market'],
  },
  settings: {
    title: 'Cài đặt',
    desc: 'Tuỳ chỉnh trải nghiệm, khẩu vị rủi ro và thông báo của bạn.',
    motto: 'Công cụ đúng,\nquyết định tốt hơn.',
    mottoLines: ['Your platform', 'your rules', 'your tomorrow'],
  },
  stock: {
    title: 'Chi tiết cổ phiếu',
    desc: 'Phân tích toàn diện: định giá, tài chính, kỹ thuật và luận điểm đầu tư.',
    motto: 'Hiểu doanh nghiệp,\nhiểu giá trị.',
    mottoLines: ['Know', 'the business', 'know the value'],
  },
}