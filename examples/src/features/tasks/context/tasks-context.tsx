import React, { useState, createContext, useContext, useCallback } from 'react'
import useDialogState from '@/hooks/use-dialog-state'
import { Task } from '../data/schema'
// 假设初始任务数据从此文件导入
// 如果文件名不同或没有此文件，您需要调整此导入或提供其他数据源
import { tasks as initialTasksData } from '../data/tasks' 

type TasksDialogType = 'create' | 'update' | 'delete' | 'import'

interface TasksContextType {
  // Dialog and current row state
  open: TasksDialogType | null
  setOpen: (str: TasksDialogType | null) => void
  currentRow: Task | null
  setCurrentRow: React.Dispatch<React.SetStateAction<Task | null>>
  
  // Tasks data and CRUD operations
  tasks: Task[]
  addTask: (taskData: Omit<Task, 'id' | 'status' | 'label' | 'priority'> & Partial<Pick<Task, 'status' | 'label' | 'priority'>>) => void // id 会自动生成，其他可选
  updateTask: (taskId: string, updates: Partial<Task>) => void
  deleteTask: (taskId: string) => void
}

const TasksContext = createContext<TasksContextType | null>(null)

interface Props {
  children: React.ReactNode
}

export default function TasksProvider({ children }: Props) {
  const [open, setOpen] = useDialogState<TasksDialogType>(null)
  const [currentRow, setCurrentRow] = useState<Task | null>(null)
  
  // 从导入的数据初始化任务列表状态
  const [tasks, setTasks] = useState<Task[]>(initialTasksData || [])

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'status' | 'label' | 'priority'> & Partial<Pick<Task, 'status' | 'label' | 'priority'>>) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: `TASK-${Date.now()}`, // 简单的 ID 生成
        status: taskData.status || 'todo', // 默认值
        label: taskData.label || 'feature', // 默认值
        priority: taskData.priority || 'medium', // 默认值
        ...taskData,
      },
    ])
  }, [])

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      )
    )
  }, [])

  const deleteTask = useCallback((taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId))
  }, [])

  return (
    <TasksContext.Provider 
      value={{ 
        open, setOpen, 
        currentRow, setCurrentRow,
        tasks, 
        addTask, updateTask, deleteTask 
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useTasks = () => {
  const tasksContext = useContext(TasksContext)

  if (!tasksContext) {
    throw new Error('useTasks has to be used within <TasksProvider>')
  }

  return tasksContext
}
