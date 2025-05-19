/* -------------------------------------------------------------------------- */
/*  Profile.jsx                                                               */
/* -------------------------------------------------------------------------- */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import MovieCard from '../MovieCard/MovieCard';
import { useAuthContext } from '../../auth/useAuthContext';

import {
  fetchInitialWatchlist,
  createWatchlist,
  renameWatchlist,
  removeWatchlist
} from '../../redux/slices/watchListSlice';

import {
  Dialog,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogClose
} from '@radix-ui/react-dialog';

export default function Profile() {
  const dispatch = useDispatch();

  /* ----------- Global State ----------- */
  const { user } = useAuthContext();
  const { favoriteMovies } = useSelector(s => s.favorites);
  const { watchlists, status } = useSelector(s => s.watchlists);

  /* ----------- Local State ----------- */
  // Yeni liste
  const [openNew, setOpenNew] = useState(false);
  const [newName, setNewName] = useState('');

  // Rename
  const [renameOpenId, setRenameOpenId] = useState(null);
  const [renameValue, setRenameValue] = useState('');

  // Delete
  const [deleteOpenId, setDeleteOpenId] = useState(null);

  useEffect(() => {
    dispatch(fetchInitialWatchlist());
  }, [dispatch]);

  /* ----------- Yardımcılar ----------- */
  const openRename = wl => {
    setRenameValue(wl.name);
    setRenameOpenId(wl.id);
  };
  const closeRename = () => setRenameOpenId(null);

  const openDelete = id => setDeleteOpenId(id);
  const closeDelete = () => setDeleteOpenId(null);

  /* ======================================================================== */
  /*                                RENDER                                    */
  /* ======================================================================== */
  return (
    <div className="flex justify-center w-full">
      <div className="container flex flex-col gap-10">

        {/* ==================== USER AREA ==================== */}
        <div className="flex md:justify-between justify-center items-center md:flex-row flex-col">
          <div className="p-3 flex items-center gap-4">
            <img
              src="https://cdn-icons-png.flaticon.com/512/147/147140.png"
              alt=""
              className="rounded-full size-20"
            />

            <div className="flex flex-col gap-3">
              <div className="flex gap-1">
                <h4>{user.name}</h4>
                <h4>{user.lastname}</h4>
              </div>
            </div>
          </div>

          {/* Dummy stats */}
          <div className="flex items-center gap-10 flex-wrap justify-center md:mt-0 mt-10">
            {[
              { label: 'FILMS', value: 333 },
              { label: 'This Year', value: 26 },
              { label: 'List', value: 2 },
              { label: 'Following', value: 12 },
              { label: 'Followers', value: 12 }
            ].map(stat => (
              <div
                key={stat.label}
                className="flex flex-col gap-1 border-r last:border-none border-r-slate-300 pr-8 last:pr-0"
              >
                <p className="text-white text-lg text-center">{stat.value}</p>
                <p className="text-gray-500 text-base">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ==================== FAVORITES ==================== */}
        {favoriteMovies?.length > 0 && (
          <div className="flex flex-col gap-5">
            <h1 className="text-2xl uppercase font-extrabold mt-10 border-b">
              Favorite Films
            </h1>
            <ul className="flex flex-wrap md:justify-start justify-center">
              {favoriteMovies.map(movie => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          </div>
        )}

        {/* ==================== WATCHLISTS =================== */}
        <section className="flex flex-col gap-5">
          <h1 className="text-2xl uppercase font-extrabold mt-10 border-b">
            WatchList
          </h1>

          {/* -------- Yeni Liste Dialog -------- */}
          <div className="flex items-center justify-end">
            <Dialog open={openNew} onOpenChange={setOpenNew}>
              <DialogTrigger asChild>
                <button className="uppercase border p-1 rounded-sm px-4 hover:opacity-50 transition-all">
                  Create New List
                </button>
              </DialogTrigger>

              <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />

              <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                 w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-lg z-50">
                <h2 className="text-lg mb-4 font-semibold">Create New List</h2>

                <label className="block mb-2 text-sm">List Name</label>
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="e.g. Weekend"
                  className="w-full mb-6 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
                />

                <div className="flex justify-end gap-3">
                  <DialogClose asChild>
                    <button className="border px-4 py-1 rounded">Cancel</button>
                  </DialogClose>

                  <button
                    disabled={!newName.trim()}
                    className="border px-4 py-1 rounded"
                    onClick={() => {
                      dispatch(createWatchlist({ name: newName.trim() }));
                      setNewName('');
                      setOpenNew(false);
                    }}
                  >
                    Save
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {status === 'loading' && <p>Loading…</p>}

          {watchlists.map(wl => (
            <div key={wl.id} className="mb-8">
              {/* -------- Header w/ actions -------- */}
              <header className="flex items-center justify-between mb-4">
                <h2 className="text-base font-semibold">
                  {wl.name}{' '}
                  <span className="text-sm text-gray-400">
                    ({wl.movies.length})
                  </span>
                </h2>

                <div className="flex gap-2">
                  <button
                    className="border px-2 py-0.5 rounded text-xs"
                    onClick={() => openRename(wl)}
                  >
                    Rename
                  </button>

                  <button
                    className="border px-2 py-0.5 rounded text-xs text-red-400"
                    onClick={() => openDelete(wl.id)}
                  >
                    Delete
                  </button>
                </div>
              </header>

              {/* -------- Film Cards -------- */}
              <ul className="flex flex-wrap md:justify-start justify-center">
                {wl.movies.map(m => (
                  <MovieCard key={m.id} movie={m} />
                ))}
              </ul>

              {/* ---------- Rename Dialog ---------- */}
              <Dialog
                open={renameOpenId === wl.id}
                onOpenChange={closeRename}
              >
                <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-full max-w-md bg-zinc-900 p-6 rounded-xl shadow-lg z-50">
                  <h2 className="text-lg mb-4 font-semibold">Rename List</h2>

                  <input
                    value={renameValue}
                    onChange={e => setRenameValue(e.target.value)}
                    className="w-full mb-6 px-3 py-2 rounded bg-zinc-800 border border-zinc-700 focus:outline-none"
                  />

                  <div className="flex justify-end gap-3">
                    <DialogClose asChild>
                      <button className="border px-4 py-1 rounded">Cancel</button>
                    </DialogClose>

                    <button
                      disabled={!renameValue.trim()}
                      className="border px-4 py-1 rounded"
                      onClick={() => {
                        dispatch(
                          renameWatchlist({ id: wl.id, name: renameValue.trim() })
                        );
                        closeRename();
                      }}
                    >
                      Save
                    </button>
                  </div>
                </DialogContent>
              </Dialog>

              {/* ---------- Delete Dialog ---------- */}
              <Dialog
                open={deleteOpenId === wl.id}
                onOpenChange={closeDelete}
              >
                <DialogOverlay className="fixed inset-0 bg-black/50 z-50" />
                <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                   w-full max-w-sm bg-zinc-900 p-6 rounded-xl shadow-lg z-50">
                  <h2 className="text-lg font-semibold mb-4">
                    Delete this list?
                  </h2>
                  <p className="mb-6 text-sm text-gray-400">
                    Are you sure you want to delete this watchlist? This action
                    cannot be undone.
                  </p>

                  <div className="flex justify-end gap-3">
                    <DialogClose asChild>
                      <button className="border px-4 py-1 rounded">Cancel</button>
                    </DialogClose>

                    <button
                      className="border px-4 py-1 rounded text-red-400"
                      onClick={() => {
                        dispatch(removeWatchlist({ id: wl.id }));
                        closeDelete();
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}