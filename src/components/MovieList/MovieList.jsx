import './MovieList.css';
import axios from 'axios';
import Error from '../Error';
import Loading from '../Loading/Loading';
import MovieCard from '../MovieCard/MovieCard';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { API_KEY, API_POPULAR } from '../../constants/api';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { getMovieList, getMovieListByGenre } from '../../redux/slices/movieListSlice';

const MovieList = ({ selectedGenre }) => {
    const trackRef = useRef(null);
    const dispatch = useDispatch();
    const excludedGenres = [18, 10749];
    const [loading, setLoading] = useState(false);
    const [populars, setPopulars] = useState(null);
    const { movieList, status, error } = useSelector((store) => store.movieList);

    async function fetchData() {
        try {
            setLoading(true)
            const response = await axios.get(`${API_POPULAR}?api_key=${API_KEY}&page=3`);
            setPopulars(response.data.results);
        } catch (error) {
            setLoading(false);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchData();
    }, [])

    const scroll = (dir) => {
        const node = trackRef.current;
        if (!node) return;
        const scrollAmount = node.clientWidth / 1.2;      // ≈ 1 ekran kartı
        node.scrollBy({
            left: dir === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
        });
    };

    // excludedGenres dizisindeki elemanlardan herhngi birini içermeyen filmleri filtredim.
    const filteredMovies = movieList.filter((movie) =>
        !movie.genre_ids.some((genreId) => excludedGenres.includes(genreId))
    );

    useEffect(() => {
        if (!selectedGenre) {
            dispatch(getMovieList())
        } else {
            dispatch(getMovieListByGenre(selectedGenre.id))
        }
    }, [selectedGenre, dispatch])

    return (
        <div className='movie-list'>
            <h1 className='text-center text-2xl uppercase font-extrabold mt-10 text-shadow-lg text-shadow-black'>Popular ON spectra</h1>
            <div className="relative my-10 md:px-[60px]">
                <div ref={trackRef} className={`flex gap-4 overflow-x-auto scroll-smooth no-scrollbar movies`}>
                    {loading ? (
                        <div className="flex h-40 w-full items-center justify-center">
                            <Loading />
                        </div>
                    ) : (
                        populars?.map((m) => (
                            <MovieCard movie={m} />
                        ))
                    )}
                </div>

                {/* Sol ok -------------------------------------------------------- */}
                <button
                    onClick={() => scroll("left")}
                    className="absolute left-0 top-1/2 -translate-y-1/2
                   hidden md:flex h-10 w-10 items-center justify-center
                   rounded-full bg-gray-500 hover:opacity-70
                   text-white backdrop-blur-sm"
                >
                    <BiChevronLeft size={20} />
                </button>

                {/* Sağ ok -------------------------------------------------------- */}
                <button
                    onClick={() => scroll("right")}
                    className="absolute right-0 top-1/2 -translate-y-1/2
                   hidden md:flex h-10 w-10 items-center justify-center
                   rounded-full bg-gray-500 hover:opacity-70
                   text-white backdrop-blur-sm"
                >
                    <BiChevronRight size={20} />
                </button>
            </div>

            <h1 className='text-center text-2xl uppercase font-extrabold text-shadow-lg text-shadow-black'>Recommended For You</h1>
            <ul>
                {
                    status === 'fulfilled' ?
                        filteredMovies && filteredMovies.map(movie => (
                            <MovieCard key={movie.id} movie={movie} />
                        )) :
                        status === 'pending' ?
                            <Loading /> :
                            <Error error={error} />
                }
            </ul>
        </div>
    )
}

export default MovieList