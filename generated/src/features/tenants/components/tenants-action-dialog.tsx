'use client'

import * as React from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
// import { showSubmittedData } from '@/utils/show-submitted-data' // Placeholder, actual submission logic will use context
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { SelectDropdown } from '@/components/select-dropdown' // Assuming SelectDropdown is a generic component

// Import specific entity data, types, and context
import { Tenants } from '../data/schema'
// Assuming entity_fields will provide necessary info for options, or a specific data import like below
// import * as tenantsDataAll from '../data/data'; 
import { useTenants } from '../context/tenants-context'

// Dynamically build the Zod schema based on entity_fields
// This is a simplified representation. Real-world usage might require more complex logic or a helper function.
const getFormSchema = (entityFields: any[], isEdit: boolean) => {
  let schemaObject: { [key: string]: z.ZodTypeAny } = {};
  entityFields.forEach(field => {
    let fieldSchema: z.ZodTypeAny;
    switch (field.type) {
      case 'email':
        fieldSchema = z.string().email({ message: `${field.comment || field.name} is invalid.` });
        break;

      case 'number':
        fieldSchema = z.coerce.number();
        break;
      case 'boolean':
        fieldSchema = z.boolean();
        break;
      case 'date':
        fieldSchema = z.coerce.date(); // Use coerce.date for string inputs from date picker
        break;
      // Add more types as needed, e.g., 'enum', 'url'
      default: // Default to string
        fieldSchema = z.string();
    }
    if (field.required) {
      if (field.type === 'string' || field.type === 'email') {
        fieldSchema = (fieldSchema as z.ZodString).min(1, { message: `${field.comment || field.name} is required.` });
      }
    }
    schemaObject[field.name] = fieldSchema;
  });

  // Add isEdit field for conditional validation logic
  schemaObject['isEdit'] = z.boolean();


  let baseSchema = z.object(schemaObject);

  return baseSchema;
};

// Define Props interface for the dialog component
interface TenantsActionDialogProps {
  currentRow?: Tenants;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // entityFields prop removed
}

export function TenantsActionDialog({
  currentRow,
  open,
  onOpenChange
  // entityFields prop removed
}: TenantsActionDialogProps) {
  const isEdit = !!currentRow;
  const { addTenants, updateTenants } = useTenants();

  // entity_fields from Jinja context, made available as a JS const
  const entityFields = [{"comment": "\u79df\u6237\u552f\u4e00\u6807\u8bc6", "component": "Input", "default_value": "\u0027\u0027", "enableHiding": true, "enableSorting": false, "input_type": "text", "label": "Id", "name": "id", "options": [], "placeholder": "Enter Id...", "primary_key": true, "required": true, "show_in_form": false, "show_in_table": false, "table_comment": "\u5b58\u50a8\u79df\u6237\u4fe1\u606f", "table_name": "tenants", "type": "string", "validations": "", "zod_type": "z.string().uuid()"}, {"comment": "\u79df\u6237\u540d\u79f0", "component": "Input", "default_value": "\u0027\u0027", "enableHiding": true, "enableSorting": true, "input_type": "text", "label": "Name", "name": "name", "options": [], "placeholder": "Enter Name...", "primary_key": false, "required": true, "show_in_form": true, "show_in_table": true, "table_comment": "\u5b58\u50a8\u79df\u6237\u4fe1\u606f", "table_name": "tenants", "type": "string", "validations": "", "zod_type": "z.any()"}, {"comment": "\u79df\u6237\u5957\u9910", "component": "Input", "default_value": "\u0027\u0027", "enableHiding": true, "enableSorting": true, "input_type": "text", "label": "Plan", "name": "plan", "options": [], "placeholder": "Enter Plan...", "primary_key": false, "required": true, "show_in_form": true, "show_in_table": true, "table_comment": "\u5b58\u50a8\u79df\u6237\u4fe1\u606f", "table_name": "tenants", "type": "string", "validations": "", "zod_type": "z.any()"}, {"comment": "\u79df\u6237\u72b6\u6001", "component": "SelectDropdown", "default_value": "\u0027\u0027", "enableHiding": true, "enableSorting": true, "input_type": "text", "label": "Status", "name": "status", "options": [{"label": "Active", "value": "active"}, {"label": "Inactive", "value": "inactive"}], "placeholder": "Select Status...", "primary_key": false, "required": true, "show_in_form": true, "show_in_table": true, "table_comment": "\u5b58\u50a8\u79df\u6237\u4fe1\u606f", "table_name": "tenants", "type": "string", "validations": "", "zod_type": "z.any()"}, {"comment": "\u81ea\u5b9a\u4e49\u914d\u7f6e", "component": "Input", "default_value": "null", "enableHiding": true, "enableSorting": true, "input_type": "text", "label": "Custom Config", "name": "custom_config", "options": [], "placeholder": "Enter Custom Config...", "primary_key": false, "required": false, "show_in_form": true, "show_in_table": true, "table_comment": "\u5b58\u50a8\u79df\u6237\u4fe1\u606f", "table_name": "tenants", "type": "json", "validations": ".nullable().optional()", "zod_type": "z.record(z.unknown())"}, {"comment": "\u6570\u636e\u4fdd\u7559\u671f", "component": "Input", "default_value": "null", "enableHiding": true, "enableSorting": true, "input_type": "text", "label": "Data Retention Period", "name": "data_retention_period", "options": [], "placeholder": "Enter Data Retention Period...", "primary_key": false, "required": false, "show_in_form": true, "show_in_table": true, "table_comment": "\u5b58\u50a8\u79df\u6237\u4fe1\u606f", "table_name": "tenants", "type": "unknown", "validations": ".nullable().optional()", "zod_type": "z.any()"}, {"comment": "\u505c\u7528\u65f6\u95f4", "component": "Input", "default_value": "null", "enableHiding": true, "enableSorting": true, "input_type": "text", "label": "Deactivated At", "name": "deactivated_at", "options": [], "placeholder": "Enter Deactivated At...", "primary_key": false, "required": false, "show_in_form": true, "show_in_table": true, "table_comment": "\u5b58\u50a8\u79df\u6237\u4fe1\u606f", "table_name": "tenants", "type": "date", "validations": ".nullable().optional()", "zod_type": "z.any()"}, {"comment": "\u521b\u5efa\u65f6\u95f4", "component": "Input", "default_value": "null", "enableHiding": true, "enableSorting": true, "input_type": "text", "label": "Created At", "name": "created_at", "options": [], "placeholder": "Enter Created At...", "primary_key": false, "required": false, "show_in_form": false, "show_in_table": true, "table_comment": "\u5b58\u50a8\u79df\u6237\u4fe1\u606f", "table_name": "tenants", "type": "date", "validations": ".nullable().optional()", "zod_type": "z.any()"}, {"comment": "\u66f4\u65b0\u65f6\u95f4", "component": "Input", "default_value": "null", "enableHiding": true, "enableSorting": true, "input_type": "text", "label": "Updated At", "name": "updated_at", "options": [], "placeholder": "Enter Updated At...", "primary_key": false, "required": false, "show_in_form": false, "show_in_table": true, "table_comment": "\u5b58\u50a8\u79df\u6237\u4fe1\u606f", "table_name": "tenants", "type": "date", "validations": ".nullable().optional()", "zod_type": "z.any()"}, {"comment": "\u5173\u8054\u8ba1\u5212ID", "component": "Input", "default_value": "\u0027\u0027", "enableHiding": true, "enableSorting": true, "input_type": "text", "label": "Rental Plan Id", "name": "rental_plan_id", "options": [], "placeholder": "Enter Rental Plan Id...", "primary_key": false, "required": false, "show_in_form": true, "show_in_table": true, "table_comment": "\u5b58\u50a8\u79df\u6237\u4fe1\u606f", "table_name": "tenants", "type": "string", "validations": ".nullable().optional()", "zod_type": "z.string().uuid()"}];

  // Memoize the form schema to prevent re-computation on every render
  // The entityFields in the dependency array now refers to the local const
  const formSchema = React.useMemo(() => getFormSchema(entityFields, isEdit), [entityFields, isEdit]);
  type TenantsFormValues = z.infer<typeof formSchema>;

  const form = useForm<TenantsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: React.useMemo(() => {
      const defaults: any = { isEdit };
      entityFields.forEach(field => {
        defaults[field.name] = currentRow?.[field.name as keyof Tenants] ?? (field.type === 'boolean' ? false : '');
      });
      return defaults;
    }, [currentRow, entityFields, isEdit]),
  });

  React.useEffect(() => {
    // Reset form when currentRow or isEdit status changes (e.g. dialog opens for new/edit)
    const defaults: any = { isEdit };
    entityFields.forEach(field => {
      defaults[field.name] = currentRow?.[field.name as keyof Tenants] ?? (field.type === 'boolean' ? false : '');
    });
    form.reset(defaults);
  }, [currentRow, entityFields, form, isEdit]);

  const onSubmit = async (values: TenantsFormValues) => {
    // Remove isEdit from the data to be submitted
    const { isEdit: editFlag, ...submissionData } = values;
    
    try {
      if (isEdit && currentRow?.id) {
        await updateTenants(currentRow.id, submissionData as Partial<Tenants>);
      } else {
        await addTenants(submissionData as Omit<Tenants, 'id'>);
      }
      form.reset();
      onOpenChange(false);
      // Optionally, add a success toast/notification here
    } catch (error) {
      // Optionally, add an error toast/notification here
      console.error("Failed to save :", error);
    }
  };


  return (
    <Dialog
      open={open}
      onOpenChange={(state) => {
        if (!state) { // Only reset if dialog is closing
          const defaults: any = { isEdit };
          entityFields.forEach(field => {
            defaults[field.name] = currentRow?.[field.name as keyof Tenants] ?? (field.type === 'boolean' ? false : '');
          });
          form.reset(defaults);
        }
        onOpenChange(state);
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-left'>
          <DialogTitle>{isEdit ? 'Edit ' : 'Add New '}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Update the  here. ' : 'Create new  here. '}
            Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className='-mr-4 h-[26.25rem] w-full overflow-y-auto py-1 pr-4'> {/* Consider making height dynamic or configurable */}
          <Form {...form}>
            <form
              id='tenants-form'
              onSubmit={form.handleSubmit(onSubmit)}
              className='space-y-4 p-0.5'
            >
              <FormField
                control={form.control}
                key={"id"}
                name={"id"}
                render={({ field }) => ( // 'field' is from react-hook-form
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      租户唯一标识
                    </FormLabel>
                    <FormControl>
                         <Input
                          placeholder="Enter Id..."
                          className='col-span-4'
                          autoComplete='off'
                          type={ "text" }
                          {...field}
                          value={field.value || ''}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={"name"}
                name={"name"}
                render={({ field }) => ( // 'field' is from react-hook-form
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      租户名称
                    </FormLabel>
                    <FormControl>
                         <Input
                          placeholder="Enter Name..."
                          className='col-span-4'
                          autoComplete='off'
                          type={ "text" }
                          {...field}
                          value={field.value || ''}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={"plan"}
                name={"plan"}
                render={({ field }) => ( // 'field' is from react-hook-form
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      租户套餐
                    </FormLabel>
                    <FormControl>
                         <Input
                          placeholder="Enter Plan..."
                          className='col-span-4'
                          autoComplete='off'
                          type={ "text" }
                          {...field}
                          value={field.value || ''}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={"status"}
                name={"status"}
                render={({ field }) => ( // 'field' is from react-hook-form
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      租户状态
                    </FormLabel>
                    <FormControl>
                         <Input
                          placeholder="Select Status..."
                          className='col-span-4'
                          autoComplete='off'
                          type={ "text" }
                          {...field}
                          value={field.value || ''}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={"custom_config"}
                name={"custom_config"}
                render={({ field }) => ( // 'field' is from react-hook-form
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      自定义配置
                    </FormLabel>
                    <FormControl>
                         <Input
                          placeholder="Enter Custom Config..."
                          className='col-span-4'
                          autoComplete='off'
                          type={ "text" }
                          {...field}
                          value={field.value || ''}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={"data_retention_period"}
                name={"data_retention_period"}
                render={({ field }) => ( // 'field' is from react-hook-form
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      数据保留期
                    </FormLabel>
                    <FormControl>
                         <Input
                          placeholder="Enter Data Retention Period..."
                          className='col-span-4'
                          autoComplete='off'
                          type={ "text" }
                          {...field}
                          value={field.value || ''}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={"deactivated_at"}
                name={"deactivated_at"}
                render={({ field }) => ( // 'field' is from react-hook-form
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      停用时间
                    </FormLabel>
                    <FormControl>
                        <Input
                          placeholder="Enter Deactivated At..."
                          className='col-span-4'
                          autoComplete='off'
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={"created_at"}
                name={"created_at"}
                render={({ field }) => ( // 'field' is from react-hook-form
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      创建时间
                    </FormLabel>
                    <FormControl>
                        <Input
                          placeholder="Enter Created At..."
                          className='col-span-4'
                          autoComplete='off'
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={"updated_at"}
                name={"updated_at"}
                render={({ field }) => ( // 'field' is from react-hook-form
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      更新时间
                    </FormLabel>
                    <FormControl>
                        <Input
                          placeholder="Enter Updated At..."
                          className='col-span-4'
                          autoComplete='off'
                          type="date"
                          {...field}
                          value={field.value ? new Date(field.value).toISOString().split('T')[0] : ''}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                key={"rental_plan_id"}
                name={"rental_plan_id"}
                render={({ field }) => ( // 'field' is from react-hook-form
                  <FormItem className='grid grid-cols-6 items-center space-y-0 gap-x-4 gap-y-1'>
                    <FormLabel className='col-span-2 text-right'>
                      关联计划ID
                    </FormLabel>
                    <FormControl>
                         <Input
                          placeholder="Enter Rental Plan Id..."
                          className='col-span-4'
                          autoComplete='off'
                          type={ "text" }
                          {...field}
                          value={field.value || ''}
                        />
                    </FormControl>
                    <FormMessage className='col-span-4 col-start-3' />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
        <DialogFooter>
          <Button type='submit' form='tenants-form'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}