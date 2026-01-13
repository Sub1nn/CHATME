/**
 * Notifications.jsx
 *
 * Dialog component that displays pending notifications for the user.
 * In this app, notifications primarily represent incoming friend requests.
 *
 * Responsibilities:
 *  - Fetch pending friend requests from the backend
 *  - Render each request with accept/reject actions
 *  - Trigger accept/reject mutation for a selected request
 *  - Close dialog via global UI state in Redux (misc.isNotification)
 *
 * Notes:
 *  - This dialog is opened from the Header notification icon.
 *  - Accepting/rejecting closes the dialog first, then performs the API call.
 */

import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import React, { memo } from "react";
import { useDispatch, useSelector } from "react-redux";

// Custom hooks for centralized error handling and async mutation wrapper
import { useAsyncMutation, useErrors } from "../../hooks/hook";

// RTK Query hooks for notifications + accept/reject friend requests
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";

// UI state action to close the notifications dialog
import { setIsNotification } from "../../redux/reducers/misc";

const Notifications = () => {
  // Dialog open/close state from Redux
  const { isNotification } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  /**
   * Fetch all incoming friend requests for the current user.
   * Expected response shape:
   *  - data.allRequests: array of requests
   */
  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  /**
   * Mutation wrapper for accepting/rejecting a request.
   * useAsyncMutation handles toast + loading state internally.
   */
  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);

  /**
   * Accept or reject friend request.
   * `accept` determines whether this becomes a chat/friend connection or is discarded.
   */
  const friendRequestHandler = async ({ _id, accept }) => {
    // Close the dialog immediately for better UX
    dispatch(setIsNotification(false));

    // Call the API (backend will create chat if accepted)
    await acceptRequest("Accepting...", { requestId: _id, accept });
  };

  // Close dialog handler
  const closeHandler = () => dispatch(setIsNotification(false));

  // Centralized error handling for query errors
  useErrors([{ error, isError }]);

  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>

        {/* Loading state while fetching requests */}
        {isLoading ? (
          <Skeleton />
        ) : (
          <>
            {/* Render requests if present, otherwise show empty state */}
            {data?.allRequests.length > 0 ? (
              data?.allRequests?.map(({ sender, _id }) => (
                <NotificationItem
                  sender={sender}
                  _id={_id}
                  handler={friendRequestHandler}
                  key={_id}
                />
              ))
            ) : (
              <Typography textAlign={"center"}>0 notifications</Typography>
            )}
          </>
        )}
      </Stack>
    </Dialog>
  );
};

/**
 * NotificationItem
 *
 * Renders a single friend request row with accept/reject controls.
 * Memoized to reduce re-renders when parent list changes.
 */
const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;

  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        {/* Sender avatar
            NOTE: Current code renders <Avatar /> without a src.
            TODO: If desired, pass avatar URL using transformImage(avatar) like other components.
        */}
        <Avatar />

        {/* Request message with ellipsis overflow handling */}
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
          {`${name} sent you a friend request.`}
        </Typography>

        {/* Action buttons */}
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notifications;
