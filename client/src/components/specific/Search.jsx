/**
 * Search.jsx
 *
 * Dialog component that allows users to search for other users
 * and send friend requests.
 *
 * Responsibilities:
 *  - Capture search input from the user
 *  - Debounce search queries to avoid excessive API calls
 *  - Fetch matching users from the backend
 *  - Allow sending friend requests to selected users
 *  - Close the dialog via global UI state (misc.isSearch)
 */

import { useInputValidation } from "6pp";
import { Search as SearchIcon } from "@mui/icons-material";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

// Custom async mutation wrapper
import { useAsyncMutation } from "../../hooks/hook";

// RTK Query hooks for searching users and sending friend requests
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";

// UI state action to close the search dialog
import { setIsSearch } from "../../redux/reducers/misc";

// Reusable user list item
import UserItem from "../shared/UserItem";

const Search = () => {
  // Dialog open/close state from Redux
  const { isSearch } = useSelector((state) => state.misc);

  /**
   * Lazy query for searching users.
   * Triggered manually after debounce.
   */
  const [searchUser] = useLazySearchUserQuery();

  /**
   * Mutation for sending friend requests.
   * Wrapped to provide loading state and toast feedback.
   */
  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutation(
    useSendFriendRequestMutation
  );

  const dispatch = useDispatch();

  // Search input state with validation helper
  const search = useInputValidation("");

  // List of users returned from the search API
  const [users, setUsers] = useState([]);

  /**
   * Sends a friend request to the selected user.
   */
  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending friend request...", { userId: id });
  };

  // Close the search dialog
  const searchCloseHandler = () => dispatch(setIsSearch(false));

  /**
   * Debounced search effect.
   * Waits 1 second after user stops typing before querying the backend.
   */
  useEffect(() => {
    const timeOutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 1000);

    // Cleanup previous timeout on input change
    return () => {
      clearTimeout(timeOutId);
    };
  }, [search.value]);

  return (
    <Dialog open={isSearch} onClose={searchCloseHandler}>
      <Stack p={"2rem"} direction={"column"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>

        {/* Search input with icon */}
        <TextField
          label=""
          value={search.value}
          onChange={search.changeHandler}
          variant="outlined"
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {/* Search results */}
        <List>
          {users.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
