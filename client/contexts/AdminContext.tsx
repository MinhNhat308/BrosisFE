import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AdminContextType {
  isAdminMode: boolean;
  setIsAdminMode: (value: boolean) => void;
  showPasswordModal: boolean;
  setShowPasswordModal: (value: boolean) => void;
  passwordInput: string;
  setPasswordInput: (value: string) => void;
  passwordError: string;
  setPasswordError: (value: string) => void;
  handlePasswordSubmit: () => void;
  handlePasswordCancel: () => void;
  handleAdminToggle: () => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

const ADMIN_PASSWORD = "Minhnhat123@";

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordSubmit = () => {
    if (passwordInput === ADMIN_PASSWORD) {
      setIsAdminMode(true);
      setShowPasswordModal(false);
      setPasswordInput("");
      setPasswordError("");
    } else {
      setPasswordError("Mật khẩu không đúng!");
      setPasswordInput("");
    }
  };

  const handlePasswordCancel = () => {
    setShowPasswordModal(false);
    setPasswordInput("");
    setPasswordError("");
  };

  const handleAdminToggle = () => {
    if (isAdminMode) {
      setIsAdminMode(false);
    } else {
      setShowPasswordModal(true);
    }
  };

  const value = {
    isAdminMode,
    setIsAdminMode,
    showPasswordModal,
    setShowPasswordModal,
    passwordInput,
    setPasswordInput,
    passwordError,
    setPasswordError,
    handlePasswordSubmit,
    handlePasswordCancel,
    handleAdminToggle,
  };

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
