import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { IconTrash } from '@tabler/icons-react'
import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

// 新增：Label 类型定义
export interface ActionLabelOption {
  value: string
  label: string
  icon?: React.ComponentType<{ className?: string }> // 可选
}

// 新增：自定义操作项类型定义
export interface CustomActionItem<TData> {
  label: string
  action: (rowData: TData) => void
  icon?: React.ComponentType<{ className?: string }> // 可选
  shortcut?: React.ReactNode
  disabled?: boolean
  isSeparator?: boolean // 用于插入分隔符
}

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onEdit?: (rowData: TData) => void
  onDelete?: (rowData: TData) => void
  labels?: ActionLabelOption[]
  currentLabelValue?: string
  onSetLabel?: (rowData: TData, labelValue: string) => void
  customActions?: CustomActionItem<TData>[]
}

export function DataTableRowActions<TData>({
  row,
  onEdit,
  onDelete,
  labels,
  currentLabelValue,
  onSetLabel,
  customActions,
}: DataTableRowActionsProps<TData>) {
  const rowData = row.original as TData

  // Helper to determine if any preceding items exist to conditionally render separators
  const hasPrecedingStandardActions = onEdit
  const hasPrecedingCustomActions = customActions && customActions.some(action => !action.isSeparator)
  const hasPrecedingLabelAction = labels && labels.length > 0 && onSetLabel

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
        {onEdit && (
          <DropdownMenuItem onClick={() => onEdit(rowData)}>
            Edit
          </DropdownMenuItem>
        )}

        {customActions &&
          customActions.map((item, index) =>
            item.isSeparator ? (
              <DropdownMenuSeparator key={`sep-${index}`} />
            ) : (
              <DropdownMenuItem
                key={item.label + index}
                onClick={() => item.action(rowData)}
                disabled={item.disabled}
              >
                {item.icon && <item.icon className='mr-2 h-4 w-4' />}
                {item.label}
                {item.shortcut && (
                  <DropdownMenuShortcut>
                    {item.shortcut}
                  </DropdownMenuShortcut>
                )}
              </DropdownMenuItem>
            )
          )}

        {labels && labels.length > 0 && onSetLabel && (
          <>
            {(hasPrecedingStandardActions || hasPrecedingCustomActions) && <DropdownMenuSeparator />}
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Labels</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup
                  value={currentLabelValue}
                  onValueChange={(value) => onSetLabel(rowData, value)}
                >
                  {labels.map((label) => (
                    <DropdownMenuRadioItem
                      key={label.value}
                      value={label.value}
                    >
                      {label.icon && <label.icon className='mr-2 h-4 w-4' />}
                      {label.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        )}

        {onDelete && (
          <>
            {(hasPrecedingStandardActions || hasPrecedingCustomActions || hasPrecedingLabelAction) && <DropdownMenuSeparator />}
            <DropdownMenuItem onClick={() => onDelete(rowData)}>
              Delete
              <DropdownMenuShortcut>
                <IconTrash size={16} />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
