import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import styles from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  async function handleSearch(query: string) {
    setIsLoading(true);
    setIsError(false);
    setMovies([]);
    setSelectedMovie(null);

    try {
      const results = await fetchMovies(query);

      if (results.length === 0) {
        toast("No movies found. Try another query 🙂");
        return;
      }

      setMovies(results);
    } catch (error) {
      setIsError(true);
      toast.error("There was an error, please try again...");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={setSelectedMovie} />
      )}

      {selectedMovie && (
        <MovieModal
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </div>
  );
}
