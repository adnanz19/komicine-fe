"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

// --- 1. IMPORT DARI FIREBASE & NEXT ---
import { auth } from "@/lib/firebase" // Pastikan path ini benar
import { signInWithEmailAndPassword } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useState } from "react"

const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email wajib diisi" })
    .email({ message: "Format email tidak valid" }),
  password: z
    .string()
    .min(1, { message: "Password wajib diisi" }), 
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  
  const router = useRouter()
  const [globalError, setGlobalError] = useState<string>("")

  // 2. Setup useForm
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  // --- 3. LOGIKA LOGIN ---
  const onSubmit = async (data: LoginFormValues) => {
    setGlobalError(""); // Reset error lama
    
    try {
      // Eksekusi Login Firebase
      await signInWithEmailAndPassword(auth, data.email, data.password)
      
      console.log("Login Berhasil!")
      
      // Redirect ke dashboard
      router.push("/mangas")
      router.refresh() // Tips: Refresh agar server component mendeteksi session baru
      
    } catch (error: any) {
      console.error("Login Gagal:", error.code)

      // Handle Error Firebase
      // auth/invalid-credential adalah kode standar baru untuk email/pass salah (biar aman dari hacker)
      if (error.code === 'auth/invalid-credential' || error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setGlobalError("Email atau password salah.")
      } else if (error.code === 'auth/too-many-requests') {
        setGlobalError("Terlalu banyak percobaan gagal. Coba lagi nanti.")
      } else {
        setGlobalError("Terjadi kesalahan sistem.")
      }
    }
  }

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className={cn("flex flex-col gap-6", className)} 
      {...props}
    >
      <FieldGroup>
        <div className="flex flex-col items-center gap-1 text-center">
          <h1 className="text-2xl font-bold">Login to your account</h1>
          <p className="text-muted-foreground text-sm text-balance">
            Enter your email below to login to your account
          </p>
        </div>

        {/* Tampilkan Global Error (Kotak Merah) */}
        {globalError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded text-sm text-center">
            {globalError}
          </div>
        )}

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
            <a
              href="/forgot-password" // Arahkan ke halaman reset password nanti
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>
          </div>
          <Input 
            id="password" 
            type="password" 
            {...register("password")} 
          />
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </Field>

        <Field>
          <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
            {isSubmitting ? "Signing in..." : "Login"}
          </Button>
        </Field>

        <Field>
          <FieldDescription className="text-center">
            Don&apos;t have an account?{" "}
            <a href="/register" className="underline underline-offset-4">
              Register
            </a>
          </FieldDescription>
        </Field>
      </FieldGroup>
    </form>
  )
}