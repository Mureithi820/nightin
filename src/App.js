import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorageState } from "./useLocalStorageState";
import { useKey } from "./useKey";
//import ReactTmdbImage from "react-tmdb-image";
// const tempMovieData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt0133093",
//     Title: "The Matrix",
//     Year: "1999",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
//   },
//   {
//     imdbID: "tt6751668",
//     Title: "Parasite",
//     Year: "2019",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
//   },
// ];

// const tempWatchedData = [
//   {
//     imdbID: "tt1375666",
//     Title: "Inception",
//     Year: "2010",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
//     runtime: 148,
//     imdbRating: 8.8,
//     userRating: 10,
//   },
//   {
//     imdbID: "tt0088763",
//     Title: "Back to the Future",
//     Year: "1985",
//     Poster:
//       "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
//     runtime: 116,
//     imdbRating: 8.5,
//     userRating: 9,
//   },
// ];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

const KEY = "d23ab74305c85767888d49cab240abaf";

// const KEY = "efdd89cc";
export default function App() {
  const [query, setQuery] = useState("");

  const [selectedId, setSelectedId] = useState(null);

 
  const { movies, isLoading, error } = useMovies(query);
  // const [watched, setWatched] = useState([]);
  const { value: watched, setValue: setWatched } = useLocalStorageState(
    [],
    "watched"
  );

  // const [watched, setWatched] = useState(function () {
  //   const storedValue = localStorage.getItem("watched");
  //   return JSON.parse(storedValue);
  // });

  /*
  useEffect(function () {
    console.log("After initial render");
  }, []);

  useEffect(function () {
    console.log("After every render");
  });

  useEffect(
    function () {
      console.log("D");
    },
    [query]
  );

  console.log("During render");
*/

  function handleSelectMovie(id) {
    setSelectedId(id);

    // setSelectedId(id === selectedId ? null : id);

    // setSelectedId((selectedId) => (id === selectedId ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }
  function handleAddWatched(movie) {
    // Create a temporary variable to store the updated watched array.
    const updatedWatched = [...watched, movie];

    // Set the watched state with the updated watched array.
    setWatched(updatedWatched);

    // // Save the updated watched array to local storage.
    // localStorage.setItem("watched", JSON.stringify(updatedWatched));
  }

  function handleDeleteWatched(id) {
    setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
  }

  //     setIsLoading(true);
  //     setError("");

  //     const res = await fetch(
  //       // `http://www.omdbapi.com/?i=tt3896198 apikey=f84fc31d &s=${query}`,
  //       `https://api.themoviedb.org/3/search/movie?api_key=${KEY}&query=${query}`

  //       { signal: controller.signal }
  //     );

  //     if (!res.ok)
  //       throw new Error("Something went wrong with fetching movies");

  //     const data = await res.json();
  //     if (data.Response === "False") throw new Error("Movie not found");

  //     setMovies(data.Search);
  //     setError("");
  //   } catch (err) {
  //     if (err.name !== "AbortError") {
  //       console.log(err.message);
  //       setError(err.message);
  //     }
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }

  return (
    <>
      <NavBar>
        <Search query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>

      <Main>
        <Box>
          {/* {isLoading ? <Loader /> : <MovieList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelectMovie={handleSelectMovie} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>

        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
              watched={watched}
            />
          ) : (
            <>
              <WatchedSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onDeleteWatched={handleDeleteWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}

function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}

function NavBar({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>NightIn</h1>
    </div>
  );
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>

      {isOpen && children}
    </div>
  );
}

// function MovieList({ movies, onSelectMovie }) {
//   return (
//     <ul className="list list-movies">
//       {movies?.map((movie) => (
//         <Movie
//           movie={movie}
//           key={movie.id}
//           onSelectMovie={() => {
//             onSelectMovie(movie.id);
//           }}
//         />
//       ))}
//     </ul>
//   );
// }
function MovieList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => {
        if (movie.media_type === "movie" || movie.media_type === "tv") {
          return (
            <Movie
              movie={movie}
              key={movie.id}
              onSelectMovie={() => {
                onSelectMovie(movie.id);
              }}
            />
          );
        }
        return null;
      })}
    </ul>
  );
}

function Movie({ movie, onSelectMovie }) {
  if (!movie || !movie.title) {
    return null; // Or some loading indicator
  }
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "";
  // const posterUrl = poster ? `https://image.tmdb.org/t/p/w500${poster}` : ""; // Use the correct base URL for movie posters

  return (
    <li key={movie.id} onClick={() => onSelectMovie(movie.id)}>
      <img src={posterUrl} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.release_date.substring(0, 4)}</span>
        </p>
      </div>
    </li>
  );
}

function MovieDetails({ selectedId, onCloseMovie, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [userRating, setUserRating] = useState("");
  // const [genres, setGenres] = useState([]);
  const [actors, setActors] = useState([]);
  const [directors, setDirectors] = useState([]);
  useEffect(() => {
    async function getMovieDetails() {
      setIsLoading(true);
      const movieResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${selectedId}?api_key=${KEY}`
      );
      const movieData = await movieResponse.json();
      console.log("movieData.genres:", movieData.genres);
      setMovie(movieData);
      setIsLoading(false);

      // // Get Genres
      // const genresResponse = await fetch(
      //   `https://api.themoviedb.org/3/movie/${selectedId}/genres?api_key=${KEY}`
      // );
      // const genresData = await genresResponse.json();
      // setGenres(genresData.genres);
      // Get Genres

      // Get Credits (Actors and Directors)
      const creditsResponse = await fetch(
        `https://api.themoviedb.org/3/movie/${selectedId}/credits?api_key=${KEY}`
      );
      const creditsData = await creditsResponse.json();
      setActors(creditsData.cast);
      setDirectors(creditsData.crew);
    }

    getMovieDetails();
  }, [selectedId]);

  const countRef = useRef(0);

  useEffect(() => {
    const updatedCount = countRef.current + 1;
    countRef.current = updatedCount;
  }, [userRating]);

  const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
  const watchedUserRating = watched.find(
    (movie) => movie.imdbID === selectedId
  )?.userRating;

  const {
    title,
    release_date: released,
    poster_path: poster,
    runtime,
    vote_average: imdbRating,
    overview: plot,
    // credits: { cast: actors, crew: directors } = {},
    // genres,
  } = movie;

  // const isTop = imdbRating > 8;
  // console.log(isTop);

  // const [avgRating, setAvgRating] = useState(0);

  function handleAdd() {
    const newWatchedMovie = {
      imdbID: selectedId,
      title,
      year: released.substring(0, 4), // Extract the year from the release_date
      poster: poster ? `https://image.tmdb.org/t/p/w500${poster}` : "", // Use TMDb image URL
      imdbRating: imdbRating,
      runtime: runtime,
      userRating,
      countRatingDecisions: countRef.current,
    };

    onAddWatched(newWatchedMovie);
    onCloseMovie();
  }

  useKey("Escape", onCloseMovie);

  useEffect(
    function () {
      if (!title) return;
      document.title = `Movie | ${title}`;

      return function () {
        document.title = "NightIn";
        // console.log(`Clean up effect for movie ${title}`);
      };
    },
    [title]
  );

  return (
    <div className="details">
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            {/* <img src={poster} alt={`Poster of ${title} movie`} /> */}
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={`Poster of ${movie.title} movie`}
            />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              {/* <p>Genre: {genres.map((genre) => genre.name).join(", ")}</p> */}
              <p>
                Genre:{" "}
                {movie.genres && movie.genres.length > 0
                  ? movie.genres.map((genre) => genre.name).join(", ")
                  : "N/A"}
              </p>
              <p>
                <span>⭐️</span>
                {imdbRating} IMDb rating
              </p>
            </div>
          </header>
          {/* <p>{avgRating}</p> */}
          <section>
            <div className="rating">
              {!isWatched ? (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    onSetRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={handleAdd}>
                      + Add to list
                    </button>
                  )}
                </>
              ) : (
                <p>
                  You rated with movie {watchedUserRating} <span>⭐️</span>
                </p>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>
              Starring:{" "}
              {actors && actors.length > 0
                ? actors.map((actor) => actor.name).join(", ")
                : "N/A"}
            </p>

            <p>
              Directed by:{" "}
              {directors && directors.length > 0
                ? directors
                    .filter((crewMember) => crewMember.job === "Director")
                    .map((director) => director.name)
                    .join(", ")
                : "N/A"}
            </p>
          </section>
        </>
      )}
    </div>
  );
}

function WatchedSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onDeleteWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          movie={movie}
          key={movie.imdbID}
          onDeleteWatched={onDeleteWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onDeleteWatched }) {
  return (
    <li>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => onDeleteWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
