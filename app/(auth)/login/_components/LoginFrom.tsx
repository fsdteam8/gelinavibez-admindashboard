
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {  useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff } from "lucide-react";
import { AuthLayout } from "@/components/Shared/AuthLayout";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);


  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  useEffect(() => {
    if (error === "CredentialsSignin") {
      toast.error("Invalid credentials or access denied (Admins only) ❌");
    }
  }, [error]);

  useEffect(() => {
    const savedEmail = localStorage.getItem("savedEmail");
    const savedPassword = localStorage.getItem("savedPassword");
    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      toast.error("Email is required");
      return;
    }
    if (!password.trim()) {
      toast.error("Password is required");
      return;
    }

    try {
      setLoading(true);

      const res = await signIn("credentials", {
        redirect: false, 
        email,
        password,
        callbackUrl: "/", 
      });
 
      if (res?.error) {
        if (res.error.includes("admin_only")) {
          toast.error("Only admin users can login ");
        } else {
          toast.error("Invalid email or password ");
        }
        setLoading(false);
        return;
      }

      if (rememberMe) {
        localStorage.setItem("savedEmail", email);
        localStorage.setItem("savedPassword", password);
      } else {
        localStorage.removeItem("savedEmail");
        localStorage.removeItem("savedPassword");
      }

      toast.success("Login successful 🎉");
      setTimeout(() => {
        // router.push("/");
        window.location.href = "/";
      }, 800);
    } catch (err) {
      toast.error("Something went wrong. Please try again." + err);
    } finally {
      setLoading(false);  
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-4xl font-serif text-[#0F3D61]">Hello!</h1>
          <p className="text-base text-[#6C757D]">
            Access to manage your account
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-base font-medium text-[#0F3D61]"
            >
              Email <span className="text-[#0F3D61]">*</span>
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-white border-[#484848] rounded-full px-4 h-[56px] placeholder:text-[#787878] text-[#0F3D61] text-base font-normal"
              required
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-base font-medium text-[#0F3D61]"
            >
              Password <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white border-[#484848] rounded-full px-4 h-[56px] placeholder:text-[#787878] text-[#0F3D61] text-base font-normal"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label
                htmlFor="remember"
                className="text-base text-[#0F3D61] cursor-pointer"
              >
                Remember Me
              </label>
            </div>
            <Link
              href="/forgot-password"
              className="text-base text-[#0F3D61] hover:underline"
            >
              Forget Password?
            </Link>
          </div>

          <div className="pt-6">
            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0F3D61] hover:bg-[#0F3D61]/90 text-white rounded-full font-bold py-6 text-base"
            >
              {loading ? "Logging in..." : "Sign In"}
            </Button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}
