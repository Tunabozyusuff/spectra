import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGenre } from '../../redux/slices/genreSlice'
import './Genre.css'

const Genre = ({ setSelectedGenre }) => {
    const { genres } = useSelector((store) => store.genres)
    let filteredGenres = genres.filter((genre) => {
        return genre.id !== 10749 && genre.id !== 18;
      })  
    const dispatch = useDispatch();

    const [activeGenre, setActiveGenre] = useState(null)

    const handleGenre = (genre) => {
        setSelectedGenre(genre)
        setActiveGenre(genre.id)
    }

    useEffect(() => {
        dispatch(getGenre())
    }, [])

    return (
        <div className='genres relative z-10'>
            <ul>
                {filteredGenres && filteredGenres.map((genre) => (
                    <li
                        className={`${activeGenre === genre.id ? 'active' : ''} uppercase`}
                        onClick={() => handleGenre(genre)}
                        key={genre.id}>{genre.name}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Genre