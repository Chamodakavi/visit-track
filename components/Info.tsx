// components/Info.tsx
import React from "react";
import { Box } from "@mui/material";

interface InfoProps {
  customerName: string;
  buyer: string;
  createdAt: string;
  remarks: {
    fabric?: string;
    interline?: string;
    regular?: string;
    ["new inquiry"]?: string;
    ["sample submission"]?: string;
  };
  salesOptions: string[];
  sampleCollectionTypes: string[];
  selectedPurposes: string[];
}

const Info: React.FC<InfoProps> = ({
  customerName,
  buyer,
  remarks,
  salesOptions,
  sampleCollectionTypes,
  selectedPurposes,
}) => {
  return (
    <Box sx={{ p: 2, border: "1px solid #ccc", borderRadius: 2, mb: 2 }}>
      <h2 className="text-lg font-bold">Customer: {customerName}</h2>

      <div className="mt-2">
        <h3 className="font-semibold">Selected Purposes:</h3>
        <ul>
          {selectedPurposes.map((purpose, i) => (
            <li key={i}>{purpose}</li>
          ))}
        </ul>
      </div>

      <p>
        <h3 className="font-semibold">Buyer:</h3> {buyer}
      </p>
      {/* <p>Created At: {createdAt}</p> */}

      <div className="mt-2">
        <h3 className="font-semibold">Sales Options:</h3>
        <ul>
          {salesOptions.map((option, i) => (
            <li key={i}>{option}</li>
          ))}
        </ul>
      </div>

      <div className="mt-2">
        <h3 className="font-semibold">Remarks:</h3>
        <ul>
          {Object.entries(remarks).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-2">
        <h3 className="font-semibold">Sample Collection Types:</h3>
        <ul>
          {sampleCollectionTypes.map((type, i) => (
            <li key={i}>{type}</li>
          ))}
        </ul>
      </div>
    </Box>
  );
};

export default Info;
