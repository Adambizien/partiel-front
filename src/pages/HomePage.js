import React, { useEffect, useState } from 'react';
import Select from 'react-select';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const apiKey = process.env.REACT_APP_TMDB_API_KEY;
  const moviesPerPage = 10;

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/genre/movie/list?language=fr`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${apiKey}`,
            },
          }
        );
        const data = await response.json();
        setGenres(data.genres);
      } catch (error) {
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [apiKey]);

  const fetchMovies = async (page = 1) => {
    try {
      const genreFilter = selectedGenres.length > 0 ? `&with_genres=${selectedGenres.map(option => option.value).join(',')}` : '';
      const response = await fetch(
        query !== ''
          ? `https://api.themoviedb.org/3/search/movie?query=${query}&language=fr-FR&page=${page}${genreFilter}`
          : `https://api.themoviedb.org/3/discover/movie?language=fr-FR&page=${page}${genreFilter}`,
        {
          method: 'GET',
          headers: {
            accept: 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      const data = await response.json();
      setMovies(data.results);
      setTotalResults(data.total_results);
    } catch (error) {
      console.error('Error fetching movies:', error);
    }
  };

  useEffect(() => {
    fetchMovies(currentPage);
  }, [query, currentPage, selectedGenres, apiKey]);

  const handleGenreChange = (selectedOptions) => {
    setSelectedGenres(selectedOptions || []);
  };

  const handlePageChange = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= Math.ceil(totalResults / moviesPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

  const totalPages = Math.ceil(totalResults / moviesPerPage);

  const renderPageButtons = () => {
    const pageButtons = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageButtons.push(i);
      }
    } else {
      if (currentPage > 3) pageButtons.push('...');
      for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
        pageButtons.push(i);
      }
      if (currentPage < totalPages - 2) pageButtons.push('...');
    }
    return pageButtons.map((page, index) => (
      <li key={index}>
        {page === '...' ? (
          <span className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300">
            {page}
          </span>
        ) : (
          <button
            onClick={() => handlePageChange(page)}
            className={`flex items-center justify-center px-4 h-10 leading-tight ${
              page === currentPage
                ? 'z-10 text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700'
                : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700'
            }`}
          >
            {page}
          </button>
        )}
      </li>
    ));
  };

  const genreOptions = genres.map(genre => ({
    value: genre.id,
    label: genre.name,
  }));

  const getGenresNames = (genreIds) => {
    return genres
      .filter(genre => genreIds.includes(genre.id))
      .map(genre => genre.name)
      .join(', ');
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-6">
      <div className="container max-w-7xl mx-auto">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div className="relative">
            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher un film..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="block w-full p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <Select
            isMulti
            options={genreOptions}
            value={selectedGenres}
            onChange={handleGenreChange}
            placeholder="Filtrer par genre..."
            className="mb-4 md:mb-0"
            classNamePrefix="react-select"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {movies.length > 0 ? (
            movies.map((movie) => (
                <a href={`/movie/${movie.id}`} key={movie.id}>
                <div className="bg-white shadow-lg rounded-lg overflow-hidden">
                    <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-64 object-cover"
                    />
                    <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
                    <p className="text-gray-600 text-sm mb-2 line-clamp-3">{movie.overview}</p>
                    <p className="text-gray-500 text-xs">Date de sortie: {movie.release_date}</p>
                    <p className="text-gray-500 text-xs mt-2">Genres: {getGenresNames(movie.genre_ids)}</p>
                    </div>
                </div>
                </a>
            ))
            ) : (
            <p className="text-center text-gray-500">Chargement...</p>
            )}
        </div>
        <nav aria-label="Page navigation example" className="mt-6">
          <div className="flex justify-center">
            <ul className="flex items-center -space-x-px h-10 text-base">
              <li>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-md hover:bg-gray-100 hover:text-gray-700"
                >
                  <span className="sr-only">Précédent</span>
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </button>
              </li>
              {renderPageButtons()}
              <li>
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-md hover:bg-gray-100 hover:text-gray-700"
                >
                  <span className="sr-only">Suivant</span>
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;
