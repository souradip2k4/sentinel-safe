import React from "react";

import DirectionsWalkIcon from "@mui/icons-material/DirectionsWalk";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";

import { Typography } from "@mui/material";
const metrics = ({ peopleCount, avgSpeed }) => {
  return (
    <>
    
      <div className="flex gap-2 items-center justify-center ">
        <PeopleAltIcon className="text-green-400" />

        <span>{peopleCount}</span>
      </div>
      <div className="flex gap-2 items-center justify-center ">
        <DirectionsWalkIcon className="text-green-400" />
        <span>{avgSpeed} kmph</span>
      </div>
    </>
  );
};
export default metrics;
