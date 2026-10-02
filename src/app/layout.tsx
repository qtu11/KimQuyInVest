import type { Metadata, Viewport } from 'next'
import '../styles/tokens.css'
import '../styles/components.css'

export const metadata: Metadata = {
  title: 'KIMQUY Invest — Intelligence for a Greater Tomorrow',
  description: 'Nền tảng phân tích & đầu tư chứng khoán Việt Nam cao cấp. Dữ liệu chuẩn xác, phân tích chuyên sâu, AI Copilot đồng hành kiến tạo thịnh vượng bền vững.',
  keywords: ['KIMQUY Invest', 'chứng khoán Việt Nam', 'VN-INDEX', 'AI Copilot', 'phân tích kỹ thuật', 'quản trị rủi ro', 'đầu tư chứng khoán'],
  authors: [{ name: 'KIMQUY Invest Team' }],
  icons: {
    icon: '/asset/logo-remove-background.png',
    apple: '/asset/logo-circle.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#0a0d10',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@500;600;700;800;900&family=Playfair+Display:ital,wght@0,500;0,600;0,700;0,800;1,400;1,600&family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400;1,600&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body suppressHydrationWarning>
        {children}
      </body>
    </html>
  )
}
