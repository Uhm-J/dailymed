import React from 'react'
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/components/ui/use-toast"

const ToasterProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Toaster />
    </>
  )
}

const useCustomToast = () => {
  const { toast } = useToast()

  const showToast = (message: string, type = "default") => {
    toast({
      title: type.charAt(0).toUpperCase() + type.slice(1),
      description: message,
      variant: type === "error" ? "destructive" : "success",
      duration: type === "error" ? 7000 : 5000, // Error messages stay longer
    })
  }

  return showToast
}

export { ToasterProvider, useCustomToast };