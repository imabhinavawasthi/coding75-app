import { Toaster } from '@/components/ui/sonner';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import TopLoader from '@/components/top-loader';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://coding75.com'),
  title: 'coding75 | Powered by crackDSA',
  description: 'Coding DSA MERN Projects Interview Preparation: Free Resources for College Students',
  keywords: [
    'Coding',
    'DSA',
    'Competitive Programming',
    'CP',
    'Interviews',
    'coding75',
    'crackDSA',
    'learn coding',
    'coding 75',
    'coding75.com',
    'crackdsa',
  ],
  openGraph: {
    images: ['/og.png'],
  },
  other: {
    'google-adsense-account': 'ca-pub-5737188174207597',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className='scroll-smooth' lang="en">
      <body className={inter.className + " no-scrollbar"}>
        <TopLoader />
        {children}
        <Toaster theme='light' richColors closeButton position="top-right" />
      </body>
    </html>
  )
}
