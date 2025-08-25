import React from "react";
import { Autocomplete, TextField } from "@mui/material";

const US_STATES = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota",
    "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada",
    "New Hampshire", "New Jersey", "New Mexico", "New York",
    "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon",
    "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota",
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington",
    "West Virginia", "Wisconsin", "Wyoming"
];

const StateSelector = ({ trip, handleChange }: any) => {
    return (
        <Autocomplete
            freeSolo
            options={US_STATES}
            value={trip.state || ""}
            onInputChange={(event, newValue) =>
                handleChange({ target: { name: "state", value: newValue } })
            }
            renderInput={(params) => (
                <TextField {...params} label="State" className="w-full p-2 border" />
            )}
        />
    );
};

export default StateSelector;
