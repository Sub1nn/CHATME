/**
 * Table.jsx
 *
 * Reusable table component built on top of MUI's DataGrid.
 *
 * Responsibilities:
 *  - Provide a consistent table layout for admin and data-heavy pages
 *  - Render a heading/title above the table
 *  - Apply common styling (header color, spacing, layout constraints)
 *
 * This component is mainly used in admin views such as:
 *  - User management
 *  - Chat management
 *  - Message management
 */

import React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Container, Paper, Typography } from "@mui/material";

// Theme color used for table header background
import { matBlack } from "../../constants/color";

/**
 * Table
 *
 * Props:
 *  - rows: array of row objects compatible with MUI DataGrid
 *  - columns: column configuration for DataGrid
 *  - heading: title displayed above the table
 *  - rowHeight: height of each row (default: 52)
 */
const Table = ({ rows, columns, heading, rowHeight = 52 }) => {
  return (
    <Container
      sx={{
        height: "100vh",
      }}
    >
      {/* Outer paper container for consistent padding and rounded layout */}
      <Paper
        elevation={3}
        sx={{
          padding: "1rem 4rem",
          borderRadius: "1rem",
          margin: "auto",
          width: "100%",
          overflow: "hidden",
          height: "100%",
          boxShadow: "none",
        }}
      >
        {/* Table heading */}
        <Typography
          textAlign={"center"}
          variant="h4"
          sx={{
            margin: "2rem",
            textTransform: "uppercase",
          }}
        >
          {heading}
        </Typography>

        {/* Data grid displaying rows and columns */}
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          style={{
            height: "80%",
          }}
          sx={{
            border: "none",

            // Custom styling for header row
            ".table-header": {
              bgcolor: matBlack,
              color: "white",
            },
          }}
        />
      </Paper>
    </Container>
  );
};

export default Table;
