import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { TenantsDataTable } from './components/data-table';
import { TenantsDialogs } from './components/tenants-dialogs'
import { TenantsPrimaryButtons } from './components/tenants-primary-buttons'
import TenantsProvider from './context/tenants-context'

export default function Tenants() {
  return (
    <TenantsProvider>
      <Header fixed>
        <Search />
        <div className='ml-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Tenants</h2>
            <p className='text-muted-foreground'>
              Here's a list of your tenants  
            </p>
          </div>
          <TenantsPrimaryButtons />
        </div>
        <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <TenantsDataTable />
        </div>
      </Main>

      <TenantsDialogs />
    </TenantsProvider>
  )
}