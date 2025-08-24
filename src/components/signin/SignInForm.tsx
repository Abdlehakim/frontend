/* ------------------------------------------------------------------
   src/components/signin/SignInForm.tsx
------------------------------------------------------------------ */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";
import { fetchData } from "@/lib/fetchData";
import LoadingDots from "@/components/LoadingDots";

declare global {
  interface Window {
    google?: { accounts?: Record<string, unknown> };
  }
}

interface SignInFormProps {
  redirectTo: string;
}

export default function SignInForm({ redirectTo }: SignInFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [hasGoogleLoaded, setHasGoogleLoaded] = useState(false);

  useEffect(() => {
    const t = setTimeout(
      () =>
        setHasGoogleLoaded(
          typeof window !== "undefined" && !!window.google?.accounts
        ),
      3000
    );
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting) return;

    setError("");
    setIsSubmitting(true);

    try {
      // Clear any stale client timer cookie to avoid instant auto-logout races
      document.cookie = "token_FrontEnd_exp=; Max-Age=0; path=/";

      await fetchData("/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      else localStorage.removeItem("rememberedEmail");

      // Hard reload so middleware and HttpOnly cookie are respected
      window.location.replace(redirectTo);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Échec de la connexion");
      setIsSubmitting(false);
    }
  }

  const handleGoogleSignIn = async (resp: CredentialResponse) => {
    if (!resp.credential || isGoogleLoading) return;

    setError("");
    setIsGoogleLoading(true);
    try {
      document.cookie = "token_FrontEnd_exp=; Max-Age=0; path=/";

      await fetchData<{ message?: string }>("/signin/google", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken: resp.credential }),
      });

      window.location.replace(redirectTo);
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Échec de la connexion Google"
      );
      setIsGoogleLoading(false);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {(isSubmitting || isGoogleLoading) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <LoadingDots />
        </div>
      )}

      <div className="w-flex w-full h-screen items-center">
        <div className="w-[60%] max-lg:w-[100%] flex justify-center items-center h-full">
          <div className="px-8 flex flex-col w-[600px] h-full bg-white/80 rounded-xl max-md:rounded-none justify-center gap-4 z-10">
            <div className="flex flex-col gap-2 items-center">
              <h1 className="text-2xl uppercase font-bold">Connectez-vous</h1>
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="flex flex-col gap-2">
              <div className="flex flex-col gap-1">
                <label htmlFor="email" className="block mb-1 font-medium">
                  E-mail
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="vous@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full h-12 border border-gray-300 px-4 rounded-md focus:outline-none text-md"
                />
              </div>

              <div className="flex flex-col gap-1 relative">
                <label htmlFor="password" className="block mb-1 font-medium">
                  Mot de passe
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
                    className="w-full h-12 border border-gray-300 px-4 pr-10 rounded-md focus:outline-none text-md"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
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
                className="mt-2 h-12 w-full text-white text-lg font-semibold rounded-md bg-primary transition hover:bg-secondary disabled:opacity-60"
              >
                {isSubmitting ? "Connexion…" : "Se connecter"}
              </button>

              <div className="flex items-center justify-between mt-2 text-sm font-semibold">
                <label className="inline-flex items-center text-gray-500 max-md:text-xs">
                  <input
                    type="checkbox"
                    className="mr-2 w-4 h-4"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Se souvenir de moi
                </label>
                <Link
                  href="/forgot-password"
                  className="text-primary hover:underline max-md:text-xs"
                >
                  Mot de passe oublié&nbsp;?
                </Link>
              </div>

              <div className="flex items-center">
                <hr className="flex-grow border-t border-gray-300" />
                <span className="mx-2 text-gray-500">ou</span>
                <hr className="flex-grow border-t border-gray-300" />
              </div>

              <div className="flex flex-col items-center h-20 w-full">
                {isGoogleLoading || !hasGoogleLoaded ? (
                  <LoadingDots />
                ) : (
                  <GoogleLogin
                    onSuccess={handleGoogleSignIn}
                    onError={() => setError("Échec de la connexion Google")}
                  />
                )}
              </div>

              <hr className="border-t border-gray-300" />
            </form>

            <div className="flex items-center w-full gap-2 justify-center">
              <div className="flex-grow border-t border-gray-400" />
              <Link
                href="/signup"
                className="text-primary text-center text-sm font-semibold hover:underline"
              >
                Vous n’avez pas de compte ? Cliquez ici pour en créer un.
              </Link>
              <div className="flex-grow border-t border-gray-400" />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 -z-10">
        <Image
          src="/signin.jpg"
          alt="Arrière-plan de connexion"
          fill
          priority
          className="object-cover"
        />
      </div>
    </>
  );
}
