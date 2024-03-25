import { Avatar, Stack, Typography } from "@mui/material";
import React from "react";
import {
  Face as FaceIcon,
  AlternateEmail as UsernameIcon,
  CalendarMonth as CalendarIcon,
} from "@mui/icons-material";
import moment from "moment";
const Profile = () => {
  return (
    <Stack spacing={"2rem"} alignItems={"center"}>
      <Avatar
        sx={{
          width: 200,
          height: 200,
          objectFit: "contain",
          marginBottom: "1rem",
          border: "2px solid #fff",
        }}
      />
      <ProfileCard heading={"Bio"} text={"Hii there"} />
      <ProfileCard
        heading={"Username"}
        text={"SK_Admin"}
        icon={<UsernameIcon />}
      />
      <ProfileCard
        heading={"Name"}
        text={"Subin Khatiwada"}
        icon={<FaceIcon />}
      />
      <ProfileCard
        heading={"Joined"}
        text={moment("2024-03-25T00:00:00.000Z").fromNow()} // shows how long ago the user joined
        icon={<CalendarIcon />}
      />
    </Stack>
  );
};

const ProfileCard = ({ text, icon, heading }) => (
  <Stack
    direction={"row"}
    alignItems={"center"}
    spacing={"0.5rem"}
    textAlign={"center"}
    color={"white"}
  >
    {icon && icon}
    <Stack>
      <Typography variant="body1"> {text} </Typography>
      <Typography color={"gray"} variant="caption">
        {heading}
      </Typography>
    </Stack>
  </Stack>
);

export default Profile;
