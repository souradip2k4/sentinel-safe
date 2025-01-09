import { Typography } from "@mui/material";
import React from "react";
const Reviews = ({ review }) => {
  return (
    <div
      className="bg-transparent w-full h-fit text-white border border-gray-600 rounded-lg mt-3 md-3 p-3"
    >
      <div className="w-full flex justify-between ">
        <Typography className="font-bold text-sm">{review.name}</Typography>
        <Typography className="font-light text-green-400  text-sm">
          {review.sentiment ? review.sentiment : "loading"} sentiment rating
        </Typography>
      </div>
      <p className="opacity-70 text-sm">{review.review}</p>
    </div>
  );
};
export default Reviews;
