"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

export default function SignUpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form state
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Feedback state
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Adjust backend URL if needed
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const res = await fetch(`${backendUrl}/api/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // If you need HttpOnly cookies cross-domain
        body: JSON.stringify({ username, phone, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Sign-up failed");
        return;
      }

      const data = await res.json();
      console.log("Sign-up success:", data);

      // Redirect upon success
      const redirectTo = searchParams.get("redirectTo") || "/";
      router.push(redirectTo);
    } catch (err) {
      console.error("Sign-up error:", err);
      setError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full h-screen items-center">
    <div className="w-[60%] max-lg:w-[100%] flex justify-center items-center h-screen">
    <div className="px-8 flex flex-col w-[600px] h-[700px] bg-white bg-opacity-80 rounded-xl justify-center gap-[16px] z-10">
        {/* Flowbite Brand & Welcome Text */}
        <div className="flex flex-col gap-[8px] items-center">
          <h1 className="text-4xl font-bold mb-2">Bienvenu Client</h1>
          <p className="text-lg text-gray-200"></p>
          Create an account. Vous avez deja un account ?
          <div className="flex items-center w-[300px] gap-[8px]">
            <div className="flex-grow border-t border-gray-400"></div>
            <Link
              href="/signin"
              className="text-primary text-sm font-semibold hover:underline"
            >
              Click here pour connectez a votre compte
            </Link>
            <div className="flex-grow border-t border-gray-400"></div>
          </div>
        </div>

        {/* If there's an error, display it here */}
        {error && (
          <p className="text-red-500 text-center font-semibold">{error}</p>
        )}

        {/* Sign-Up Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-[8px]">
          <div>
            <label htmlFor="username" className="block mb-1 font-medium">
              Username
            </label>
            <input
              id="username"
              placeholder="Votre name"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-lg"
            />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1 font-medium">
              Phone (optional)
            </label>
            <input
              id="phone"
              placeholder="Numero de telephone"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-lg"
            />
          </div>

          <div>
            <label htmlFor="email" className="block mb-1 font-medium">
              Email
            </label>
            <input
              id="email"
              placeholder="Votremail@email.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-lg"
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
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none text-lg font-semibold"
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
            className="h-[50px] w-full text-white text-lg font-semibold py-2 rounded-md bg-primary border-2 transition duration-200 mt-4 hover:bg-secondary"
          >
            {isSubmitting ? "Signing up..." : "Sign up"}
          </button>
        </form>
        </div>
        </div>

      {/* Right Column: Image */}
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
