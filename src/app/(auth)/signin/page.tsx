"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { FaFacebookF, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

declare global {
  interface Window {
    google?: {
      accounts?: Record<string, unknown>;
    };
  }
}

// LoadingDots component: three animated dots using Tailwind classes
const LoadingDots = () => (
  <div className="flex justify-center space-x-1 z-10 w-full h-20 items-center">
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "0s" }}
    ></div>
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "0.2s" }}
    ></div>
    <div
      className="w-2 h-2 bg-primary rounded-full animate-bounce"
      style={{ animationDelay: "0.1s" }}
    ></div>
  </div>
);

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [hasGoogleLoaded, setHasGoogleLoaded] = useState<boolean>(false);

  // Adjust backend URL for your environment
  const backendUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== "undefined" && window.google?.accounts) {
        setHasGoogleLoaded(true);
      } else {
        setHasGoogleLoaded(false);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${backendUrl}/api/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Sign-in failed");
        return;
      }

      const redirectTo = searchParams.get("redirectTo") || "/";
      router.push(redirectTo);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Sign-in error:", error.message);
      } else {
        console.error("Sign-in error:", error);
      }
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  const handleGoogleSignIn = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      console.warn("No credential received from Google.");
      return;
    }

    setHasGoogleLoaded(true);
    setIsGoogleLoading(true);
    try {
      const res = await fetch(`${backendUrl}/api/signin/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken: credentialResponse.credential }),
      });

      if (res.ok) {
        const redirectTo = searchParams.get("redirectTo") || "/";
        router.push(redirectTo);
      } else {
        console.error(
          `Google Sign-in failed. Response status: ${res.status} ${res.statusText}`
        );
        const errorData = await res.json();
        console.error("Error details:", errorData);
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.name === "AbortError") {
          console.warn("Google Sign-in was aborted.");
        } else {
          console.error(
            "Unexpected error during Google Sign-in:",
            error.message
          );
        }
      } else {
        console.error("Unexpected error during Google Sign-in:", error);
      }
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    console.error("Google Sign-in was unsuccessful. Try again later.");
  };

  return (
    <div className="w-flex w-full h-screen items-center">
      <div className="w-[60%] max-lg:w-[100%] flex justify-center items-center h-screen">
        <div className="px-8 flex flex-col w-[600px] h-[700px] bg-white bg-opacity-80 rounded-xl justify-center gap-[16px] z-10">
          <div className="flex flex-col gap-[8px] items-center">
            <h1 className="text-4xl font-bold mb-2">Bienvenu Client</h1>
            <p className="text-lg text-gray-200">Login to your account.</p>
            <div className="flex items-center w-[300px] gap-[8px]">
              <div className="flex-grow border-t border-gray-400"></div>
              <Link
                href="/signup"
                className="text-primary text-sm font-semibold hover:underline"
              >
                Click here to create an account
              </Link>
              <div className="flex-grow border-t border-gray-400"></div>
            </div>
          </div>

          {error && <p className="text-red-500 mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-[8px] ">
            <div className="flex flex-col gap-[4px]">
              <label htmlFor="email" className="text-lg font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Votremail@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email" // ✅ Add this
                className="w-full h-[50px] border px-4 border-primary rounded-md focus:outline-none text-sm font-semibold"
              />
            </div>

            <div className="flex flex-col gap-[4px] relative">
              <label htmlFor="password" className="mb-1 text-lg font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  placeholder="*******"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password" // ✅ Add this
                  className="w-full border border-primary rounded-md px-3 py-2 pr-10 focus:outline-none text-lg font-semibold"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={22} />
                  ) : (
                    <AiOutlineEye size={22} />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="h-[50px] w-full text-white text-lg font-semibold py-2 rounded-md bg-primary transition duration-200 mt-4 hover:bg-secondary"
            >
              {isSubmitting ? "Signing in..." : "Sign in to your account"}
            </button>

            <div className="flex items-center justify-between m-4 text-sm font-semibold">
              <label className="inline-flex items-center text-gray-500">
                <input type="checkbox" className="mr-2 w-4 h-6 bg-blue-200" />
                <span>Remember me</span>
              </label>
              <Link
                href="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <div className="flex items-center">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-2 text-gray-500">or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            {/* Google Sign-In Section */}
            <div className="flex flex-col gap-[8px] h-20 items-center">
              {isGoogleLoading || !hasGoogleLoaded ? (
                <LoadingDots />
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSignIn}
                  onError={handleGoogleError}
                  useOneTap={false}
                />
              )}
            </div>

            <hr className="flex-grow border-t border-gray-300" />
          </form>

          <div className="flex gap-[16px] items-center justify-center">
            <a
              href="#"
              aria-label="Facebook"
              className="w-12 h-12 border-4 flex items-center justify-center border-gray-500 rounded-full text-gray-500"
            >
              <FaFacebookF className="text-2xl" />
            </a>
            <a
              href="#"
              aria-label="Instagram"
              className="w-12 h-12 flex items-center justify-center border-4 border-gray-500 rounded-full text-gray-500"
            >
              <FaInstagram className="text-2xl" />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="w-12 h-12 flex items-center justify-center border-4 border-gray-500 rounded-full text-gray-500"
            >
              <FaTwitter className="text-2xl" />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="w-12 h-12 flex items-center justify-center border-4 border-gray-500 rounded-full text-gray-500"
            >
              <FaYoutube className="text-2xl" />
            </a>
          </div>
        </div>
      </div>

      {/* Background Image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/signin.jpg"
          alt="signin background"
          fill
          priority
          className="object-cover"
        />
      </div>
    </div>
  );
}
