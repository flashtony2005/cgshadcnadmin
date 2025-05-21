import * as React from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'

// Import通用 DataTable 组件及其子组件和类型
import { DataTable } from '../../../components/data-table/data-table'
import { DataTableColumnHeader } from '../../../components/data-table/data-table-column-header'
import { 
  DataTableRowActions, 
  ActionLabelOption,
  // CustomActionItem // 如果需要自定义操作，取消注释
} from '../../../components/data-table/data-table-row-actions'
import { FacetedFilterConfigItem } from '../../../components/data-table/data-table-toolbar'

// Import特定于任务的数据、类型和上下文
import { Task } from '../data/schema'
import { labels as taskLabelData, priorities as taskPriorityData, statuses as taskStatusData } from '../data/data'
import { useTasks } from '../context/tasks-context'

// 主 Tasks DataTable 组件
export function TasksDataTable() {
  // 从 context 获取任务数据和操作函数
  // 确保 useTasks 返回的对象包含这些属性，根据我们对 TasksProvider 的最新修改，它应该包含
  const { tasks, setOpen, setCurrentRow, updateTask, deleteTask /* addTask */ } = useTasks() 

  // 为 DataTableRowActions 定义操作处理函数
  const handleEditTask = React.useCallback((task: Task) => {
    setCurrentRow(task)
    setOpen('update')
  }, [setCurrentRow, setOpen])

  const handleDeleteTask = React.useCallback((task: Task) => {
    if (deleteTask) { // 检查函数是否存在
        deleteTask(task.id) 
    } else {
        // Fallback or error handling if deleteTask is not provided by context
        // console.error('deleteTask function not available in context'); // Removed console.error
        setCurrentRow(task) // Still allow opening a dialog if that's part of the flow
        setOpen('delete')
    }
  }, [deleteTask, setCurrentRow, setOpen])

  const handleSetTaskLabel = React.useCallback((task: Task, newLabelValue: string) => {
    if (updateTask) { // 检查函数是否存在
        updateTask(task.id, { ...task, label: newLabelValue })
    } 
    // else { // Removed console.error
        // console.error('updateTask function not available in context');
    // }
  }, [updateTask])
  
  const taskLabelOptionsForActions: ActionLabelOption[] = React.useMemo(() => 
    taskLabelData.map(l => ({ 
      value: l.value, 
      label: l.label,
      // icon: l.icon, // 移除，因为原始 taskLabelData 类型似乎没有 icon
    })), 
  [taskLabelData]);


  // 定义列
  const columns = React.useMemo<ColumnDef<Task>[]>(() => [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Task' />
      ),
      cell: ({ row }) => <div className='w-[80px]'>{row.getValue('id')}</div>,
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'title',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Title' />
      ),
      cell: ({ row }) => {
        const taskLabel = taskLabelData.find((label) => label.value === row.original.label)
        return (
          <div className='flex space-x-2'>
            {taskLabel && <Badge variant='outline'>{taskLabel.label}</Badge>}
            <span className='max-w-32 truncate font-medium sm:max-w-72 md:max-w-[31rem]'>
              {row.getValue('title')}
            </span>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Status' />
      ),
      cell: ({ row }) => {
        const status = taskStatusData.find(
          (s) => s.value === row.getValue('status')
        )
        if (!status) return null
        return (
          <div className='flex w-[100px] items-center'>
            {status.icon && ( // Safely access icon if it exists on status object
              <status.icon className='text-muted-foreground mr-2 h-4 w-4' />
            )}
            <span>{status.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      accessorKey: 'priority',
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title='Priority' />
      ),
      cell: ({ row }) => {
        const priority = taskPriorityData.find(
          (p) => p.value === row.getValue('priority')
        )
        if (!priority) return null
        return (
          <div className='flex items-center'>
            {priority.icon && ( // Safely access icon if it exists on priority object
              <priority.icon className='text-muted-foreground mr-2 h-4 w-4' />
            )}
            <span>{priority.label}</span>
          </div>
        )
      },
      filterFn: (row, id, value) => value.includes(row.getValue(id)),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions<Task>
          row={row}
          onEdit={handleEditTask}
          onDelete={handleDeleteTask}
          labels={taskLabelOptionsForActions}
          currentLabelValue={row.original.label}
          onSetLabel={handleSetTaskLabel}
          // customActions={...} // 如果需要，可以添加自定义操作
        />
      ),
    },
  ], [handleEditTask, handleDeleteTask, handleSetTaskLabel, taskLabelOptionsForActions, taskLabelData, taskStatusData, taskPriorityData]); // Added dependencies for cell renderers

  // 为 DataTableToolbar 配置 Faceted Filters
  const facetedFilterConfig = React.useMemo<FacetedFilterConfigItem[]>(() => [
    {
      columnId: 'status',
      title: 'Status',
      options: taskStatusData.map(s => ({ label: s.label, value: s.value, ...(s.icon && { icon: s.icon}) })),
    },
    {
      columnId: 'priority',
      title: 'Priority',
      options: taskPriorityData.map(p => ({ label: p.label, value: p.value, ...(p.icon && { icon: p.icon}) })),
    },
  ], [taskStatusData, taskPriorityData]);

  // 确保 tasks 是一个数组，即使 context 初始化时 tasks 可能为 undefined
  const tasksData = Array.isArray(tasks) ? tasks : [];

  if (!useTasks()) { // Basic check if context is available, though useTasks hook itself throws if not in provider
      return <div>Error: Tasks context not found.</div>;
  }
  
  // 如果 tasks 仍在加载（例如，如果 context 异步获取数据），可以显示加载状态
  // 对于从静态文件导入并用 useState 初始化的简单情况，tasks 会立即是数组（空或有数据）
  // if (tasks === undefined) { // A more robust loading check might be needed if data fetching is async
  //   return <div>Loading tasks...</div>;
  // }

  return (
    <DataTable<Task, any>
      columns={columns}
      data={tasksData} // 使用确保是数组的 tasksData
      globalFilterColumnId="title"
      globalFilterPlaceholder="Filter tasks by title..."
      facetedFilterConfig={facetedFilterConfig}
    />
  )
}
