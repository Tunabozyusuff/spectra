import React, { useState } from 'react'
import { PiFilmReelFill, PiPower } from "react-icons/pi";
import { TiHome } from "react-icons/ti";
import { FaHeart, FaSearch, FaSpinner, FaUser } from "react-icons/fa";
import './Navbar.css'
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useAuthContext } from '../../auth/useAuthContext';
import { clearSearch, getMovieList, searchMovies } from '../../redux/slices/movieListSlice';


const Navbar = () => {
    const { logout } = useAuthContext();
    const favoriteCounter = useSelector(store => store.favorites.favoriteMovies.length)
    const [keyword, setKeyword] = useState('');
    const dispatch = useDispatch();

    const handleChange = (e) => {
        const value = e.target.value;
        setKeyword(value);

        // input temizlenmişse eski listeye dön
        if (value.trim() === '') {
            dispatch(clearSearch());
            dispatch(getMovieList());
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (keyword.trim()) {
            dispatch(searchMovies(keyword.trim()));
        }
    };

    return (
        <nav className="navbar md:px-20 py-5 px-10 z-10 relative">
            <div className=' flex items-center justify-between w-full md:max-w-6xl'>
                <div className="left">
                    <Link to={"/"}>
                        <h1 className='font-extrabold font-poppins text-4xl text-white'
                            style={{ fontFamily: 'poppins', letterSpacing: '-3px' }}>spectra.</h1>
                    </Link>
                </div>
                <div className="">
                    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
                        <input
                            type="text"
                            value={keyword}
                            onChange={handleChange}
                            placeholder="Search movie..."
                            className="px-3 py-1 rounded  text-white"
                        />


                        <button
                            type='submit'
                            className="text-white size-5 rounded-full"
                        >
                            <FaSearch className='w-full h-full hover:opacity-50' />
                        </button>
                    </form>
                </div>
                <div className="right">
                    <ul>
                        <li>
                            <Link to="/" className='uppercase font-bold text-sm'>
                                <TiHome/>
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" className='uppercase font-bold text-sm'>
                                Profile
                            </Link>
                        </li>
                        <li>
                            <Link to="/profile" className='uppercase font-bold text-sm'>
                                WATCHLIST
                            </Link>
                        </li>
                        <li className='relative'>
                            <Link to="/my-list" className='uppercase font-bold text-sm'>
                                Favorites
                                <div className='favorite-count'>{favoriteCounter}</div>
                            </Link>
                        </li>
                        <li onClick={logout}>
                            <PiPower />
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    )
}

export default Navbar