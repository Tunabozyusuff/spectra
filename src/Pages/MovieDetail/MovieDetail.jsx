// src/pages/MovieDetail/MovieDetail.jsx
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getMovieDetailById } from '../../redux/slices/movieDetailSlice';
import {
    addFavorite,
    removeFavorite
} from '../../redux/slices/favoriteSlice';
import {
    addMovie as addWatchMovie,
    removeMovie as removeWatchMovie
} from '../../redux/slices/watchListSlice';

import { API_IMG } from '../../constants/api';
import { FaStar } from 'react-icons/fa';
import Loading from '../../components/Loading/Loading';
import Error from '../../components/Error';
import './MovieDetail.css';

const MovieDetail = ({ id }) => {
    /* ------------------------------------------------------------------ */
    /* 1) Store verileri ve dispatcher                                     */
    /* ------------------------------------------------------------------ */
    const dispatch = useDispatch();

    /* Film detay slice */
    const { movieDetail, status, error } = useSelector(
        s => s.movieDetail
    );

    /* Tüm watchlist’ler */
    const watchlists = useSelector(s => s.watchlists.watchlists);

    /* Favori kontrolü */
    const isFavorite = useSelector(s =>
        s.favorites.favoriteMovies?.some(m => m.id === id)
    );

    /* ------------------------------------------------------------------ */
    /* 2) Yerel state – seçili watchlist ID’si                            */
    /* ------------------------------------------------------------------ */
    const [selectedWlId, setSelectedWlId] = useState(
        watchlists[0]?.id ?? null
    );

    /* Seçili liste objesi */
    const selectedWatchlist = useMemo(
        () => watchlists.find(w => w.id === selectedWlId),
        [watchlists, selectedWlId]
    );

    /* Film zaten o listede var mı? */
    const isInSelectedWatchlist = selectedWatchlist?.movies?.some(
        m => m.id === id
    );

    /* ------------------------------------------------------------------ */
    /* 3) Yan etkiler                                                      */
    /* ------------------------------------------------------------------ */
    useEffect(() => {
        dispatch(getMovieDetailById(id));
    }, [id, dispatch]);

    /* Eğer watchlists henüz gelmemişse ilkini default seç */
    useEffect(() => {
        if (!selectedWlId && watchlists.length) {
            setSelectedWlId(watchlists[0].id);
        }
    }, [watchlists, selectedWlId]);

    /* ------------------------------------------------------------------ */
    /* 4) Handler’lar                                                      */
    /* ------------------------------------------------------------------ */
    const { title, overview, vote_average, backdrop_path, poster_path,
        genres, spoken_languages, release_date } = movieDetail;

    const payloadCore = { id, title, poster_path, vote_average };

    const handleAddFavorite = () => dispatch(addFavorite(payloadCore));
    const handleRemoveFavorite = () => dispatch(removeFavorite({ id }));

    const handleToggleInWatchlist = e => {
        const wlId = e.target.value;
        if (!wlId) return;

        const wl = watchlists.find(w => w.id === wlId);
        const movieObj = { id, title, poster_path, vote_average };
        const exists = wl?.movies?.some(m => m.id === id);

        if (exists) {
            dispatch(removeWatchMovie({ watchlistId: wlId, movieId: id }));
        } else {
            dispatch(addWatchMovie({ watchlistId: wlId, movie: movieObj }));
        }

        /* Seçimi sıfırla – sadece işlem yapsın */
        e.target.selectedIndex = 0;
    };

    const releaseYear = new Date(release_date).getFullYear();

    /* ------------------------------------------------------------------ */
    /* 5) UI                                                              */
    /* ------------------------------------------------------------------ */
    return (
        <div className="movie-detail">
            {status === 'pending' && <Loading />}
            {status === 'rejected' && <Error error={error} />}

            {status === 'fulfilled' && (
                <>
                    <img
                        className="backdrop"
                        src={`${API_IMG}/${backdrop_path}`}
                        alt={title}
                    />

                    {/* -------- HEADER ------------------------------------------------ */}
                    <header>
                        <p>{title}</p>

                        <div className="add-remove-favorite">
                            {/* ---- WATCHLIST SELECT + BUTTON ---------------------------- */}
                            <div className="flex gap-3 items-center">
                                <select onChange={handleToggleInWatchlist} className="list-select" >
                                    <option value="">Choose list</option>
                                    {watchlists.map(wl => (
                                        <option key={wl.id} value={wl.id}>
                                            {wl.name} {wl.movies.some(m => m.id === id) ? '✓' : ''}
                                        </option>
                                    ))}
                                </select>

                                {/* ---- FAVORITE BUTTON ----------------------------------- */}
                                <button
                                    className={isFavorite ? 'remove-btn' : 'add-btn'}
                                    onClick={isFavorite ? handleRemoveFavorite : handleAddFavorite}
                                >
                                    {isFavorite ? 'Remove Favorite' : 'Add Favorite'}
                                </button>
                            </div>
                        </div>
                    </header>

                    {/* -------- CONTENT --------------------------------------------- */}
                    <div className="content">
                        <div className="left">
                            <img
                                src={`${API_IMG}/${poster_path}`}
                                alt={title}
                                className="movie-poster_path"
                            />
                        </div>

                        <div className="right">
                            <p className="movie-overview">{overview}</p>

                            <div className="movie-rating">
                                <FaStar />
                                <p>{vote_average?.toFixed(1)}</p>
                            </div>

                            <div className="release-date">
                                <span>Year:</span>
                                <p>{releaseYear}</p>
                            </div>

                            <div className="movie-info">
                                <div className="movie-genres">
                                    <span>Genres:</span>
                                    <ul>{genres?.map(g => <li key={g.id}>{g.name}</li>)}</ul>
                                </div>

                                <div className="movie-languages">
                                    <span>Languages:</span>
                                    <ul>
                                        {spoken_languages?.map((l, i) => (
                                            <li key={i}>{l.name}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default MovieDetail;