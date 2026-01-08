/**
 * AppLayout.jsx
 *
 * Higher-Order Component (HOC) that wraps authenticated pages
 * with the full chat application layout.
 *
 * Responsibilities:
 *  - Fetch and render the user's chat list
 *  - Handle socket-driven real-time updates (messages, requests, online users)
 *  - Manage responsive layout (desktop vs mobile drawer)
 *  - Provide shared UI elements (Header, ChatList, Profile, DeleteChatMenu)
 *
 * Usage:
 *  export default AppLayout()(SomePageComponent)
 */

import { Drawer, Grid, Skeleton } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// Socket event constants
import {
  NEW_MESSAGE_ALERT,
  NEW_REQUEST,
  ONLINE_USERS,
  REFETCH_CHATS,
} from "../../constants/events";

// Custom hooks for error handling and socket subscriptions
import { useErrors, useSocketEvents } from "../../hooks/hook";

// Utility for persisting data in local storage
import { getOrSaveFromStorage } from "../../lib/features";

// RTK Query hook to fetch user's chats
import { useMyChatsQuery } from "../../redux/api/api";

// Redux actions related to chat state
import {
  incrementNotification,
  setNewMessagesAlert,
} from "../../redux/reducers/chat";

// Redux actions related to UI / layout state
import {
  setIsDeleteMenu,
  setIsMobile,
  setSelectedDeleteChat,
} from "../../redux/reducers/misc";

// Socket instance getter
import { getSocket } from "../../socket";

// UI components
import DeleteChatMenu from "../dialogs/DeleteChatMenu";
import Title from "../shared/Title";
import ChatList from "../specific/ChatList";
import Profile from "../specific/Profile";
import Header from "./Header";

/**
 * AppLayout is implemented as a Higher-Order Component.
 * It receives a page component (WrappedComponent) and
 * injects layout + shared behavior around it.
 */
const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    // Route parameters (used to extract active chatId)
    const params = useParams();

    // Navigation helper
    const navigate = useNavigate();

    // Redux dispatcher
    const dispatch = useDispatch();

    // Shared socket instance
    const socket = getSocket();

    // Currently selected chat ID from the URL
    const chatId = params.chatId;

    // Ref used to anchor the delete chat context menu
    const deleteMenuAnchor = useRef(null);

    // Tracks currently online users (updated via socket)
    const [onlineUsers, setOnlineUsers] = useState([]);

    // UI state: whether app is in mobile layout mode
    const { isMobile } = useSelector((state) => state.misc);

    // Authenticated user
    const { user } = useSelector((state) => state.auth);

    // New message alerts per chat
    const { newMessagesAlert } = useSelector((state) => state.chat);

    /**
     * Fetch user's chats using RTK Query.
     * `refetch` is used when server requests chat list refresh.
     */
    const { isLoading, data, isError, error, refetch } = useMyChatsQuery("");

    // Centralized error handling for API errors
    useErrors([{ isError, error }]);

    /**
     * Persist new message alerts in local storage
     * so unread indicators survive page reloads.
     */
    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert });
    }, [newMessagesAlert]);

    /**
     * Trigger delete chat menu and store selected chat info in Redux.
     */
    const handleDeleteChat = (e, chatId, groupChat) => {
      dispatch(setIsDeleteMenu(true));
      dispatch(setSelectedDeleteChat({ chatId, groupChat }));
      deleteMenuAnchor.current = e.currentTarget;
    };

    // Close mobile drawer
    const handleMobileClose = () => dispatch(setIsMobile(false));

    /**
     * Socket listener: new message alert
     * If message belongs to currently open chat, ignore it.
     * Otherwise, store alert in Redux.
     */
    const newMessageAlertListener = useCallback(
      (data) => {
        if (data.chatId === chatId) return;
        dispatch(setNewMessagesAlert(data));
      },
      [chatId]
    );

    /**
     * Socket listener: new friend request
     * Increments notification count.
     */
    const newRequestListener = useCallback(() => {
      dispatch(incrementNotification());
    }, [dispatch]);

    /**
     * Socket listener: server requests chat list refetch
     * Used after chat creation / deletion.
     */
    const refetchListener = useCallback(() => {
      refetch();
      navigate("/");
    }, [refetch, navigate]);

    /**
     * Socket listener: list of currently online users
     */
    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, []);

    /**
     * Map socket events to their respective handlers.
     */
    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertListener,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USERS]: onlineUsersListener,
    };

    // Register socket listeners
    useSocketEvents(socket, eventHandlers);

    return (
      <>
        {/* Updates document title based on route */}
        <Title />

        {/* Top navigation bar */}
        <Header />

        {/* Context menu for deleting chats */}
        <DeleteChatMenu
          dispatch={dispatch}
          deleteMenuAnchor={deleteMenuAnchor}
        />

        {/* Mobile chat list rendered inside a drawer */}
        {isLoading ? (
          <Skeleton />
        ) : (
          <Drawer open={isMobile} onClose={handleMobileClose}>
            <ChatList
              w="70vw"
              chats={data?.chats}
              chatId={chatId}
              handleDeleteChat={handleDeleteChat}
              newMessagesAlert={newMessagesAlert}
              onlineUsers={onlineUsers}
            />
          </Drawer>
        )}

        {/* Main application layout grid */}
        <Grid container height={"calc(100vh - 4rem)"}>
          {/* Desktop chat list */}
          <Grid
            item
            sm={4}
            md={3}
            sx={{
              display: { xs: "none", sm: "block" },
            }}
            height={"100%"}
          >
            {isLoading ? (
              <Skeleton />
            ) : (
              <ChatList
                chats={data?.chats}
                chatId={chatId}
                handleDeleteChat={handleDeleteChat}
                newMessagesAlert={newMessagesAlert}
                onlineUsers={onlineUsers}
              />
            )}
          </Grid>

          {/* Main content area (wrapped page component) */}
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} user={user} />
          </Grid>

          {/* Right-side user profile panel (desktop only) */}
          <Grid
            item
            md={4}
            lg={3}
            height={"100%"}
            sx={{
              display: { xs: "none", md: "block" },
              padding: "2rem",
              bgcolor: "rgba(0,0,0,0.85)",
            }}
          >
            <Profile user={user} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
