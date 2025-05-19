// src/redux/slices/watchListSlice.js
import { createSlice, createAsyncThunk, nanoid } from '@reduxjs/toolkit';
import axios from 'axios';
import { getItemFromStorage, setItemToStorage } from '../storage/storageService';
import { API_MOVIE_LIST, API_KEY } from '../../constants/api';

/* -------------------------------------------------------------------------- */
/* 1) En popüler 5 filmi çeken thunk — axios                                  */
/* -------------------------------------------------------------------------- */
export const fetchInitialWatchlist = createAsyncThunk(
  'watchlists/fetchInitial',
  async () => {
    const { data } = await axios.get(
      `${API_MOVIE_LIST}?api_key=${API_KEY}&sort_by=popularity.desc`
    );
    /* yalnıza ilk 5 filmi döndür */
    return data.results.slice(0, 5);
  }
);

/* -------------------------------------------------------------------------- */
/* 2) Başlangıç state’i                                                       */
/* -------------------------------------------------------------------------- */
const initialState = {
  watchlists:
    getItemFromStorage('watchlists') ??
    [
      /* Eğer storage boşsa yine de bir varsayılan liste olsun */
      { id: nanoid(), name: 'İzlenecekler', movies: [] }
    ],
  status: 'idle'
};

/* -------------------------------------------------------------------------- */
/* 3) Slice                                                                   */
/* -------------------------------------------------------------------------- */
const watchListSlice = createSlice({
  name: 'watchlists',
  initialState,
  reducers: {
    createWatchlist(state, action) {
      state.watchlists.push({
        id: nanoid(),
        name: action.payload.name,
        movies: []
      });
      setItemToStorage('watchlists', state.watchlists);
    },

    renameWatchlist(state, action) {
      const wl = state.watchlists.find(w => w.id === action.payload.id);
      if (wl) wl.name = action.payload.name;
      setItemToStorage('watchlists', state.watchlists);
    },

    removeWatchlist(state, action) {
      state.watchlists = state.watchlists.filter(
        w => w.id !== action.payload.id
      );
      setItemToStorage('watchlists', state.watchlists);
    },

    addMovie(state, action) {
      const wl = state.watchlists.find(
        w => w.id === action.payload.watchlistId
      );
      if (wl && !wl.movies.some(m => m.id === action.payload.movie.id)) {
        wl.movies.push(action.payload.movie);
        setItemToStorage('watchlists', state.watchlists);
      }
    },

    removeMovie(state, action) {
      const wl = state.watchlists.find(
        w => w.id === action.payload.watchlistId
      );
      if (wl) {
        wl.movies = wl.movies.filter(m => m.id !== action.payload.movieId);
        setItemToStorage('watchlists', state.watchlists);
      }
    }
  },

  /* ---------------------------------------------------------------------- */
  /* 4) Thunk sonuçlarını işle                                               */
  /* ---------------------------------------------------------------------- */
  extraReducers: builder => {
    builder
      .addCase(fetchInitialWatchlist.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchInitialWatchlist.fulfilled, (state, action) => {
        state.status = 'succeeded';

        /* watchlists dizisi boşsa önce varsayılanı oluştur */
        if (state.watchlists.length === 0) {
          state.watchlists.push({
            id: nanoid(),
            name: 'İzlenecekler',
            movies: action.payload
          });
        } else {
          const defaultWl = state.watchlists[0];

          /* movies alanı yoksa veya boşsa doldur */
          if (!defaultWl.movies || defaultWl.movies.length === 0) {
            defaultWl.movies = action.payload;
          }
        }

        setItemToStorage('watchlists', state.watchlists);
      })
      .addCase(fetchInitialWatchlist.rejected, state => {
        state.status = 'failed';
      });
  }
});

/* -------------------------------------------------------------------------- */
/* 5) Export’lar                                                              */
/* -------------------------------------------------------------------------- */
export const {
  createWatchlist,
  renameWatchlist,
  removeWatchlist,
  addMovie,
  removeMovie
} = watchListSlice.actions;

export default watchListSlice.reducer;
