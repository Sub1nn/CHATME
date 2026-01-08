/**
 * App.jsx
 *
 * Root router for the React client.
 *
 * Responsibilities:
 *  - Bootstrap the auth session on first mount (cookie-based session via /user/me)
 *  - Show a full-page loader while auth state is being resolved
 *  - Define routing for:
 *      - authenticated user pages (wrapped with SocketProvider)
 *      - public login page (only accessible when NOT logged in)
 *      - admin pages (currently routed directly; access control may be handled inside pages)
 *      - catch-all NotFound route
 *
 * Notes:
 *  - Page components are lazy-loaded to keep the initial bundle smaller.
 *  - ProtectRoute is used as a route guard to allow/redirect based on auth state.
 */

import React, { Suspense, lazy, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Route guard that either renders protected pages or redirects to login/home
import ProtectRoute from "./components/auth/ProtectRoute";

// Full-page loader used while checking auth state and while lazy chunks load
import { LayoutLoader } from "./components/layout/Loaders";

import axios from "axios";
import { server } from "./constants/config";

// Redux: auth state + actions to set/clear current user
import { useDispatch, useSelector } from "react-redux";
import { userExists, userNotExists } from "./redux/reducers/auth";

// Global toast notifications (errors, success messages, etc.)
import { Toaster } from "react-hot-toast";

// Provides a single socket connection for all protected pages
import { SocketProvider } from "./socket";

/**
 * Code-splitting:
 * Pages are lazy-loaded so initial bundle stays small and routes load on demand.
 */
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Admin pages (lazy-loaded separately to keep user bundle lighter)
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const Dashboard = lazy(() => import("./pages/admin/Dashboard"));
const UserManagement = lazy(() => import("./pages/admin/UserManagement"));
const ChatManagement = lazy(() => import("./pages/admin/ChatManagement"));
const MessagesManagement = lazy(() =>
  import("./pages/admin/MessageManagement")
);

const App = () => {
  /**
   * auth slice:
   * - user: currently logged-in user object (null/undefined if not authenticated)
   * - loader: true while the app is verifying auth session on initial load
   */
  const { user, loader } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  /**
   * Session bootstrap:
   * On first mount, fetch current session user (cookie-based auth).
   * If successful -> store user in Redux.
   * If not -> mark user as not authenticated (important for route guard logic).
   *
   * Important:
   * - `withCredentials: true` is required so the browser sends cookies to the server
   *   (especially when client/server are on different ports).
   */
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch(() => dispatch(userNotExists()));
  }, [dispatch]);

  // If auth check is still running, show a full-page loader to avoid UI flicker
  return loader ? (
    <LayoutLoader />
  ) : (
    <BrowserRouter>
      {/* Suspense fallback handles lazy-loaded page bundles */}
      <Suspense fallback={<LayoutLoader />}>
        <Routes>
          {/**
           * Protected user routes:
           * SocketProvider is only mounted for authenticated user pages
           * (avoids creating socket connection on login screen / public pages).
           */}
          <Route
            element={
              <SocketProvider>
                <ProtectRoute user={user} />
              </SocketProvider>
            }
          >
            <Route path="/" element={<Home />} />
            <Route path="/chat/:chatId" element={<Chat />} />
            <Route path="/groups" element={<Groups />} />
          </Route>
          {/**
           * Public route:
           * Login should only be accessible when NOT logged in.
           * If user exists -> redirect to home.
           */}
          <Route
            path="/login"
            element={
              <ProtectRoute user={!user} redirect="/">
                <Login />
              </ProtectRoute>
            }
          />
          /** * Admin routes: * These routes render admin pages. * * NOTE: *
          They are not wrapped in ProtectRoute in this file. * If you rely on
          admin-only access, ensure: * - admin token checks happen inside the
          admin pages/hooks, OR * - you wrap these routes with a dedicated admin
          ProtectRoute. * TODO: Consider adding a dedicated admin route guard
          for these paths. */
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/chats" element={<ChatManagement />} />
          <Route path="/admin/messages" element={<MessagesManagement />} />
          {/* Catch-all route for unknown URLs */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Global toast container */}
      <Toaster position="bottom-center" />
    </BrowserRouter>
  );
};

export default App;
