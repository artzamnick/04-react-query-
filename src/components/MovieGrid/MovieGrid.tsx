import type { Movie } from "../../types/movie";
import styles from "./MovieGrid.module.css";

interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export default function MovieGrid({ movies, onSelect }: MovieGridProps) {
  return (
    <ul className={styles.grid}>
      {movies.map((movie) => {
        const posterUrl = movie.poster_path
          ? `${IMAGE_BASE_URL}${movie.poster_path}`
          : "/no-poster.png"; 

        return (
          <li key={movie.id} className={styles.item}>
            <div
              className={styles.card}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(movie)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  onSelect(movie);
                }
              }}
            >
              <img
                className={styles.image}
                src={posterUrl}
                alt={movie.title}
                loading="lazy"
              />
              <h2 className={styles.title}>{movie.title}</h2>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
