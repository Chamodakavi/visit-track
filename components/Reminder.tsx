import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { db } from "../src/utils/firebaseConfig"; // Adjust path if needed

type Note = {
  id: string;
  note: string;
  createdAt: Date;
};

function Reminder() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Get the start of today as a Dayjs object
    const today = dayjs().startOf("day");
    // Convert it to a Firestore Timestamp
    const todayTimestamp = Timestamp.fromDate(today.toDate());

    // Create a query to fetch notes from today onwards, ordered by creation date
    const q = query(
      collection(db, "note"),
      where("createdAt", ">=", todayTimestamp),
      orderBy("createdAt", "asc") // Order by creation date to show chronologically
    );

    // Set up a real-time listener
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const fetchedNotes:
          | ((prevState: never[]) => never[])
          | { id: string; note: string; createdAt: Date }[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedNotes.push({
            id: doc.id,
            note: data.note,
            createdAt: data.createdAt.toDate(), // Convert Firestore Timestamp to JS Date
          });
        });
        setNotes(fetchedNotes);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching notes:", err);
        setError("Failed to load notes. Please try again.");
        setLoading(false);
      }
    );

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array means this effect runs once on mount

  return (
    <Box
      sx={{
        width: { xs: "100%", md: "25%" }, // Responsive width
        borderLeft: { xs: "none", md: "5px solid #353839" }, // Border only on medium screens and up
        borderTop: { xs: "5px solid #353839", md: "none" }, // Top border on small screens
        p: 2,
        bgcolor: "background.paper", // Use theme background color
        boxShadow: 1, // Subtle shadow
        overflowY: "auto", // Enable scrolling if content overflows
        maxHeight: "100vh", // Limit height to viewport height
      }}
    >
      <Typography variant="h6" color="text.primary" gutterBottom>
        Upcoming Notes
      </Typography>
      <Divider sx={{ mb: 2 }} />

      {loading && (
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ textAlign: "center", py: 2 }}>
          {error}
        </Typography>
      )}

      {!loading && !error && notes.length === 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center", py: 2 }}
        >
          No upcoming notes found.
        </Typography>
      )}

      {!loading && !error && notes.length > 0 && (
        <List>
          {notes.map((noteItem) => (
            <React.Fragment key={noteItem.id}>
              <ListItem alignItems="flex-start">
                <ListItemText
                  primary={dayjs(noteItem.createdAt).format(
                    "MMMM DD, YYYY - hh:mm A"
                  )}
                  secondary={
                    <Typography
                      sx={{ display: "block" }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {noteItem.note}
                    </Typography>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      )}
    </Box>
  );
}

export default Reminder;
