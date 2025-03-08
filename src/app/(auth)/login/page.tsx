"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation"; // Import useRouter
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MdBusinessCenter } from "react-icons/md";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

export default function AuthPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const router = useRouter();
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/businessDash");
  };
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/businessDash");
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col">
      {/* Header */}
      <header className="container mx-auto py-4 flex items-center justify-between z-10">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full text-pink-900 text-5xl flex items-center justify-center">
            <MdBusinessCenter />
          </div>
          <span className="text-white text-xl font-bold">Worklio</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-white hover:text-pink-400 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-white hover:text-pink-400 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/#about"
            className="text-white hover:text-pink-400 transition-colors"
          >
            About
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 relative">
        {/* Background elements */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          {/* Main gradient background */}
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-900/80 via-zinc-900 to-zinc-950"></div>

          {/* Animated grid */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px)",
              backgroundSize: "30px 30px",
              backgroundPosition: "0 0",
            }}
          ></div>

          {/* Glowing orbs */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl"></div>
          <div className="absolute top-36 -left-12 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl"></div>

          {/* Floating geometric shapes */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/10 rounded-lg transform rotate-12 opacity-50"></div>
          <div className="absolute bottom-1/3 right-1/3 w-20 h-20 border border-pink-500/20 rounded-full transform opacity-70"></div>
          <div className="absolute top-1/3 right-1/4 w-16 h-16 border border-indigo-500/20 transform rotate-45 opacity-50"></div>
        </div>

        <Card className="w-full max-w-md border-0 bg-white/5 backdrop-blur-sm shadow-xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-white">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Sign in to your account or create a new one
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="login"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2 mb-6 bg-zinc-800/50">
                <TabsTrigger
                  value="login"
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
                >
                  Login
                </TabsTrigger>
                <TabsTrigger
                  value="register"
                  className="data-[state=active]:bg-pink-600 data-[state=active]:text-white"
                >
                  Register
                </TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login" className="mt-0">
                <form onSubmit={handleLogin}>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-300">
                        Email
                      </Label>
                      <Input
                        id="email"
                        placeholder="name@example.com"
                        type="email"
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-zinc-300">
                          Password
                        </Label>
                        <Link
                          href="/forgot-password"
                          className="text-xs text-pink-400 hover:text-pink-300"
                        >
                          Forgot password?
                        </Link>
                      </div>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="bg-zinc-800/50 border-zinc-700 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-300"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="remember"
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-800/50 text-pink-600 focus:ring-pink-600"
                      />
                      <Label
                        htmlFor="remember"
                        className="text-sm text-zinc-300"
                      >
                        Remember me
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                      Sign In
                    </Button>
                  </div>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register" className="mt-0">
                <form onSubmit={handleRegister}>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name" className="text-zinc-300">
                          First Name
                        </Label>
                        <Input
                          id="first-name"
                          placeholder="John"
                          required
                          className="bg-zinc-800/50 border-zinc-700 text-white"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name" className="text-zinc-300">
                          Last Name
                        </Label>
                        <Input
                          id="last-name"
                          placeholder="Doe"
                          required
                          className="bg-zinc-800/50 border-zinc-700 text-white"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email" className="text-zinc-300">
                        Email
                      </Label>
                      <Input
                        id="register-email"
                        placeholder="name@example.com"
                        type="email"
                        required
                        className="bg-zinc-800/50 border-zinc-700 text-white"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label
                        htmlFor="register-password"
                        className="text-zinc-300"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          required
                          className="bg-zinc-800/50 border-zinc-700 text-white pr-10"
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-400 hover:text-zinc-300"
                        >
                          {showPassword ? (
                            <EyeOff size={18} />
                          ) : (
                            <Eye size={18} />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-zinc-400 mt-1">
                        Password must be at least 8 characters long
                      </p>
                    </div>

                    <div className="flex items-start space-x-2">
                      <input
                        type="checkbox"
                        id="terms"
                        className="h-4 w-4 rounded border-zinc-700 bg-zinc-800/50 text-pink-600 focus:ring-pink-600 mt-1"
                      />
                      <Label htmlFor="terms" className="text-sm text-zinc-300">
                        I agree to the Terms of Service and Privacy Policy.
                      </Label>
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-pink-600 hover:bg-pink-700"
                    >
                      Create Account
                    </Button>
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>

          <CardFooter className="flex flex-col gap-4 border-t border-zinc-800 pt-6">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-zinc-700"></span>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-zinc-900 px-2 text-zinc-400">
                  OR CONTINUE WITH
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700/50"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.0003 2C6.47751 2 2.00049 6.477 2.00049 12C2.00049 17.523 6.47751 22 12.0003 22C17.5233 22 22.0003 17.523 22.0003 12C22.0003 6.477 17.5233 2 12.0003 2ZM18.5933 9.814L17.2733 15.291C17.2483 15.398 17.1953 15.498 17.1193 15.577C17.0433 15.657 16.9483 15.713 16.8423 15.739C16.7363 15.765 16.6253 15.759 16.5233 15.724C16.4213 15.688 16.3333 15.624 16.2703 15.539L14.1583 12.893L12.1233 14.701C12.0743 14.744 12.0153 14.775 11.9513 14.79C11.8873 14.805 11.8213 14.804 11.7583 14.787C11.6953 14.77 11.6373 14.737 11.5903 14.692C11.5423 14.647 11.5073 14.592 11.4883 14.53L10.7663 11.997L8.08931 10.573C7.98931 10.523 7.90831 10.442 7.85731 10.344C7.80631 10.245 7.78831 10.134 7.80631 10.025C7.82431 9.917 7.87731 9.817 7.95731 9.739C8.03731 9.661 8.13931 9.61 8.24931 9.594L17.8203 8.055C17.9343 8.039 18.0513 8.051 18.1573 8.091C18.2643 8.13 18.3563 8.196 18.4233 8.281C18.4903 8.366 18.5313 8.467 18.5413 8.573C18.5513 8.679 18.5303 8.785 18.4813 8.879L18.5933 9.813V9.814Z" />
                </svg>
                LinkedIn
              </Button>
              <Button
                variant="outline"
                className="bg-zinc-800/50 border-zinc-700 text-white hover:bg-zinc-700/50"
              >
                <svg
                  className="mr-2 h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Google
              </Button>
            </div>
          </CardFooter>
        </Card>
      </main>

      {/* Footer */}
      <footer className="py-6 text-center text-zinc-500 text-sm">
        <p>© {new Date().getFullYear()} Worklio. All rights reserved.</p>
      </footer>
    </div>
  );
}
