// src/redux/slices/movieListSlice.js
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_KEY, API_POPULAR, API_SEARCH } from '../../constants/api';

const API_DISCOVER = 'https://api.themoviedb.org/3/discover/movie';

/* ------------------------------------------------------------------ */
/*                               Thunk’lar                            */
/* ------------------------------------------------------------------ */

// Ana (popüler) liste
export const getMovieList = createAsyncThunk('movieList/get', async () => {
  const { data } = await axios.get(
    `${API_POPULAR}?api_key=${API_KEY}&page=3`
  );
  return data.results;           // => film dizisi
});

// Seçili türe göre liste
export const getMovieListByGenre = createAsyncThunk(
  'movieList/getByGenre',
  async (genreId) => {
    const { data } = await axios.get(
      `${API_DISCOVER}?api_key=${API_KEY}&with_genres=${genreId}&page=4`
    );
    return data.results;         // => film dizisi
  }
);

// Arama
export const searchMovies = createAsyncThunk(
  'movieList/search',
  async (query) => {
    const { data } = await axios.get(
      `${API_SEARCH}?api_key=${API_KEY}&query=${encodeURIComponent(query)}`
    );
    return { query, results: data.results };
  }
);

/* ------------------------------------------------------------------ */
/*                           Başlangıç durumu                         */
/* ------------------------------------------------------------------ */
const initialState = {
  movieList: [],
  status: 'idle',        // idle | pending | fulfilled | rejected
  error: null,
  isSearch: false,
  searchQuery: '',
};

/* ------------------------------------------------------------------ */
/*                                 Slice                              */
/* ------------------------------------------------------------------ */
const movieListSlice = createSlice({
  name: 'movieList',
  initialState,
  reducers: {
    clearSearch(state) {
      state.isSearch = false;
      state.searchQuery = '';
      // movieList’i temizlemiyoruz; component yeniden getMovieList() çağıracak
    },
  },
  extraReducers: (builder) => {
    /* -------------------- Popüler liste -------------------- */
    builder
      .addCase(getMovieList.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getMovieList.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.movieList = action.payload;
        state.error = null;
        state.isSearch = false;
      })
      .addCase(getMovieList.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message || 'Bir hata oluştu';
      });

    /* ------------------ Tür bazlı liste -------------------- */
    builder
      .addCase(getMovieListByGenre.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(getMovieListByGenre.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.movieList = action.payload;
        state.error = null;
        state.isSearch = false;
      })
      .addCase(getMovieListByGenre.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message || 'Bir hata oluştu';
      });

    /* ----------------------- Arama ------------------------- */
    builder
      .addCase(searchMovies.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.status = 'fulfilled';
        state.movieList = action.payload.results;
        state.isSearch = true;
        state.searchQuery = action.payload.query;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.status = 'rejected';
        state.error = action.error.message || 'Bir hata oluştu';
      });
  },
});

/* ------------------------------------------------------------------ */
/*                            Selector’lar                            */
/* ------------------------------------------------------------------ */
export const selectMovieList = (state) => state.movieList.movieList;
export const selectMovieStatus = (state) => state.movieList.status;
export const selectIsSearch = (state) => state.movieList.isSearch;
export const selectSearchQuery = (state) => state.movieList.searchQuery;

/* ------------------------------------------------------------------ */
/*                         Export – actions/reducer                    */
/* ------------------------------------------------------------------ */
export const { clearSearch } = movieListSlice.actions;
export default movieListSlice.reducer;
