import React from "react";
import { Box, Typography, IconButton, Tooltip, Stack } from "@mui/material";
import {
  HomeRounded,
  PeopleAltRounded,
  SettingsRounded,
} from "@mui/icons-material";

function SideBar() {
  return (
    <Box
      sx={{
        width: 80, // Fixed width for the sidebar
        height: "100vh", // Full height of the viewport
        bgcolor: "background.paper", // Background color for the sidebar
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "fixed", // Fixed position to stay on the side
        top: 0,
        left: 0,
        boxShadow: 3, // Subtle shadow for depth
        px: 1, // Margin on the x-axis for spacing
        mr: 6, // Margin on the right for spacing
      }}
    >
      {/* Dynamic Island Container */}
      <Box
        sx={{
          bgcolor: "primary.main", // Primary color for the dynamic island background
          borderRadius: 8, // More rounded corners for the dynamic island effect
          p: 2, // Padding inside the island
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 3, // Space between icons
          boxShadow: 6, // Stronger shadow for the island to make it pop
          // Optional: Add a subtle gradient for more elegance
          background: "linear-gradient(145deg, #f0f0f0, #e0e0e0)", // Light grey gradient
          // For a darker theme, you might use:
          // background: 'linear-gradient(145deg, #333, #222)',
        }}
      >
        {/* Home Icon */}
        <Tooltip title="Home" placement="right">
          <IconButton
            sx={{
              color: "text.primary", // Icon color
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)", // Subtle hover effect
                transform: "scale(1.1)", // Slight scale on hover
                transition: "transform 0.2s ease-in-out",
              },
            }}
          >
            <HomeRounded sx={{ fontSize: 32 }} /> {/* Larger icon size */}
          </IconButton>
        </Tooltip>

        {/* Customer Icon */}
        <Tooltip title="Customers" placement="right">
          <IconButton
            sx={{
              color: "text.primary",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
                transform: "scale(1.1)",
                transition: "transform 0.2s ease-in-out",
              },
            }}
          >
            <PeopleAltRounded sx={{ fontSize: 32 }} />
          </IconButton>
        </Tooltip>

        {/* Settings Icon */}
        <Tooltip title="Settings" placement="right">
          <IconButton
            sx={{
              color: "text.primary",
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.1)",
                transform: "scale(1.1)",
                transition: "transform 0.2s ease-in-out",
              },
            }}
          >
            <SettingsRounded sx={{ fontSize: 32 }} />
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
}

export default SideBar;
