import * as React from 'react'
 
import { ColumnDef, Column, Row } from '@tanstack/react-table'

// Define an interface for the structure of items in entity_fields
// This helps ensure that the data from [{'name': 'id', 'required': True, 'comment': '租户唯一标识', 'primary_key': True, 'table_comment': '存储租户信息', 'table_name': 'tenants', 'type': 'string', 'zod_type': 'z.string().uuid()', 'validations': '', 'label': 'Id', 'placeholder': 'Enter Id...', 'component': 'Input', 'input_type': 'text', 'default_value': "''", 'options': [], 'show_in_table': False, 'show_in_form': False, 'enableSorting': False, 'enableHiding': True}, {'name': 'name', 'required': True, 'comment': '租户名称', 'primary_key': False, 'table_comment': '存储租户信息', 'table_name': 'tenants', 'type': 'string', 'zod_type': 'z.any()', 'validations': '', 'label': 'Name', 'placeholder': 'Enter Name...', 'component': 'Input', 'input_type': 'text', 'default_value': "''", 'options': [], 'show_in_table': True, 'show_in_form': True, 'enableSorting': True, 'enableHiding': True}, {'name': 'plan', 'required': True, 'comment': '租户套餐', 'primary_key': False, 'table_comment': '存储租户信息', 'table_name': 'tenants', 'type': 'string', 'zod_type': 'z.any()', 'validations': '', 'label': 'Plan', 'placeholder': 'Enter Plan...', 'component': 'Input', 'input_type': 'text', 'default_value': "''", 'options': [], 'show_in_table': True, 'show_in_form': True, 'enableSorting': True, 'enableHiding': True}, {'name': 'status', 'required': True, 'comment': '租户状态', 'primary_key': False, 'table_comment': '存储租户信息', 'table_name': 'tenants', 'type': 'string', 'zod_type': 'z.any()', 'validations': '', 'label': 'Status', 'placeholder': 'Select Status...', 'component': 'SelectDropdown', 'input_type': 'text', 'default_value': "''", 'options': [{'label': 'Active', 'value': 'active'}, {'label': 'Inactive', 'value': 'inactive'}], 'show_in_table': True, 'show_in_form': True, 'enableSorting': True, 'enableHiding': True}, {'name': 'custom_config', 'required': False, 'comment': '自定义配置', 'primary_key': False, 'table_comment': '存储租户信息', 'table_name': 'tenants', 'type': 'json', 'zod_type': 'z.record(z.unknown())', 'validations': '.nullable().optional()', 'label': 'Custom Config', 'placeholder': 'Enter Custom Config...', 'component': 'Input', 'input_type': 'text', 'default_value': 'null', 'options': [], 'show_in_table': True, 'show_in_form': True, 'enableSorting': True, 'enableHiding': True}, {'name': 'data_retention_period', 'required': False, 'comment': '数据保留期', 'primary_key': False, 'table_comment': '存储租户信息', 'table_name': 'tenants', 'type': 'unknown', 'zod_type': 'z.any()', 'validations': '.nullable().optional()', 'label': 'Data Retention Period', 'placeholder': 'Enter Data Retention Period...', 'component': 'Input', 'input_type': 'text', 'default_value': 'null', 'options': [], 'show_in_table': True, 'show_in_form': True, 'enableSorting': True, 'enableHiding': True}, {'name': 'deactivated_at', 'required': False, 'comment': '停用时间', 'primary_key': False, 'table_comment': '存储租户信息', 'table_name': 'tenants', 'type': 'date', 'zod_type': 'z.any()', 'validations': '.nullable().optional()', 'label': 'Deactivated At', 'placeholder': 'Enter Deactivated At...', 'component': 'Input', 'input_type': 'text', 'default_value': 'null', 'options': [], 'show_in_table': True, 'show_in_form': True, 'enableSorting': True, 'enableHiding': True}, {'name': 'created_at', 'required': False, 'comment': '创建时间', 'primary_key': False, 'table_comment': '存储租户信息', 'table_name': 'tenants', 'type': 'date', 'zod_type': 'z.any()', 'validations': '.nullable().optional()', 'label': 'Created At', 'placeholder': 'Enter Created At...', 'component': 'Input', 'input_type': 'text', 'default_value': 'null', 'options': [], 'show_in_table': True, 'show_in_form': False, 'enableSorting': True, 'enableHiding': True}, {'name': 'updated_at', 'required': False, 'comment': '更新时间', 'primary_key': False, 'table_comment': '存储租户信息', 'table_name': 'tenants', 'type': 'date', 'zod_type': 'z.any()', 'validations': '.nullable().optional()', 'label': 'Updated At', 'placeholder': 'Enter Updated At...', 'component': 'Input', 'input_type': 'text', 'default_value': 'null', 'options': [], 'show_in_table': True, 'show_in_form': False, 'enableSorting': True, 'enableHiding': True}, {'name': 'rental_plan_id', 'required': False, 'comment': '关联计划ID', 'primary_key': False, 'table_comment': '存储租户信息', 'table_name': 'tenants', 'type': 'string', 'zod_type': 'z.string().uuid()', 'validations': '.nullable().optional()', 'label': 'Rental Plan Id', 'placeholder': 'Enter Rental Plan Id...', 'component': 'Input', 'input_type': 'text', 'default_value': "''", 'options': [], 'show_in_table': True, 'show_in_form': True, 'enableSorting': True, 'enableHiding': True}] is used correctly.
interface EntityField {
  name: string; // The key for accessing data in a row object
  type: string; // Data type (e.g., 'string', 'number', 'date', 'enum')
  label?: string; // User-friendly label for the column header
  options?: Array<{ value: any; label: string; icon?: React.ComponentType<{ className?: string }> }>; // Options for 'enum' type or faceted filters
  sortable?: boolean; // Whether the column should be sortable (defaults to true)
  hidden?: boolean; // Whether the column should be hidden by default or unhideable (defaults to false, meaning visible and hideable)
  // columnOptions?: any; // For any other @tanstack/react-table column options, if needed
}
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

// Import特定于实体的数据、类型和上下文
import { Tenants } from '../data/schema'
// Import data options for labels, statuses, priorities
import * as tenantsDataAll from '../data/data';

const tenantsLabelData = (tenantsDataAll as any)?.labels ?? [];
const tenantsPriorityData = (tenantsDataAll as any)?.priorities ?? [];
const tenantsStatusData = (tenantsDataAll as any)?.statuses ?? [];
import { useTenants } from '../context/tenants-context'

/**
 * DataTable component for displaying Tenants
 * Features:
 * - Column sorting/filtering
 * - Row selection
 * - CRUD operations
 * - Label management
 */
export function TenantsDataTable() {
 
  // 从 context 获取实体数据和操作函数
  // 确保 useTenants 返回的对象包含这些属性，根据我们对 TenantsProvider 的最新修改，它应该包含
  const { tenants, setOpen, setCurrentRow, updateTenants, deleteTenants /* addTenants */ } = useTenants()
  // Assuming entity_fields comes from a stable source (e.g., context, props, or is static for the entity)
  // If entity_fields can change dynamically during the component's lifecycle based on other state/props not reflected here,
  // a more complex memoization for entityFieldsReference might be needed.
  
  // 为 DataTableRowActions 定义操作处理函数
  const handleEditTenants = React.useCallback((tenants: Tenants) => {
    setCurrentRow(tenants)
    setOpen('update')
  }, [setCurrentRow, setOpen])

  const handleDeleteTenants = React.useCallback((tenants: Tenants) => {
  //  if (deleteTenants) { // 检查函数是否存在
  //      deleteTenants(tenants.id) 
  //  } else {
        // Fallback or error handling if deleteTenants is not provided by context
        // console.error('deleteTenants function not available in context'); // Removed console.error
        setCurrentRow(tenants) // Still allow opening a dialog if that's part of the flow
        setOpen('delete')
   // }
  }, [deleteTenants, setCurrentRow, setOpen])

  const handleSetTenantsLabel = React.useCallback((tenants: Tenants, newLabelValue: string) => {
    if (updateTenants) { // 检查函数是否存在
        updateTenants(tenants.id, { ...tenants, label: newLabelValue })
    } 
    // else { // Removed console.error
        // console.error('updateTenants function not available in context');
    // }
  }, [updateTenants])

  // 定义数据项的类型
  interface LabelDataItem {
    value: string;
    label: string;
  }
  
  interface StatusDataItem {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }
  
  interface PriorityDataItem {
    value: string;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }

  const tenantsLabelOptionsForActions: ActionLabelOption[] = React.useMemo(() =>
    tenantsLabelData.map((l: LabelDataItem) => ({
      value: l.value,
      label: l.label,
      // icon: l.icon, // 移除，因为原始 tenantsLabelData 类型似乎没有 icon
    })),
  [tenantsLabelData]);


  // 根据entity_fields动态生成列定义
  const columns = React.useMemo<ColumnDef<Tenants>[]>(() => {
    // 基础列数组，始终包含选择列
    const baseColumns: ColumnDef<Tenants>[] = [
      // 选择列
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select All"
            className='translate-y-[2px]'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select Row"
            className='translate-y-[2px]'
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }
    ];
    
    // 动态列数组，根据entity_fields生成
    const dynamicColumns: ColumnDef<Tenants>[] = [];
    
    // 检查entity_fields中是否存在特定字段
          // 主键列
          dynamicColumns.push({
            accessorKey: 'id',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="租户唯一标识" />
            ),
            cell: ({ row }) => <div className="w-[80px]">{row.getValue('id')}</div>,
            enableSorting: true,
            enableHiding: false,
          });
          // 其他普通列
          dynamicColumns.push({
            accessorKey: 'name',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="租户名称" />
            ),
            cell: ({ row }) => <div>{String(row.getValue('name') || '-')}</div>,
            enableSorting: true,
          });
          // 其他普通列
          dynamicColumns.push({
            accessorKey: 'plan',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="租户套餐" />
            ),
            cell: ({ row }) => <div>{String(row.getValue('plan') || '-')}</div>,
            enableSorting: true,
          });
          // 其他普通列
          dynamicColumns.push({
            accessorKey: 'status',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="租户状态" />
            ),
            cell: ({ row }) => <div>{String(row.getValue('status') || '-')}</div>,
            enableSorting: true,
          });
          // 其他普通列
          dynamicColumns.push({
            accessorKey: 'custom_config',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="自定义配置" />
            ),
            cell: ({ row }) => <div>{String(row.getValue('custom_config') || '-')}</div>,
            enableSorting: true,
          });
          // 其他普通列
          dynamicColumns.push({
            accessorKey: 'data_retention_period',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="数据保留期" />
            ),
            cell: ({ row }) => <div>{String(row.getValue('data_retention_period') || '-')}</div>,
            enableSorting: true,
          });
          // 其他普通列
          dynamicColumns.push({
            accessorKey: 'deactivated_at',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="停用时间" />
            ),
            cell: ({ row }) => <div>{String(row.getValue('deactivated_at') || '-')}</div>,
            enableSorting: true,
          });
          // 其他普通列
          dynamicColumns.push({
            accessorKey: 'created_at',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="创建时间" />
            ),
            cell: ({ row }) => <div>{String(row.getValue('created_at') || '-')}</div>,
            enableSorting: true,
          });
          // 其他普通列
          dynamicColumns.push({
            accessorKey: 'updated_at',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="更新时间" />
            ),
            cell: ({ row }) => <div>{String(row.getValue('updated_at') || '-')}</div>,
            enableSorting: true,
          });
          // 其他普通列
          dynamicColumns.push({
            accessorKey: 'rental_plan_id',
            header: ({ column }) => (
              <DataTableColumnHeader column={column} title="关联计划ID" />
            ),
            cell: ({ row }) => <div>{String(row.getValue('rental_plan_id') || '-')}</div>,
            enableSorting: true,
          });
    
    // 操作列，始终添加
    const actionColumn: ColumnDef<Tenants> = {
      id: 'actions',
      cell: ({ row }) => (
        <DataTableRowActions<Tenants>
          row={row}
          onEdit={handleEditTenants}
          onDelete={handleDeleteTenants}
          labels={ tenantsLabelOptionsForActions }
          currentLabelValue={row.original.label}
          onSetLabel={handleSetTenantsLabel}
        />
      ),
    };
    
    // 合并所有列
    return [...baseColumns, ...dynamicColumns, actionColumn];
  }, [
    handleEditTenants,
    handleDeleteTenants,
    handleSetTenantsLabel,
    tenantsLabelOptionsForActions
  ]);


  // 为 DataTableToolbar 配置 Faceted Filters
  const facetedFilterConfig = React.useMemo<FacetedFilterConfigItem[]>(() => {
    const config: FacetedFilterConfigItem[] = []; 
   

    // 添加固定的 status 和 priority filters (如果它们没有在 entity_fields 中定义 options)
    // 检查是否已存在 status filter
    if (!config.some(c => c.columnId === 'status') && tenantsStatusData && tenantsStatusData.length > 0) {
      config.push({
        columnId: 'status',
        title: 'Status',
        options: tenantsStatusData.map((s: StatusDataItem) => ({ label: s.label, value: s.value, ...(s.icon && { icon: s.icon}) })),
      });
    }
  

    return config;
  }, [tenantsStatusData, tenantsPriorityData]);


  // 确保实体数据是一个数组，即使 context 初始化时可能为 undefined
  const tenantsData = Array.isArray(tenants) ? tenants : [];

  if (!useTenants()) { // Basic check if context is available, though useTenants hook itself throws if not in provider
      return <div>Error: Tenants context not found.</div>;
  }
  
  // 如果 tenants 仍在加载（例如，如果 context 异步获取数据），可以显示加载状态
  // 对于从静态文件导入并用 useState 初始化的简单情况，tenants 会立即是数组（空或有数据）
  // if (tenants === undefined) { // A more robust loading check might be needed if data fetching is async
  //   return <div>Loading tenants...</div>;
  // }


  return (
    <DataTable<Tenants, any>
      columns={columns}
      data={ tenantsData }
      globalFilterColumnId="id"
      globalFilterPlaceholder="Filter..."
    />
  )
}