import { Box, CircularProgress } from "@mui/material";
import React from "react";

function Loading() {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
}

export default Loading;
