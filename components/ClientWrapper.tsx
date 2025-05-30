"use client";

import React from "react";
import { usePathname } from "next/navigation";
import SideBar from "./SideBar";
import Reminder from "./Reminder";
import { Box } from "@mui/material";

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isDayRoute = pathname?.startsWith("/day");

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {!isDayRoute && <SideBar />}
      <Box flex={1}>{children}</Box>
      {!isDayRoute && <Reminder />}
    </div>
  );
}
