import { useEffect, useState, type ComponentType } from "react";
import { useQuery } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";
import * as ReactPaginateModule from "react-paginate";

import styles from "./App.module.css";

import SearchBar from "../SearchBar/SearchBar";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";

import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function unwrapDefaultToComponent(
  mod: unknown
): ComponentType<Record<string, unknown>> | null {
  let current: unknown = mod;

  for (let i = 0; i < 5; i += 1) {
    if (typeof current === "function") {
      return current as ComponentType<Record<string, unknown>>;
    }

    if (isRecord(current) && "default" in current) {
      current = current.default;
      continue;
    }

    break;
  }

  return typeof current === "function"
    ? (current as ComponentType<Record<string, unknown>>)
    : null;
}

const ReactPaginate = unwrapDefaultToComponent(ReactPaginateModule);

export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query.trim().length > 0,
    staleTime: 1000 * 60,
  });

  const movies = data?.results ?? [];
  const totalPages = data?.total_pages ?? 0;

  useEffect(() => {
    if (query && data && !isLoading && !isError && data.results.length === 0) {
      toast("No movies found. Try another query 🙂");
    }
  }, [query, data, isLoading, isError]);

  function handleSearch(newQuery: string) {
    const normalized = newQuery.trim();
    if (!normalized) return;

    setQuery(normalized);
    setPage(1);
    setSelectedMovie(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const canRenderPaginate =
    ReactPaginate &&
    !isLoading &&
    !isError &&
    movies.length > 0 &&
    totalPages > 1;

  return (
    <div className={styles.app}>
      <Toaster position="top-right" />
      <SearchBar onSubmit={handleSearch} />

      {canRenderPaginate && ReactPaginate && (
        <div className={styles.paginationWrap}>
          <ReactPaginate
            pageCount={totalPages}
            pageRangeDisplayed={5}
            marginPagesDisplayed={1}
            onPageChange={({ selected }: { selected: number }) =>
              setPage(selected + 1)
            }
            forcePage={page - 1}
            containerClassName={styles.pagination}
            activeClassName={styles.active}
            disabledClassName={styles.disabled}
            previousClassName={styles.nav}
            nextClassName={styles.nav}
            breakClassName={styles.break}
            nextLabel="→"
            previousLabel="←"
          />
        </div>
      )}

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      {!isLoading && !isError && movies.length > 0 && (
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
