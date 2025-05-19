import './MovieCard.css';
import { FaStar } from "react-icons/fa";
import { API_IMG } from '../../constants/api';
import MovieDetail from '../../Pages/MovieDetail/MovieDetail';
import { Dialog, DialogContent, DialogOverlay, DialogTrigger } from '@radix-ui/react-dialog';

const MovieCard = ({ movie }) => {
    const { id, poster_path, vote_average, title } = movie;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className='Movie-Card cursor-pointer  shrink-0'>
                    <div className="gradient"></div>
                    <img src={`${API_IMG}/${poster_path}`} alt={title} />
                    <div className="movie-info">
                        <div className="movie-rating">
                            <p>{vote_average?.toFixed(1)}</p>
                            <FaStar />
                        </div>
                    </div>
                </div>
            </DialogTrigger>

            <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
            <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-6xl w-full p-4 bg-black rounded-xl shadow-lg z-50">
                <MovieDetail id={id} />
            </DialogContent>
        </Dialog>
    );
};

export default MovieCard;
