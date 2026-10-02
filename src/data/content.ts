/* ==========================================================================
   NỘI DUNG: TIN TỨC · Ý TƯỞNG · CHỦ ĐỀ · BÁO CÁO · KỊCH BẢN · SÀNG LỌC
   ========================================================================== */

import type { ArtKind } from '../components/Art'
import { rng } from './market'

/* -------------------------------------------------------------------------- */
/* TIN TỨC & SỰ KIỆN                                                          */
/* -------------------------------------------------------------------------- */

export type NewsItem = {
  id: number
  time: string
  day: string
  cat: string
  catTone: 'up' | 'down' | 'blue' | 'rose' | 'violet' | 'gold' | 'sky' | 'teal'
  important?: boolean
  title: string
  desc: string
  source: string
  art: ArtKind
  tickers: { symbol: string; pct: number }[]
  saved?: boolean
}

export const NEWS: NewsItem[] = [
  {
    id: 1, time: '08:15', day: 'Hôm nay', cat: 'Quan trọng', catTone: 'rose', important: true,
    title: 'Fed giữ lãi suất, phát tín hiệu có thể cắt giảm trong năm 2026',
    desc: 'Fed duy trì lãi suất 5,25–5,50%, để ngỏ khả năng cắt giảm lãi suất vào Q2/2026. Thị trường kỳ vọng chính sách nới lỏng sẽ hỗ trợ tài sản rủi ro.',
    source: 'Vi mô · Quốc tế', art: 'fed',
    tickers: [{ symbol: 'VNINDEX', pct: 0.83 }, { symbol: 'USD/VND', pct: 0.12 }, { symbol: 'DXY', pct: -0.45 }],
    saved: true,
  },
  {
    id: 2, time: '07:42', day: 'Hôm nay', cat: 'Nổi bật', catTone: 'orange' as never,
    title: 'Giá dầu tăng 3,2% do căng thẳng địa chính trị tại Trung Đông',
    desc: 'Giá dầu Brent vượt 92 USD/thùng sau căng thẳng leo thang tại khu vực. Có thể tác động tích cực đến nhóm dầu khí trong ngắn hạn.',
    source: 'Hàng hoá · Dầu khí', art: 'oil',
    tickers: [{ symbol: 'PVS', pct: 2.1 }, { symbol: 'PVD', pct: 1.8 }, { symbol: 'GAS', pct: 1.5 }],
  },
  {
    id: 3, time: '07:30', day: 'Hôm nay', cat: 'Doanh nghiệp', catTone: 'blue',
    title: 'FPT công bố hợp đồng AI với đối tác Nhật trị giá 100 triệu USD',
    desc: 'FPT ký kết hợp đồng triển khai giải pháp AI và chuyển đổi số cho tập đoàn công nghệ Nhật Bản. Dự kiến ghi nhận doanh thu từ Q4/2026.',
    source: 'Công nghệ · FPT', art: 'chip',
    tickers: [{ symbol: 'FPT', pct: 2.8 }, { symbol: 'VN2', pct: 1.2 }],
    saved: true,
  },
  {
    id: 4, time: '06:55', day: 'Hôm nay', cat: 'Chính sách', catTone: 'violet',
    title: 'Chính phủ thúc đẩy đầu tư công, giải ngân tăng mạnh trong Q3',
    desc: 'Thủ tướng yêu cầu các bộ ngành đẩy nhanh tiến độ giải ngân, tập trung vào các dự án hạ tầng trọng điểm. Các dự án hạ tầng trọng điểm.',
    source: 'Vĩ mô · Đầu tư công', art: 'highway',
    tickers: [{ symbol: 'VCG', pct: 1.9 }, { symbol: 'HHV', pct: 1.6 }, { symbol: 'C4G', pct: 1.4 }],
  },
  {
    id: 5, time: '06:30', day: 'Hôm nay', cat: 'Ngành', catTone: 'teal',
    title: 'Ngành ngân hàng hưởng lợi khi tín dụng tăng trở lại',
    desc: 'Tín dụng toàn hệ thống tăng 10,2% so với đầu năm, thanh khoản cải thiện. Các ngân hàng có tỷ lệ CASA cao tiếp tục dẫn dắt.',
    source: 'Ngân hàng · Tài chính', art: 'bank',
    tickers: [{ symbol: 'VCB', pct: 1.8 }, { symbol: 'TCB', pct: 1.5 }, { symbol: 'MBB', pct: 1.3 }],
  },
  {
    id: 6, time: '21:15', day: 'Hôm qua', cat: 'Quốc tế', catTone: 'sky',
    title: 'Chứng khoán Mỹ phục hồi, Nasdaq tăng 0,9%',
    desc: 'Thị trường chứng khoán Mỹ phục hồi nhờ kỳ vọng Fed nới lỏng chính sách. Nhóm công nghệ dẫn dắt đà tăng.',
    source: 'Quốc tế · Hoa Kỳ', art: 'exchange',
    tickers: [{ symbol: 'NASDAQ', pct: 0.9 }, { symbol: 'S&P 500', pct: 0.6 }, { symbol: 'DOW JONES', pct: 0.4 }],
  },
  {
    id: 7, time: '20:05', day: 'Hôm qua', cat: 'Doanh nghiệp', catTone: 'blue',
    title: 'MWG mở rộng chuỗi AI Store, hợp tác với Nvidia',
    desc: 'MWG công bố kế hoạch mở 50 cửa hàng tích hợp giải pháp AI trong 2026. Hợp tác chiến lược với Nvidia về giải pháp bán lẻ thông minh.',
    source: 'Bán lẻ · MWG', art: 'cart',
    tickers: [{ symbol: 'MWG', pct: 1.9 }, { symbol: 'FRT', pct: 1.1 }, { symbol: 'DGW', pct: 0.8 }],
    saved: true,
  },
  {
    id: 8, time: '18:40', day: 'Hôm qua', cat: 'Vĩ mô', catTone: 'gold',
    title: 'NHNN bơm ròng 12.400 tỷ đồng qua kênh OMO',
    desc: 'Ngân hàng Nhà nước bơm ròng tuần thứ ba liên tiếp nhằm hỗ trợ thanh khoản hệ thống trong giai đoạn cao điểm tín dụng.',
    source: 'Vĩ mô · Tiền tệ', art: 'building',
    tickers: [{ symbol: 'VNINDEX', pct: 0.4 }, { symbol: 'VN30', pct: 0.5 }],
  },
  {
    id: 9, time: '17:20', day: 'Hôm qua', cat: 'Ngành', catTone: 'teal',
    title: 'Sản lượng thép tiêu thụ nội địa tăng 8,4% so với cùng kỳ',
    desc: 'Hiệp hội Thép Việt Nam cho biết sản lượng tiêu thụ nội địa tăng nhờ nhu cầu xây dựng phục hồi và hoạt động xuất khẩu khởi sắc.',
    source: 'Thép · Vật liệu', art: 'factory',
    tickers: [{ symbol: 'HPG', pct: 1.2 }, { symbol: 'HSG', pct: -1.8 }, { symbol: 'VGC', pct: 0.8 }],
  },
  {
    id: 10, time: '16:05', day: 'Hôm qua', cat: 'Chính sách', catTone: 'violet',
    title: 'Nghị định mới về trái phiếu doanh nghiệp có hiệu lực từ 01/10',
    desc: 'Nghị định siết chặt điều kiện phát hành và yêu cầu công bố thông tin minh bạch hơn, kỳ vọng lành mạnh hoá thị trường vốn.',
    source: 'Chính sách · Trái phiếu', art: 'city',
    tickers: [{ symbol: 'TCB', pct: 0.6 }, { symbol: 'VHM', pct: -0.4 }],
  },
  {
    id: 11, time: '14:30', day: 'Hôm qua', cat: 'Quốc tế', catTone: 'sky',
    title: 'Trung Quốc công bố gói kích thích 400 tỷ USD',
    desc: 'Bắc Kinh công bố gói kích thích kinh tế nhằm hỗ trợ thị trường bất động sản và tiêu dùng, tác động lan toả tới khu vực.',
    source: 'Quốc tế · Trung Quốc', art: 'port',
    tickers: [{ symbol: 'HSG', pct: -1.1 }, { symbol: 'DGC', pct: 0.7 }, { symbol: 'GVR', pct: 0.9 }],
  },
  {
    id: 12, time: '11:50', day: 'Hôm qua', cat: 'Doanh nghiệp', catTone: 'blue',
    title: 'PNJ mở 20 cửa hàng mới, doanh thu 8 tháng tăng 18%',
    desc: 'PNJ ghi nhận doanh thu 8 tháng đầu năm tăng 18% nhờ nhu cầu vàng trang sức và vàng miếng tăng mạnh trong bối cảnh giá vàng cao.',
    source: 'Bán lẻ · PNJ', art: 'gold',
    tickers: [{ symbol: 'PNJ', pct: 2.4 }, { symbol: 'SBT', pct: 0.5 }],
  },
]

export const NEWS_TABS = [
  'Tất cả', 'Tin nổi bật', 'Vĩ mô', 'Doanh nghiệp',
  'Ngành', 'Thị trường', 'Chính sách', 'Quốc tế',
]

export const NEWS_STATS = [
  { label: 'Tổng số tin hôm nay', value: 124, delta: '+18%', note: 'so với hôm qua', tone: 'up' as const, icon: 'doc' as const },
  { label: 'Tin quan trọng', value: 12, delta: '+3', note: 'cần theo dõi', tone: 'up' as const, icon: 'flame' as const },
  { label: 'Tin doanh nghiệp', value: 68, delta: '+25%', note: '', tone: 'up' as const, icon: 'build' as const },
  { label: 'Tin vĩ mô & quốc tế', value: 24, delta: '+9%', note: '', tone: 'up' as const, icon: 'globe' as const },
]

export const SENTIMENT = { score: 0.36, label: 'Tích cực', segment: 3 }

/* -------------------------------------------------------------------------- */
/* Ý TƯỞNG ĐẦU TƯ                                                             */
/* -------------------------------------------------------------------------- */

export type Idea = {
  id: number
  title: string
  desc: string
  tags: string[]
  risk: 'Cao' | 'Trung bình' | 'Thấp'
  riskLevel: number
  updated: string
  comments: number
  votes: number
  art: ArtKind
  sector: string
  topic: string
  horizon: string
}

export const IDEAS: Idea[] = [
  {
    id: 1, title: 'Ngành Điện hưởng lợi từ chu kỳ đầu tư hạ tầng 2025–2030',
    desc: 'Nhu cầu điện tăng cao, cơ chế giá mới và dây mạnh đầu tư lưới truyền tải mở ra cơ hội cho nhóm doanh nghiệp điện và hạ tầng năng lượng.',
    tags: ['Điện', 'Hạ tầng', 'Tăng trưởng dài hạn'], risk: 'Cao', riskLevel: 4, updated: '22/09/2026',
    comments: 28, votes: 124, art: 'power', sector: 'Điện nước', topic: 'Hạ tầng & Đầu tư công', horizon: 'Dài hạn',
  },
  {
    id: 2, title: 'Ngành Bán dẫn Việt Nam – Dòng vốn FDI và chuỗi cung ứng',
    desc: 'Việt Nam hưởng lợi từ xu hướng đa dạng hoá chuỗi cung ứng toàn cầu, dòng vốn FDI vào lĩnh vực bán dẫn và chính sách hỗ trợ.',
    tags: ['Bán dẫn', 'Công nghệ', 'FDI'], risk: 'Cao', riskLevel: 4, updated: '22/09/2026',
    comments: 18, votes: 98, art: 'chip', sector: 'Công nghệ', topic: 'Công nghệ & Bán dẫn', horizon: 'Dài hạn',
  },
  {
    id: 3, title: 'Điện mặt trời & Lưu trữ năng lượng – Chu kỳ tăng trưởng mới',
    desc: 'Cơ chế DPPA, nhu cầu năng lượng xanh và giá thiết bị giảm tạo động lực tăng trưởng cho các doanh nghiệp trong ngành.',
    tags: ['Năng lượng tái tạo', 'Điện', 'ESG'], risk: 'Cao', riskLevel: 4, updated: '21/09/2026',
    comments: 16, votes: 76, art: 'solar', sector: 'Điện nước', topic: 'Năng lượng xanh', horizon: 'Dài hạn',
  },
  {
    id: 4, title: 'Ngân hàng TMCP – Định giá hấp dẫn sau nhịp điều chỉnh',
    desc: 'Chất lượng tài sản cải thiện, tăng trưởng tín dụng trở lại và mặt bằng định giá vẫn thấp so với trung bình 5 năm.',
    tags: ['Ngân hàng', 'Tài chính', 'Định giá'], risk: 'Trung bình', riskLevel: 2, updated: '20/09/2026',
    comments: 12, votes: 76, art: 'bank', sector: 'Ngân hàng', topic: 'Tài chính – Ngân hàng', horizon: 'Trung hạn',
  },
  {
    id: 5, title: 'Tiêu dùng nội địa – Sức bật từ tầng lớp trung lưu',
    desc: 'Thu nhập cải thiện, xu hướng tiêu dùng hiện đại và mở rộng kênh bán lẻ tạo cơ hội cho các doanh nghiệp đầu ngành.',
    tags: ['Tiêu dùng', 'Bán lẻ', 'Tăng trưởng'], risk: 'Trung bình', riskLevel: 2, updated: '20/09/2026',
    comments: 9, votes: 64, art: 'cart', sector: 'Bán lẻ', topic: 'Tiêu dùng nội địa', horizon: 'Trung hạn',
  },
  {
    id: 6, title: 'Logistics & Cảng biển – Hưởng lợi từ thương mại phục hồi',
    desc: 'Sản lượng hàng hoá qua cảng tăng, giá cước ổn định và làn sóng dịch chuyển sản xuất giúp cải thiện triển vọng ngành.',
    tags: ['Logistics', 'Cảng biển', 'Xuất nhập khẩu'], risk: 'Trung bình', riskLevel: 2, updated: '18/09/2026',
    comments: 7, votes: 52, art: 'ship', sector: 'Vận tải', topic: 'Xuất khẩu & Logistics', horizon: 'Trung hạn',
  },
  {
    id: 7, title: 'Hạ tầng & Đầu tư công – Động lực tăng trưởng mới',
    desc: 'Giải ngân đầu tư công tăng tốc, các dự án cao tốc và sân bay trọng điểm mở ra cơ hội cho nhóm xây dựng và vật liệu.',
    tags: ['Hạ tầng', 'Đầu tư công', 'Xây dựng'], risk: 'Trung bình', riskLevel: 2, updated: '21/09/2026',
    comments: 11, votes: 58, art: 'highway', sector: 'Xây dựng', topic: 'Hạ tầng & Đầu tư công', horizon: 'Trung hạn',
  },
  {
    id: 8, title: 'Chuyển đổi năng lượng – Hướng tới Net Zero 2050',
    desc: 'Cam kết Net Zero và cơ chế chuyển dịch năng lượng tạo động lực dài hạn cho nhóm năng lượng tái tạo và hạ tầng điện.',
    tags: ['Năng lượng', 'ESG', 'Dài hạn'], risk: 'Cao', riskLevel: 4, updated: '19/09/2026',
    comments: 14, votes: 61, art: 'leaf', sector: 'Điện nước', topic: 'Năng lượng xanh', horizon: 'Dài hạn',
  },
  {
    id: 9, title: 'Dịch chuyển chuỗi cung ứng – Cơ hội từ làn sóng China +1',
    desc: 'Dòng vốn FDI dịch chuyển khỏi Trung Quốc mở ra cơ hội cho bất động sản khu công nghiệp và sản xuất xuất khẩu.',
    tags: ['FDI', 'KCN', 'Xuất khẩu'], risk: 'Trung bình', riskLevel: 2, updated: '20/09/2026',
    comments: 10, votes: 54, art: 'factory', sector: 'Bất động sản', topic: 'Dịch chuyển chuỗi cung ứng', horizon: 'Dài hạn',
  },
  {
    id: 10, title: 'Kinh tế tuần hoàn – Xu hướng tất yếu của sản xuất',
    desc: 'Áp lực từ thị trường xuất khẩu về tiêu chuẩn ESG thúc đẩy doanh nghiệp đầu tư vào công nghệ tái chế và sản xuất xanh.',
    tags: ['ESG', 'Sản xuất', 'Dài hạn'], risk: 'Cao', riskLevel: 4, updated: '17/09/2026',
    comments: 5, votes: 41, art: 'recycle', sector: 'Vật liệu', topic: 'Năng lượng xanh', horizon: 'Dài hạn',
  },
  {
    id: 11, title: 'Vật liệu xây dựng – Chu kỳ phục hồi từ đầu tư công',
    desc: 'Nhu cầu vật liệu tăng theo tiến độ giải ngân đầu tư công và phục hồi của thị trường bất động sản.',
    tags: ['Vật liệu', 'Xây dựng', 'Chu kỳ'], risk: 'Trung bình', riskLevel: 2, updated: '18/09/2026',
    comments: 8, votes: 46, art: 'brick', sector: 'Vật liệu', topic: 'Hạ tầng & Đầu tư công', horizon: 'Ngắn hạn',
  },
  {
    id: 12, title: 'Dầu khí – Đón sóng chu kỳ hàng hoá',
    desc: 'Giá dầu neo cao và nhu cầu năng lượng toàn cầu phục hồi hỗ trợ nhóm thượng nguồn và dịch vụ dầu khí.',
    tags: ['Dầu khí', 'Hàng hoá', 'Chu kỳ'], risk: 'Cao', riskLevel: 4, updated: '22/09/2026',
    comments: 13, votes: 57, art: 'oil', sector: 'Dầu khí', topic: 'Năng lượng xanh', horizon: 'Ngắn hạn',
  },
]

export const IDEA_SECTORS = ['Tất cả', 'Ngân hàng', 'Công nghệ', 'Bất động sản', 'Bán lẻ', 'Điện nước', 'Vận tải', 'Xây dựng', 'Dầu khí', 'Vật liệu']

export const IDEA_TOPICS = ['Tất cả', 'AI & Bán dẫn', 'Chuyển đổi năng lượng', 'Hạ tầng & Đầu tư công', 'Tiêu dùng nội địa', 'Dịch chuyển chuỗi cung ứng', 'Tài chính – Ngân hàng', 'Năng lượng xanh', 'Xuất khẩu & Logistics']

/* -------------------------------------------------------------------------- */
/* CHỦ ĐỀ ĐẦU TƯ                                                              */
/* -------------------------------------------------------------------------- */

export type Topic = {
  id: number
  name: string
  desc: string
  stocks: number
  pct3M: number
  pct6M: number
  interest: number
  art: ArtKind
  tag: string
  scope: string
  points: string[]
}

export const TOPICS: Topic[] = [
  {
    id: 1, name: 'AI & Bán dẫn', desc: 'Làn sóng hạ tầng AI toàn cầu', stocks: 28, pct3M: 18.5, pct6M: 42.8,
    interest: 96, art: 'chip', tag: 'Đại hạn', scope: 'Toàn cầu',
    points: [
      'Nhu cầu AI, cloud computing và data center tăng mạnh trên toàn cầu.',
      'Việt Nam hưởng lợi từ làn sóng dịch chuyển chuỗi cung ứng bán dẫn.',
      'Chính phủ đang thúc đẩy chiến lược phát triển ngành công nghiệp bán dẫn.',
      'Rủi ro: căng thẳng địa chính trị, phụ thuộc vào chuỗi cung ứng toàn cầu.',
    ],
  },
  {
    id: 2, name: 'Chuyển đổi năng lượng', desc: 'Điện gió, điện mặt trời, LNG', stocks: 24, pct3M: 12.1, pct6M: 28.4,
    interest: 82, art: 'solar', tag: 'Tăng trưởng cao', scope: 'Toàn cầu',
    points: [
      'Cam kết Net Zero 2050 thúc đẩy dịch chuyển cơ cấu nguồn điện.',
      'Cơ chế DPPA và giá điện mới cải thiện hiệu quả đầu tư.',
      'Rủi ro: tiến độ phê duyệt dự án và chính sách giá điện.',
    ],
  },
  {
    id: 3, name: 'Hạ tầng & Đầu tư công', desc: 'Cao tốc, sân bay, logistics', stocks: 32, pct3M: 10.7, pct6M: 24.1,
    interest: 78, art: 'highway', tag: 'Tăng trưởng cao', scope: 'Việt Nam',
    points: [
      'Giải ngân đầu tư công tăng tốc trong Q3/2026.',
      'Các dự án cao tốc Bắc–Nam và sân bay Long Thành là động lực chính.',
      'Rủi ro: tiến độ giải ngân và giá nguyên vật liệu.',
    ],
  },
  {
    id: 4, name: 'Tiêu dùng nội địa', desc: 'Sức bật từ tầng lớp trung lưu', stocks: 26, pct3M: 8.9, pct6M: 18.7,
    interest: 74, art: 'cart', tag: 'Ổn định', scope: 'Việt Nam',
    points: [
      'Thu nhập khả dụng cải thiện hỗ trợ tiêu dùng.',
      'Kênh bán lẻ hiện đại mở rộng nhanh tại khu vực nông thôn.',
      'Rủi ro: lạm phát và sức mua phục hồi chậm.',
    ],
  },
  {
    id: 5, name: 'Dịch chuyển chuỗi cung ứng', desc: 'Cơ hội từ làn sóng China +1', stocks: 20, pct3M: 15.3, pct6M: 31.2,
    interest: 88, art: 'factory', tag: 'Tăng trưởng cao', scope: 'Toàn cầu',
    points: [
      'FDI dịch chuyển khỏi Trung Quốc sang Việt Nam tiếp tục mạnh.',
      'Bất động sản khu công nghiệp hưởng lợi trực tiếp.',
      'Rủi ro: thuế quan và chính sách thương mại của Mỹ.',
    ],
  },
  {
    id: 6, name: 'Ngân hàng & Tài chính', desc: 'Hồi phục lợi nhuận, nới room tín dụng', stocks: 18, pct3M: 6.2, pct6M: 14.8,
    interest: 71, art: 'bank', tag: 'Ổn định', scope: 'Việt Nam',
    points: [
      'Tín dụng toàn hệ thống tăng 10,2% so với đầu năm.',
      'Chất lượng tài sản cải thiện, nợ xấu được kiểm soát.',
      'Rủi ro: lãi suất huy động và áp lực NIM.',
    ],
  },
  {
    id: 7, name: 'Bất động sản khu công nghiệp', desc: 'Làn sóng FDI thế hệ mới', stocks: 15, pct3M: 9.4, pct6M: 22.1,
    interest: 69, art: 'port', tag: 'Tăng trưởng cao', scope: 'Việt Nam',
    points: [
      'Tỷ lệ lấp đầy khu công nghiệp tại miền Bắc duy trì trên 85%.',
      'Giá thuê đất tăng nhẹ nhờ nguồn cung hạn chế.',
      'Rủi ro: thủ tục phê duyệt dự án mới.',
    ],
  },
  {
    id: 8, name: 'Kinh tế số & Fintech', desc: 'Thanh toán số, ngân hàng số', stocks: 16, pct3M: 11.0, pct6M: 25.6,
    interest: 76, art: 'phone', tag: 'Tăng trưởng cao', scope: 'Toàn cầu',
    points: [
      'Tỷ lệ thanh toán không tiền mặt tăng nhanh.',
      'Khung pháp lý sandbox fintech đang được hoàn thiện.',
      'Rủi ro: cạnh tranh và chi phí thu hút khách hàng.',
    ],
  },
  {
    id: 9, name: 'Năng lượng xanh', desc: 'Điện gió, hydrogen, ESG', stocks: 12, pct3M: 18.6, pct6M: 33.4,
    interest: 84, art: 'leaf', tag: 'Tăng trưởng cao', scope: 'Toàn cầu',
    points: [
      'Tiêu chuẩn ESG từ thị trường xuất khẩu thúc đẩy đầu tư xanh.',
      'Điện gió ngoài khơi là điểm sáng dài hạn.',
      'Rủi ro: chi phí vốn và tiến độ triển khai.',
    ],
  },
  {
    id: 10, name: 'Hàng tiêu dùng & Bán lẻ', desc: 'Phục hồi sức mua', stocks: 14, pct3M: 4.2, pct6M: 11.8,
    interest: 62, art: 'cart', tag: 'Ổn định', scope: 'Việt Nam',
    points: [
      'Sức mua hồi phục chậm nhưng ổn định.',
      'Biên lợi nhuận cải thiện nhờ giá nguyên liệu hạ.',
      'Rủi ro: cạnh tranh giá và chi phí thuê mặt bằng.',
    ],
  },
  {
    id: 11, name: 'Thép & Vật liệu', desc: 'Chu kỳ phục hồi sản lượng', stocks: 11, pct3M: -2.4, pct6M: 8.6,
    interest: 55, art: 'brick', tag: 'Chu kỳ', scope: 'Việt Nam',
    points: [
      'Sản lượng tiêu thụ nội địa tăng 8,4% so với cùng kỳ.',
      'Giá quặng sắt và than cốc ổn định hỗ trợ biên lợi nhuận.',
      'Rủi ro: hàng nhập khẩu giá rẻ từ Trung Quốc.',
    ],
  },
  {
    id: 12, name: 'Dầu khí & Năng lượng', desc: 'Chu kỳ hàng hoá neo cao', stocks: 13, pct3M: 7.8, pct6M: 16.4,
    interest: 66, art: 'oil', tag: 'Chu kỳ', scope: 'Toàn cầu',
    points: [
      'Giá dầu Brent duy trì trên 90 USD/thùng.',
      'Nhu cầu năng lượng toàn cầu phục hồi.',
      'Rủi ro: biến động địa chính trị và nhu cầu Trung Quốc.',
    ],
  },
]

/* -------------------------------------------------------------------------- */
/* BÁO CÁO                                                                    */
/* -------------------------------------------------------------------------- */

export type Report = {
  id: number
  cat: string
  catTone: 'rose' | 'blue' | 'teal' | 'gold' | 'violet' | 'orange'
  title: string
  desc: string
  date: string
  pages: number
  art: ArtKind
  featured?: boolean
}

export const REPORTS: Report[] = [
  { id: 1, cat: 'Báo cáo hàng ngày', catTone: 'rose', title: 'Thị trường hôm nay (22/09/2026)', desc: 'Điểm biến thị trường, điểm nhấn phiên giao dịch, cổ phiếu đáng chú ý.', date: '22/09/2026', pages: 12, art: 'exchange' },
  { id: 2, cat: 'Báo cáo vĩ mô', catTone: 'blue', title: 'Chính sách vĩ mô Việt Nam tháng 9/2026', desc: 'Lạm phát, tăng trưởng, lãi suất và chính sách điều hành mới nhất.', date: '21/09/2026', pages: 24, art: 'building' },
  { id: 3, cat: 'Báo cáo danh mục', catTone: 'teal', title: 'Báo cáo danh mục của tôi (Tuần 15/09 – 21/09)', desc: 'Hiệu suất, phân bổ tài sản, đánh giá rủi ro và khuyến nghị tái cơ cấu.', date: '21/09/2026', pages: 18, art: 'city' },
  { id: 4, cat: 'Báo cáo hàng tuần', catTone: 'orange', title: 'Tuần qua có gì? (15/09 – 21/09/2026)', desc: 'Tổng hợp điểm biến, dòng tiền, ngành nổi bật và chiến lược tuần tới.', date: '21/09/2026', pages: 16, art: 'highway' },
  { id: 5, cat: 'Báo cáo ngành', catTone: 'blue', title: 'Ngành Ngân hàng – Cập nhật tháng 9/2026', desc: 'Tăng trưởng tín dụng, chất lượng tài sản và triển vọng lợi nhuận.', date: '20/09/2026', pages: 32, art: 'bank' },
  { id: 6, cat: 'Báo cáo doanh nghiệp', catTone: 'violet', title: 'FPT – Báo cáo cập nhật tháng 9/2026', desc: 'KQKD, triển vọng, định giá và khuyến nghị đầu tư.', date: '19/09/2026', pages: 28, art: 'chip', featured: false },
  { id: 7, cat: 'Báo cáo vĩ mô', catTone: 'blue', title: 'Triển vọng thị trường Q4/2026', desc: 'Cập nhật bức tranh vĩ mô toàn cầu và chiến lược đầu tư cho quý cuối năm.', date: '18/09/2026', pages: 46, art: 'city', featured: true },
]

export const REPORT_TOPICS = [
  { name: 'Hàng ngày', desc: 'Cập nhật nhanh thị trường', art: 'exchange' as ArtKind },
  { name: 'Hàng tuần', desc: 'Tổng hợp và góc nhìn', art: 'highway' as ArtKind },
  { name: 'Vĩ mô', desc: 'Kinh tế – Chính sách', art: 'building' as ArtKind },
  { name: 'Ngành', desc: 'Phân tích chuyên sâu', art: 'bank' as ArtKind },
  { name: 'Doanh nghiệp', desc: 'Cập nhật KQKD & triển vọng', art: 'chip' as ArtKind },
  { name: 'Danh mục của tôi', desc: 'Báo cáo cá nhân hoá', art: 'city' as ArtKind },
]

export const REPORT_SUBSCRIPTIONS = [
  { label: 'Báo cáo hàng ngày', on: true },
  { label: 'Báo cáo hàng tuần', on: true },
  { label: 'Báo cáo vĩ mô', on: true },
  { label: 'Báo cáo ngành', on: false },
  { label: 'Báo cáo doanh nghiệp', on: true },
  { label: 'Báo cáo danh mục của tôi', on: true },
]

export const TOP_REPORTS = [
  { no: 1, title: 'Triển vọng thị trường Q4/2026', cat: 'Báo cáo vĩ mô', date: '18/09/2026' },
  { no: 2, title: 'Ngành Bất động sản – Cơ hội sau điều chỉnh', cat: 'Báo cáo ngành', date: '16/09/2026' },
  { no: 3, title: 'Danh mục của tôi – Tháng 9/2026', cat: 'Báo cáo danh mục', date: '15/09/2026' },
  { no: 4, title: 'Top cổ phiếu theo dõi Q4/2026', cat: 'Báo cáo chiến lược', date: '14/09/2026' },
  { no: 5, title: 'Fed và tác động tới thị trường mới nổi', cat: 'Báo cáo vĩ mô', date: '12/09/2026' },
]

/* -------------------------------------------------------------------------- */
/* KỊCH BẢN & STRESS TEST                                                     */
/* -------------------------------------------------------------------------- */

export type Scenario = {
  key: 'base' | 'bull' | 'bear' | 'crisis'
  title: string
  sub: string
  pct: number
}

export const SCENARIOS: Scenario[] = [
  { key: 'base', title: 'Kịch bản cơ sở', sub: 'Tăng trưởng ổn định, lạm phát hạ nhiệt', pct: 12.4 },
  { key: 'bull', title: 'Kịch bản tích cực', sub: 'Kinh tế phục hồi mạnh, dòng tiền quay lại', pct: 28.6 },
  { key: 'bear', title: 'Kịch bản tiêu cực', sub: 'Suy giảm kinh tế, lãi suất duy trì cao', pct: -18.7 },
  { key: 'crisis', title: 'Kịch bản khủng hoảng', sub: 'Khủng hoảng tài chính, thanh khoản suy giảm', pct: -32.5 },
]

export const SCENARIO_TABLE = [
  { label: 'Lợi nhuận danh mục', base: 12.4, bull: 28.6, bear: -18.7, crisis: -32.5, tone: 'pct' },
  { label: 'VN-Index (tham chiếu)', base: 8.3, bull: 25.0, bear: -20.0, crisis: -35.0, tone: 'pct' },
  { label: 'Biến động (Volatility)', base: 14.8, bull: 18.2, bear: 28.6, crisis: 42.3, tone: 'plain' },
  { label: 'Max Drawdown', base: -12.6, bull: -15.4, bear: -28.9, crisis: -45.7, tone: 'pct' },
  { label: 'Sharpe Ratio', base: 0.82, bull: 1.21, bear: -0.36, crisis: -0.71, tone: 'plain' },
  { label: 'Xác suất xảy ra (ước tính)', base: 50, bull: 20, bear: 20, crisis: 10, tone: 'prob' },
]

export const STRESS_TESTS = [
  { icon: 'down' as const, name: 'VN-Index giảm 20%', assumption: 'Thị trường chung -20%', impact: -16.8 },
  { icon: 'gold' as const, name: 'Lãi suất tăng 2%', assumption: 'Lãi suất +2%', impact: -11.4 },
  { icon: 'sky' as const, name: 'Tỷ giá USD/VND tăng 5%', assumption: 'Tỷ giá +5%', impact: -6.2 },
  { icon: 'oil' as const, name: 'Giá dầu tăng 50%', assumption: 'Dầu Brent +50%', impact: -8.7 },
  { icon: 'flame' as const, name: 'Lạm phát tăng mạnh', assumption: 'CPI +3%', impact: -10.1 },
  { icon: 'warn' as const, name: 'Thanh khoản thị trường giảm', assumption: 'GTGD -30%', impact: -13.5 },
]

export const SCENARIO_INPUTS = [
  { label: 'Tăng trưởng GDP', value: 4.5, unit: '%', key: 'gdp' },
  { label: 'Lạm phát (CPI)', value: 3.2, unit: '%', key: 'cpi' },
  { label: 'Lãi suất điều hành', value: 5.5, unit: '%', key: 'rate' },
  { label: 'Tỷ giá USD/VND', value: 25_500, unit: 'VND', key: 'fx' },
  { label: 'Tăng trưởng EPS thị trường', value: 10, unit: '%', key: 'eps' },
]

export const SENSITIVITY = [
  { x: -2, y: 15 },
  { x: -1.5, y: 11 },
  { x: -1, y: 7.5 },
  { x: -0.5, y: 3.6 },
  { x: 0, y: 0.2 },
  { x: 0.5, y: -4.6 },
  { x: 1, y: -8.4 },
  { x: 1.5, y: -12.8 },
  { x: 2, y: -17.4 },
]

export const TEST_HISTORY = [
  { date: '22/09/2026', name: 'Kịch bản cơ sở', type: 'Kịch bản vĩ mô', result: 'Hoàn tất', pct: 12.4 },
  { date: '18/09/2026', name: 'Stress test lãi suất', type: 'Stress test', result: 'Hoàn tất', pct: -11.4 },
  { date: '12/09/2026', name: 'Kịch bản khủng hoảng', type: 'Kịch bản vĩ mô', result: 'Hoàn tất', pct: -32.5 },
  { date: '05/09/2026', name: 'Phân tích độ nhạy tỷ giá', type: 'Độ nhạy', result: 'Hoàn tất', pct: -6.2 },
  { date: '28/08/2026', name: 'Stress test thanh khoản', type: 'Stress test', result: 'Hoàn tất', pct: -13.5 },
]

export const SCENARIO_NOTES = [
  { tone: 'up' as const, text: 'Kịch bản vĩ mô cho thấy danh mục tăng trưởng tốt trong kịch bản lãi suất tăng, nhưng nhạy cảm với cú sốc thanh khoản.' },
  { tone: 'gold' as const, text: 'Nên gia tăng tỷ trọng cổ phiếu phòng thủ (ngân hàng, tiện ích).' },
]

/* -------------------------------------------------------------------------- */
/* SÀNG LỌC CỔ PHIẾU                                                          */
/* -------------------------------------------------------------------------- */

export const SCREEN_PRESETS = [
  { name: 'Cổ phiếu tăng trưởng', desc: 'Tăng trưởng EPS và doanh thu cao, ROE ổn định' },
  { name: 'Cổ phiếu giá trị', desc: 'Định giá thấp so với giá trị nội tại' },
  { name: 'Cổ phiếu có cổ tức cao', desc: 'Tỷ suất cổ tức trên 3%/năm, chi trả đều đặn' },
  { name: 'Cổ phiếu vốn hoá nhỏ tiềm năng', desc: 'Vốn hoá dưới 5.000 tỷ, tiềm năng tăng trưởng' },
  { name: 'Cổ phiếu ngành hưởng lợi', desc: 'Hưởng lợi từ chính sách và dòng tiền hiện tại' },
  { name: 'Cổ phiếu cho danh mục phòng thủ', desc: 'Beta thấp, biến động thấp, cổ tức ổn định' },
]

export const SCREEN_FILTERS = {
  market: ['Tất cả', 'HOSE', 'HNX', 'UPCOM'],
  sectors: ['Tất cả', ...Array.from(new Set(['Ngân hàng', 'Chứng khoán', 'Bất động sản', 'Thép', 'Công nghệ', 'Bán lẻ', 'Hàng tiêu dùng', 'Dầu khí', 'Hóa chất', 'Điện nước', 'Vận tải', 'Xây dựng', 'Bảo hiểm', 'Nông nghiệp', 'Y tế', 'Dệt may', 'Vật liệu', 'Viễn thông', 'Công nghiệp']))],
}

export const SCREEN_STATS = [
  { label: 'Cổ phiếu phù hợp', value: '124', tone: 'gold' as const },
  { label: 'Tăng giá trong 6 tháng', value: '65%', tone: 'up' as const },
  { label: 'ROE trung bình', value: '18,5%', tone: 'up' as const },
  { label: 'P/E trung bình', value: '12,4', tone: 'blue' as const },
]

export const SCREEN_TOP_METRICS = [
  { label: 'ROE cao nhất', value: 36.2, color: '#2ec27b' },
  { label: 'Tăng trưởng LNST cao nhất', value: 48.5, color: '#5b8def' },
  { label: 'P/E thấp nhất', value: 4.2, color: '#d4af37' },
  { label: 'P/B thấp nhất', value: 0.6, color: '#8b7cf6' },
  { label: 'Cổ tức suất cao nhất', value: 8.4, color: '#2dd4bf' },
]

export const SCREEN_AI_SUGGESTIONS = [
  'Có 12 cổ phiếu công nghệ đạt ROE > 20% và tăng trưởng LNST > 15%',
  '3 cổ phiếu ngân hàng đang có định giá hấp dẫn so với trung bình ngành',
  'Nhóm bất động sản có tín hiệu dòng tiền cải thiện trong 3 tháng gần đây',
  'Cơ hội từ nhóm xuất khẩu khi tỷ giá neo cao',
]

export const SCREEN_COLUMNS = [
  { key: 'symbol', label: 'Mã' },
  { key: 'name', label: 'Tên công ty' },
  { key: 'sector', label: 'Ngành' },
  { key: 'price', label: 'Giá (VND)' },
  { key: 'change', label: '+/-' },
  { key: 'changePct', label: '%' },
  { key: 'pe', label: 'P/E' },
  { key: 'pb', label: 'P/B' },
  { key: 'roe', label: 'ROE (%)' },
  { key: 'epsGrowth', label: 'Tăng trưởng LNST (%)' },
  { key: 'marketCap', label: 'Vốn hoá (tỷ VND)' },
]

/* -------------------------------------------------------------------------- */
/* CHỈ SỐ CHO TRANG TỔNG QUAN                                                 */
/* -------------------------------------------------------------------------- */

export const TODAY_IDEAS = [
  { symbol: 'FPT', label: 'Tích cực', tone: 'up' as const, text: 'Hợp đồng AI 100 triệu USD' },
  { symbol: 'VCB', label: 'Theo dõi', tone: 'gold' as const, text: 'Định giá hấp dẫn sau điều chỉnh' },
  { symbol: 'HHV', label: 'Tích cực', tone: 'up' as const, text: 'Hưởng lợi đầu tư công' },
  { symbol: 'MWG', label: 'Theo dõi', tone: 'gold' as const, text: 'Mở rộng chuỗi AI Store' },
]

export const TODAY_THEMES = [
  { symbol: 'Đầu tư công', tone: 'up' as const, text: 'Giải ngân tăng tốc trong Q3' },
  { symbol: 'AI & Data Center', tone: 'up' as const, text: 'Dòng vốn FDI vào hạ tầng số' },
  { symbol: 'Ngân hàng', tone: 'gold' as const, text: 'Tín dụng tăng trưởng trở lại' },
  { symbol: 'Xuất khẩu', tone: 'down' as const, text: 'Áp lực tỷ giá và thuế quan' },
  { symbol: 'Năng lượng tái tạo', tone: 'gold' as const, text: 'Cơ chế DPPA mở đường' },
]

export const TODAY_REPORTS = [
  { title: 'Vietnam Market Morning Brief', date: '22/09/2026' },
  { title: 'Sector Focus: Ngân hàng', date: '21/09/2026' },
  { title: 'Theme Report: AI Infrastructure', date: '20/09/2026' },
]

export const OVERVIEW_NEWS = [
  { title: 'Fed giữ lãi suất, phát tín hiệu có thể cắt giảm trong năm 2026', time: '08:15', cat: 'Vĩ mô', art: 'fed' as ArtKind },
  { title: 'Giá dầu tăng 3,2% do căng thẳng địa chính trị tại Trung Đông', time: '07:42', cat: 'Hàng hoá', art: 'oil' as ArtKind },
  { title: 'Chính phủ thúc đẩy đầu tư công, giải ngân tăng mạnh trong Q3', time: '07:30', cat: 'Chính sách', art: 'highway' as ArtKind },
  { title: 'FPT công bố hợp đồng AI với đối tác Nhật trị giá 100 triệu USD', time: '06:55', cat: 'Doanh nghiệp', art: 'chip' as ArtKind },
  { title: 'Dòng tiền quay trở lại thị trường, VN-Index vượt MA20', time: '06:30', cat: 'Thị trường', art: 'exchange' as ArtKind },
]

export const HERO_QUOTES = [
  'Kỷ luật hôm nay, thịnh vượng ngày mai.',
  'Cơ hội luôn xuất hiện trong những biến động.',
  'Quản trị tốt hôm nay, tự do hơn ngày mai.',
  'Hiệu suất hôm nay, đổi tự do ngày mai.',
  'Thị trường luôn có cơ hội cho những người chuẩn bị tốt.',
  'Tư duy dài hạn, hành động kỷ luật, kết quả bền vững.',
]

export const HERO_SUBTITLES = [
  'Thị trường luôn có cơ hội cho những người chuẩn bị tốt.',
  'Theo dõi. Phân tích. Tự tin. Đồng hành cùng mục tiêu tài chính của bạn.',
  'Đo lường. Hiểu nguyên nhân. Tối ưu để tăng trưởng bền vững.',
  'Dự phòng nhiều kịch bản. Kiểm tra sức chịu đựng. Chủ động trước biến động.',
]

/* Sinh chỉ số phụ trợ cho bảng */
export function screenRows(list: typeof import('./market').STOCKS, seedKey: string) {
  const r = rng(seedKey)
  return list.map((s) => ({ ...s, _r: r() }))
}