/**
 * UserManagement.jsx
 *
 * Admin page for viewing all registered users in the system.
 *
 * Responsibilities:
 *  - Fetch all users from an admin-protected endpoint
 *  - Display users in a tabular format using the shared Table component
 *  - Show basic user metadata:
 *      - avatar
 *      - name
 *      - username
 *      - total friends count
 *      - total groups count
 *
 * This page is wrapped with AdminLayout to:
 *  - Enforce admin-only access
 *  - Provide consistent admin navigation and layout
 */

import { useFetchData } from "6pp";
import { Avatar, Skeleton } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";

/**
 * Column configuration for the users DataGrid.
 * Defines how each user attribute is displayed in the table.
 */
const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "avatar",
    headerName: "Avatar",
    headerClassName: "table-header",
    width: 150,
    /**
     * Render user avatar.
     */
    renderCell: (params) => (
      <Avatar alt={params.row.name} src={params.row.avatar} />
    ),
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "username",
    headerName: "Username",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "friends",
    headerName: "Friends",
    headerClassName: "table-header",
    width: 150,
  },
  {
    field: "groups",
    headerName: "Groups",
    headerClassName: "table-header",
    width: 200,
  },
];

const UserManagement = () => {
  /**
   * Fetch all users via admin API.
   * credentials: "include" ensures admin session cookies are sent.
   */
  const { loading, data, error } = useFetchData({
    url: `${server}/api/v1/admin/users`,
    key: "dashboard-users",
    credentials: "include", // important: send cookies
  });

  /**
   * Centralized error handling for admin user fetch.
   */
  useErrors([
    {
      isError: error,
      error: error,
    },
  ]);

  // Rows formatted for DataGrid consumption
  const [rows, setRows] = useState([]);

  /**
   * Transform backend user data into table-friendly rows.
   * Avatar URLs are optimized using transformImage helper.
   */
  useEffect(() => {
    if (data) {
      setRows(
        data.users.map((i) => ({
          ...i,
          id: i._id,
          avatar: transformImage(i.avatar, 50),
        })),
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Users"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default UserManagement;
