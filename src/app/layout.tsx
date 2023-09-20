import './globals.css'
export const metadata = {
  title: 'Conversation coach',
  description: 'Improve your conversational skills using AI',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
