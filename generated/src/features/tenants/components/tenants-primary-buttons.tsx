import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { useTenants } from '../context/tenants-context'

/**
 * Primary action buttons for Tenants feature
 * Includes Create button and optional Import button
 */
export function TenantsPrimaryButtons() {
  const { setOpen } = useTenants()
  
  return (
    <div className='flex gap-2'>
      <Button
        variant='outline'
        className='space-x-1'
        onClick={() => setOpen('import')}
      >
        <span>导入</span> <IconDownload size={18} />
      </Button>
      
      <Button className='space-x-1' onClick={() => setOpen('create')}>
        <span>新增</span> <IconPlus size={18} />
      </Button>
    </div>
  )
}