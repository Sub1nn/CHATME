/**
 * NewGroup.jsx
 *
 * Dialog component used to create a new group chat.
 *
 * Responsibilities:
 *  - Collect group name from user
 *  - Fetch and display list of available friends
 *  - Allow selecting / deselecting members
 *  - Validate minimum member count before creation
 *  - Trigger group creation API call
 *
 * This dialog is controlled globally via Redux (misc.isNewGroup).
 */

import { useInputValidation } from "6pp";
import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

// NOTE: sampleUsers import is unused now; real data comes from API
import { sampleUsers } from "../../constants/sampleData";

import UserItem from "../shared/UserItem";
import { useDispatch, useSelector } from "react-redux";

// RTK Query hooks for fetching friends and creating a group
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";

// Custom hooks for async mutation handling and error reporting
import { useAsyncMutation, useErrors } from "../../hooks/hook";

// UI state action to close the dialog
import { setIsNewGroup } from "../../redux/reducers/misc";

import toast from "react-hot-toast";

const NewGroup = () => {
  // Dialog open/close state from Redux
  const { isNewGroup } = useSelector((state) => state.misc);
  const dispatch = useDispatch();

  /**
   * Fetch list of friends available for group creation.
   * These are users with whom the current user already has a connection.
   */
  const { isError, isLoading, error, data } = useAvailableFriendsQuery();

  /**
   * Mutation hook to create a new group.
   * Wrapped using useAsyncMutation for loading state and toast handling.
   */
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation);

  // Group name input with validation helper
  const groupName = useInputValidation("");

  // IDs of users selected for the group
  const [selectedMembers, setSelectedMembers] = useState([]);

  // Centralized error handling configuration
  const errors = [
    {
      isError,
      error,
    },
  ];

  useErrors(errors);

  /**
   * Toggles a user ID in the selected members list.
   * If already selected -> remove
   * If not selected -> add
   */
  const selectMemberHandler = (id) => {
    setSelectedMembers((prev) =>
      prev.includes(id)
        ? prev.filter((currElement) => currElement !== id)
        : [...prev, id]
    );
  };

  /**
   * Handles group creation submission.
   * Performs basic validation before calling the API.
   */
  const submitHandler = () => {
    if (!groupName.value) return toast.error("Group name is required");

    // +1 accounts for the current user
    if (selectedMembers.length < 2)
      return toast.error("Please Select Atleast 3 Members");

    newGroup("Creating New Group...", {
      name: groupName.value,
      members: selectedMembers,
    });

    closeHandler();
  };

  // Close the dialog
  const closeHandler = () => {
    dispatch(setIsNewGroup(false));
  };

  return (
    <Dialog onClose={closeHandler} open={isNewGroup}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>

        {/* Group name input */}
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />

        <Typography variant="body1">Members</Typography>

        {/* Friend list */}
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectedMembers.includes(i._id)}
              />
            ))
          )}
        </Stack>

        {/* Action buttons */}
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="text"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={submitHandler}
            disabled={isLoadingNewGroup}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
