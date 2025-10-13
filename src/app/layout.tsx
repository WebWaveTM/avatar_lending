import type { Metadata } from 'next'
import { Ysabeau_Infant } from 'next/font/google'
import './globals.css'
import ContactPopupProvider from '@/context/ContactPopupContext'
import { Toaster } from 'react-hot-toast'


const ysabeauInfant = Ysabeau_Infant({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ysabeau-infant',
})

export const metadata: Metadata = {
  title: 'Avatar Project',
  description: 'Цифровые аватары для образования',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru">
      <body className={ysabeauInfant.variable}>
        <ContactPopupProvider>
        {children}
        </ContactPopupProvider>
        <Toaster position="top-right" />
        </body>
    </html>
  )
}
