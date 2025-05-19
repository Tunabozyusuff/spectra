import { configureStore } from '@reduxjs/toolkit'
import genreSlice from './slices/genreSlice'
import movieListSlice from './slices/movieListSlice'
import movieDetailSlice from './slices/movieDetailSlice'
import favoriteSlice from './slices/favoriteSlice'
import watchListSlice from './slices/watchListSlice'

export const store = configureStore({
  reducer: {
    genres: genreSlice,
    movieList: movieListSlice,
    watchlists: watchListSlice,
    movieDetail: movieDetailSlice,
    favorites: favoriteSlice
  },
})