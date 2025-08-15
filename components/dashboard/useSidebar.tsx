'use client'
import { createContext, useContext, useEffect, useState } from 'react'

type Ctx = {
  collapsed: boolean
  setCollapsed(v: boolean): void
  mobileOpen: boolean
  setMobileOpen(v: boolean): void
}
const SidebarContext = createContext<Ctx | null>(null)

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  // remember collapse state between reloads
  useEffect(() => {
    const saved = localStorage.getItem('dash:collapsed')
    if (saved) setCollapsed(saved === '1')
  }, [])
  useEffect(() => {
    localStorage.setItem('dash:collapsed', collapsed ? '1' : '0')
  }, [collapsed])

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen }}>
      {children}
    </SidebarContext.Provider>
  )
}

export function useSidebar() {
  const ctx = useContext(SidebarContext)
  if (!ctx) throw new Error('useSidebar must be used inside <SidebarProvider>')
  return ctx
}
