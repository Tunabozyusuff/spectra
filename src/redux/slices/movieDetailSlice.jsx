import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_MOVIE_DETAIL, API_KEY } from '../../constants/api'

const initialState = {
    movieDetail: {},
    status: 'idle',
    error: null,
}

export const getMovieDetailById = createAsyncThunk('getMovieDetailById', async (id) => {
    const res = await axios.get(`${API_MOVIE_DETAIL}/${id}?api_key=${API_KEY}`)
    return res.data;
})

export const movieDetailSlice = createSlice({
    name: 'movieDetail',
    initialState,
    reducers: {},
    extraReducers: (builder) => {  // HTTP Request
        builder.addCase(getMovieDetailById.pending, (state, action) => {
            state.status = action.meta.requestStatus;
        })
        builder.addCase(getMovieDetailById.fulfilled, (state, action) => {
            state.status = action.meta.requestStatus;
            state.movieDetail = action.payload;
        })
        builder.addCase(getMovieDetailById.rejected, (state, action) => {
            state.status = action.meta.requestStatus;
            state.error = action.error.message;
        })
    }
})

export const { } = movieDetailSlice.actions

export default movieDetailSlice.reducer