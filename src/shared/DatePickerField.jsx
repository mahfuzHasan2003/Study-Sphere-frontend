import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Controller } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

const DatePickerField = ({ name, label, control, errors, minDate }) => (
   <div className='flex flex-col space-y-2'>
      <Label htmlFor={name}>
         {label} <span className='text-red-500'>*</span>
      </Label>
      <Controller
         name={name}
         control={control}
         rules={{
            required: `${label} is required`,
            validate: (value) => {
               if (minDate && value < minDate) {
                  return `${label} must be after ${format(minDate, "PPP")}`;
               }
               return true;
            },
         }}
         render={({ field }) => (
            <Popover>
               <PopoverTrigger asChild>
                  <Button
                     variant='outline'
                     className={`w-full justify-start text-left font-normal ${
                        !field.value && "text-muted-foreground"
                     }`}>
                     <CalendarIcon className='mr-2 h-4 w-4' />
                     {field.value ? (
                        format(field.value, "PPP")
                     ) : (
                        <span>Pick a date</span>
                     )}
                  </Button>
               </PopoverTrigger>
               <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                     mode='single'
                     selected={field.value}
                     onSelect={field.onChange}
                     disabled={(date) => date < (minDate || new Date())}
                     initialFocus
                  />
               </PopoverContent>
            </Popover>
         )}
      />
      {errors[name] && (
         <p className='text-sm text-red-500'>{errors[name].message}</p>
      )}
   </div>
);

export default DatePickerField;
