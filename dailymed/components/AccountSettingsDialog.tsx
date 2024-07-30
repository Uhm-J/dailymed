import React from 'react'
import { Button } from "@/components/ui/button"
import {
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useCustomToast } from './ToasterProvider'

const AccountSettingsDialog = ({ onLogout }) => {
  const showToast = useCustomToast()

  const handleLogout = () => {
    onLogout()
    showToast('Logged out successfully', 'success')
  }

  return (
    <div>
        <DialogHeader>
          <DialogTitle>Account Settings</DialogTitle>
          <DialogDescription>
            Manage your account settings here.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button onClick={handleLogout} variant="destructive">
            Log out
          </Button>
        </div>
        </div>


  )
}

export default AccountSettingsDialog