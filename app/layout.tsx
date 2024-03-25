import { Toaster } from '@/components/ui/sonner';
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import NextTopLoader from 'nextjs-toploader';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'coding75 App',
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
        <title>coding75 | Powered by crackDSA</title>
        <meta name="description" content="Coding DSA MERN Projects Interview Preparation: Free Resources for College Students" />
        <meta name="keywords" content="Coding, DSA, Competitive Programming, CP, Interviews, coding75, crackDSA, learn coding" />
        <meta property="og:title" content="coding75 | Powered by crackDSA" />
        <meta property="og:description" content="Coding DSA MERN Projects Interview Preparation: Free Resources for College Students" />
        <meta property="og:image" content="/og.png" />
        {/* <link rel="icon" href="/logo.svg" /> */}
      </head>
      <body className={inter.className}>
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
