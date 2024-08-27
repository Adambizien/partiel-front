import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faCalendarAlt, faFilm, faLanguage, faClock, faTag, faLink, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

const MovieDetails = () => {
  const { movieId } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}?language=fr-FR`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
            },
          }
        );
        const data = await response.json();
        setMovie(data);

        // Fetch movie credits
        const creditsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/credits?language=fr-FR`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
            },
          }
        );
        const creditsData = await creditsResponse.json();
        setActors(creditsData.cast);

        // Fetch movie reviews with pagination
        const reviewsResponse = await fetch(
          `https://api.themoviedb.org/3/movie/${movieId}/reviews?language=en-EN&page=${currentPage}`,
          {
            method: 'GET',
            headers: {
              accept: 'application/json',
              Authorization: `Bearer ${process.env.REACT_APP_TMDB_API_KEY}`,
            },
          }
        );
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData.results);
        setTotalPages(reviewsData.total_pages);
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [movieId, currentPage]);

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(
        <li key={i}>
          <button
            onClick={() => handlePageChange(i)}
            className={`flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 ${i === currentPage ? 'bg-gray-100 text-gray-700' : 'hover:bg-gray-100 hover:text-gray-700'} ${i === currentPage ? 'font-bold' : ''}`}
          >
            {i}
          </button>
        </li>
      );
    }
    return buttons;
  };

  if (!movie) return <p className="text-center text-gray-700">Loading...</p>;

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-1/3 mb-6 md:mb-0 bg-gray-100 rounded-lg">
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="w-full h-auto object-cover rounded-lg shadow-lg"
          />
        </div>
        <div className="md:ml-6 flex-1">
          <button
            onClick={() => navigate('/')}
            className="mb-4 text-blue-600 hover:underline flex items-center"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-blue-600 mr-2" />
            <span>Retour à l'accueil</span>
          </button>
          <div className="flex items-baseline mb-4">
            <h1 className="text-4xl font-extrabold flex-1">{movie.title}</h1>
            <div className="text-lg text-gray-700 ml-4 flex items-center">
              <FontAwesomeIcon icon={faStar} className="text-yellow-500 mr-1" />
              <span className="font-medium">{movie.vote_average.toFixed(1)}</span>
              <span className="text-gray-500 ml-2">({movie.vote_count} votes)</span>
            </div>
          </div>
          <p className="text-lg text-gray-700 mb-4">{movie.overview}</p>
          <div className="text-gray-500 mb-4">
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-500 mr-2" />
              <p>Date de sortie: <span className="font-medium">{movie.release_date}</span></p>
            </div>
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faFilm} className="text-gray-500 mr-2" />
              <p>Genres: <span className="font-medium">{movie.genres.map(genre => genre.name).join(', ')}</span></p>
            </div>
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faLanguage} className="text-gray-500 mr-2" />
              <p>VO: <span className="font-medium">{movie.original_language.toUpperCase()}</span></p>
            </div>
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faClock} className="text-gray-500 mr-2" />
              <p>Durée: <span className="font-medium">{movie.runtime} minutes</span></p>
            </div>
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faTag} className="text-gray-500 mr-2" />
              <p>Status: <span className="font-medium">{movie.status}</span></p>
            </div>
            <div className="flex items-center mb-2">
              <FontAwesomeIcon icon={faTag} className="text-gray-500 mr-2" />
              <p>Slogan: <span className="font-medium italic">"{movie.tagline}"</span></p>
            </div>
          </div>
          {movie.homepage && (
            <a
              href={movie.homepage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-blue-600 hover:underline text-lg font-medium"
            >
              <FontAwesomeIcon icon={faLink} className="text-blue-600 mr-2" />
              Site officiel
            </a>
          )}
          <div className="mt-8">
            <h2 className="text-3xl font-extrabold mb-6">Cast</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {actors.length > 0 ? (
                actors.slice(0, 8).map(actor => (
                  <div key={actor.id} className="bg-white p-4 rounded-lg shadow-md text-center">
                    <img
                      src={actor.profile_path ? `https://image.tmdb.org/t/p/w500${actor.profile_path}` : 'https://via.placeholder.com/150'}
                      alt={actor.name}
                      className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                    />
                    <p className="font-semibold text-lg">{actor.name}</p>
                    <p className="text-gray-600">as {actor.character}</p>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-700">Pas d'acteurs trouvés</p>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-3xl font-extrabold mb-6">Avis des spectateurs</h2>
            {reviews.length > 0 ? (
              <div>
                {reviews.slice(0, 5).map(review => (
                  <div key={review.id} className="bg-white p-4 rounded-lg shadow-md mb-4">
                    <h3 className="text-xl font-semibold mb-2">{review.author}</h3>
                    <p className="text-gray-700 mb-2">{review.content}</p>
                    <p className="text-gray-500 text-sm">Publié le {new Date(review.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-700">Aucun avis trouvé</p>
            )}
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
      </div>
    </div>
  );
};

export default MovieDetails;
