/* ==========================================================================
   DỮ LIỆU DANH MỤC ĐẦU TƯ
   ========================================================================== */

import { performanceSeries, rng, stockBySymbol, type RangeKey } from './market'

/* -------------------------------------------------------------------------- */
/* Khoản nắm giữ                                                              */
/* -------------------------------------------------------------------------- */

export type Holding = {
  symbol: string
  name: string
  sector: string
  qty: number
  cost: number
  price: number
  value: number
  pnl: number
  pnlPct: number
  weight: number
  contribution: number
  strategy: string
  signals: string[]
}

const RAW: [string, number, number, string, number, string[]][] = [
  ['FPT', 2000, 100000, 'Tăng trưởng', 20.2, ['KQKD tốt', 'Dòng tiền mạnh']],
  ['TCB', 5000, 28000, 'Giá trị', 13.7, ['Định giá hấp dẫn', 'Chất lượng tài sản']],
  ['HPG', 10000, 25000, 'Cổ tức', 22.9, ['Chu kỳ phục hồi', 'Sản lượng tăng']],
  ['MWG', 2000, 50000, 'Tăng trưởng', 9.9, ['Mở rộng chuỗi', 'Biên lợi nhuận']],
  ['VCB', 1000, 85000, 'Giá trị', 7.1, ['Nền tảng cơ bản tốt', 'CASA cao']],
  ['PNJ', 1000, 95000, 'Tăng trưởng', 8.1, ['Nhu cầu vàng', 'Mở rộng cửa hàng']],
  ['VHM', 500, 42000, 'Giá trị', 3.7, ['Quỹ đất lớn', 'Bàn giao nhà']],
  ['MSN', 1000, 69000, 'Tăng trưởng', 5.9, ['Tái cấu trúc', 'Tiêu dùng phục hồi']],
  ['VIC', 1500, 45000, 'Cổ tức', 4.9, ['Hệ sinh thái', 'Định giá lại']],
  ['HSG', 3000, 21000, 'Trading', 2.4, ['Chu kỳ thép', 'Giá HRC']],
]

export const HOLDINGS: Holding[] = (() => {
  const rows = RAW.map(([symbol, qty, cost, strategy, weight, signals]) => {
    const st = stockBySymbol(symbol)!
    const value = qty * st.price
    const pnl = (st.price - cost) * qty
    return {
      symbol,
      name: st.name,
      sector: st.sector,
      qty,
      cost,
      price: st.price,
      value,
      pnl,
      pnlPct: (st.price / cost - 1) * 100,
      weight,
      contribution: st.changePct * (weight / 100),
      strategy,
      signals,
    }
  })
  return rows
})()

export const PORTFOLIO = {
  name: 'Core Portfolio',
  totalValue: 1_250_000_000,
  ytdPnl: 138_000_000,
  ytdPct: 12.4,
  benchmarkPct: 8.3,
  benchmarkName: 'VN-Index',
  alpha: 4.1,
  sharpe: 0.82,
  beta: 1.18,
  cash: 62_500_000,
  cashPct: 5.0,
  volatility: 14.8,
  maxDrawdown: -12.6,
  var95: -3.2,
  twr: 14.8,
  positions: HOLDINGS.length,
}

/* -------------------------------------------------------------------------- */
/* Phân bổ tài sản                                                            */
/* -------------------------------------------------------------------------- */

export const ALLOC_SECTOR = [
  { name: 'Ngân hàng', value: 32, color: '#d5a452' },
  { name: 'Công nghệ', value: 24, color: '#eee4ce' },
  { name: 'Bất động sản', value: 18, color: '#d9a54e' },
  { name: 'Hàng tiêu dùng', value: 12, color: '#e8bc68' },
  { name: 'Công nghiệp', value: 8, color: '#8c97a5' },
  { name: 'Tiền mặt', value: 6, color: '#cfd4dc' },
]

export const ALLOC_ASSET = [
  { name: 'Cổ phiếu', value: 68, color: '#d5a452' },
  { name: 'Trái phiếu', value: 14, color: '#eee4ce' },
  { name: 'Vàng', value: 8, color: '#e8bc68' },
  { name: 'Tiền mặt', value: 6, color: '#cfd4dc' },
  { name: 'Chứng chỉ quỹ', value: 4, color: '#8c97a5' },
]

export const ALLOC_STRATEGY = [
  { name: 'Tăng trưởng', value: 45, color: '#d5a452' },
  { name: 'Giá trị', value: 30, color: '#eee4ce' },
  { name: 'Cổ tức', value: 15, color: '#d9a54e' },
  { name: 'Trading', value: 10, color: '#8c97a5' },
]

/* -------------------------------------------------------------------------- */
/* Giao dịch                                                                  */
/* -------------------------------------------------------------------------- */

export type Trade = {
  date: string
  symbol: string
  side: 'Mua' | 'Bán'
  qty: number
  price: number
  value: number
  fee: number
  tax: number
  note: string
}

export const TRADES: Trade[] = [
  { date: '22/09/2026', symbol: 'FPT', side: 'Mua', qty: 500, price: 126000, value: 63_000_000, fee: 94_500, tax: 0, note: 'Gia tăng tỷ trọng công nghệ' },
  { date: '19/09/2026', symbol: 'MWG', side: 'Mua', qty: 800, price: 61000, value: 48_800_000, fee: 73_200, tax: 0, note: 'Mở rộng chuỗi Bách Hóa Xanh' },
  { date: '18/09/2026', symbol: 'HSG', side: 'Bán', qty: 2000, price: 20200, value: 40_400_000, fee: 60_600, tax: 40_400, note: 'Cắt lỗ theo kế hoạch' },
  { date: '17/09/2026', symbol: 'TCB', side: 'Mua', qty: 2000, price: 33500, value: 67_000_000, fee: 100_500, tax: 0, note: 'Bổ sung ngân hàng' },
  { date: '16/09/2026', symbol: 'VIC', side: 'Bán', qty: 500, price: 41200, value: 20_600_000, fee: 30_900, tax: 20_600, note: 'Tái cơ cấu danh mục' },
  { date: '15/09/2026', symbol: 'PNJ', side: 'Mua', qty: 300, price: 98500, value: 29_550_000, fee: 44_325, tax: 0, note: 'Nhu cầu vàng tăng' },
  { date: '12/09/2026', symbol: 'HPG', side: 'Mua', qty: 4000, price: 27100, value: 108_400_000, fee: 162_600, tax: 0, note: 'Chu kỳ thép phục hồi' },
  { date: '11/09/2026', symbol: 'VHM', side: 'Bán', qty: 1000, price: 44900, value: 44_900_000, fee: 67_350, tax: 44_900, note: 'Chốt lời ngắn hạn' },
]

/* -------------------------------------------------------------------------- */
/* Hiệu suất                                                                  */
/* -------------------------------------------------------------------------- */

export type PerfRow = {
  symbol: string
  name: string
  weight: number
  cost: number
  price: number
  pnl: number
  pnlPct: number
  contribution: number
  seed: string
}

export const PERF_ROWS: PerfRow[] = HOLDINGS.map((h) => ({
  symbol: h.symbol,
  name: h.name,
  weight: h.weight,
  cost: h.cost,
  price: h.price,
  pnl: h.pnl,
  pnlPct: h.pnlPct,
  contribution: h.contribution,
  seed: h.symbol,
})).sort((a, b) => b.pnlPct - a.pnlPct)

export const CONTRIBUTIONS = [
  { symbol: 'FPT', value: 3.8 },
  { symbol: 'MWG', value: 2.6 },
  { symbol: 'TCB', value: 2.1 },
  { symbol: 'HPG', value: 1.8 },
  { symbol: 'VCB', value: 1.2 },
  { symbol: 'VHM', value: -0.8 },
  { symbol: 'MSN', value: -1.1 },
  { symbol: 'PNJ', value: -1.4 },
  { symbol: 'VIC', value: -1.9 },
  { symbol: 'HSG', value: -2.3 },
]

export const RISK_METRICS = [
  { label: 'Độ biến động (Volatility)', value: '14,8%', tone: 'gold' as const, bars: 6, level: 'low' as const },
  { label: 'Max Drawdown', value: '-12,6%', tone: 'down' as const, bars: 9, level: 'high' as const },
  { label: 'VaR (95%, 1 ngày)', value: '-3,2%', tone: 'gold' as const, bars: 5, level: 'mid' as const },
  { label: 'Beta so với VN-Index', value: '1,18', tone: 'flat' as const, bars: 7, level: 'mid' as const },
  { label: 'Tỷ lệ Sharpe', value: '0,82', tone: 'up' as const, bars: 5, level: 'mid' as const },
  { label: 'Hệ số tập trung (HHI)', value: '0,14', tone: 'up' as const, bars: 3, level: 'low' as const },
]

/* So sánh với chỉ số chuẩn */
export const BENCHMARK_COMPARE = [
  { label: 'Tổng sinh lời', values: [14.8, 8.3, 9.6] },
  { label: 'Biến động', values: [14.8, 16.2, 15.9] },
  { label: 'Sharpe Ratio', values: [0.82, 0.54, 0.62] },
  { label: 'Max Drawdown', values: [-12.6, -18.4, -15.2] },
]

export const BENCHMARKS = [
  { name: 'Danh mục của tôi', color: '#e8b44a' },
  { name: 'VN-Index', color: '#8b8b8b' },
  { name: 'VN30', color: '#5b8def' },
]

export function portfolioSeries(range: RangeKey): number[] {
  return performanceSeries('portfolio', range, 12.4)
}

export function benchmarkSeries(range: RangeKey): number[] {
  return performanceSeries('vnindex', range, 8.3)
}

export function vn30Series(range: RangeKey): number[] {
  return performanceSeries('vn30-bench', range, 9.6)
}

/* -------------------------------------------------------------------------- */
/* Đánh giá & gợi ý                                                           */
/* -------------------------------------------------------------------------- */

export const PORTFOLIO_REVIEW = {
  score: 78,
  grade: 'Tốt',
  strengths: [
    'Tập trung vào nhóm Ngân hàng (32%) và Công nghệ (24%) — hai nhóm dẫn dắt dòng tiền hiện tại.',
    'Tỷ trọng tiền mặt 5% phù hợp với khẩu vị rủi ro trung bình – cao.',
    'Alpha dương +4,1% so với VN-Index trong 12 tháng gần nhất.',
  ],
  improvements: [
    'Tỷ trọng nhóm Bất động sản (15%) đang cao hơn mức khuyến nghị 10% trong bối cảnh thanh khoản ngành yếu.',
    'Cần bổ sung 1–2 mã phòng thủ (Điện nước, Tiêu dùng thiết yếu) để giảm tương quan danh mục.',
    'Đa dạng hoá theo ngành còn thấp: 56% giá trị tập trung vào 3 nhóm đầu.',
  ],
  actions: [
    { tone: 'up' as const, text: 'Nắm giữ FPT, MWG — động lực tăng trưởng chính của danh mục.' },
    { tone: 'gold' as const, text: 'Theo dõi VCB, HPG — tích luỹ khi điều chỉnh về vùng hỗ trợ.' },
    { tone: 'down' as const, text: 'Giảm tỷ trọng HSG, VIC nếu vi phạm ngưỡng cắt lỗ -8%.' },
  ],
}

export const HOLDING_SIGNALS: Record<string, { action: string; reason: string }> = {
  FPT: { action: 'Mua / Bán', reason: 'Động lực tăng trưởng chính, KQKD Q3 tích cực' },
  TCB: { action: 'Mua / Bán', reason: 'Chất lượng tài sản cải thiện, NIM mở rộng' },
  HPG: { action: 'Mua / Bán', reason: 'Sản lượng tiêu thụ tăng, giá HRC phục hồi' },
  MWG: { action: 'Mua / Bán', reason: 'Chuỗi Bách Hoá Xanh đạt điểm hoà vốn' },
  VCB: { action: 'Mua / Bán', reason: 'Nền tảng cơ bản tốt nhất ngành' },
  PNJ: { action: 'Mua / Bán', reason: 'Nhu cầu vàng miếng tăng mạnh' },
  VHM: { action: 'Mua / Bán', reason: 'Bàn giao nhà tại các đại dự án' },
  MSN: { action: 'Mua / Bán', reason: 'Tiêu dùng phục hồi, tái cấu trúc WinCommerce' },
  VIC: { action: 'Mua / Bán', reason: 'Định giá lại hệ sinh thái' },
  HSG: { action: 'Mua / Bán', reason: 'Biên lợi nhuận chịu áp lực từ giá HRC' },
}

/* ---------------- Thông báo ---------------- */

export type Notice = {
  id: number
  title: string
  body: string
  time: string
  tone: 'up' | 'down' | 'gold'
  read: boolean
}

export const NOTICES: Notice[] = [
  { id: 1, title: 'FPT vượt đỉnh 52 tuần', body: 'FPT tăng 2,50% lên 126.500 VND, khối lượng đột biến gấp 1,8× trung bình 20 phiên.', time: '5 phút trước', tone: 'up', read: false },
  { id: 2, title: 'Cảnh báo tỷ trọng ngành', body: 'Nhóm Bất động sản trong danh mục đã vượt ngưỡng khuyến nghị 10%.', time: '32 phút trước', tone: 'gold', read: false },
  { id: 3, title: 'Fed họp chính sách hôm nay', body: 'Thị trường kỳ vọng Fed giữ nguyên lãi suất 5,25–5,50%.', time: '1 giờ trước', tone: 'down', read: false },
  { id: 4, title: 'HSG giảm sàn', body: 'HSG giảm 11,90%, vi phạm ngưỡng cắt lỗ -8% của danh mục.', time: '2 giờ trước', tone: 'down', read: true },
  { id: 5, title: 'Báo cáo danh mục tháng 9 đã sẵn sàng', body: 'Hiệu suất, phân bổ tài sản và khuyến nghị tái cơ cấu.', time: '3 giờ trước', tone: 'gold', read: true },
]

/* ---------------- Thông báo hệ thống ---------------- */

export const NOTIFICATIONS = [
  { id: 1, title: 'MWG công bố hợp tác với Nvidia', body: 'MWG mở rộng chuỗi AI Store, hợp tác chiến lược cùng Nvidia.', time: '2 giờ trước', tone: 'up' as const },
  { id: 2, title: 'Cảnh báo biến động HSG', body: 'HSG giảm sàn, khối lượng đột biến.', time: '4 giờ trước', tone: 'down' as const },
  { id: 3, title: 'Báo cáo tháng 9/2026', body: 'Báo cáo danh mục của bạn đã sẵn sàng.', time: 'Hôm qua', tone: 'gold' as const },
]

/* ---------------- Bảng tin nhắn Copilot ---------------- */

export const AI_QUESTIONS = [
  'Phân tích tác động của việc lãi suất giảm đến nhóm ngành ngân hàng',
  'So sánh định giá FPT, VCB và HPG',
  'Danh mục của tôi đang chịu rủi ro gì?',
  'Gợi ý các cổ phiếu hưởng lợi từ đầu tư công',
  'Đánh giá tác động của Fed đến thị trường Việt Nam',
  'Xây dựng kịch bản cho ngành ngân hàng năm 2026',
  'Tóm tắt báo cáo vĩ mô mới nhất',
  'Gợi ý danh mục phòng thủ',
]

export const COPILOT_MODES = ['Phân tích', 'So sánh', 'Tóm tắt', 'Ý tưởng', 'Xây dựng Thesis']

/* ---------------- Sinh chuỗi cho bảng hiệu suất ---------------- */

export function holdingSpark(seed: string, positive: boolean): number[] {
  const r = rng(`${seed}-spark`)
  const out: number[] = []
  let v = 50
  const drift = positive ? 0.9 : -0.7
  for (let i = 0; i < 26; i++) {
    v = v + drift + (r() - 0.5) * 4.2
    out.push(v)
  }
  return out
}