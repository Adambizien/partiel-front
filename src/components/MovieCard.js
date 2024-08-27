import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie, genres }) => {
  const getGenresNames = (genreIds) => {
    return genres
      .filter((genre) => genreIds.includes(genre.id))
      .map((genre) => genre.name)
      .join(', ');
  };

  const imageSrc = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="bg-white shadow-lg rounded-lg overflow-hidden"
    >
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={movie.title}
          className="w-full h-64 object-cover"
        />
      ) : (
        <div className="w-full h-64 bg-gray-300 flex items-center justify-center">
        </div>
      )}
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{movie.title}</h2>
        <p className="text-gray-600 text-sm mb-2 line-clamp-3">{movie.overview}</p>
        <p className="text-gray-500 text-xs">Date de sortie: {movie.release_date}</p>
        <p className="text-gray-500 text-xs mt-2">Genres: {getGenresNames(movie.genre_ids)}</p>
      </div>
    </Link>
  );
};

export default MovieCard;
