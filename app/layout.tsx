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
    <html lang="en">
      <body className={inter.className}>
      <NextTopLoader
      height={4}
      showSpinner={false}
      />
        {children}
      </body>
    </html>
  )
}
