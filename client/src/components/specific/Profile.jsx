/**
 * Profile.jsx
 *
 * Right-side profile panel component shown in the main chat layout (desktop).
 *
 * Responsibilities:
 *  - Display basic information about the currently authenticated user:
 *      - avatar
 *      - bio
 *      - username
 *      - name
 *      - joined date (relative time)
 *
 * This component is intentionally lightweight and purely presentational.
 */

import React from "react";
import { Avatar, Stack, Typography } from "@mui/material";
import {
  Face as FaceIcon,
  AlternateEmail as UserNameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";

// Utility to normalize / resize image URLs
import { transformImage } from "../../lib/features";

/**
 * Profile
 *
 * Props:
 *  - user: authenticated user object from Redux (or passed down by layout)
 *
 * Note:
 *  - Optional chaining is used to avoid crashing during initial render
 *    if user data is not yet available.
 */
const Profile = ({ user }) => {
  return (
    <Stack spacing={"2rem"} direction={"column"} alignItems={"center"}>
      {/* User avatar */}
      <Avatar
        src={transformImage(user?.avatar?.url)}
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "5px solid white",
        }}
      />

      {/* Profile information cards */}
      <ProfileCard heading={"Bio"} text={user?.bio} />
      <ProfileCard
        heading={"Username"}
        text={user?.username}
        Icon={<UserNameIcon />}
      />
      <ProfileCard heading={"Name"} text={user?.name} Icon={<FaceIcon />} />
      <ProfileCard
        heading={"Joined"}
        text={moment(user?.createdAt).fromNow()}
        Icon={<CalendarIcon />}
      />
    </Stack>
  );
};

/**
 * ProfileCard
 *
 * Small reusable row used to display one labeled piece of user information.
 *
 * Props:
 *  - text: value to display (e.g., username, name)
 *  - Icon: optional icon element displayed to the left
 *  - heading: small caption describing the field
 */
const ProfileCard = ({ text, Icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"1rem"}
    color={"white"}
    textAlign={"center"}
  >
    {Icon && Icon}

    <Stack>
      <Typography variant="body1">{text}</Typography>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
