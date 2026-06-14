'use client'



import { useState } from 'react'
import MovieModal from './MovieModal'
import { getMovieDetails, getImageUrl } from '@/lib/omdb'

export default function MovieCard({
  movie,
  isFavorite,
  onToggleFavorite,
}) {
  const [showModal, setShowModal] = useState(false)
  const [movieDetails, setMovieDetails] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleOpenModal = async () => {
    if (!movieDetails) {
      setLoading(true)
      const details = await getMovieDetails(movie.imdbID)
      setMovieDetails(details)
      setLoading(false)
    }
    setShowModal(true)
  }

  const handleCloseModal = () => {
    setShowModal(false)
  }

  return (
    <>
      <article className="group relative w-full overflow-hidden rounded-2xl">
        <button
          type="button"
          aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
          onClick={() => onToggleFavorite(movie)}
          className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 backdrop-blur transition hover:bg-black"
        >
          <span
            className={
              isFavorite
                ? 'text-red-500 text-lg'
                : 'text-white text-lg'
            }
          >
            ♥
          </span>
        </button>

        <button
          type="button"
          onClick={handleOpenModal}
          className="block w-full overflow-hidden rounded-2xl"
        >
          <div className="relative">
            <img
              src={getImageUrl(movie.Poster)}
              alt={movie.Title}
              loading="lazy"
              className="h-[340px] w-full object-cover transition duration-500 group-hover:scale-110"
            />

            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />

            <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
              <p className="text-xs font-medium uppercase tracking-wider text-cyan-400">
                {movie.Year || 'TBA'}
              </p>

              <h3 className="mt-1 line-clamp-2 text-lg font-bold text-white">
                {movie.Title}
              </h3>

              <div className="mt-2 flex items-center justify-between">
                <span className="rounded-full bg-white/10 px-2 py-1 text-xs text-slate-200 backdrop-blur">
                  {movie.Type?.toUpperCase() || 'MOVIE'}
                </span>

                <span className="text-xs text-slate-300">
                  IMDb
                </span>
              </div>
            </div>
          </div>
        </button>
      </article>

      {showModal && movieDetails && (
        <MovieModal
          movie={movieDetails}
          isFavorite={isFavorite}
          onClose={handleCloseModal}
          onToggleFavorite={onToggleFavorite}
        />
      )}
    </>
  )
}
