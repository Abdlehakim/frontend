// src/components/signin/SignUpForm.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "@/hooks/useAuth";
import { fetchData } from "@/lib/fetchData";

interface SignUpFormProps {
  redirectTo: string;
}

export default function SignUpForm({ redirectTo }: SignUpFormProps) {
  const router = useRouter();
  const { refresh } = useAuth();

  /* ---------------- form state ---------------- */
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  /* ---------------- feedback ------------------ */
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      // POST to /api/auth/signup via your fetchData helper
      await fetchData<{
        message: string;
        user: { id: string; email: string; username: string };
      }>("signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, phone, email, password }),
      });

      // re-hydrate your auth context and then redirect
      await refresh();
      router.push(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Sign-up failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex w-full h-screen items-center">
      <div className="w-[60%] max-lg:w-full flex justify-center items-center h-screen">
        <div className="px-8 flex flex-col w-[600px] h-full bg-white bg-opacity-80 rounded-xl justify-center gap-[16px] z-10">
          {/* Heading */}
          <div className="flex flex-col gap-[8px] items-center">
            <h1 className="text-2xl uppercase font-bold">Create an account</h1>
          </div>

          {error && (
            <p className="text-red-500 text-center font-semibold">{error}</p>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-[8px]">
            <div>
              <label htmlFor="username" className="block mb-1 font-medium">
                Username
              </label>
              <input
                id="username"
                placeholder="Votre nom"
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
                placeholder="Numéro de téléphone"
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
                placeholder="votremail@email.com"
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
          <div className="flex items-center mt-4 w-full gap-[8px]">
            <div className="flex-grow border-t border-gray-400" />
            <Link
              href="/signin"
              className="text-primary text-sm font-semibold hover:underline text-center"
            >
              Vous Avez deja un compte ? Cliquez ici pour vous connecter
            </Link>
            <div className="flex-grow border-t border-gray-400" />
          </div>
        </div>
      </div>

      {/* Background image */}
      <div className="fixed inset-0 -z-10">
        <Image
          src="/signin.jpg"
          alt="Arrière-plan de connexion"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
