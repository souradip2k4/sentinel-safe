"use client";
import Navbar from "@/components/Dashboard/Navbar";
import MenuIcon from "@mui/icons-material/Menu";
import React, {useEffect, useState} from "react";
import {Toaster} from "react-hot-toast";
import {auth} from "@/firebase.config"
import dynamic from "next/dynamic";
import Sidebar from "@/components/Dashboard/Sidebar";

const Location = dynamic(() => import("@/components/Dashboard/Location"), {
  ssr: false,
});


const Page = () => {
  const [collapsed, setCollapsed] = useState(true);

  const [height, setHeight] = useState("calc(100% - 96px)");

  useEffect(() => {
    if (window.innerWidth >= 768) {
      setHeight("calc(100% - 60px)")
    } else {
      setHeight("calc(100% - 96px)")
    }
  }, [window.innerWidth]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      auth.currentUser.getIdToken(true).then((token) => {
        console.log(token);
      });
    }
  }, []);

  return (
    <div className="h-screen  w-screen overflow-hidden">
      <Navbar/>
      <Toaster/>
      <div className="relative flex md:flex-row flex-col bg-green-300 h-full"

      >
        <div className={"w-full h-full relative"}>
          <div className={"absolute bottom-0 h-full w-full"}>
            <Location/>
          </div>
        </div>


        <MenuIcon
          onClick={() => setCollapsed(!collapsed)}
          sx={{fontSize: "40px"}}
          className="hover:text-green-200 bg-gray-900 text-white p-2 rounded-lg cursor-pointer absolute top-5 right-5"
        />
        <div className={"md:relative md:h-full md:w-fit"}
             style={{
               height: height,
             }}>
          <Sidebar
            collapsed={collapsed}
            setCollapsed={setCollapsed}
          />
        </div>

      </div>
    </div>
  );
};

export default Page;