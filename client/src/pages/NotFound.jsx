/**
 * NotFound.jsx
 *
 * Fallback page rendered for unknown or invalid routes (404).
 *
 * Responsibilities:
 *  - Inform the user that the requested page does not exist
 *  - Provide a simple navigation link back to the home page
 *
 * This page is intentionally minimal and does not depend on
 * application state or layout wrappers.
 */

import React from "react";
import { Error as ErrorIcon } from "@mui/icons-material";
import { Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <Container maxWidth="lg" sx={{ height: "100vh" }}>
      <Stack
        alignItems={"center"}
        spacing={"2rem"}
        justifyContent={"center"}
        height="100%"
      >
        {/* Large error icon for visual emphasis */}
        <ErrorIcon sx={{ fontSize: "10rem" }} />

        {/* HTTP status code */}
        <Typography variant="h1">404</Typography>

        {/* Error description */}
        <Typography variant="h3">Not Found</Typography>

        {/* Navigation back to a valid route */}
        <Link to="/">Go back to home</Link>
      </Stack>
    </Container>
  );
};

export default NotFound;
