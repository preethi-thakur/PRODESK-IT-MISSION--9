'use client'

/**
 * MovieModal Component
 * CLIENT COMPONENT - Displays detailed movie information in a modal
 */

import { getImageUrl } from '@/lib/omdb'

export default function MovieModal({
  movie,
  isFavorite,
  onClose,
  onToggleFavorite,
}) {
  if (!movie) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm">
      <div className="relative max-h-[95vh] w-full max-w-6xl overflow-y-auto rounded-3xl bg-slate-900 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black/70 text-white transition hover:bg-black"
        >
          ✕
        </button>

        <div className="relative">
          <img
            src={getImageUrl(movie.Poster)}
            alt={movie.Title}
            className="h-[500px] w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />

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

        <div className="p-8">
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

          <div className="mb-8">
            <h2 className="mb-3 text-xl font-bold text-white">
              Genre
            </h2>

            <p className="text-slate-300">
              {movie.Genre || 'Genre unavailable'}
            </p>
          </div>

          <div className="mb-10">
            <h2 className="mb-3 text-xl font-bold text-white">
              Plot
            </h2>

            <p className="leading-8 text-slate-300">
              {movie.Plot ||
                'No synopsis is available for this title.'}
            </p>
          </div>

          <button
            onClick={() => onToggleFavorite(movie)}
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
