/// src/components/signin/SignInForm.tsx

"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/lib/fetchData";
import LoadingDots from "@/components/LoadingDots";

declare global {
  interface Window {
    google?: {
      accounts?: Record<string, unknown>;
    };
  }
}

interface SignInFormProps {
  redirectTo: string;
}

export default function SignInForm({ redirectTo }: SignInFormProps) {
  const router = useRouter();
  const { login, refresh } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [hasGoogleLoaded, setHasGoogleLoaded] = useState(false);

  /* check when GIS script is ready */
  useEffect(() => {
    const t = setTimeout(
      () =>
        setHasGoogleLoaded(
          typeof window !== "undefined" && !!window.google?.accounts,
        ),
      3000,
    );
    return () => clearTimeout(t);
  }, []);

  /* ---------- email / password ---------- */
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await login(email, password);
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  /* ---------- Google ---------- */
  const handleGoogleSignIn = async (resp: CredentialResponse) => {
    if (!resp.credential) return;

    setIsGoogleLoading(true);
    try {
      await fetchData<{ message?: string }>("/signin/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken: resp.credential }),
      });

      await refresh(); // sync context
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Google sign-in failed");
    } finally {
      setIsGoogleLoading(false);
    }
  };

  /* ---------- JSX (unchanged styling) ---------- */
  return (
    <div className="w-flex w-full h-screen items-center">
      <div className="w-[60%] max-lg:w-[100%] flex justify-center items-center h-screen">
        <div className="px-8 flex flex-col w-[600px] h-[700px] bg-white bg-opacity-80 rounded-xl justify-center gap-4 z-10">
          <div className="flex flex-col gap-2 items-center">
            <h1 className="text-4xl font-bold">Bienvenu Client</h1>
            <p className="text-lg text-gray-200">Login to your account.</p>
            <div className="flex items-center w-[300px] gap-2">
              <div className="flex-grow border-t border-gray-400" />
              <Link
                href="/signup"
                className="text-primary text-sm font-semibold hover:underline"
              >
                Click here to create an account
              </Link>
              <div className="flex-grow border-t border-gray-400" />
            </div>
          </div>

          {error && <p className="text-red-500">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            {/* email */}
            <div className="flex flex-col gap-1">
              <label htmlFor="email" className="text-lg font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                className="w-full h-12 border px-4 border-primary rounded-md focus:outline-none text-sm font-semibold"
              />
            </div>

            {/* password */}
            <div className="flex flex-col gap-1 relative">
              <label htmlFor="password" className="text-lg font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="•••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
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

            {/* submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full text-white text-lg font-semibold rounded-md bg-primary transition hover:bg-secondary"
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>

            {/* remember + forgot */}
            <div className="flex items-center justify-between m-2 text-sm font-semibold">
              <label className="inline-flex items-center text-gray-500">
                <input type="checkbox" className="mr-2 w-4 h-4" />
                Remember me
              </label>
              <Link
                href="/forgot-password"
                className="text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* divider */}
            <div className="flex items-center">
              <hr className="flex-grow border-t border-gray-300" />
              <span className="mx-2 text-gray-500">or</span>
              <hr className="flex-grow border-t border-gray-300" />
            </div>

            {/* Google */}
            <div className="flex flex-col items-center h-20">
              {isGoogleLoading || !hasGoogleLoaded ? (
                <LoadingDots />
              ) : (
                <GoogleLogin
                  onSuccess={handleGoogleSignIn}
                  onError={() => setError("Google sign-in failed")}
                />
              )}
            </div>

            <hr className="border-t border-gray-300" />
          </form>

          {/* socials */}
          <div className="flex gap-4 justify-center">
            {[FaFacebookF, FaInstagram, FaTwitter, FaYoutube].map(
              (Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-12 h-12 border-4 border-gray-500 rounded-full flex items-center justify-center text-gray-500"
                >
                  <Icon className="text-2xl" />
                </a>
              ),
            )}
          </div>
        </div>
      </div>

      {/* background */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/signin.jpg"
          alt="Sign-in background"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
