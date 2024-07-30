'use client';

import '@/styles/globals.css'
import Header from '@/components/header'
import { Kameron } from 'next/font/google'
import { SubjectsProvider } from '@/contexts/SubjectsContext'
import SmoothScroll from '@/components/ui/SmoothScroll';
import { ToasterProvider } from '@/components/ToasterProvider'

const kameron = Kameron({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-kameron',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${kameron.variable} bg-background`}>
        <SmoothScroll />
        <SubjectsProvider>
        <ToasterProvider>

        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow mt-[var(--header-height)]">
          {children}
          </main>
          <footer className="bg-primary text-white text-center py-4">
            <p>&copy; 2024 DailyMed</p>
          </footer>
          </div>
          </ToasterProvider>

        </SubjectsProvider>
      </body>
    </html>
  )
}