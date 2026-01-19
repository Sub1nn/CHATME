/**
 * ChatManagement.jsx
 *
 * Admin page for viewing and monitoring all chats in the system.
 *
 * Responsibilities:
 *  - Fetch all chats from admin-protected endpoint
 *  - Display chats in a tabular format using reusable Table component
 *  - Show key metadata per chat:
 *      - chat ID
 *      - avatar(s)
 *      - name
 *      - group / direct chat flag
 *      - total members
 *      - total messages
 *      - creator details
 *
 * This page is wrapped with AdminLayout to enforce admin-only access
 * and provide consistent admin navigation UI.
 */

import { useFetchData } from "6pp";
import { Avatar, Skeleton, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import AvatarCard from "../../components/shared/AvatarCard";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { transformImage } from "../../lib/features";

/**
 * Column configuration for the admin chats table.
 * Uses MUI DataGrid-compatible schema.
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
    renderCell: (params) => <AvatarCard avatar={params.row.avatar} />,
  },
  {
    field: "name",
    headerName: "Name",
    headerClassName: "table-header",
    width: 300,
  },
  {
    field: "groupChat",
    headerName: "Group",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "totalMembers",
    headerName: "Total Members",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "members",
    headerName: "Members",
    headerClassName: "table-header",
    width: 400,
    renderCell: (params) => (
      <AvatarCard max={100} avatar={params.row.members} />
    ),
  },
  {
    field: "totalMessages",
    headerName: "Total Messages",
    headerClassName: "table-header",
    width: 120,
  },
  {
    field: "creator",
    headerName: "Created By",
    headerClassName: "table-header",
    width: 250,
    renderCell: (params) => (
      <Stack direction="row" alignItems="center" spacing={"1rem"}>
        <Avatar alt={params.row.creator.name} src={params.row.creator.avatar} />
        <span>{params.row.creator.name}</span>
      </Stack>
    ),
  },
];

const ChatManagement = () => {
  /**
   * Fetch all chats via admin API.
   * credentials: "include" ensures admin session cookies are sent.
   */
  const { loading, data, error } = useFetchData({
    url: `${server}/api/v1/admin/chats`,
    key: "dashboard-chats",
    credentials: "include",
  });

  /**
   * Centralized error handling for failed admin fetch.
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
   * Transform backend response into table-friendly rows.
   * Images are optimized via transformImage helper.
   */
  useEffect(() => {
    if (data) {
      setRows(
        data.chats.map((i) => ({
          ...i,
          id: i._id,
          avatar: i.avatar.map((i) => transformImage(i, 50)),
          members: i.members.map((i) => transformImage(i.avatar, 50)),
          creator: {
            name: i.creator.name,
            avatar: transformImage(i.creator.avatar, 50),
          },
        })),
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table heading={"All Chats"} columns={columns} rows={rows} />
      )}
    </AdminLayout>
  );
};

export default ChatManagement;
