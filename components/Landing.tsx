"use client";

import React, { useState, useEffect } from "react";
import {
  Typography,
  Box,
  TextField,
  Button,
  CircularProgress,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "next/navigation";

// Firestore imports
import { db } from "../src/utils/firebaseConfig"; // adjust path if needed
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Landing() {
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs());
  // Using a map to store notes locally, keyed by date string (YYYY-MM-DD)
  const [notes, setNotes] = useState<{
    [date: string]: { id: string; note: string };
  }>({});
  const [currentNote, setCurrentNote] = useState("");
  const [loading, setLoading] = useState(false); // New loading state
  const router = useRouter();

  // Helper to format date consistently
  const formatDate = (date: Dayjs | null) => date?.format("YYYY-MM-DD") || "";

  // Effect to fetch and set notes when selectedDate changes
  useEffect(() => {
    const fetchNoteForSelectedDate = async () => {
      if (!selectedDate) return;

      setLoading(true); // Start loading
      const key = formatDate(selectedDate);

      // Check if the note is already in our local state
      if (notes[key]) {
        setCurrentNote(notes[key].note);
        setLoading(false);
        return;
      }

      // If not in local state, fetch from Firestore
      const startOfDay = selectedDate.startOf("day").toDate();
      const endOfDay = selectedDate.endOf("day").toDate();

      const q = query(
        collection(db, "note"),
        where("createdAt", ">=", startOfDay),
        where("createdAt", "<=", endOfDay)
      );

      try {
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
          // Assuming one note per day, take the first one
          const docData = querySnapshot.docs[0].data();
          const docId = querySnapshot.docs[0].id;
          const fetchedNote = docData.note;

          setCurrentNote(fetchedNote);
          // Update local state with the fetched note and its ID
          setNotes((prev) => ({
            ...prev,
            [key]: { id: docId, note: fetchedNote },
          }));
        } else {
          setCurrentNote(""); // No note found for this date
        }
      } catch (error) {
        console.error("Error fetching note from Firestore:", error);
        setCurrentNote(""); // Clear on error
      } finally {
        setLoading(false); // End loading
      }
    };

    fetchNoteForSelectedDate();
  }, [selectedDate]); // Depend only on selectedDate for fetching

  // Save or update note in Firestore
  const saveNote = async () => {
    if (!selectedDate || !currentNote.trim()) return; // Don't save empty notes

    setLoading(true); // Start loading for save
    const key = formatDate(selectedDate);
    const noteContent = currentNote.trim();

    try {
      if (notes[key]?.id) {
        // If an existing note for this date is in our local state (meaning it has an ID), update it
        const noteRef = doc(db, "note", notes[key].id);
        await updateDoc(noteRef, {
          note: noteContent,
          updatedAt: Timestamp.now(), // Add an update timestamp
        });
        console.log("Note updated in Firestore.");
      } else {
        // Otherwise, add a new note
        const docRef = await addDoc(collection(db, "note"), {
          createdAt: Timestamp.fromDate(selectedDate.toDate()),
          note: noteContent,
        });
        console.log("Note saved to Firestore.");
        // Store the new doc ID in local state
        setNotes((prev) => ({
          ...prev,
          [key]: { id: docRef.id, note: noteContent },
        }));
      }
      // Update local state after successful save/update
      setNotes((prev) => ({
        ...prev,
        [key]: { ...(prev[key] || {}), note: noteContent },
      }));
    } catch (error) {
      console.error("Error saving/updating note to Firestore:", error);
    } finally {
      setLoading(false); // End loading
    }
  };

  const openDay = async () => {
    // Ensure the note is saved before navigating
    await saveNote();
    const dateStr = formatDate(selectedDate);
    router.push(`/${dateStr}`);
  };

  return (
    <>
      <Typography
        variant="h4"
        sx={{
          my: 6,
          textAlign: "center",
          fontWeight: "bold",
          color: "primary.main", // Use primary color for the title
          ml: "-40%",
        }}
      >
        Welcome to Visit Tracker
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack on small screens, row on medium and up
          justifyContent: "space-evenly",
          p: 4,
          gap: 4, // Increased gap for better spacing
          ml: 10,
        }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DateCalendar
            value={selectedDate}
            onChange={(newDate) => setSelectedDate(newDate)}
            sx={{
              m: 0,
              borderRadius: 2,
              boxShadow: 3, // Increased shadow for better visual depth
              "& .MuiPickersDay-root:hover": {
                bgcolor: "red",
                color: "white",
              },
              minWidth: 300, // Ensure calendar has a minimum width
            }}
          />
        </LocalizationProvider>

        {selectedDate && (
          <Box
            sx={{
              mt: { xs: 4, md: 0 }, // Margin top on small screens, none on medium and up
              flexGrow: 1, // Allows the box to take available space
              maxWidth: { md: "50%" }, // Limit width on larger screens
            }}
          >
            <Typography variant="h6" gutterBottom>
              {" "}
              {/* Added gutterBottom for spacing */}
              Notes for {selectedDate.format("MMMM DD, YYYY")}
            </Typography>
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: 150,
                }}
              >
                <CircularProgress />
              </Box>
            ) : (
              <TextField
                multiline
                rows={8} // Increased rows for more writing space
                fullWidth
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Write your notes here..."
                variant="outlined" // Use outlined variant for better visual
                sx={{ mt: 2 }}
              />
            )}

            <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
              {" "}
              {/* Added gap for button spacing */}
              <Button variant="contained" onClick={saveNote} disabled={loading}>
                {loading ? "Saving..." : "Save Note"}
              </Button>
              <Button
                variant="contained"
                sx={{ bgcolor: "red", "&:hover": { bgcolor: "darkred" } }} // Added hover effect
                onClick={openDay}
                disabled={loading}
              >
                Open Day
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </>
  );
}
