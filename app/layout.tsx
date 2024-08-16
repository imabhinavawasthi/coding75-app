import { Toaster } from '@/components/ui/sonner';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'coding75 | Powered by crackDSA',
  description: 'Coding DSA MERN Projects Interview Preparation: Free Resources for College Students',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className='scroll-smooth' lang="en">
      <head>
        <meta name="description" content="Coding DSA MERN Projects Interview Preparation: Free Resources for College Students" />
        <meta name="keywords" content="Coding, DSA, Competitive Programming, CP, Interviews, coding75, crackDSA, learn coding, coding75, coding 75, coding75.com, crackdsa" />
        <meta property="og:image" content="/og.png" />
        <meta name="google-adsense-account" content="ca-pub-5737188174207597"/>
        {/* <link rel="icon" href="/logo.svg" /> */}
      </head>
      <body className={inter.className + " no-scrollbar"}>
        <NextTopLoader
          color="#2563eb"
          height={4}
          showSpinner={false}
        />
        {children}
        <Toaster theme='light' richColors closeButton position="top-right" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/react-quill@1.3.3/dist/quill.snow.css"
        />
      </body>
    </html>
  )
}
