"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to dashboard or login page
    router.push("/dashboard")
  }, [])

  // Return a minimal loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Carregando...</h2>
        <p className="text-muted-foreground">Redirecionando para o dashboard</p>
      </div>
    </div>
  )
}