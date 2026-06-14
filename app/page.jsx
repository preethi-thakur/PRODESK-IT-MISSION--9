'use client'


import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/Navbar'
import MovieCard from '@/components/MovieCard'
import MovieGallery from '@/components/MovieGallery'
import MovieModal from '@/components/MovieModal'
import { searchMovies, getTrendingMovies, getMovieDetails, getImageUrl } from '@/lib/omdb'

const STORAGE_KEY = 'favorites'

const loadStoredFavorites = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch {
    return {}
  }
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [query, setQuery] = useState('Marvel')
  const [searchResults, setSearchResults] = useState([])
  const [favorites, setFavorites] = useState({})
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [activeTab, setActiveTab] = useState('movies')
  const [status, setStatus] = useState({ loading: false, message: '' })
  const [initialized, setInitialized] = useState(false)

  const debounceRef = useRef(null)

  useEffect(() => {
    setFavorites(loadStoredFavorites())
    setInitialized(true)
  }, [])

  // Initial load of trending movies
  useEffect(() => {
    const loadInitial = async () => {
      if (!initialized) return
      setStatus({ loading: true, message: '' })
      try {
        const movies = await getTrendingMovies()
        setSearchResults(movies)
        setStatus({ loading: false, message: '' })
      } catch (error) {
        setStatus({ loading: false, message: 'Failed to load movies.' })
      }
    }
    loadInitial()
  }, [initialized])

  // Debounced search
  useEffect(() => {
    clearTimeout(debounceRef.current)

    debounceRef.current = setTimeout(() => {
      const value = searchTerm.trim()
      if (value.length >= 2) {
        setQuery(value)
        setSearchResults([])
      } else if (value.length === 0) {
        setQuery('Marvel')
        setSearchResults([])
      }
    }, 500)

    return () => clearTimeout(debounceRef.current)
  }, [searchTerm])


  useEffect(() => {
    const fetchResults = async () => {
      if (!query) return

      setStatus({ loading: true, message: '' })
      try {
        const data = await searchMovies(query, 1)
        if (data.Response === 'False') {
          setSearchResults([])
          setStatus({
            loading: false,
            message: 'No movies found.',
          })
        } else {
          setSearchResults(data.Search || [])
          setStatus({ loading: false, message: '' })
        }
      } catch (error) {
        setStatus({
          loading: false,
          message: 'Failed to load movies.',
        })
      }
    }

    fetchResults()
  }, [query])


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

  const openModal = async (movie) => {
    try {
      const data = await getMovieDetails(movie.imdbID)
      if (data && data.Response === 'True') {
        setSelectedMovie(data)
      }
    } catch (error) {
      console.error('Error opening modal:', error)
    }
  }

  const closeModal = () => setSelectedMovie(null)

  const favoriteCount = Object.keys(favorites).length
  const featuredMovie = searchResults[0]

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-7xl px-4 py-6">
        <Navbar
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          favoriteCount={favoriteCount}
        />

        <div className="mb-8 flex gap-3">
          <button
            onClick={() => setActiveTab('movies')}
            className={`rounded-xl px-5 py-3 font-medium transition ${
              activeTab === 'movies'
                ? 'bg-cyan-500 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            🎬 Movies
          </button>

          <button
            onClick={() => setActiveTab('favorites')}
            className={`rounded-xl px-5 py-3 font-medium transition ${
              activeTab === 'favorites'
                ? 'bg-red-500 text-white'
                : 'bg-slate-800 text-slate-300'
            }`}
          >
            ❤️ Favorites ({favoriteCount})
          </button>
        </div>

        {activeTab === 'movies' && (
          <>
            {featuredMovie && (
              <div className="relative mb-12 overflow-hidden rounded-3xl">
                <img
                  src={getImageUrl(featuredMovie.Poster)}
                  alt={featuredMovie.Title}
                  className="h-[500px] w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />

                <div className="absolute left-10 top-1/2 max-w-xl -translate-y-1/2">
                  <p className="mb-3 text-cyan-400 font-medium">
                    Featured Movie
                  </p>

                  <h1 className="text-5xl md:text-6xl font-bold">
                    {featuredMovie.Title}
                  </h1>

                  <p className="mt-4 text-lg text-slate-300">
                    Released: {featuredMovie.Year}
                  </p>

                  <button
                    onClick={() => openModal(featuredMovie)}
                    className="mt-6 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-white hover:bg-cyan-400"
                  >
                    View Details
                  </button>
                </div>
              </div>
            )}

            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                Recommended Movies
              </h2>

              <span className="rounded-full bg-slate-800 px-4 py-2 text-sm">
                {searchResults.length} Movies
              </span>
            </div>

            {searchResults.length > 0 ? (
              <MovieGallery
                initialMovies={searchResults}
                query={query}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
              />
            ) : (
              <>
                <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                  {searchResults.map((movie) => (
                    <MovieCard
                      key={movie.imdbID}
                      movie={movie}
                      isFavorite={Boolean(favorites[movie.imdbID])}
                      onToggleFavorite={toggleFavorite}
                    />
                  ))}
                </div>

                {status.message && !status.loading && (
                  <div className="rounded-2xl bg-slate-900 p-10 text-center text-slate-400">
                    {status.message}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {activeTab === 'favorites' && (
          <>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-3xl font-bold">
                ❤️ My Favorites
              </h2>

              <span className="rounded-full bg-red-500 px-4 py-2 text-sm">
                {favoriteCount}
              </span>
            </div>

            {favoriteCount === 0 ? (
              <div className="rounded-2xl bg-slate-900 p-10 text-center text-slate-400">
                No favorite movies yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-5 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
                {Object.values(favorites).map((movie) => (
                  <MovieCard
                    key={movie.imdbID}
                    movie={movie}
                    isFavorite
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {selectedMovie && (
          <MovieModal
            movie={selectedMovie}
            isFavorite={Boolean(favorites[selectedMovie.imdbID])}
            onClose={closeModal}
            onToggleFavorite={toggleFavorite}
          />
        )}
      </div>
    </div>
  )
}
