import { ReactNode } from "react";
import { Navigate } from "react-router-dom";

import AuthGuard from "../auth/AuthGuard";
import GuestGuard from "../auth/GuestGuard";

import Login from "../pages/auth/Login";
import Register from "../Pages/auth/Register";
import Home from "../Pages/Home/Home";
import MyList from "../Pages/MyList/MyList";
import MovieDetail from "../Pages/MovieDetail/MovieDetail";

import Layout from "../Pages/layouts/Layout";
import AuthLayout from "../Pages/layouts/AuthLayout";
import Profile from "../components/profile/Profile";

export interface RouteItem {
  path?: string;
  element?: ReactNode;
  children?: RouteItem[];
  index?: boolean;
}

const routes: RouteItem[] = [
  {
    path: '/login',
    element: (
      <GuestGuard>
        <Login />
      </GuestGuard>
    ),
  },
  {
    path: '/register',
    element: (
      <GuestGuard>
        <Register />
      </GuestGuard>
    )
  },

  /* ───────────────── Oturum açık rotalar ─────────────── */
  {
    path: '/',          // artık tek “/” sadece buraya ait
    element: (
      <AuthGuard>
        <Layout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'my-list', element: <MyList /> },
      { path: 'profile', element: <Profile /> },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
];
export default routes;
