import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./MovieModal.module.css";
import type { Movie } from "../../types/movie";

interface MovieModalProps {
  movie: Movie;
  onClose: () => void;
}

const modalRoot = document.getElementById("modal-root");

export default function MovieModal({ movie, onClose }: MovieModalProps) {
  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500/${movie.poster_path}`
    : "";

  const year = movie.release_date ? movie.release_date.slice(0, 4) : "—";
  const rating =
    typeof movie.vote_average === "number" ? movie.vote_average.toFixed(1) : "—";

  const modal = (
    <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true">
      <div className={styles.modal}>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>

        {posterUrl ? (
          <img className={styles.image} src={posterUrl} alt={movie.title} />
        ) : (
          <div className={styles.image} />
        )}

        <div className={styles.content}>
          <h2>
            {movie.title} ({year})
          </h2>
          <p>Rating: {rating}</p>
          <p>{movie.overview || "No overview available."}</p>
        </div>
      </div>
    </div>
  );

  if (!modalRoot) return null;

  return createPortal(modal, modalRoot);
}
