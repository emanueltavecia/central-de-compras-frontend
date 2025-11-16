import { Inter } from 'next/font/google'

import {
  ColorSchemeScript,
  MantineProvider,
  mantineHtmlProps,
} from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import type { Metadata } from 'next'

import '@mantine/core/styles.css'
import '@mantine/notifications/styles.css'
import './globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Central de Compras',
  description: 'Sistema de gestão de compras',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript />
      </head>
      <body className={`${inter.variable} antialiased`}>
        <Suspense>
          <TokenInitializer />
        </Suspense>
        <MantineProvider>
          <Notifications position="top-right" />
          {children}
        </MantineProvider>
      </body>
    </html>
  )
}
