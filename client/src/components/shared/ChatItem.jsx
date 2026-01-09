/**
 * ChatItem.jsx
 *
 * Single chat row item rendered inside the ChatList.
 *
 * Responsibilities:
 *  - Link to the chat route (/chat/:chatId)
 *  - Show chat avatar(s) (single or group) via AvatarCard
 *  - Show chat name
 *  - Show unread message alert (if present)
 *  - Show online indicator (for direct chats)
 *  - Trigger delete context menu on right click (context menu event)
 *
 * Performance:
 *  - Exported using React.memo to avoid unnecessary re-renders when props
 *    do not change.
 */

import React, { memo } from "react";

// Styled link used across the app for consistent clickable rows
import { Link } from "../styles/StyledComponents";

import { Box, Stack, Typography } from "@mui/material";

// Renders one or multiple avatars (group chats show multiple)
import AvatarCard from "./AvatarCard";

// Used for entrance animation when chat list renders
import { motion } from "framer-motion";

const ChatItem = ({
  avatar = [],
  name,
  _id,
  groupChat = false,
  sameSender,
  isOnline,
  newMessageAlert,
  index = 0,
  handleDeleteChat,
}) => {
  return (
    <Link
      sx={{
        padding: "0",
      }}
      // Navigate to selected chat page
      to={`/chat/${_id}`}
      /**
       * Right-click (or long-press on some devices) opens delete menu.
       * `handleDeleteChat` stores the selected chat in Redux and anchors the menu.
       */
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)}
    >
      <motion.div
        /**
         * Simple entrance animation for each chat row.
         * Delay is scaled by index to create a staggered list effect.
         */
        initial={{ opacity: 0, y: "-100%" }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 * index }}
        style={{
          display: "flex",
          gap: "1rem",
          alignItems: "center",

          // Highlight currently selected chat row
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",

          position: "relative",
          padding: "1rem",
        }}
      >
        {/* Avatar preview (single or multiple images) */}
        <AvatarCard avatar={avatar} />

        {/* Chat name + optional unread message indicator */}
        <Stack>
          <Typography>{name}</Typography>

          {/* newMessageAlert typically contains { chatId, count } */}
          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>

        {/* Online indicator dot (commonly relevant for 1-to-1 chats) */}
        {isOnline && (
          <Box
            sx={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              top: "50%",
              right: "1rem",
              transform: "translateY(-50%)",
            }}
          />
        )}
      </motion.div>
    </Link>
  );
};

export default memo(ChatItem);
