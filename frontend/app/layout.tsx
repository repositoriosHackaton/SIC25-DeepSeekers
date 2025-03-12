import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Reconocimiento de enfermedades en plantas de cultivo',
  description: 'Interfaz para el reconocimiento de enfermedades en plantas de cultivo'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
