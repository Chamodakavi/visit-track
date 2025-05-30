"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Typography,
  Box,
  Fab,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert as MuiAlert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from "@mui/icons-material/Person";
import dayjs from "dayjs";
import Form from "../../../../components/Form";
import Info from "../../../../components/Info";
import { query, where, Timestamp } from "firebase/firestore";

// Firebase imports
import { db } from "../../../utils/firebaseConfig";
import { collection, getDocs, addDoc } from "firebase/firestore";

const Alert = React.forwardRef(function Alert(props: any, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function DayPage() {
  const params = useParams();
  const dateParamRaw = params?.date || "";
  const dateParam = Array.isArray(dateParamRaw)
    ? dateParamRaw[0]
    : dateParamRaw;
  const date = dayjs(dateParam);

  const [showCustomerForm, setShowCustomerForm] = useState(false);
  const [customerName, setCustomerName] = useState("");
  const [customersForDay, setCustomersForDay] = useState<string[]>([]);
  const [existingCustomers, setExistingCustomers] = useState<string[]>([]);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("info");
  const buyerOptions = ["Buyer A", "Buyer B", "Buyer C"];
  const [infoEntries, setInfoEntries] = useState<any[]>([]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "Customers"));
        const customerList: string[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.name) {
            customerList.push(data.name);
          }
        });
        setExistingCustomers(customerList);
        setSnackbarMessage("Connected to Firebase and fetched customers.");
        setSnackbarSeverity("success");
        setSnackbarOpen(true);
      } catch (error) {
        console.error("Error fetching customers from Firebase:", error);
        setSnackbarMessage("Failed to connect to Firebase.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    };

    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchInfoEntries = async () => {
      try {
        const startOfDay = date.startOf("day").toDate();
        const endOfDay = date.endOf("day").toDate();

        const infoQuery = query(
          collection(db, "info"),
          where("createdAt", ">=", Timestamp.fromDate(startOfDay)),
          where("createdAt", "<=", Timestamp.fromDate(endOfDay))
        );

        const querySnapshot = await getDocs(infoQuery);
        const fetchedInfo = querySnapshot.docs.map((doc) => doc.data());
        setInfoEntries(fetchedInfo);
      } catch (err) {
        console.error("Error fetching info data:", err);
      }
    };

    fetchInfoEntries();
  }, [date]);

  const handleAddCustomerClick = () => {
    setShowCustomerForm(true);
  };

  const handleCloseCustomerForm = () => {
    setShowCustomerForm(false);
    setCustomerName("");
  };

  const handleSaveCustomer = () => {
    if (customerName.trim() === "") return;
    setCustomersForDay((prev) => [...prev, customerName.trim()]);
    handleCloseCustomerForm();
  };

  if (!date.isValid()) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">
          Invalid date: {dateParam}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        pt: 4,
        pb: 10,
        position: "relative",
      }}
    >
      <Typography variant="h4" sx={{ p: 2, color: "primary.main" }}>
        Date: {date.format("MMMM DD, YYYY")}
      </Typography>

      <Box sx={{ flexGrow: 1, mt: 2, width: "100%", maxWidth: "600px" }}>
        <Typography variant="body1">
          This is the content area for {date.format("MMMM DD, YYYY")}.
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          You can add notes, reminders, or customer details for this day.
        </Typography>

        {infoEntries.length > 0 && (
          <Box sx={{ mt: 4, width: "100%", maxWidth: "600px" }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Info Entries:
            </Typography>
            {infoEntries.map((entry, index) => (
              <Info
                key={index}
                customerName={entry.customerName || "N/A"}
                buyer={entry.buyer || "N/A"}
                createdAt={entry.createdAt?.toDate().toLocaleString() || "N/A"}
                remarks={entry.remarks || {}}
                salesOptions={entry.salesOptions || []}
                sampleCollectionTypes={entry.sampleCollectionTypes || []}
                selectedPurposes={entry.selectedPurposes || []}
              />
            ))}
          </Box>
        )}
      </Box>

      <Box
        sx={{
          position: "fixed",
          bottom: 32,
          right: 32,
          display: "flex",
          alignItems: "center",
          "&:hover .add-customer-text": {
            opacity: 1,
            transform: "translateX(0)",
          },
          "&:hover .MuiFab-root": {
            transform: "rotate(45deg) scale(1.05)",
            boxShadow: 8,
          },
        }}
      >
        <Box
          className="add-customer-text"
          sx={{
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            borderRadius: 2,
            p: 1,
            mr: 1,
            opacity: 0,
            pointerEvents: "none",
            whiteSpace: "nowrap",
            transform: "translateX(20px)",
            transition: "opacity 0.3s ease-in-out, transform 0.3s ease-in-out",
          }}
        >
          <Typography variant="body2" sx={{ fontSize: "1rem" }}>
            Add new customer
          </Typography>
        </Box>

        <Fab
          color="primary"
          aria-label="add"
          sx={{
            boxShadow: 6,
            "& .MuiSvgIcon-root": {
              fontSize: "2rem",
            },
            transition:
              "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
          }}
          onClick={handleAddCustomerClick}
        >
          <AddIcon />
        </Fab>
      </Box>

      {showCustomerForm && (
        <Form
          show={showCustomerForm}
          onClose={handleCloseCustomerForm}
          onSave={handleSaveCustomer}
          existingCustomers={existingCustomers}
          buyerOptions={buyerOptions}
          selectedDate={date.toDate()}
        />
      )}

      {/* Snackbar for Firebase connection status */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
}
