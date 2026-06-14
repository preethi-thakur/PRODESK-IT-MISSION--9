'use client'



import { useEffect, useRef, useState } from 'react'
import MovieCard from './MovieCard'
import { searchMovies } from '@/lib/omdb'

export default function MovieGallery({
  initialMovies,
  query,
  favorites,
  onToggleFavorite,
}) {
  const [movies, setMovies] = useState(initialMovies)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const observerRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore) {
          setPage((prev) => prev + 1)
        }
      },
      { rootMargin: '300px' }
    )

    if (observerRef.current) {
      observer.observe(observerRef.current)
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current)
      }
    }
  }, [loading, hasMore])

  useEffect(() => {
    if (page === 1) return

    const loadMore = async () => {
      setLoading(true)
      try {
        const data = await searchMovies(query, page)
        if (data.Search) {
          setMovies((prev) => [...prev, ...data.Search])
          if ((data.Search || []).length < 10) {
            setHasMore(false)
          }
        } else {
          setHasMore(false)
        }
      } catch (error) {
        console.error('Error loading more movies:', error)
      }
      setLoading(false)
    }

    loadMore()
  }, [page, query])

  return (
    <>
      <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies.map((movie) => (
          <MovieCard
            key={movie.imdbID}
            movie={movie}
            isFavorite={Boolean(favorites[movie.imdbID])}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>

      <div
        ref={observerRef}
        className="h-24 flex items-center justify-center mt-8"
      >
        {loading && (
          <p className="text-slate-400">
            Loading more movies...
          </p>
        )}
        {!hasMore && movies.length > 0 && (
          <p className="text-slate-400">
            No more movies to load
          </p>
        )}
      </div>
    </>
  )
}
