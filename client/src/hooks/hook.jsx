/**
 * hook.jsx
 *
 * Collection of reusable custom React hooks used across the client.
 *
 * Hooks included:
 *  - useErrors: centralized error handling with optional fallback logic
 *  - useAsyncMutation: wrapper around RTK Query mutation hooks with toast feedback
 *  - useSocketEvents: utility for registering and cleaning up socket event listeners
 *
 * These hooks help keep components small and focused by extracting
 * common side-effect and async-handling logic.
 */

import { useEffect, useState } from "react";
import toast from "react-hot-toast";

/**
 * useErrors
 *
 * Centralized error-handling hook.
 *
 * @param {Array} errors - Array of error descriptors:
 *   Each item can contain:
 *    - isError: boolean flag indicating error state
 *    - error: error object returned from API
 *    - fallback: optional callback executed instead of showing toast
 *
 * Behavior:
 *  - Displays a toast error message by default
 *  - Executes fallback if provided
 */
const useErrors = (errors = []) => {
  useEffect(() => {
    errors.forEach(({ isError, error, fallback }) => {
      if (isError) {
        if (fallback) fallback();
        else toast.error(error?.data?.message || "Something went wrong");
      }
    });
  }, [errors]);
};

/**
 * useAsyncMutation
 *
 * Wrapper hook around RTK Query mutation hooks.
 *
 * Purpose:
 *  - Provide loading state
 *  - Standardize toast notifications (loading / success / error)
 *  - Capture response data for optional local usage
 *
 * @param {Function} mutatationHook - RTK Query mutation hook
 *
 * @returns {Array} [executeMutation, isLoading, data]
 */
const useAsyncMutation = (mutatationHook) => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState(null);

  // Initialize RTK Query mutation
  const [mutate] = mutatationHook();

  /**
   * Executes the mutation with toast feedback.
   *
   * @param {string} toastMessage - Message shown during loading
   * @param {...any} args - Arguments passed to the mutation
   */
  const executeMutation = async (toastMessage, ...args) => {
    setIsLoading(true);
    const toastId = toast.loading(toastMessage || "Updating data...");

    try {
      const res = await mutate(...args);

      if (res.data) {
        toast.success(res.data.message || "Updated data successfully", {
          id: toastId,
        });
        setData(res.data);
      } else {
        toast.error(res?.error?.data?.message || "Something went wrong", {
          id: toastId,
        });
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  return [executeMutation, isLoading, data];
};

/**
 * useSocketEvents
 *
 * Utility hook for registering multiple socket event listeners
 * and cleaning them up automatically on unmount or dependency change.
 *
 * @param {Object} socket - Active socket.io client instance
 * @param {Object} handlers - Map of event names to handler functions
 *
 * Example:
 *  {
 *    "NEW_MESSAGE": handleNewMessage,
 *    "ONLINE_USERS": handleOnlineUsers
 *  }
 */
const useSocketEvents = (socket, handlers) => {
  useEffect(() => {
    Object.entries(handlers).forEach(([event, handler]) => {
      socket.on(event, handler);
    });

    // Cleanup listeners on unmount
    return () => {
      Object.entries(handlers).forEach(([event, handler]) => {
        socket.off(event, handler);
      });
    };
  }, [socket, handlers]);
};

export { useErrors, useAsyncMutation, useSocketEvents };
