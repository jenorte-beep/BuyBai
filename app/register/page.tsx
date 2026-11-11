
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { apiClient } from "@/lib/api";
import { CONFIG } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function RegisterPage() {
  const router = useRouter();
  const { isChecking } = useAuthGuard({ requireAuth: false });

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  if (isChecking) return null;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await apiClient("/auth/register", {
        method: "POST",
        body: JSON.stringify({ username, password }),
      });

      router.push(CONFIG.ROUTES.LOGIN);
    } catch (err: any) {
      setError(err.message || "Unable to create your account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08060D] px-5 py-12 text-white">

      {/* BACKGROUND EFFECTS */}
      <div className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-700/20 blur-[150px]" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full bg-purple-600/20 blur-[150px]" />

      {/* REGISTER CARD */}
      <div className="relative z-10 w-full max-w-md rounded-3xl border border-violet-500/20 bg-[#100D18]/95 p-7 shadow-[0_0_80px_rgba(139,92,246,0.15)] sm:p-10">

        {/* SHOP NAME */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Buy<span className="text-violet-500">Bai</span>
          </h1>
          <div className="mx-auto mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-violet-600 to-purple-400" />
        </div>

        <Card className="border-0 bg-transparent shadow-none">

          {/* HEADER */}
          <CardHeader className="space-y-3 px-0 text-left">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-violet-400">
              Join BuyBai
            </p>

            <CardTitle className="text-3xl font-bold tracking-tight text-white">
              Create your
              <span className="block text-violet-400">account.</span>
            </CardTitle>

            <CardDescription className="text-sm leading-6 text-gray-400">
              Create your BuyBai account and get started today.
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleRegister}>

            <CardContent className="space-y-6 px-0">

              {/* ERROR MESSAGE */}
              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              {/* USERNAME */}
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-sm font-medium text-gray-300"
                >
                  Username
                </Label>

                <Input
                  id="username"
                  type="text"
                  placeholder="Choose a username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  autoComplete="username"
                  required
                  className="h-14 rounded-xl border border-white/10 bg-[#171321] text-white placeholder:text-gray-600 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/20"
                />
              </div>

              {/* PASSWORD */}
              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-300"
                >
                  Password
                </Label>

                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    className="h-14 rounded-xl border border-white/10 bg-[#171321] pr-16 text-white placeholder:text-gray-600 focus-visible:border-violet-500 focus-visible:ring-2 focus-visible:ring-violet-500/20"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-violet-400 hover:text-violet-300"
                  >
                    {showPassword ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>

            </CardContent>

            {/* BUTTON AND FOOTER */}
            <CardFooter className="bg-transparent flex flex-col gap-6 px-0 pt-5">

              <Button
                type="submit"
                disabled={loading}
                className="h-14 w-full rounded-xl bg-gradient-to-r from-violet-700 via-violet-600 to-purple-600 text-base font-semibold text-white shadow-lg shadow-violet-900/40 transition-all duration-300 hover:scale-[1.01] hover:from-violet-600 hover:to-fuchsia-600 hover:shadow-violet-600/30 disabled:opacity-60"
              >
                {loading ? (
                  <span className="flex items-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Creating Account...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Create Account
                    <span className="text-xl">→</span>
                  </span>
                )}
              </Button>

              <div className="flex w-full items-center gap-3">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs text-gray-600">
                  ALREADY A MEMBER?
                </span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <Link
                  href={CONFIG.ROUTES.LOGIN}
                  className="font-semibold text-violet-400 transition-colors hover:text-violet-300 hover:underline"
                >
                  Login
                </Link>
              </p>

              <p className="text-center text-xs text-gray-600">
                © 2026 BuyBai. All rights reserved.
              </p>

            </CardFooter>
          </form>
        </Card>
      </div>
    </main>
  );
}
