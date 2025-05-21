import React, { useState, createContext, useContext, useCallback } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Tenants } from '../data/schema'
// Initial data import - adjust if your data file has different name
import { tenants as initialTenantsData } from '../data/tenants'

type TenantsDialogType = 'create' | 'update' | 'delete' | 'import'

interface TenantsContextType {
  // Dialog and current row state
  open: TenantsDialogType | null
  setOpen: (str: TenantsDialogType | null) => void
  currentRow: Tenants | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Tenants | null>>
  
  // Tenants data and CRUD operations
  tenants: Tenants[]
  addTenants: (tenantsData: Omit<Tenants, 'id' | 'status' | 'label' | 'priority'> & Partial<Pick<Tenants, 'status' | 'label' | 'priority'>>) => void // id 会自动生成，其他可选
  updateTenants: (tenantsId: string, updates: Partial<Tenants>) => void
  deleteTenants: (tenantsId: string) => void
}

const TenantsContext = createContext<TenantsContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TenantsProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TenantsDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Tenants | null>(null)
  
  // 从导入的数据初始化任务列表状态
  const [tenants, setTenants] = useState<Tenants[]>(initialTenantsData || [])

  const addTenants = useCallback((tenantsData: Omit<Tenants, 'id' | 'status' | 'label' | 'priority'> & Partial<Pick<Tenants, 'status' | 'label' | 'priority'>>) => {
    setTenants((prevTenants) => [
      ...prevTenants,
      {
        id: `TENANTS-{Date.now()}`, // 简单的 ID 生成
        status: tenantsData.status || 'todo', // 默认值
        label: tenantsData.label || 'feature', // 默认值
        priority: tenantsData.priority || 'medium', // 默认值
        ...tenantsData,
      },
    ])
  }, [])

  const updateTenants = useCallback((tenantsId: string, updates: Partial<Tenants>) => {
    setTenants((prevTenants) =>
      prevTenants.map((tenants) =>
        tenants.id === tenantsId ? { ...tenants, ...updates } : tenants
      )
    )
  }, [])

  const deleteTenants = useCallback((tenantsId: string) => {
    setTenants((prevTenants) => prevTenants.filter((tenants) => tenants.id !== tenantsId))
  }, [])

  return (
    <TenantsContext.Provider 
      value={{ 
        open, setOpen, 
        currentRow, setCurrentRow,
        tenants, 
        addTenants, updateTenants, deleteTenants 
      }}
    >
      {children}
    </TenantsContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTenants = () => {
  const tenantsContext = useContext(TenantsContext)

  if (!tenantsContext) {
    throw new Error('useTenants has to be used within <TenantsProvider>')
  }

  return tenantsContext
}