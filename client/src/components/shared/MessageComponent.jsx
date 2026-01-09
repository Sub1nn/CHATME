/**
 * MessageComponent.jsx
 *
 * Renders a single chat message bubble inside a conversation.
 *
 * Responsibilities:
 *  - Decide alignment (left/right) based on whether the message was sent by the current user
 *  - Show sender name for incoming messages (group chats / non-self messages)
 *  - Render text content
 *  - Render attachments (images/files) using a helper renderer
 *  - Display relative timestamp (e.g., "2 minutes ago")
 *
 * Performance:
 *  - Exported with React.memo to reduce unnecessary re-renders when props
 *    have not changed.
 */

import { Box, Typography } from "@mui/material";
import React, { memo } from "react";

// Color used to highlight sender name for incoming messages
import { lightBlue } from "../../constants/color";

// Used to format timestamps as "time ago"
import moment from "moment";

// Utility to infer file type from URL (image/video/pdf/etc.)
import { fileFormat } from "../../lib/features";

// Attachment renderer (returns a UI element for the attachment type)
import RenderAttachment from "./RenderContent";

// Simple entrance animation for messages
import { motion } from "framer-motion";

const MessageComponent = ({ message, user }) => {
  /**
   * message fields used here:
   *  - sender: { _id, name, ... }
   *  - content: string message text
   *  - attachments: array of { url, ... }
   *  - createdAt: timestamp of message creation
   */
  const { sender, content, attachments = [], createdAt } = message;

  /**
   * Determine whether this message was sent by the current logged-in user.
   * This controls alignment and whether sender name is shown.
   */
  const sameSender = sender?._id === user?._id;

  // Human-friendly relative timestamp (e.g., "a few seconds ago")
  const timeAgo = moment(createdAt).fromNow();

  return (
    <motion.div
      /**
       * Animate message bubble sliding in from the left.
       * Note:
       *  - This animation is used for both incoming and outgoing messages
       *    (alignment is controlled separately by `alignSelf`).
       */
      initial={{ opacity: 0, x: "-100%" }}
      whileInView={{ opacity: 1, x: 0 }}
      style={{
        // Right-align messages sent by the current user
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: "white",
        color: "black",
        borderRadius: "5px",
        padding: "0.5rem",
        width: "fit-content",
      }}
    >
      {/* Show sender name only for messages NOT sent by current user */}
      {!sameSender && (
        <Typography color={lightBlue} fontWeight={"600"} variant="caption">
          {sender.name}
        </Typography>
      )}

      {/* Text content (optional, messages can be attachments-only) */}
      {content && <Typography>{content}</Typography>}

      {/* Render attachments (if any) */}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;

          // Determine file type from URL to choose the correct renderer
          const file = fileFormat(url);

          return (
            <Box key={index}>
              {/* Clicking opens in a new tab; download attribute suggests download */}
              <a
                href={url}
                target="_blank"
                download
                style={{
                  color: "black",
                }}
              >
                {RenderAttachment(file, url)}
              </a>
            </Box>
          );
        })}

      {/* Timestamp displayed at the bottom of the bubble */}
      <Typography variant="caption" color={"text.secondary"}>
        {timeAgo}
      </Typography>
    </motion.div>
  );
};

export default memo(MessageComponent);
