/**
 * Home.jsx
 *
 * Default landing page shown after user logs in
 * when no specific chat is selected.
 *
 * Responsibilities:
 *  - Act as a placeholder / empty state for the chat area
 *  - Prompt the user to select a friend from the chat list
 *
 * This page is intentionally minimal and purely presentational.
 * It is wrapped with AppLayout to ensure consistent layout
 * (chat list, header, profile panel).
 */

import React from "react";
import AppLayout from "../components/layout/AppLayout";
import { Box, Typography } from "@mui/material";
import { grayColor } from "../constants/color";

const Home = () => {
  return (
    <Box bgcolor={grayColor} height={"100%"}>
      {/* Empty-state message shown when no chat is selected */}
      <Typography p={"2rem"} variant="h5" textAlign={"center"}>
        Select a friend to chat
      </Typography>
    </Box>
  );
};

export default AppLayout()(Home);
