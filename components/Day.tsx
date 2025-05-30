import { Box, Typography } from "@mui/material";
import { Dayjs } from "dayjs";
import React from "react";
export default function DayComponent({ date }: { date: Dayjs }) {
  return (
    <Box sx={{ p: 4, border: "1px solid gray", borderRadius: 2, mt: 2 }}>
      <Typography variant="h5">Day Details</Typography>
      <Typography variant="body1" sx={{ mt: 1 }}>
        Selected Date: {date.format("MMMM DD, YYYY")}
      </Typography>
      {/* Add more day details here if you want */}
    </Box>
  );
}
