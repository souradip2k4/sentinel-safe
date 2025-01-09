"use client"

import {auth} from "@/firebase.config";
import {onAuthStateChanged} from "firebase/auth";
import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";

export default function RootLayout({children}) {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        setIsLoading(true);
      } else {
        router.replace("/auth");
      }
    })
  }, []);


  useEffect(() => {
    console.log(isLoading);
  }, [isLoading]);

  if (!isLoading) {
    return <div>Loading...</div>
  }
  return (
    <>{children}</>
  );
}