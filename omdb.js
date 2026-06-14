/**
 * OMDB API Utility Functions
 * Server-side API calls for fetching movie data
 */

const API_BASE = 'https://www.omdbapi.com/'

export const buildUrl = (params) => {
  const searchParams = new URLSearchParams({
    apikey: process.env.NEXT_PUBLIC_OMDB_API_KEY || '',
    r: 'json',
    ...params,
  })
  return `${API_BASE}?${searchParams}`
}

export const getImageUrl = (poster) =>
  poster && poster !== 'N/A'
    ? poster
    : 'https://via.placeholder.com/500x750?text=No+Poster'

/**
 * Search movies by query and page
 * @param {string} query - Movie title to search for
 * @param {number} page - Page number for pagination
 * @returns {Promise<{Search: Array, Response: string, totalResults: string}>}
 */
export const searchMovies = async (query, page = 1) => {
  try {
    const response = await fetch(
      buildUrl({
        s: query,
        type: 'movie',
        page,
      }),
      { next: { revalidate: 3600 } } // Revalidate every hour
    )

    if (!response.ok) throw new Error('Failed to fetch movies')
    return await response.json()
  } catch (error) {
    console.error('Error searching movies:', error)
    return { Search: [], Response: 'False' }
  }
}

/**
 * Get detailed movie information
 * @param {string} imdbID - IMDb ID of the movie
 * @returns {Promise<Object>} Movie details
 */
export const getMovieDetails = async (imdbID) => {
  try {
    const response = await fetch(
      buildUrl({
        i: imdbID,
        plot: 'full',
      }),
      { next: { revalidate: 86400 } } // Revalidate every 24 hours
    )

    if (!response.ok) throw new Error('Failed to fetch movie details')
    return await response.json()
  } catch (error) {
    console.error('Error fetching movie details:', error)
    return null
  }
}

/**
 * Get trending movies (initial search)
 * @returns {Promise<Array>} Array of movies
 */
export const getTrendingMovies = async () => {
  const data = await searchMovies('Marvel', 1)
  return data.Search || []
}
