"use client";
import React from "react";

const SkeletonUI = () => {

  return (
    <div className="h-screen w-screen bg-gray-100 flex flex-col">
      {/* Navbar Skeleton */}
      <div
        className="w-screen flex justify-between items-center h-[60px] md:h-[60px] p-4 md:pr-8 md:pl-8 bg-gray-100 animate-pulse mt-1.5">
        {/* Logo Skeleton */}
        <div className="hidden md:flex h-[40px] w-[150px] bg-gray-300 rounded-md"></div>

        {/* Right Section Skeleton */}
        <div className="flex justify-between w-full md:w-fit items-center gap-4">
          {/* Dashboard/Community Chat Button */}
          <div className="h-8 w-[120px] bg-gray-300 rounded-md"></div>

          {/* Log Out Button */}
          <div className="h-8 w-[80px] bg-gray-300 rounded-md"></div>

          {/* Profile Picture Skeleton */}
          <div className="w-12 h-11 bg-gray-300 rounded-full"></div>
        </div>
      </div>
      <div className="h-full bg-gray-100 animate-pulse w-full p-4 pt-2">
        <div className={"w-full h-full bg-gray-300 rounded-lg"}></div>
      </div>

    </div>
  );
};

export default SkeletonUI;