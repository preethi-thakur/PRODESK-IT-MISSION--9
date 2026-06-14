'use client'

/**
 * Movie Detail Client Component
 * CLIENT COMPONENT - Handles interactivity on movie detail page
 * 
 * Why CLIENT:
 * - Manages favorites state
 * - Handles localStorage operations
 * - Provides interactive features (back button, favorites toggle)
 */

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getImageUrl } from '@/lib/omdb'

const STORAGE_KEY = 'favorites'

const loadStoredFavorites = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export default function MovieDetailClient({ initialMovie }) {
  const router = useRouter()
  const [favorites, setFavorites] = useState({})
  const [movie] = useState(initialMovie)

  // Initialize favorites from localStorage
  useEffect(() => {
    setFavorites(loadStoredFavorites())
  }, [])

  // Persist favorites to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
  }, [favorites])

  const toggleFavorite = (movie) => {
    setFavorites((current) => {
      const next = { ...current }
      if (next[movie.imdbID]) {
        delete next[movie.imdbID]
      } else {
        next[movie.imdbID] = movie
      }
      return next
    })
  }

  const isFavorite = Boolean(favorites[movie.imdbID])

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        {/* Header with back button */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="rounded-xl px-4 py-2 bg-slate-800 text-slate-300 hover:bg-slate-700 transition"
          >
            ← Back
          </button>
        </div>

        {/* Movie detail section */}
        <div className="relative">
          <img
            src={getImageUrl(movie.Poster)}
            alt={movie.Title}
            className="h-[500px] w-full object-cover rounded-3xl"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent rounded-3xl" />

          <div className="absolute bottom-10 left-10">
            <p className="mb-3 text-cyan-400 font-medium">
              Featured Movie
            </p>

            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {movie.Title}
            </h1>

            <div className="mt-4 flex flex-wrap gap-3">
              <span className="rounded-full bg-cyan-500/20 px-4 py-2 text-sm text-cyan-300">
                {movie.Year || 'TBA'}
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                {movie.Type?.toUpperCase() || 'MOVIE'}
              </span>

              <span className="rounded-full bg-white/10 px-4 py-2 text-sm text-white">
                {movie.Runtime || 'N/A'}
              </span>
            </div>
          </div>
        </div>

        <div className="mt-12 p-8">
          {/* Stats section */}
          <div className="mb-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                IMDb Rating
              </p>

              <p className="mt-2 text-3xl font-bold text-yellow-400">
                ⭐ {movie.imdbRating || 'N/A'}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Votes
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {movie.imdbVotes || 'N/A'}
              </p>
            </div>

            <div className="rounded-2xl bg-slate-800 p-5">
              <p className="text-sm text-slate-400">
                Released
              </p>

              <p className="mt-2 text-3xl font-bold text-white">
                {movie.Released || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Genre section */}
          <div className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-white">
              Genre
            </h2>

            <p className="text-slate-300">
              {movie.Genre || 'Genre unavailable'}
            </p>
          </div>

          {/* Plot section */}
          <div className="mb-10">
            <h2 className="mb-3 text-xl font-bold text-white">
              Plot
            </h2>

            <p className="leading-8 text-slate-300">
              {movie.Plot ||
                'No synopsis is available for this title.'}
            </p>
          </div>

          {/* Favorite button */}
          <button
            onClick={() => toggleFavorite(movie)}
            className={`rounded-xl px-6 py-3 font-semibold transition ${
              isFavorite
                ? 'bg-red-500 text-white hover:bg-red-400'
                : 'bg-cyan-500 text-white hover:bg-cyan-400'
            }`}
          >
            {isFavorite
              ? '❤️ Remove from Favorites'
              : '🤍 Add to Favorites'}
          </button>
        </div>
      </div>
    </div>
  )
}
