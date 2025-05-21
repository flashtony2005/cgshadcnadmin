import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { DataTableViewOptions } from './data-table-view-options'
// Removed import of priorities, statuses
import { DataTableFacetedFilter } from './data-table-faceted-filter'

// 新增：Faceted Filter 配置项类型定义
export interface FacetedFilterConfigItem {
  columnId: string
  title: string
  options: {
    label: string
    value: string
    icon?: React.ComponentType<{ className?: string }>
  }[]
}

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  globalFilterColumnId?: string
  globalFilterPlaceholder?: string
  facetedFilterConfig?: FacetedFilterConfigItem[]
}

export function DataTableToolbar<TData>({
  table,
  globalFilterColumnId,
  globalFilterPlaceholder = 'Filter items...', // Default placeholder
  facetedFilterConfig,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const globalFilterColumn = globalFilterColumnId
    ? table.getColumn(globalFilterColumnId)
    : undefined

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        {globalFilterColumn && (
          <Input
            placeholder={globalFilterPlaceholder}
            value={
              (globalFilterColumn.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              globalFilterColumn.setFilterValue(event.target.value)
            }
            className='h-8 w-[150px] lg:w-[250px]'
          />
        )}
        <div className='flex gap-x-2'>
          {facetedFilterConfig &&
            facetedFilterConfig.map((filter) => {
              const column = table.getColumn(filter.columnId)
              if (!column) {
                // console.warn(`DataTableToolbar: Column with id "${filter.columnId}" not found.`); // Removed console.warn
                return null
              }
              return (
                <DataTableFacetedFilter
                  key={filter.columnId}
                  column={column}
                  title={filter.title}
                  options={filter.options}
                />
              )
            })}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
