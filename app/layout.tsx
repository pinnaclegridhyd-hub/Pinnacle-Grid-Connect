import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Pinnacle Grid Connect - Smart Digital Visiting Cards',
  description: 'Create, share, and manage smart digital visiting cards with Pinnacle Grid Connect.',
  generator: 'v0.app',
  openGraph: {
    title: 'Pinnacle Grid Connect - Smart Digital Visiting Cards',
    description: 'Create, share, and manage smart digital visiting cards with Pinnacle Grid Connect.',
    siteName: 'Pinnacle Grid Connect',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pinnacle Grid Connect - Smart Digital Visiting Cards',
    description: 'Create, share, and manage smart digital visiting cards with Pinnacle Grid Connect.',
  },
  icons: {
    icon: '/pgc-logo.png',
    apple: '/pgc-logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased bg-background">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          {process.env.NODE_ENV === 'production' && <Analytics />}
        </ThemeProvider>
      </body>
    </html>
  )
}
