import React, { memo } from "react";
import { Link } from "../styles/StyledComponents";
import { Box, Stack, Typography } from "@mui/material";
import AvatarCard from "./AvatarCard";

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
        padding: "0rem",
      }}
      to={`/chat/${_id}`}
      onContextMenu={(e) => handleDeleteChat(e, _id, groupChat)} // onContextMenu is a React event handler that listens for the context menu event, which occurs when a user right-clicks on an element
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "1rem",
          gap: "1rem",
          // borderRadius: "0.5rem",
          backgroundColor: sameSender ? "black" : "unset",
          color: sameSender ? "white" : "unset",
          position: "relative",
        }}
      >
        <AvatarCard avatar={avatar} />
        <Stack>
          <Typography>{name}</Typography>
          {newMessageAlert && (
            <Typography>{newMessageAlert.count} New Message</Typography>
          )}
        </Stack>
        {isOnline && (
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              backgroundColor: "green",
              position: "absolute",
              right: "1rem",
            }}
          />
        )}
      </div>
    </Link>
  );
};

export default memo(ChatItem);
