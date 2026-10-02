/* ==========================================================================
   DỮ LIỆU THỊ TRƯỜNG
   Bộ sinh dữ liệu tất định (deterministic) — cùng đầu vào luôn cho cùng kết quả
   ========================================================================== */

import { seededSeries } from '../components/charts/helpers'

/* -------------------------------------------------------------------------- */
/* Sinh số giả ngẫu nhiên có hạt giống                                        */
/* -------------------------------------------------------------------------- */

export function hash(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export function rng(seed: string | number) {
  let s = typeof seed === 'string' ? hash(seed) : seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 4294967296
  }
}

/** Chuỗi giá có xu hướng + nhiễu, ổn định theo hạt giống */
export function series(seed: string, count: number, start: number, end: number, vol = 0.012) {
  const r = rng(seed)
  const out: number[] = []
  let v = start
  const drift = (end - start) / count
  for (let i = 0; i < count; i++) {
    const shock = (r() - 0.5) * 2 * vol * start
    v = v + drift + shock
    out.push(v)
  }
  out[out.length - 1] = end
  // làm mượt nhẹ để đường không bị răng cưa
  return out.map((x, i) => (i === 0 || i === out.length - 1 ? x : x * 0.7 + ((out[i - 1] + (out[i + 1] ?? x)) / 2) * 0.3))
}

/* -------------------------------------------------------------------------- */
/* Chỉ số thị trường                                                          */
/* -------------------------------------------------------------------------- */

export type MarketIndex = {
  code: string
  name: string
  value: number
  change: number
  changePct: number
  open: number
  high: number
  low: number
  ref: number
  volume: number
  turnover: number
  seed: string
}

export const INDICES: MarketIndex[] = [
  {
    code: 'VN-INDEX',
    name: 'Chỉ số VN-Index',
    value: 1245.32,
    change: 10.24,
    changePct: 0.83,
    open: 1238.41,
    high: 1247.18,
    low: 1232.05,
    ref: 1235.08,
    volume: 812_400_000,
    turnover: 18532,
    seed: 'vnindex',
  },
  {
    code: 'VN30',
    name: 'Chỉ số VN30',
    value: 1320.15,
    change: 12.58,
    changePct: 0.96,
    open: 1309.4,
    high: 1322.8,
    low: 1306.2,
    ref: 1307.57,
    volume: 288_600_000,
    turnover: 9240,
    seed: 'vn30',
  },
  {
    code: 'HNX-INDEX',
    name: 'Chỉ số HNX-Index',
    value: 227.14,
    change: 1.32,
    changePct: 0.58,
    open: 226.1,
    high: 227.9,
    low: 225.4,
    ref: 225.82,
    volume: 96_200_000,
    turnover: 1984,
    seed: 'hnx',
  },
  {
    code: 'UPCOM',
    name: 'Chỉ số UPCoM',
    value: 92.38,
    change: 0.21,
    changePct: 0.23,
    open: 92.2,
    high: 92.6,
    low: 91.9,
    ref: 92.17,
    volume: 78_400_000,
    turnover: 892,
    seed: 'upcom',
  },
  {
    code: 'VNALLSHARE',
    name: 'Chỉ số VNAllShare',
    value: 1318.76,
    change: 9.3,
    changePct: 0.71,
    open: 1310.2,
    high: 1320.4,
    low: 1308.1,
    ref: 1309.46,
    volume: 986_300_000,
    turnover: 21408,
    seed: 'vnall',
  },
]

export const MAIN_INDEX = INDICES[0]

/** Nhãn giờ giao dịch 09:00 → 15:00 */
export const INTRADAY_LABELS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00',
]

export function intraday(seed: string, changePct: number, ref: number, points = 45): number[] {
  const end = ref * (1 + changePct / 100)
  const start = ref * (1 - changePct / 100 * 0.35)
  const base = series(`${seed}-intra`, points, start, end, 0.0016)
  return base
}

export function intradayVolume(seed: string, points = 45): number[] {
  const r = rng(`${seed}-vol`)
  // Khối lượng tăng dần về cuối phiên (đặc trưng ATC)
  return Array.from({ length: points }, (_, i) => {
    const u = i / (points - 1)
    const shape = u > 0.82 ? 2.4 : u < 0.12 ? 1.5 : 1
    return (0.35 + r() * 0.9) * shape * 100 + u * 60
  })
}

/* -------------------------------------------------------------------------- */
/* Ngành                                                                      */
/* -------------------------------------------------------------------------- */

export type Sector = {
  name: string
  pct: number
  turnover: number
  net: number
  stocks: number
}

/** 18 ngành — bản đồ nhiệt & bảng hiệu suất ngành */
export const SECTORS: Sector[] = [
  { name: 'Ngân hàng', pct: 2.41, turnover: 4320, net: 520, stocks: 27 },
  { name: 'Chứng khoán', pct: 1.85, turnover: 3210, net: 412, stocks: 38 },
  { name: 'Bất động sản', pct: 1.12, turnover: 2845, net: 230, stocks: 92 },
  { name: 'Thép', pct: -0.62, turnover: 1980, net: -86, stocks: 24 },
  { name: 'Công nghệ', pct: 1.98, turnover: 1760, net: 180, stocks: 31 },
  { name: 'Bán lẻ', pct: 1.21, turnover: 1540, net: 126, stocks: 19 },
  { name: 'Hàng tiêu dùng', pct: -0.34, turnover: 1320, net: -52, stocks: 46 },
  { name: 'Dầu khí', pct: 0.76, turnover: 1128, net: 95, stocks: 22 },
  { name: 'Hóa chất', pct: 0.58, turnover: 980, net: 72, stocks: 28 },
  { name: 'Điện nước', pct: 0.92, turnover: 860, net: 68, stocks: 33 },
  { name: 'Vận tải', pct: 1.45, turnover: 820, net: 61, stocks: 41 },
  { name: 'Xây dựng', pct: -0.18, turnover: 640, net: -28, stocks: 57 },
  { name: 'Bảo hiểm', pct: 1.03, turnover: 610, net: 48, stocks: 12 },
  { name: 'Nông nghiệp', pct: 0.21, turnover: 420, net: 12, stocks: 26 },
  { name: 'Y tế', pct: 0.36, turnover: 380, net: 14, stocks: 18 },
  { name: 'Dịch vụ tài chính', pct: 0.67, turnover: 340, net: -18, stocks: 15 },
  { name: 'Tài nguyên', pct: 0.28, turnover: 290, net: -24, stocks: 21 },
  { name: 'Khác', pct: -0.12, turnover: 407, net: -6, stocks: 68 },
]

/** Sắc độ bản đồ nhiệt */
export function heatLevel(pct: number): string {
  if (pct >= 2) return 'heat-4'
  if (pct >= 1.2) return 'heat-3'
  if (pct >= 0.5) return 'heat-2'
  if (pct > 0) return 'heat-1'
  if (pct === 0) return 'heat-0'
  if (pct > -0.5) return 'heat-n1'
  if (pct > -1.2) return 'heat-n2'
  if (pct > -2) return 'heat-n3'
  return 'heat-n4'
}

/* -------------------------------------------------------------------------- */
/* Cổ phiếu                                                                   */
/* -------------------------------------------------------------------------- */

export type Stock = {
  symbol: string
  name: string
  sector: string
  exchange: 'HOSE' | 'HNX' | 'UPCOM'
  price: number
  change: number
  changePct: number
  ref: number
  open: number
  high: number
  low: number
  volume: number
  marketCap: number
  pe: number
  pb: number
  roe: number
  epsGrowth: number
  de: number
  dividendYield: number
  foreignNet: number
}

const S = (
  symbol: string,
  name: string,
  sector: string,
  exchange: Stock['exchange'],
  price: number,
  changePct: number,
  marketCap: number,
  pe: number,
  pb: number,
  roe: number,
  epsGrowth: number,
  de: number,
  dividendYield: number,
  volumeM: number,
  foreignNet: number,
  chg?: number,
): Stock => {
  const r = rng(symbol)
  const ref = chg !== undefined ? price - chg : price / (1 + changePct / 100)
  const change = price - ref
  const open = ref * (1 + (r() - 0.45) * 0.004)
  const high = Math.max(price, open) * (1 + r() * 0.006)
  const low = Math.min(price, open) * (1 - r() * 0.006)
  return {
    symbol,
    name,
    sector,
    exchange,
    price,
    change: Number(change.toFixed(2)),
    changePct,
    ref: Number(ref.toFixed(2)),
    open: Number(open.toFixed(2)),
    high: Number(high.toFixed(2)),
    low: Number(low.toFixed(2)),
    volume: Math.round(volumeM * 1_000_000),
    marketCap,
    pe,
    pb,
    roe,
    epsGrowth,
    de,
    dividendYield,
    foreignNet,
  }
}

export const STOCKS: Stock[] = [
  S('FPT', 'FPT Corporation', 'Công nghệ', 'HOSE', 126_500, 2.5, 1253000, 22.1, 5.2, 26.8, 20.4, 0.42, 1.8, 12.4, 186),
  S('TCB', 'Techcombank', 'Ngân hàng', 'HOSE', 34_200, 1.79, 982000, 9.8, 1.4, 24.1, 16.3, 1.1, 3.2, 32.1, 142),
  S('HPG', 'Hòa Phát', 'Thép', 'HOSE', 28_650, 1.21, 1102000, 15.4, 1.6, 18.9, 25.1, 0.68, 2.4, 28.6, -96),
  S('MWG', 'Thế Giới Di Động', 'Bán lẻ', 'HOSE', 62_100, 3.16, 864000, 15.4, 3.1, 21.2, 17.2, 0.74, 1.2, 14.2, 88),
  S('VCB', 'Vietcombank', 'Ngân hàng', 'HOSE', 88_300, -0.34, 756000, 14.7, 2.8, 18.5, 12.5, 1.3, 2.1, 6.8, 124),
  S('PNJ', 'Phú Nhuận Jewelry', 'Bán lẻ', 'HOSE', 101_200, 2.43, 420000, 16.8, 3.4, 17.6, 17.9, 0.52, 2.8, 4.1, 42),
  S('VHM', 'Vinhomes', 'Bất động sản', 'HOSE', 56_200, -3.94, 1340000, 10.3, 1.7, 16.4, 14.0, 1.8, 0.0, 8.1, -212, -2300),
  S('MSN', 'Masan Group', 'Hàng tiêu dùng', 'HOSE', 72_300, -2.56, 689000, 18.2, 2.9, 16.1, 14.2, 1.9, 0.9, 4.5, 36),
  S('VIC', 'Vingroup', 'Bất động sản', 'HOSE', 110_500, -2.82, 612000, 13.6, 2.3, 15.8, 19.8, 2.1, 0.0, 6.3, -188, -3200),
  S('HSG', 'Hoa Sen Group', 'Thép', 'HOSE', 18_500, -1.05, 176000, 11.9, 1.6, 15.7, 23.1, 0.61, 3.4, 3.8, -34),
  S('DGC', 'Đức Giang Hóa Chất', 'Hóa chất', 'HOSE', 112_000, -1.35, 512000, 13.6, 2.3, 15.8, 19.8, 0.34, 3.1, 2.6, -18),
  S('KDH', 'Khang Điền', 'Bất động sản', 'HOSE', 33_150, 1.84, 398000, 11.9, 1.6, 15.7, 23.1, 0.88, 1.4, 3.4, 22),
  S('HVN', 'Vietnam Airlines', 'Vận tải', 'HOSE', 28_600, 6.91, 186000, 8.4, 2.1, 12.4, 34.2, 2.6, 0.0, 12.4, 64),
  S('VIX', 'VIX Securities', 'Chứng khoán', 'HOSE', 16_250, 6.91, 214000, 9.1, 1.4, 15.9, 26.8, 0.94, 1.2, 32.1, 96),
  S('HAG', 'Hoàng Anh Gia Lai', 'Nông nghiệp', 'HOSE', 12_300, 6.5, 128000, 7.8, 1.1, 14.2, 28.4, 1.2, 0.0, 18.7, 48),
  S('DXG', 'Đất Xanh Group', 'Bất động sản', 'HOSE', 20_150, 6.33, 176000, 12.8, 1.2, 10.4, 21.4, 1.4, 0.8, 21.4, 72),
  S('PVD', 'Petrovietnam Drilling', 'Dầu khí', 'HOSE', 28_100, 6.24, 148000, 14.2, 1.1, 9.6, 24.6, 0.72, 1.1, 10.2, 38),
  S('VRE', 'Vincom Retail', 'Bất động sản', 'HOSE', 29_100, -2.35, 662000, 12.4, 1.5, 13.2, 13.4, 0.44, 1.6, 7.4, -64),
  S('NVL', 'Novaland', 'Bất động sản', 'HOSE', 14_250, -2.06, 278000, 0, 0.9, 3.2, 0, 2.8, 0.0, 9.6, -42),
  S('PVS', 'Petrovietnam Services', 'Dầu khí', 'HOSE', 34_800, 2.1, 166000, 13.1, 1.3, 11.8, 18.2, 0.66, 1.4, 5.8, 28),
  S('GAS', 'PetroVietnam Gas', 'Dầu khí', 'HOSE', 68_400, 1.5, 1310000, 16.4, 2.7, 17.2, 8.4, 0.51, 2.9, 2.4, 84),
  S('VN2', 'Quỹ VN2', 'Khác', 'HOSE', 31_900, 1.2, 42000, 0, 0, 0, 0, 0, 0, 1.2, 6),
  S('VCG', 'Vinaconex', 'Xây dựng', 'HOSE', 22_400, 1.9, 132000, 14.8, 1.4, 10.2, 16.8, 1.1, 1.2, 6.4, 24),
  S('HHV', 'Đèo Cả', 'Xây dựng', 'HOSE', 13_600, 1.6, 98000, 15.2, 1.2, 9.4, 15.2, 1.3, 0.0, 5.2, 16),
  S('C4G', 'CIENCO4', 'Xây dựng', 'HNX', 11_800, 1.4, 46000, 13.6, 1.1, 8.8, 14.6, 1.6, 0.0, 2.8, 8),
  S('MBB', 'Military Bank', 'Ngân hàng', 'HOSE', 26_400, 1.3, 412000, 7.2, 1.2, 22.4, 18.6, 1.2, 3.8, 18.2, 92),
  S('ACV', 'Airports Corporation', 'Vận tải', 'UPCOM', 108_000, -0.8, 486000, 18.4, 4.2, 21.6, 12.4, 0.62, 1.4, 1.4, -22),
  S('BSR', 'Bình Sơn Refinery', 'Dầu khí', 'UPCOM', 21_400, 1.2, 128000, 11.2, 1.4, 14.8, 22.4, 0.58, 2.2, 4.6, 32),
  S('FRT', 'FPT Retail', 'Bán lẻ', 'HOSE', 168_000, -1.2, 168000, 24.6, 5.4, 19.2, 28.4, 1.4, 0.6, 1.8, 18),
  S('DGW', 'Digiworld', 'Bán lẻ', 'HOSE', 42_600, 0.8, 96000, 14.8, 2.6, 18.4, 16.2, 0.9, 1.8, 2.4, 12),
  S('SAB', 'Sabeco', 'Hàng tiêu dùng', 'HOSE', 58_200, -0.6, 748000, 16.8, 3.2, 19.4, 6.2, 0.24, 3.6, 1.6, -28),
  S('BID', 'BIDV', 'Ngân hàng', 'HOSE', 48_600, 1.1, 682000, 10.4, 1.8, 19.2, 14.2, 1.4, 1.8, 8.4, 116),
  S('VND', 'VNDirect', 'Chứng khoán', 'HOSE', 14_800, 2.8, 92000, 12.6, 1.5, 13.8, 24.2, 0.66, 1.6, 14.6, 42),
  S('SSI', 'SSI Securities', 'Chứng khoán', 'HOSE', 32_400, 2.2, 318000, 14.2, 1.9, 15.4, 22.8, 0.72, 1.8, 16.8, 78),
  S('VCI', 'Vietcap', 'Chứng khoán', 'HOSE', 38_600, 1.8, 124000, 15.8, 2.1, 14.6, 20.4, 0.84, 1.2, 4.2, 26),
  S('STB', 'Sacombank', 'Ngân hàng', 'HOSE', 36_800, 1.4, 348000, 8.4, 1.3, 21.2, 15.8, 1.1, 0.0, 12.8, 68),
  S('HDB', 'HDBank', 'Ngân hàng', 'HOSE', 24_600, 1.2, 286000, 6.8, 1.2, 23.4, 19.4, 1.3, 4.2, 9.6, 54),
  S('VPB', 'VPBank', 'Ngân hàng', 'HOSE', 19_400, 1.6, 486000, 8.2, 1.1, 18.6, 21.2, 1.5, 0.0, 14.2, 62),
  S('ACB', 'Asia Commercial Bank', 'Ngân hàng', 'HOSE', 26_800, 1.0, 396000, 7.4, 1.4, 22.8, 14.6, 0.9, 3.4, 8.2, 46),
  S('CTG', 'VietinBank', 'Ngân hàng', 'HOSE', 42_200, 0.9, 726000, 9.6, 1.6, 18.4, 13.2, 1.2, 2.4, 7.6, 88),
  S('TPB', 'TPBank', 'Ngân hàng', 'HOSE', 18_200, 1.8, 128000, 7.8, 1.2, 20.4, 22.6, 1.4, 0.0, 6.4, 32),
  S('PLX', 'Petrolimex', 'Dầu khí', 'HOSE', 42_800, 0.6, 218000, 13.4, 1.8, 13.8, 11.2, 0.94, 3.2, 2.2, -12),
  S('POW', 'PV Power', 'Điện nước', 'HOSE', 12_600, 0.8, 118000, 12.8, 1.1, 9.4, 14.8, 0.72, 2.6, 4.8, 18),
  S('REE', 'Cơ Điện Lạnh', 'Công nghiệp', 'HOSE', 68_400, 1.4, 132000, 15.6, 2.2, 15.2, 17.4, 0.68, 2.1, 1.8, 22),
  S('PC1', 'Xây lắp điện 1', 'Xây dựng', 'HOSE', 28_600, 1.2, 68000, 14.2, 1.4, 11.6, 16.2, 1.1, 1.4, 3.2, 14),
  S('GVR', 'Cao su Việt Nam', 'Nông nghiệp', 'HOSE', 34_200, 0.4, 486000, 22.4, 3.1, 14.6, 12.8, 0.42, 1.2, 2.4, -18),
  S('VNM', 'Vinamilk', 'Hàng tiêu dùng', 'HOSE', 68_600, -0.2, 748000, 17.2, 4.6, 28.4, 5.4, 0.18, 5.8, 3.2, -24),
  S('SBT', 'Bourbon Tây Ninh', 'Nông nghiệp', 'HOSE', 15_800, 0.6, 78000, 12.4, 1.2, 11.2, 15.4, 0.86, 3.4, 2.8, 8),
  S('DPM', 'Đạm Phú Mỹ', 'Hóa chất', 'HOSE', 36_400, 0.9, 92000, 14.6, 1.6, 12.8, 13.6, 0.44, 4.2, 3.4, 12),
  S('DCM', 'Đạm Cà Mau', 'Hóa chất', 'HOSE', 34_800, 1.1, 118000, 12.8, 1.8, 16.4, 14.2, 0.38, 4.6, 4.2, 18),
  S('BMP', 'Nhựa Bình Minh', 'Hóa chất', 'HOSE', 118_000, 0.4, 62000, 14.2, 3.4, 25.6, 8.4, 0.24, 6.4, 0.8, 4),
  S('NTP', 'Nhựa Tiền Phong', 'Hóa chất', 'HNX', 62_400, 0.6, 48000, 13.8, 2.8, 22.4, 9.2, 0.32, 5.2, 0.6, 6),
  S('HT1', 'Hà Tiên', 'Vật liệu', 'HOSE', 12_400, 0.2, 42000, 18.6, 1.4, 8.2, 11.4, 1.2, 2.2, 1.4, -8),
  S('VGC', 'Viglacera', 'Vật liệu', 'HOSE', 48_600, 0.8, 96000, 15.4, 2.4, 16.8, 14.6, 0.72, 2.8, 1.2, 10),
  S('IDC', 'Idico', 'Bất động sản', 'HNX', 52_400, 1.4, 68000, 12.6, 2.8, 24.2, 16.8, 0.84, 3.4, 1.6, 14),
  S('SZC', 'Sonadezi Châu Đức', 'Bất động sản', 'HOSE', 38_200, 1.2, 48000, 18.4, 2.6, 15.4, 15.2, 0.66, 1.8, 1.2, 8),
  S('KBC', 'Kinh Bắc', 'Bất động sản', 'HOSE', 28_400, 1.6, 112000, 16.2, 1.4, 9.8, 18.4, 1.1, 2.2, 4.6, 20),
  S('BCM', 'Becamex', 'Bất động sản', 'HOSE', 68_200, 0.6, 286000, 22.4, 3.4, 16.2, 12.4, 0.94, 1.6, 1.2, -14),
  S('BVH', 'Bảo Việt', 'Bảo hiểm', 'HOSE', 54_600, 1.2, 168000, 14.8, 2.2, 15.6, 13.2, 0.42, 2.4, 1.4, 16),
  S('PVI', 'PVI Holdings', 'Bảo hiểm', 'HNX', 48_200, 0.8, 48000, 12.4, 1.8, 16.4, 11.8, 0.38, 4.2, 0.4, 6),
  S('BMI', 'Bảo Minh', 'Bảo hiểm', 'HOSE', 24_600, 1.0, 22000, 11.8, 1.6, 14.2, 12.6, 0.44, 3.8, 0.3, 4),
  S('MIG', 'Bảo hiểm Quân đội', 'Bảo hiểm', 'HOSE', 18_400, 1.4, 26000, 13.6, 2.1, 16.8, 18.4, 0.52, 1.2, 0.8, 5),
  S('VJC', 'Vietjet Air', 'Vận tải', 'HOSE', 108_000, 0.8, 286000, 24.6, 3.4, 15.2, 22.8, 1.8, 0.0, 1.8, 24),
  S('GMD', 'Gemadept', 'Vận tải', 'HOSE', 68_400, 0.6, 96000, 16.8, 2.4, 15.4, 14.6, 0.62, 2.2, 1.2, 12),
  S('HAH', 'Hải An', 'Vận tải', 'HOSE', 42_600, 1.4, 48000, 9.8, 1.8, 20.4, 18.2, 1.1, 2.4, 2.4, 18),
  S('PVT', 'PV Trans', 'Vận tải', 'HOSE', 28_400, 1.2, 92000, 10.4, 1.4, 15.8, 16.4, 0.84, 2.8, 3.6, 22),
  S('SCS', 'Cảng hàng không Sài Gòn', 'Vận tải', 'UPCOM', 68_200, 0.4, 96000, 14.6, 4.8, 34.2, 12.4, 0.24, 4.4, 0.6, 8),
  S('CMG', 'CMC Corporation', 'Công nghệ', 'HOSE', 42_800, 2.4, 48000, 18.4, 3.2, 18.6, 22.4, 0.72, 1.2, 2.2, 14),
  S('CTR', 'Viettel Construction', 'Công nghệ', 'HOSE', 98_000, 2.1, 68000, 16.2, 4.6, 26.4, 18.2, 0.68, 1.6, 1.4, 18),
  S('VTP', 'Viettel Post', 'Vận tải', 'HOSE', 82_400, 1.8, 62000, 17.4, 3.8, 22.4, 24.6, 0.74, 1.4, 1.2, 12),
  S('VGI', 'Viettel Global', 'Viễn thông', 'UPCOM', 42_600, 2.2, 186000, 14.6, 2.8, 18.4, 26.8, 0.42, 0.8, 2.4, 26),
  S('FOX', 'FPT Telecom', 'Viễn thông', 'HNX', 78_400, 1.6, 42000, 13.8, 3.2, 24.6, 16.4, 0.86, 2.4, 0.8, 10),
  S('ELC', 'Elcom', 'Công nghệ', 'HOSE', 24_600, 2.8, 18000, 20.4, 2.4, 12.4, 28.4, 0.52, 1.0, 1.6, 8),
  S('TNG', 'TNG Investment', 'Dệt may', 'HNX', 24_800, 1.4, 14000, 11.2, 1.4, 14.8, 18.6, 1.2, 3.2, 2.8, 12),
  S('MSH', 'May Sông Hồng', 'Dệt may', 'HOSE', 48_600, 1.2, 16000, 12.6, 1.8, 15.4, 16.2, 0.94, 3.4, 1.2, 6),
]

export const stockBySymbol = (s: string): Stock | undefined =>
  STOCKS.find((x) => x.symbol === s.toUpperCase())

/* ---------------- Bảng xếp hạng ---------------- */

export const GAINERS = [...STOCKS].sort((a, b) => b.changePct - a.changePct).slice(0, 5)
export const LOSERS = [...STOCKS].sort((a, b) => a.changePct - b.changePct).slice(0, 5)
export const ACTIVE = [...STOCKS].sort((a, b) => b.volume - a.volume).slice(0, 10)

/* ---------------- Độ rộng thị trường ---------------- */

export const BREADTH = {
  up: 248,
  down: 121,
  flat: 57,
  total: 426,
  upPct: 58.2,
  downPct: 28.4,
  flatPct: 13.4,
}

export const LIQUIDITY = {
  turnover: 18532,
  turnoverPct: 18.4,
  volume: 812_400_000,
  volumePct: 15.2,
  avg20: 16203,
  matched: 16820,
  matchedPct: 14.1,
  putThrough: 1712,
  putThroughPct: -3.2,
  netFlow: 842,
}

export const FOREIGN = {
  buy: 2846,
  sell: 2171,
  net: 675,
  series: [420, 380, 610, 240, 520, 680, 450, 720, 510, 640, 380, 690, 540, 760, 620, 480, 700, 590, 660, 720],
}

export const PROP = {
  buy: 1124,
  sell: 980,
  net: 144,
  series: [120, -80, 240, 160, -40, 320, 180, -60, 260, 200, -120, 340, 220, 140, -80, 280, 160, 240, 180, 200],
}

/* ---------------- Chỉ số thế giới & hàng hoá ---------------- */

export const WORLD = [
  { name: 'S&P 500', value: 6693.12, changePct: 0.45, flag: '🇺🇸' },
  { name: 'NASDAQ', value: 22482.71, changePct: 0.62, flag: '🇺🇸' },
  { name: 'DOW JONES', value: 46381.54, changePct: 0.38, flag: '🇺🇸' },
  { name: 'Nikkei 225', value: 45493.66, changePct: 1.12, flag: '🇯🇵' },
  { name: 'Shanghai', value: 3089.26, changePct: -0.21, flag: '🇨🇳' },
  { name: 'Hang Seng', value: 26418.4, changePct: 0.88, flag: '🇭🇰' },
  { name: 'DAX', value: 24286.1, changePct: 0.34, flag: '🇩🇪' },
  { name: 'FTSE 100', value: 8421.6, changePct: -0.12, flag: '🇬🇧' },
]

export const COMMODITIES = [
  { name: 'Dầu Brent', value: 92.15, unit: 'USD/thùng', changePct: 3.2 },
  { name: 'Dầu WTI', value: 88.42, unit: 'USD/thùng', changePct: 3.0 },
  { name: 'Vàng', value: 2684.3, unit: 'USD/oz', changePct: -0.1 },
  { name: 'Thép HRC', value: 542, unit: 'USD/tấn', changePct: 0.8 },
  { name: 'Quặng sắt', value: 108.4, unit: 'USD/tấn', changePct: -0.6 },
  { name: 'Cà phê Robusta', value: 4628, unit: 'USD/tấn', changePct: 1.4 },
]

export const CURRENCIES = [
  { name: 'USD/VND', value: 24620, changePct: 0.12 },
  { name: 'EUR/VND', value: 26804, changePct: -0.08 },
  { name: 'JPY/VND', value: 163.4, changePct: 0.22 },
  { name: 'CNY/VND', value: 3412, changePct: -0.04 },
  { name: 'DXY', value: 98.42, changePct: 0.18 },
]

/* ---------------- Tin tức thị trường cho thanh chạy ---------------- */

export const TICKER_ITEMS = [
  { name: 'VN-INDEX', value: '1,245.32', pct: 0.83 },
  { name: 'VN30', value: '1,320.15', pct: 0.96 },
  { name: 'HNX', value: '227.14', pct: 0.58 },
  { name: 'UPCOM', value: '92.38', pct: 0.23 },
  { name: 'Dầu Brent', value: '92.15', pct: 3.2 },
  { name: 'Vàng', value: '2,684.30', pct: -0.1 },
  { name: 'USD/VND', value: '24,620', pct: 0.12 },
  { name: 'S&P 500', value: '6,693.12', pct: 0.45 },
  { name: 'NASDAQ', value: '22,482.71', pct: 0.62 },
  { name: 'Nikkei 225', value: '45,493.66', pct: 1.12 },
]

/* ---------------- Hồ sơ chỉ số theo khung thời gian ---------------- */

export type RangeKey = '1M' | '3M' | '6M' | 'YTD' | '1Y' | '3Y' | 'ALL'
export const RANGES: RangeKey[] = ['1M', '3M', '6M', 'YTD', '1Y', '3Y', 'ALL']

const RANGE_POINTS: Record<RangeKey, number> = {
  '1M': 22, '3M': 66, '6M': 128, YTD: 190, '1Y': 252, '3Y': 756, ALL: 1200,
}

const RANGE_RETURN: Record<RangeKey, number> = {
  '1M': 2.6, '3M': 6.4, '6M': 9.8, YTD: 8.3, '1Y': 14.6, '3Y': 32.4, ALL: 68.2,
}

export const RANGE_LABELS: Record<RangeKey, string[]> = {} as Record<RangeKey, string[]>

/** Nhãn trục thời gian cho từng khung */
export function rangeLabels(range: RangeKey): string[] {
  const n = RANGE_POINTS[range]
  const out: string[] = []
  const now = new Date(2026, 8, 22)
  const spanDays = range === '1M' ? 30 : range === '3M' ? 90 : range === '6M' ? 182 : range === 'YTD' ? 265 : range === '1Y' ? 365 : range === '3Y' ? 1095 : 1825
  for (let i = 0; i < n; i++) {
    const d = new Date(now.getTime() - (spanDays * (n - 1 - i)) / (n - 1) * 86400000)
    out.push(
      range === '1M' || range === '3M'
        ? `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`
        : `${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`,
    )
  }
  return out
}

/** Chuỗi hiệu suất chuẩn hoá (%) */
export function performanceSeries(seed: string, range: RangeKey, endPct?: number): number[] {
  const n = RANGE_POINTS[range]
  const end = endPct ?? RANGE_RETURN[range]
  const r = rng(`${seed}-${range}`)
  const out: number[] = []
  let v = -(end * 0.35)
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1)
    const target = end * (t * t * 0.55 + t * 0.45)
    v = v + (target - v) * 0.16 + (r() - 0.5) * Math.abs(end) * 0.05
    out.push(Number(v.toFixed(2)))
  }
  out[out.length - 1] = end
  return out
}

/* ---------------- Bản đồ nhiệt chỉ số theo nhóm vốn hoá ---------------- */

export const CAP_GROUPS = [
  { name: 'VN30', value: 1320.15, changePct: 0.96, turnover: 9240 },
  { name: 'Midcap', value: 1842.6, changePct: 1.42, turnover: 6840 },
  { name: 'Smallcap', value: 1284.3, changePct: -0.35, turnover: 2452 },
]

/* ---------------- Lịch sự kiện ---------------- */

export type MarketEvent = {
  day: number
  month: string
  time: string
  title: string
  source: string
  impact: 'Cao' | 'Trung bình' | 'Thấp'
  tone: 'up' | 'down' | 'flat'
}

export const EVENTS: MarketEvent[] = [
  { day: 22, month: 'Thg 9', time: '23:00', title: 'Bài phát biểu của Chủ tịch Fed (Jerome Powell)', source: 'Vĩ mô', impact: 'Cao', tone: 'down' },
  { day: 23, month: 'Thg 9', time: '14:00', title: 'Công bố PMI Việt Nam (tháng 9)', source: 'Vĩ mô', impact: 'Trung bình', tone: 'flat' },
  { day: 24, month: 'Thg 9', time: '09:00', title: 'ĐHCĐ bất thường – HPG', source: 'Doanh nghiệp', impact: 'Cao', tone: 'up' },
  { day: 25, month: 'Thg 9', time: '19:30', title: 'GDP Mỹ (Q3/2026)', source: 'Vĩ mô', impact: 'Cao', tone: 'down' },
  { day: 26, month: 'Thg 9', time: '09:00', title: 'Đáo hạn phái sinh VN30', source: 'Thị trường', impact: 'Trung bình', tone: 'flat' },
  { day: 29, month: 'Thg 9', time: '08:00', title: 'Công bố PMI Việt Nam tháng 9', source: 'Vĩ mô', impact: 'Trung bình', tone: 'flat' },
  { day: 30, month: 'Thg 9', time: '20:30', title: 'Tồn kho dầu thô Mỹ (EIA)', source: 'Hàng hoá', impact: 'Thấp', tone: 'flat' },
]

/* ---------------- Diễn biến phiên (cho lịch sử) ---------------- */

export const SESSIONS = [
  { date: '22/09/2026', vn: 0.83, hnx: 0.58, upcom: 0.23, turnover: 18532 },
  { date: '19/09/2026', vn: 0.42, hnx: 0.31, upcom: 0.15, turnover: 16204 },
  { date: '18/09/2026', vn: -0.36, hnx: -0.22, upcom: 0.08, turnover: 15118 },
  { date: '17/09/2026', vn: 1.12, hnx: 0.84, upcom: 0.42, turnover: 17840 },
  { date: '16/09/2026', vn: 0.24, hnx: -0.12, upcom: 0.05, turnover: 14206 },
  { date: '15/09/2026', vn: -0.58, hnx: -0.44, upcom: -0.18, turnover: 13642 },
  { date: '12/09/2026', vn: 0.68, hnx: 0.52, upcom: 0.24, turnover: 15980 },
  { date: '11/09/2026', vn: 0.35, hnx: 0.18, upcom: 0.11, turnover: 14760 },
]

export { seededSeries }