/**
 * UserItem.jsx
 *
 * Reusable list item component for displaying a single user.
 *
 * Common use cases:
 *  - Search dialog (adding users)
 *  - New group creation (selecting/removing members)
 *  - Friend request / user selection lists
 *
 * The component is memoized to avoid unnecessary re-renders
 * when parent lists update frequently.
 */

import { Add as AddIcon, Remove as RemoveIcon } from "@mui/icons-material";
import { Avatar, IconButton, ListItem, Stack, Typography } from "@mui/material";
import React, { memo } from "react";

// Utility to normalize / resize avatar image URLs
import { transformImage } from "../../lib/features";

/**
 * UserItem
 *
 * Props:
 *  - user: user object containing {_id, name, avatar}
 *  - handler: callback triggered when add/remove button is clicked
 *  - handlerIsLoading: disables action button while async operation is in progress
 *  - isAdded: determines whether the user is already selected/added
 *  - styling: optional extra styling props spread onto the root Stack
 */
const UserItem = ({
  user,
  handler,
  handlerIsLoading,
  isAdded = false,
  styling = {},
}) => {
  const { name, _id, avatar } = user;

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
        {...styling}
      >
        {/* User avatar */}
        <Avatar src={transformImage(avatar)} />

        {/* User name with single-line ellipsis overflow handling */}
        <Typography
          variant="body1"
          sx={{
            flexGlow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {name}
        </Typography>

        {/* Add / Remove action button */}
        <IconButton
          size="small"
          sx={{
            bgcolor: isAdded ? "error.main" : "primary.main",
            color: "white",
            "&:hover": {
              bgcolor: isAdded ? "error.dark" : "primary.dark",
            },
          }}
          onClick={() => handler(_id)}
          disabled={handlerIsLoading}
        >
          {/* Icon switches based on selection state */}
          {isAdded ? <RemoveIcon /> : <AddIcon />}
        </IconButton>
      </Stack>
    </ListItem>
  );
};

export default memo(UserItem);
