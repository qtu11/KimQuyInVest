import { KimQuyApp } from '@/components/KimQuyApp'

export default function StockDetailPage({
  params,
}: {
  params: { symbol: string }
}) {
  const sym = params?.symbol ? params.symbol.toUpperCase() : 'FPT'
  return <KimQuyApp initialPage="stock" initialSymbol={sym} />
}
