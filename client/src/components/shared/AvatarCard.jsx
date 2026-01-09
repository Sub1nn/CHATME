/**
 * AvatarCard.jsx
 *
 * Shared UI component for rendering a compact group of user avatars.
 *
 * Commonly used for:
 *  - Group chats
 *  - Multi-user previews
 *  - Any place where a small set of participant avatars needs to be shown
 *
 * Uses Material UI's AvatarGroup for grouping behavior,
 * with custom positioning to achieve an overlapping avatar layout.
 */

import { Avatar, AvatarGroup, Box, Stack } from "@mui/material";
import React from "react";

// Utility function to normalize / transform avatar image URLs
import { transformImage } from "../../lib/features";

/**
 * AvatarCard
 *
 * Props:
 *  - avatar: array of avatar image URLs (default: empty array)
 *  - max: maximum number of avatars to display before collapsing (default: 4)
 *
 * Note:
 *  - Avatar positioning is handled manually using absolute positioning
 *    to achieve a stacked / overlapping visual effect.
 */
const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={"row"} spacing={0.5}>
      <AvatarGroup
        max={max}
        sx={{
          position: "relative",
        }}
      >
        {/* Wrapper box to constrain avatar layout */}
        <Box width={"5rem"} height={"3rem"}>
          {avatar.map((i, index) => (
            <Avatar
              // Random key used to force re-rendering of avatars
              // TODO: Consider using a stable identifier if available
              key={Math.random() * 100}
              src={transformImage(i)}
              alt={`Avatar ${index}`}
              sx={{
                width: "3rem",
                height: "3rem",
                position: "absolute",

                // Responsive horizontal offset for overlapping effect
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`,
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  );
};

export default AvatarCard;
