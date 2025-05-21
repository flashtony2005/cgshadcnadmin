import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import { tenantsSchema } from '../data/schema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { SelectDropdown } from '@/components/select-dropdown'
import { Tenants } from '../data/schema'
import * as tenantsDataAll from '../data/data';





// 直接使用从schema文件导入的完整schema
const formSchema = tenantsSchema

type TenantsForm = z.infer<typeof formSchema>

export function TenantsMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const form = useForm<TenantsForm>({
    resolver: zodResolver(formSchema),
    defaultValues: currentRow ?? {
    
      id: '',
      name: '',
      plan: '',
      status: '',
      custom_config: null,
      data_retention_period: null,
      deactivated_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      rental_plan_id: '',
     
    }
  })

  const onSubmit = (data: TenantsForm) => {
    // do something with the form data
    onOpenChange(false)
    form.reset()
    showSubmittedData(data)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} </SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the  by providing necessary info.'
              : 'Add a new  by providing necessary info.'}
            Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tenants-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5 px-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>租户名称</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='输入 租户名称' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='plan'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>租户套餐</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='输入 租户套餐' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='status'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>租户状态</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='输入 租户状态' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='custom_config'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>自定义配置</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='输入 自定义配置' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='data_retention_period'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>数据保留期</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='输入 数据保留期' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='deactivated_at'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>停用时间</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="date" 
                      placeholder='Select 停用时间'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='created_at'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>创建时间</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="date" 
                      placeholder='Select 创建时间'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='updated_at'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>更新时间</FormLabel>
                  <FormControl>
                    <Input 
                      {...field} 
                      type="date" 
                      placeholder='Select 更新时间'
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='rental_plan_id'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>关联计划id</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='输入 关联计划ID' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>
        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>关闭</Button>
          </SheetClose>
          <Button form='tenants-form' type='submit'>
           保存
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}