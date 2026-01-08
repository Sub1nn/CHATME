/**
 * Loaders.jsx
 *
 * Collection of shared loading UI components used across the app.
 *
 * Components:
 *  - LayoutLoader: Full-page skeleton loader matching the main app layout
 *  - TypingLoader: Small animated indicator used while a user is typing
 *
 * These loaders improve perceived performance while data or UI state
 * is being resolved.
 */

import { Grid, Skeleton, Stack } from "@mui/material";
import React from "react";

// Custom animated skeleton used for typing indicator
import { BouncingSkeleton } from "../styles/StyledComponents";

/**
 * LayoutLoader
 *
 * Displays a skeleton version of the main application layout:
 *  - Left: chat list placeholder
 *  - Center: list of chat/message placeholders
 *  - Right: profile panel placeholder
 *
 * Used while:
 *  - Fetching user's chats
 *  - Resolving authentication state
 *  - Initial page loads
 */
const LayoutLoader = () => {
  return (
    <Grid container height={"calc(100vh - 4rem)"} spacing={"1rem"}>
      {/* Left chat list skeleton (hidden on extra-small screens) */}
      <Grid
        item
        sm={4}
        md={3}
        sx={{
          display: { xs: "none", sm: "block" },
        }}
        height={"100%"}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>

      {/* Main content skeleton */}
      <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
        <Stack spacing={"1rem"}>
          {Array.from({ length: 10 }).map((_, index) => (
            <Skeleton key={index} variant="rounded" height={"5rem"} />
          ))}
        </Stack>
      </Grid>

      {/* Right profile panel skeleton (hidden on small screens) */}
      <Grid
        item
        md={4}
        lg={3}
        height={"100%"}
        sx={{
          display: { xs: "none", md: "block" },
        }}
      >
        <Skeleton variant="rectangular" height={"100vh"} />
      </Grid>
    </Grid>
  );
};

/**
 * TypingLoader
 *
 * Animated indicator displayed when another user is typing.
 * Uses multiple bouncing skeleton dots with staggered delays
 * to create a natural typing animation effect.
 */
const TypingLoader = () => {
  return (
    <Stack
      spacing={"0.5rem"}
      direction={"row"}
      padding={"0.5rem"}
      justifyContent={"center"}
    >
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.1s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.2s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.4s",
        }}
      />
      <BouncingSkeleton
        variant="circular"
        width={15}
        height={15}
        style={{
          animationDelay: "0.6s",
        }}
      />
    </Stack>
  );
};

export { TypingLoader, LayoutLoader };
