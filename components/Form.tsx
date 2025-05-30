import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Button,
  Divider,
} from "@mui/material";
import { db } from "../src/utils/firebaseConfig";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

interface FormProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  existingCustomers: string[];
  buyerOptions: string[];
  selectedDate: Date;
}

const Form: React.FC<FormProps> = ({
  show,
  onClose,
  onSave,
  existingCustomers,
  buyerOptions,
  selectedDate,
}) => {
  const [customerName, setCustomerName] = useState("");
  const [selectedPurposes, setSelectedPurposes] = useState<string[]>([]);
  const [salesOptions, setSalesOptions] = useState<string[]>([]);
  const [sampleCollectionTypes, setSampleCollectionTypes] = useState<string[]>(
    []
  );
  const [remarks, setRemarks] = useState<Record<string, string>>({});
  const [buyer, setBuyer] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const togglePurpose = (purpose: string) => {
    setSelectedPurposes((prev) =>
      prev.includes(purpose)
        ? prev.filter((p) => p !== purpose)
        : [...prev, purpose]
    );
  };

  const toggleSalesOption = (option: string) => {
    setSalesOptions((prev) =>
      prev.includes(option)
        ? prev.filter((o) => o !== option)
        : [...prev, option]
    );
  };

  const toggleSampleType = (type: string) => {
    setSampleCollectionTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const handleSubmit = async () => {
    setLoading(true);
    const formData = {
      customerName,
      selectedPurposes,
      salesOptions,
      sampleCollectionTypes,
      remarks,
      buyer,
      createdAt: Timestamp.fromDate(selectedDate),
    };

    try {
      await addDoc(collection(db, "info"), formData);
      setSnackbarOpen(true); // show success
      onSave(formData);
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <Box
      sx={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "background.paper",
        p: 4,
        borderRadius: 2,
        boxShadow: 24,
        zIndex: 1300,
        width: { xs: "90%", sm: "500px" },
        maxHeight: "90vh", // limits height
        overflowY: "auto", // enables scroll
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      <Typography variant="h6" component="h2">
        Add New Customer
      </Typography>

      <FormControl fullWidth>
        <InputLabel id="customer-select-label">Choose from existing</InputLabel>
        <Select
          labelId="customer-select-label"
          value={customerName}
          label="Choose from existing"
          onChange={(e) => setCustomerName(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {existingCustomers.map((name) => (
            <MenuItem key={name} value={name}>
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Divider sx={{ my: 2 }} />

      {/* Purpose Selection (Sales / Admin as Checkboxes) */}
      <FormGroup row>
        {["Sales", "Admin"].map((purpose) => (
          <FormControlLabel
            key={purpose}
            control={
              <Checkbox
                checked={selectedPurposes.includes(purpose)}
                onChange={() => togglePurpose(purpose)}
              />
            }
            label={purpose}
          />
        ))}
      </FormGroup>

      {/* Buyer dropdown after purpose */}
      {(selectedPurposes.includes("Sales") ||
        selectedPurposes.includes("Admin")) && (
        <FormControl fullWidth>
          <InputLabel id="buyer-label">Buyer</InputLabel>
          <Select
            labelId="buyer-label"
            value={buyer}
            onChange={(e) => setBuyer(e.target.value)}
            label="Buyer"
          >
            {buyerOptions.map((b) => (
              <MenuItem key={b} value={b}>
                {b}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* SALES Section */}
      {selectedPurposes.includes("Sales") && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Sales Options</Typography>
          <FormGroup>
            {[
              "regular",
              "new inquiry",
              "sample collection",
              "sample submission",
            ].map((option) => (
              <FormControlLabel
                key={option}
                control={
                  <Checkbox
                    checked={salesOptions.includes(option)}
                    onChange={() => toggleSalesOption(option)}
                  />
                }
                label={option}
              />
            ))}
          </FormGroup>

          {/* Sample Collection Options */}
          {salesOptions.includes("sample collection") && (
            <>
              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Sample Collection Types
              </Typography>
              <FormGroup row>
                {["fabric", "interline"].map((type) => (
                  <FormControlLabel
                    key={type}
                    control={
                      <Checkbox
                        checked={sampleCollectionTypes.includes(type)}
                        onChange={() => toggleSampleType(type)}
                      />
                    }
                    label={type}
                  />
                ))}
              </FormGroup>
              {sampleCollectionTypes.map((type) => (
                <TextField
                  key={type}
                  label={`${type} remark`}
                  multiline
                  rows={2}
                  fullWidth
                  value={remarks[type] || ""}
                  onChange={(e) =>
                    setRemarks({ ...remarks, [type]: e.target.value })
                  }
                  sx={{ mt: 1 }}
                />
              ))}
            </>
          )}

          {/* Sample Submission */}
          {salesOptions.includes("sample submission") && (
            <TextField
              label="Sample Submission Remark"
              multiline
              rows={2}
              fullWidth
              value={remarks["sample submission"] || ""}
              onChange={(e) =>
                setRemarks({
                  ...remarks,
                  ["sample submission"]: e.target.value,
                })
              }
              sx={{ mt: 2 }}
            />
          )}

          {/* General remarks for other Sales options */}
          {salesOptions
            .filter(
              (opt) =>
                opt !== "sample collection" && opt !== "sample submission"
            )
            .map((opt) => (
              <TextField
                key={opt}
                label={`${opt} remark`}
                multiline
                rows={2}
                fullWidth
                value={remarks[opt] || ""}
                onChange={(e) =>
                  setRemarks({ ...remarks, [opt]: e.target.value })
                }
                sx={{ mt: 2 }}
              />
            ))}
        </>
      )}

      {/* ADMIN Section */}
      {selectedPurposes.includes("Admin") && (
        <>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">Admin Remarks</Typography>
          {["payment", "svat", "grn"].map((adminOpt) => (
            <TextField
              key={adminOpt}
              label={`${adminOpt} remark`}
              multiline
              rows={2}
              fullWidth
              value={remarks[adminOpt] || ""}
              onChange={(e) =>
                setRemarks({ ...remarks, [adminOpt]: e.target.value })
              }
              sx={{ mt: 2 }}
            />
          ))}
        </>
      )}

      <Divider sx={{ my: 3 }} />

      <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!customerName.trim() || loading}
          startIcon={loading && <CircularProgress size={20} />}
        >
          {loading ? "Submitting..." : "Add Customer"}
        </Button>
      </Box>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity="success"
          sx={{ width: "100%" }}
        >
          Customer added successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Form;
