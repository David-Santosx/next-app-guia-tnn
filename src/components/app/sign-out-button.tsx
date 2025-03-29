"use client"

import { LogOut } from "lucide-react"
import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"

interface SignOutButtonProps {
  variant?: "icon" | "default"
  className?: string
}

export function SignOutButton({ variant = "icon", className }: SignOutButtonProps) {
  const handleSignOut = () => {
    signOut({ callbackUrl: '/login' })
  }

  if (variant === "icon") {
    return (
      <Button
        onClick={handleSignOut}
        variant="ghost"
        size="icon"
        className={`rounded-full hover:bg-slate-800 text-slate-400 hover:text-slate-200 ${className}`}
        title="Sair"
      >
        <LogOut className="h-4 w-4" />
      </Button>
    )
  }

  return (
    <Button
      onClick={handleSignOut}
      variant="ghost"
      className={`text-slate-400 hover:text-slate-200 hover:bg-slate-800 ${className}`}
    >
      <LogOut className="h-4 w-4 mr-2" />
      Sair
    </Button>
  )
}