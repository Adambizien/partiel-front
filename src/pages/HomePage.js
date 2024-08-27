import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import SearchBar from '../components/SearchBar';
import MovieCard from '../components/MovieCard';
import Pagination from '../components/Pagination';

const HomePage = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
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
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setGenres(data.genres || []);
      } catch (error) {
        setError('Error fetching genres. Please try again later.');
        console.error('Error fetching genres:', error);
      }
    };

    fetchGenres();
  }, [apiKey]);

  const fetchMovies = async (page = 1) => {
    setLoading(true);
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
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setMovies(data.results || []);
      setTotalResults(data.total_results || 0);
      setError(null);
    } catch (error) {
      setError('Error fetching movies. Please try again later.');
      console.error('Error fetching movies:', error);
    } finally {
      setLoading(false);
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

  return (
    <div className="min-h-screen px-4 py-6 bg-gray-100">
      <div className="container max-w-7xl mx-auto">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <SearchBar query={query} setQuery={setQuery} />
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
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Erreur :</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            <p className="text-center text-gray-500">Chargement...</p>
          ) : movies.length > 0 ? (
            movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} genres={genres} />
            ))
          ) : (
            <p className="text-center text-gray-500">Aucun film trouvé.</p>
          )}
        </div>
        {!error && !loading && movies.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            handlePageChange={handlePageChange}
            renderPageButtons={renderPageButtons}
          />
        )}
      </div>
    </div>
  );
};

export default HomePage;
