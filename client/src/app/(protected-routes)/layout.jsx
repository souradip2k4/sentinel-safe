"use client";

import { auth } from "@/firebase.config";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SkeletonUI from "@/components/SkeletonUI";

function delay(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve("Promise resolved");
    }, ms);
  });
}

export default function RootLayout({ children }) {
  const [isLoading, setIsLoading] = useState(true); // Start with loading state
  const router = useRouter();

  useEffect(() => {
    const checkAuthState = async () => {
      await delay(1500); // Introduce delay

      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsLoading(false); // End loading state after delay
        } else {
          router.replace("/auth");
        }
      });
    };

    checkAuthState();
  }, []);

  if (isLoading) {
    return <SkeletonUI />;
  }

  return <>{children}</>;
}
