"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState } from "react"

export function useAuth() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (result?.ok) {
        router.push("/")
        return { success: true }
      }

      throw new Error("Login failed")
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : "Login failed",
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut({ redirect: false })
      router.push("/")
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsLoading(true)
    try {
      await signIn("google", { callbackUrl: "/" })
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGitHub = async () => {
    setIsLoading(true)
    try {
      await signIn("github", { callbackUrl: "/" })
    } finally {
      setIsLoading(false)
    }
  }

  return {
    user: session?.user,
    isAuthenticated: !!session,
    isLoading: status === "loading" || isLoading,
    login,
    logout,
    loginWithGoogle,
    loginWithGitHub,
  }
}