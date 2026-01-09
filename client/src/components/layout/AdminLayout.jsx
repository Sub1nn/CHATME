/**
 * AdminLayout.jsx
 *
 * Shared layout wrapper for all admin pages.
 *
 * Responsibilities:
 *  - Enforce admin-only access (redirect non-admin users)
 *  - Provide a persistent sidebar for admin navigation
 *  - Handle responsive layout (drawer on mobile, sidebar on desktop)
 *  - Wrap admin pages with a consistent structure and styling
 */

import {
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  ExitToApp as ExitToAppIcon,
  Groups as GroupsIcon,
  ManageAccounts as ManageAccountsIcon,
  Menu as MenuIcon,
  Message as MessageIcon,
} from "@mui/icons-material";
import {
  Box,
  Drawer,
  Grid,
  IconButton,
  Stack,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { Link as LinkComponent, Navigate, useLocation } from "react-router-dom";
import { grayColor, matBlack } from "../../constants/color";
import { useDispatch, useSelector } from "react-redux";
import { adminLogout } from "../../redux/thunks/admin";

/**
 * Styled Link component used for sidebar navigation items.
 * Adds padding, rounded corners, and hover behavior.
 */
const Link = styled(LinkComponent)`
  text-decoration: none;
  border-radius: 2rem;
  padding: 1rem 2rem;
  color: black;
  &:hover {
    color: rgba(0, 0, 0, 0.54);
  }
`;

/**
 * Configuration for admin sidebar navigation.
 * Each entry maps a route to a label and icon.
 */
const adminTabs = [
  {
    name: "Dashboard",
    path: "/admin/dashboard",
    icon: <DashboardIcon />,
  },
  {
    name: "Users",
    path: "/admin/users",
    icon: <ManageAccountsIcon />,
  },
  {
    name: "Chats",
    path: "/admin/chats",
    icon: <GroupsIcon />,
  },
  {
    name: "Messages",
    path: "/admin/messages",
    icon: <MessageIcon />,
  },
];

/**
 * Sidebar component rendered in both desktop and mobile layouts.
 *
 * Props:
 *  - w: width of the sidebar (used mainly for mobile drawer)
 */
const Sidebar = ({ w = "100%" }) => {
  const location = useLocation();
  const dispatch = useDispatch();

  /**
   * Logs out the admin user.
   * This clears admin auth state and tokens via Redux thunk.
   */
  const logoutHandler = () => {
    dispatch(adminLogout());
  };

  return (
    <Stack width={w} direction={"column"} p={"3rem"} spacing={"3rem"}>
      {/* Admin panel title */}
      <Typography variant="h5" textTransform={"uppercase"}>
        CHATME
      </Typography>

      {/* Navigation links */}
      <Stack spacing={"1rem"}>
        {adminTabs.map((tab) => (
          <Link
            key={tab.path}
            to={tab.path}
            sx={
              location.pathname === tab.path && {
                bgcolor: matBlack,
                color: "white",
                ":hover": { color: "white" },
              }
            }
          >
            <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
              {tab.icon}
              <Typography>{tab.name}</Typography>
            </Stack>
          </Link>
        ))}

        {/* Logout action */}
        <Link onClick={logoutHandler}>
          <Stack direction={"row"} alignItems={"center"} spacing={"1rem"}>
            <ExitToAppIcon />
            <Typography>Logout</Typography>
          </Stack>
        </Link>
      </Stack>
    </Stack>
  );
};

/**
 * AdminLayout
 *
 * Wraps admin pages and ensures only authenticated admins can access them.
 *
 * Props:
 *  - children: admin page content
 */
const AdminLayout = ({ children }) => {
  // Admin authentication state
  const { isAdmin } = useSelector((state) => state.auth);

  // Controls mobile sidebar drawer visibility
  const [isMobile, setIsMobile] = useState(false);

  const handleMobile = () => setIsMobile(!isMobile);
  const handleClose = () => setIsMobile(false);

  // Redirect non-admin users to admin login page
  if (!isAdmin) return <Navigate to="/admin" />;

  return (
    <Grid container minHeight={"100vh"}>
      {/* Mobile menu toggle button */}
      <Box
        sx={{
          display: { xs: "block", md: "none" },
          position: "fixed",
          right: "1rem",
          top: "1rem",
        }}
      >
        <IconButton onClick={handleMobile}>
          {isMobile ? <CloseIcon /> : <MenuIcon />}
        </IconButton>
      </Box>

      {/* Desktop sidebar */}
      <Grid item md={4} lg={3} sx={{ display: { xs: "none", md: "block" } }}>
        <Sidebar />
      </Grid>

      {/* Main admin content area */}
      <Grid
        item
        xs={12}
        md={8}
        lg={9}
        sx={{
          bgcolor: grayColor,
        }}
      >
        {children}
      </Grid>

      {/* Mobile sidebar drawer */}
      <Drawer open={isMobile} onClose={handleClose}>
        <Sidebar w="50vw" />
      </Drawer>
    </Grid>
  );
};

export default AdminLayout;
