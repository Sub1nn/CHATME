/**
 * Header.jsx
 *
 * Top application navigation bar for authenticated users.
 *
 * Responsibilities:
 *  - Provide quick access to core actions (search, new group, notifications)
 *  - Handle logout
 *  - Control mobile drawer visibility
 *  - Lazily mount dialogs (Search, Notifications, New Group)
 *
 * This component relies heavily on global UI state stored in Redux (misc slice).
 */

import {
  AppBar,
  Backdrop,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { Suspense, lazy, useState } from "react";

// Theme color for the app bar
import { orange } from "../../constants/color";

// Icons used in the header
import {
  Add as AddIcon,
  Menu as MenuIcon,
  Search as SearchIcon,
  Group as GroupIcon,
  Logout as LogoutIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../constants/config";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

// Auth action to clear user state on logout
import { userNotExists } from "../../redux/reducers/auth";

// UI state actions controlling dialogs and mobile layout
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
} from "../../redux/reducers/misc";

// Chat-related action to reset unread notification count
import { resetNotificationCount } from "../../redux/reducers/chat";

/**
 * Lazy-loaded dialog components.
 * These are only loaded when opened, keeping the header lightweight.
 */
const SearchDialog = lazy(() => import("../specific/Search"));
const NotifcationDialog = lazy(() => import("../specific/Notifications"));
const NewGroupDialog = lazy(() => import("../specific/NewGroup"));

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  /**
   * UI state flags controlling dialog visibility.
   * Stored in Redux so they can be toggled globally.
   */
  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );

  // Number of unread notifications (friend requests, etc.)
  const { notificationCount } = useSelector((state) => state.chat);

  /**
   * Opens mobile chat list drawer.
   * Used on small screens where chat list is hidden by default.
   */
  const handleMobile = () => dispatch(setIsMobile(true));

  // Open search dialog
  const openSearch = () => dispatch(setIsSearch(true));

  // Open create new group dialog
  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  /**
   * Open notifications dialog.
   * Also resets unread notification counter.
   */
  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotificationCount());
  };

  // Navigate to groups management page
  const navigateToGroup = () => navigate("/groups");

  /**
   * Logs out the current user.
   *  - Calls backend logout endpoint to clear auth cookie
   *  - Clears auth state from Redux
   *  - Shows feedback via toast
   */
  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <>
      {/* Header height spacer */}
      <Box sx={{ flexGrow: 1 }} height={"4rem"}>
        <AppBar
          position="static"
          sx={{
            bgcolor: orange,
          }}
        >
          <Toolbar>
            {/* App title (hidden on very small screens) */}
            <Typography
              variant="h6"
              sx={{
                display: { xs: "none", sm: "block" },
              }}
            >
              CHATME
            </Typography>

            {/* Mobile menu button (opens chat drawer) */}
            <Box
              sx={{
                display: { xs: "block", sm: "none" },
              }}
            >
              <IconButton color="inherit" onClick={handleMobile}>
                <MenuIcon />
              </IconButton>
            </Box>

            {/* Spacer to push action icons to the right */}
            <Box
              sx={{
                flexGrow: 1,
              }}
            />

            {/* Action icons */}
            <Box>
              <IconBtn
                title={"Search"}
                icon={<SearchIcon />}
                onClick={openSearch}
              />

              <IconBtn
                title={"New Group"}
                icon={<AddIcon />}
                onClick={openNewGroup}
              />

              <IconBtn
                title={"Manage Groups"}
                icon={<GroupIcon />}
                onClick={navigateToGroup}
              />

              <IconBtn
                title={"Notifications"}
                icon={<NotificationsIcon />}
                onClick={openNotification}
                value={notificationCount}
              />

              <IconBtn
                title={"Logout"}
                icon={<LogoutIcon />}
                onClick={logoutHandler}
              />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Search dialog (lazy-loaded) */}
      {isSearch && (
        <Suspense fallback={<Backdrop open />}>
          <SearchDialog />
        </Suspense>
      )}

      {/* Notifications dialog (lazy-loaded) */}
      {isNotification && (
        <Suspense fallback={<Backdrop open />}>
          <NotifcationDialog />
        </Suspense>
      )}

      {/* New group creation dialog (lazy-loaded) */}
      {isNewGroup && (
        <Suspense fallback={<Backdrop open />}>
          <NewGroupDialog />
        </Suspense>
      )}
    </>
  );
};

/**
 * Reusable icon button with tooltip and optional badge.
 * Used to keep Header JSX clean and consistent.
 */
const IconBtn = ({ title, icon, onClick, value }) => {
  return (
    <Tooltip title={title}>
      <IconButton color="inherit" size="large" onClick={onClick}>
        {value ? (
          <Badge badgeContent={value} color="error">
            {icon}
          </Badge>
        ) : (
          icon
        )}
      </IconButton>
    </Tooltip>
  );
};

export default Header;
