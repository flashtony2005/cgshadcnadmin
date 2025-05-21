import { showSubmittedData } from '@/utils/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useTenants } from '../context/tenants-context'
import { TenantsImportDialog } from './tenants-import-dialog'
import { TenantsMutateDrawer } from './tenants-mutate-drawer'

/**
 * Collection of all dialogs for Tenants feature
 * Includes:
 * - Create/Update drawer
 * - Import dialog (if enabled)
 * - Delete confirmation dialog
 */
export function TenantsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useTenants()
  return (
    <>
      <TenantsMutateDrawer
        key='tenants-create'
        open={open === 'create'}
        onOpenChange={() => setOpen('create')}
      />

      <TenantsImportDialog
        key='tenants-import'
        open={open === 'import'}
        onOpenChange={() => setOpen('import')}
      />

      {currentRow && (
        <>
          <TenantsMutateDrawer
            key={`tenants-update-${currentRow.id}`}
            open={open === 'update'}
            onOpenChange={() => {
              setOpen('update')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <ConfirmDialog
            key='tenants-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                `The following  has been deleted:`
              )
            }}
            className='max-w-md'
            title={`删除数据 this : ${currentRow.id} ?`}
            desc={
              <>
                删除当前数据 ID:  with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
           confirmText='删除'
           cancelBtnText = '取消'
          />
        </>
      )}
    </>
  )
}