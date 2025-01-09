"use client";
import Image from "next/image";
import React, {useEffect, useState} from "react";
import {auth} from "@/firebase.config";
import {useRouter} from "next/navigation";
import toast, {Toaster} from "react-hot-toast";
import {z} from "zod";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  sendPasswordResetEmail,
  onAuthStateChanged,
  signInAnonymously
} from "firebase/auth";

export default function Authentication() {
  const router = useRouter();

  const [signUp, setSignUp] = useState(false);
  const [input, setInput] = useState({
    name: "",
    email: "",
    password: "",
  });

  useEffect(() => {
    onAuthStateChanged(auth, user => {
      if (user) {
        router.replace("/dashboard");
      }
    })
  }, [])

  const provider = new GoogleAuthProvider();


  const validationSchema = z.object({
    name: z
    .string()
    .min(1, "Name must be entered"),

    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters long").max(10, "Password length cannot exceed 10 characters"),
  });

  const handleChange = (event) => {
    setInput((prevInput) => ({
      ...prevInput,
      [event.target.name]: event.target.value,
    }));
  };

  const createUser = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        input.email,
        input.password,
      );

      await updateProfile(auth.currentUser, {
        displayName: input.name,
      });

      await sendEmailVerification(userCredential.user);
      toast.success("Verification email sent! Please verify your email before proceeding.");

      const checkEmailVerified = async () => {
        await auth.currentUser.reload();
        if (auth.currentUser.emailVerified) {
          toast.success("Email verified successfully! Redirecting...");
          router.push("/dashboard");
        } else {
          setTimeout(checkEmailVerified, 3000);
        }
      };

      checkEmailVerified();

    } catch (error) {
      // console.log(error);
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues.map((issue) => issue.message);
        errorMessages.forEach((error) => toast.error(error));
      } else {
        toast.error(error.message);
      }
    }
  };

  const handleNext = async (e) => {
    e.preventDefault();

    try {
      validationSchema.parse(input);
      if (signUp) {
        await createUser();
      } else {
        const userCredentials = await signInWithEmailAndPassword(auth, input.email, input.password);

        // console.log(userCredentials)
        router.push("/dashboard");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues.map((issue) => issue.message);
        errorMessages.forEach((error) => toast.error(error));
      } else {
        toast(err.message);
      }
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      // console.log(response.data.message)
      router.replace("/dashboard");
    } catch (error) {
      if (err instanceof z.ZodError) {
        const errorMessages = err.issues.map((issue) => issue.message);
        errorMessages.forEach((error) => toast.error(error));
      } else {
        toast.error("Authentication Failed!");
      }
    }
  };

  const handleAnonymousSignIn = async () => {
    try {
      const userCredentials = await signInAnonymously(auth);

      router.replace("/dashboard");
    } catch (err) {
      toast.error("Authentication Failed!");
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-900">
      <div className="flex flex-col bg-gray-100 p-8 rounded-lg shadow-lg w-full max-w-md">
        <Toaster/>
        <div className="text-center">
          <Image
            src="/logo.png"
            alt="Your Company"
            width={100}
            height={100}
            className="mx-auto mb-4"
          />
          <h2 className="text-2xl font-semibold text-gray-800">
            {signUp ? "Create an account" : "Sign in to your account"}
          </h2>
        </div>

        <form onSubmit={handleNext} className="space-y-4 mt-6">
          {signUp && (
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Username
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={input.name}
                onChange={handleChange}
                className="w-full px-3 mt-1.5 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          )}

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={input.email}
              onChange={handleChange}
              className="w-full px-3  mt-1.5 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={input.password}
              onChange={handleChange}
              className="w-full px-3  mt-1.5 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {!signUp && (
              <p
                onClick={() => {
                  sendPasswordResetEmail(auth, input.email)
                  .then(() => toast.success("Reset link sent successfully!"))
                  .catch((err) => console.error(err));
                }}
                className="mt-2 text-sm text-green-600 cursor-pointer hover:underline"
              >
                Forgot password?
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
          >
            {signUp ? "Sign Up" : "Sign In"}
          </button>
        </form>

        <div className="flex flex-col space-y-3 mt-4">
          <button
            onClick={handleGoogleAuth}
            className="flex items-center justify-center bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          >
            <Image
              src="/google.png"
              alt="Google"
              width={20}
              height={20}
              className="mr-2"
            />
            Sign in with Google
          </button>
          <button
            onClick={handleAnonymousSignIn}
            className="bg-gray-400 text-gray-800 py-2 rounded-md hover:bg-gray-500 transition"
          >
            Sign in as Guest
          </button>
        </div>

        <p
          className="text-center text-sm mt-4 text-gray-600 cursor-pointer hover:underline"
          onClick={() => setSignUp(!signUp)}
        >
          {signUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </p>
      </div>
    </div>
  );
}
