/**
 * MessageManagement.jsx
 *
 * Admin page for viewing and auditing all messages in the system.
 *
 * Responsibilities:
 *  - Fetch all messages from an admin-protected endpoint
 *  - Display messages in a tabular format using the shared Table component
 *  - Render message attachments with correct previews based on file type
 *  - Show sender details, chat metadata, and timestamp
 *
 * This page is wrapped with AdminLayout to:
 *  - Enforce admin-only access
 *  - Provide consistent admin navigation and layout
 */

import { useFetchData } from "6pp";
import { Avatar, Box, Stack } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/layout/AdminLayout";
import RenderAttachment from "../../components/shared/RenderContent";
import Table from "../../components/shared/Table";
import { server } from "../../constants/config";
import { useErrors } from "../../hooks/hook";
import { fileFormat, transformImage } from "../../lib/features";

/**
 * Column configuration for the messages DataGrid.
 * Each column defines how a message attribute is displayed.
 */
const columns = [
  {
    field: "id",
    headerName: "ID",
    headerClassName: "table-header",
    width: 200,
  },
  {
    field: "attachments",
    headerName: "Attachments",
    headerClassName: "table-header",
    width: 200,
    /**
     * Render message attachments.
     * Each attachment is rendered using RenderAttachment,
     * which selects the correct UI based on file type.
     */
    renderCell: (params) => {
      const { attachments } = params.row;

      return attachments?.length > 0
        ? attachments.map((i) => {
            const url = i.url;
            const file = fileFormat(url);

            return (
              <Box>
                <a
                  href={url}
                  download
                  target="_blank"
                  style={{
                    color: "black",
                  }}
                >
                  {RenderAttachment(file, url)}
                </a>
              </Box>
            );
          })
        : "No Attachments";
    },
  },
  {
    field: "content",
    headerName: "Content",
    headerClassName: "table-header",
    width: 400,
  },
  {
    field: "sender",
    headerName: "Sent By",
    headerClassName: "table-header",
    width: 200,
    /**
     * Render sender avatar and name.
     */
    renderCell: (params) => (
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <Avatar alt={params.row.sender.name} src={params.row.sender.avatar} />
        <span>{params.row.sender.name}</span>
      </Stack>
    ),
  },
  {
    field: "chat",
    headerName: "Chat",
    headerClassName: "table-header",
    width: 220,
  },
  {
    field: "groupChat",
    headerName: "Group Chat",
    headerClassName: "table-header",
    width: 100,
  },
  {
    field: "createdAt",
    headerName: "Time",
    headerClassName: "table-header",
    width: 250,
  },
];

const MessageManagement = () => {
  /**
   * Fetch all messages using admin API.
   * credentials: "include" ensures admin session cookies are sent.
   */
  const { loading, data, error } = useFetchData({
    url: `${server}/api/v1/admin/messages`,
    key: "dashboard-messages",
    credentials: "include",
  });

  /**
   * Centralized error handling for admin message fetch.
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
   * Transform backend message data into table-friendly rows.
   * - Normalizes sender avatar URLs
   * - Formats timestamps into human-readable form
   */
  useEffect(() => {
    if (data) {
      setRows(
        data.messages.map((i) => ({
          ...i,
          id: i._id,
          sender: {
            name: i.sender.name,
            avatar: transformImage(i.sender.avatar, 50),
          },
          createdAt: moment(i.createdAt).format("MMMM Do YYYY, h:mm:ss a"),
        })),
      );
    }
  }, [data]);

  return (
    <AdminLayout>
      {loading ? (
        <Skeleton height={"100vh"} />
      ) : (
        <Table
          heading={"All Messages"}
          columns={columns}
          rows={rows}
          rowHeight={200}
        />
      )}
    </AdminLayout>
  );
};

export default MessageManagement;
