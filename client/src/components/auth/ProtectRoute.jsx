import React from "react";
import { Navigate, Outlet } from "react-router-dom";

/**
 * ProtectRoute
 *
 * A simple route guard used to control access based on authentication state.
 *
 * Usage patterns:
 * 1) As a wrapper around protected components (via `children`)
 * 2) As a parent route using <Outlet /> for nested protected routes
 *
 * Props:
 * - user: authenticated user object (truthy if logged in, falsy otherwise)
 * - redirect: path to redirect unauthenticated users to (default: "/login")
 * - children: optional React nodes to render when access is allowed
 */
const ProtectRoute = ({ children, user, redirect = "/login" }) => {
  /**
   * If no authenticated user exists, immediately redirect.
   * This prevents protected routes from rendering even briefly.
   */
  if (!user) return <Navigate to={redirect} />;

  /**
   * If children are provided, render them directly.
   * Otherwise, render <Outlet /> to support nested routes
   * defined in the parent <Route> configuration.
   */
  return children ? children : <Outlet />;
};

export default ProtectRoute;
