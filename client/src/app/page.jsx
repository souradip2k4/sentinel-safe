"use client";

import Link from "next/link";
import React, {useEffect} from "react";
import Image from "next/image";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "@/firebase.config";
import {useRouter} from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        router.replace("/dashboard");
      } else {
        console.log("No user signed in");
      }
    });
  }, [])


  useEffect(() => {
    function enterPressed(e) {
      if (e.key === "Enter") {
        window.location.href = "/auth";
      }
    }

    window.addEventListener("keypress", enterPressed);
    return () => window.removeEventListener("keypress", enterPressed);
  }, []);

  return (
    <>
      <div className="h-svh  overflow-hidden grid place-items-center">
        <div
          className="border relative overflow-hidden bg-gray-900 md:pt-0 shadow-2xl sm:rounded-3xl md:px-16 pt-12 md:flex lg:gap-x-20 lg:px-24 h-3/4 w-[90%] md:w-3/4 rounded-lg">
          <div className="md:w-[60%] grid place-content-center px-10 md:px-0">
            <h2 className="text-3xl font-bold tracking-tight text-green-400 md:text-4xl text-center md:text-left">
              SentinelSafe
              <br/>
              Your Local Guardian
            </h2>
            <br/>
            <span className="mt-6 text-lg leading-8 text-gray-300  text-center md:text-left">
              A web app Empowering Communities, Ensuring Safety and overall well
              being of the citizens.
            </span>
            <div className="mt-10 flex items-center justify-center gap-x-6 lg:justify-start ">
              <Link
                href="/auth"
                className="transition duration-300 rounded-md bg-green-400 px-3.5 py-2.5 text-sm font-semibold text-gray-800 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white "
              >
                Get Started &nbsp; &nbsp; →
              </Link>
            </div>
          </div>
          <div className="block relative h-80 mt-12 md:mt-0 ">
            <Image
              className="absolute left-0 top-0 w-[57rem] max-w-none bg-white/5 ring-1 ring-white/10"
              src="/images/google-maps.jpg"
              alt="App screenshot"
              width={1824}
              height={1080}
            />
          </div>
        </div>
      </div>
    </>
  );
}