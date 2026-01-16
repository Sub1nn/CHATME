/**
 * Chat.jsx
 *
 * Main chat page component responsible for rendering and managing
 * a single chat conversation.
 *
 * Responsibilities:
 *  - Join and leave chat rooms via socket events
 *  - Fetch chat metadata and paginated message history
 *  - Handle real-time incoming messages and system alerts
 *  - Manage typing indicators (self + other users)
 *  - Handle message sending and file attachment menu
 *  - Integrate infinite scroll for older messages
 *
 * This component is wrapped with AppLayout as a Higher-Order Component (HOC)
 * to provide shared layout, chat list, profile panel, and socket handling.
 */

import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import AppLayout from "../components/layout/AppLayout";
import { IconButton, Skeleton, Stack } from "@mui/material";
import { grayColor, orange } from "../constants/color";
import {
  AttachFile as AttachFileIcon,
  Send as SendIcon,
} from "@mui/icons-material";
import { InputBox } from "../components/styles/StyledComponents";
import FileMenu from "../components/dialogs/FileMenu";
import MessageComponent from "../components/shared/MessageComponent";
import { getSocket } from "../socket";

// Socket event constants
import {
  ALERT,
  CHAT_JOINED,
  CHAT_LEAVED,
  NEW_MESSAGE,
  START_TYPING,
  STOP_TYPING,
} from "../constants/events";

// RTK Query hooks for chat metadata and messages
import { useChatDetailsQuery, useGetMessagesQuery } from "../redux/api/api";

// Custom hooks
import { useErrors, useSocketEvents } from "../hooks/hook";

// Third-party hook for infinite scroll pagination
import { useInfiniteScrollTop } from "6pp";

import { useDispatch } from "react-redux";
import { setIsFileMenu } from "../redux/reducers/misc";
import { removeNewMessagesAlert } from "../redux/reducers/chat";
import { TypingLoader } from "../components/layout/Loaders";
import { useNavigate } from "react-router-dom";

const Chat = ({ chatId, user }) => {
  // Shared socket instance
  const socket = getSocket();

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Refs for scroll handling
  const containerRef = useRef(null);
  const bottomRef = useRef(null);

  // Message input state
  const [message, setMessage] = useState("");

  // New messages received during the current session
  const [messages, setMessages] = useState([]);

  // Pagination state for older messages
  const [page, setPage] = useState(1);

  // Anchor element for file menu dialog
  const [fileMenuAnchor, setFileMenuAnchor] = useState(null);

  // Typing state (self and others)
  const [IamTyping, setIamTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);
  const typingTimeout = useRef(null);

  /**
   * Fetch chat metadata (members, group info, etc.).
   * Query is skipped if chatId is not available.
   */
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });

  /**
   * Fetch paginated messages for infinite scrolling.
   */
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page });

  /**
   * Infinite scroll hook:
   *  - Appends older messages as user scrolls upward
   *  - Manages page state internally
   */
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk.data?.messages
  );

  // Centralized error configuration
  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error },
  ];

  // Chat members (used for socket events)
  const members = chatDetails?.data?.chat?.members;

  /**
   * Message input handler.
   * Emits START_TYPING and STOP_TYPING socket events with debounce.
   */
  const messageOnChange = (e) => {
    setMessage(e.target.value);

    if (!IamTyping) {
      socket.emit(START_TYPING, { members, chatId });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(STOP_TYPING, { members, chatId });
      setIamTyping(false);
    }, [2000]);
  };

  /**
   * Open file attachment menu.
   */
  const handleFileOpen = (e) => {
    dispatch(setIsFileMenu(true));
    setFileMenuAnchor(e.currentTarget);
  };

  /**
   * Submit message handler.
   * Emits NEW_MESSAGE socket event.
   */
  const submitHandler = (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    socket.emit(NEW_MESSAGE, { chatId, members, message });
    setMessage("");
  };

  /**
   * Join and leave chat lifecycle.
   * Also clears unread message alerts for this chat.
   */
  useEffect(() => {
    socket.emit(CHAT_JOINED, { userId: user._id, members });
    dispatch(removeNewMessagesAlert(chatId));

    return () => {
      setMessages([]);
      setMessage("");
      setOldMessages([]);
      setPage(1);
      socket.emit(CHAT_LEAVED, { userId: user._id, members });
    };
  }, [chatId]);

  /**
   * Auto-scroll to bottom when new messages arrive.
   */
  useEffect(() => {
    if (bottomRef.current)
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /**
   * Redirect user if chat does not exist or access is denied.
   */
  useEffect(() => {
    if (chatDetails.isError) return navigate("/");
  }, [chatDetails.isError]);

  /**
   * Socket event: new message
   */
  const newMessagesListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setMessages((prev) => [...prev, data.message]);
    },
    [chatId]
  );

  /**
   * Socket event: other user started typing
   */
  const startTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(true);
    },
    [chatId]
  );

  /**
   * Socket event: other user stopped typing
   */
  const stopTypingListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;
      setUserTyping(false);
    },
    [chatId]
  );

  /**
   * Socket event: system alert (e.g., admin/system message)
   */
  const alertListener = useCallback(
    (data) => {
      if (data.chatId !== chatId) return;

      const messageForAlert = {
        content: data.message,
        sender: {
          _id: "djasdhajksdhasdsadasdas",
          name: "Admin",
        },
        chat: chatId,
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, messageForAlert]);
    },
    [chatId]
  );

  // Map socket events to handlers
  const eventHandler = {
    [ALERT]: alertListener,
    [NEW_MESSAGE]: newMessagesListener,
    [START_TYPING]: startTypingListener,
    [STOP_TYPING]: stopTypingListener,
  };

  // Register socket listeners
  useSocketEvents(socket, eventHandler);

  // Handle API-related errors
  useErrors(errors);

  // Combine old and new messages for rendering
  const allMessages = [...oldMessages, ...messages];

  return chatDetails.isLoading ? (
    <Skeleton />
  ) : (
    <Fragment>
      {/* Messages container */}
      <Stack
        ref={containerRef}
        boxSizing={"border-box"}
        padding={"1rem"}
        spacing={"1rem"}
        bgcolor={grayColor}
        height={"90%"}
        sx={{
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {/* Typing indicator */}
        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </Stack>

      {/* Message input form */}
      <form
        style={{
          height: "10%",
        }}
        onSubmit={submitHandler}
      >
        <Stack
          direction={"row"}
          height={"100%"}
          padding={"1rem"}
          alignItems={"center"}
          position={"relative"}
        >
          {/* Attachment button */}
          <IconButton
            sx={{
              position: "absolute",
              left: "1.5rem",
              rotate: "30deg",
            }}
            onClick={handleFileOpen}
          >
            <AttachFileIcon />
          </IconButton>

          {/* Message input */}
          <InputBox
            placeholder="Type Message Here..."
            value={message}
            onChange={messageOnChange}
          />

          {/* Send button */}
          <IconButton
            type="submit"
            sx={{
              rotate: "-30deg",
              bgcolor: orange,
              color: "white",
              marginLeft: "1rem",
              padding: "0.5rem",
              "&:hover": {
                bgcolor: "error.dark",
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>

      {/* File attachment menu */}
      <FileMenu anchorE1={fileMenuAnchor} chatId={chatId} />
    </Fragment>
  );
};

export default AppLayout()(Chat);
