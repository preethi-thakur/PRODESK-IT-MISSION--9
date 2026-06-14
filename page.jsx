import './globals.css'

export const metadata = {
  title: 'Movie Explorer | Discover and Save Your Favorite Movies',
  description: 'Explore thousands of movies with detailed information, ratings, and reviews. Save your favorite movies to your personal collection.',
  keywords: ['movies', 'search', 'explorer', 'IMDB', 'favorites'],
  authors: [{ name: 'Movie Explorer Team' }],
  openGraph: {
    title: 'Movie Explorer',
    description: 'Discover and save your favorite movies',
    type: 'website',
    locale: 'en_US',
  },
  robots: 'index, follow',
  viewport: 'width=device-width, initial-scale=1.0',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
      </body>
    </html>
  )
}
