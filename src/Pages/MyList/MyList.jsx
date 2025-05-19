import './MyList.css';
import { useSelector } from 'react-redux';
import MovieCard from '../../components/MovieCard/MovieCard';

const MyList = () => {

  const { favoriteMovies } = useSelector(store => store.favorites)

  return (
    <div className='my-list'>

      {favoriteMovies.length > 0 &&
        <>
          <h1 className='text-center text-2xl uppercase font-extrabold mt-10'>My Favorites</h1>

          <ul>
            {
              favoriteMovies?.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))
            }
          </ul>
        </>
      }

      {favoriteMovies.length === 0 &&
        <h1 className='text-2xl uppercase font-extrabold text-gray-500 mt-10'>No favorite movies yet.</h1>
      }
    </div>
  )
}

export default MyList