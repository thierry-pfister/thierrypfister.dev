import type { Metadata } from 'next'
import { Nunito, Caveat, DM_Sans, Space_Mono } from 'next/font/google'
import './globals.css'

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['900'],
  variable: '--font-display',
  display: 'swap',
})

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['600', '700'],
  variable: '--font-hand',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Thierry Pfister — PFSTR_',
  description: 'Dev · designer · builder · Switzerland. Build. Deploy. Repeat.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${nunito.variable} ${caveat.variable} ${dmSans.variable} ${spaceMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
