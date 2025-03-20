import React from "react";
import { Box, Typography, Button, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          textAlign: "center",
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontSize: "6rem",
            fontWeight: "bold",
            color: "primary.main",
            mb: 2,
          }}
        >
          404
        </Typography>
        <Typography
          variant="h4"
          sx={{
            fontWeight: "bold",
            mb: 2,
          }}
        >
          Oops! Page Not Found
        </Typography>
        <Typography
          variant="body1"
          sx={{
            mb: 4,
            color: "text.secondary",
          }}
        >
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/")}
          sx={{
            borderRadius: "20px",
            padding: "10px 30px",
            fontSize: "1rem",
            fontWeight: "bold",
          }}
        >
          Go to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
