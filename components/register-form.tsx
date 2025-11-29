"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

// --- 1. IMPORT DARI FIREBASE & NEXT ---
import { auth } from "@/lib/firebase"; // Sesuaikan path ini
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useState } from "react";

const registerSchema = z.object({
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email format" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  
  const router = useRouter(); // Untuk redirect
  const [globalError, setGlobalError] = useState<string>(""); // Untuk error umum

  const {
    register,
    handleSubmit,
    setError, // Penting untuk menampilkan error validasi backend
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  // --- 2. LOGIKA SUBMIT ---
  const onSubmit = async (data: RegisterFormValues) => {
    setGlobalError(""); // Reset error sebelum mulai

    try {
      // Langkah A: Buat user di Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      // Langkah B: Update Profile untuk simpan "Full Name" (DisplayName)
      await updateProfile(userCredential.user, {
        displayName: data.fullName,
      });

      console.log("User registered & profile updated:", userCredential.user);

      // Langkah C: Redirect ke dashboard atau login
      router.push("/login");

    } catch (error: any) {
      console.error("Error Registration:", error.code);

      // Langkah D: Handle Error spesifik
      if (error.code === "auth/email-already-in-use") {
        setError("email", { message: "Email ini sudah terdaftar." });
      } else if (error.code === "auth/weak-password") {
        setError("password", { message: "Password terlalu lemah." });
      } else {
        setGlobalError("Terjadi kesalahan sistem. Silakan coba lagi.");
      }
    }
  };

  return (
    <form
      className={cn("flex flex-col gap-6", className)}
      onSubmit={handleSubmit(onSubmit)}
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Register your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to register your account
          </p>
        </div>

        {/* Tampilkan Global Error jika ada */}
        {globalError && (
          <div className="bg-red-100 text-red-600 text-sm p-3 rounded text-center">
            {globalError}
          </div>
        )}

        <Field>
          <FieldLabel htmlFor="fullName">Full Name</FieldLabel>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            {...register("fullName")}
          />
          {errors.fullName && (
            <p className="text-red-500 text-xs mt-1">
              {errors.fullName.message}
            </p>
          )}
        </Field>

        <Field>
          <FieldLabel htmlFor="email">Email</FieldLabel>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </Field>

        <Field>
          <div className="flex items-center">
            <FieldLabel htmlFor="password">Password</FieldLabel>
          </div>
          <Input id="password" type="password" {...register("password")} />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">
              {errors.password.message}
            </p>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting} className="cursor-pointer w-full">
            {isSubmitting ? "Creating Account..." : "Register"}
          </Button>
        </Field>
        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/login" className="underline underline-offset-4">
              Login
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  );
}