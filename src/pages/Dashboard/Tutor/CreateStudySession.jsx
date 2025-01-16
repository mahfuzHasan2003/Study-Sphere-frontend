import { useForm, Controller } from "react-hook-form";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
} from "@/components/ui/card";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import useAuth from "@/hooks/useAuth";

const CreateStudySession = () => {
   const { user } = useAuth();
   const {
      register,
      handleSubmit,
      control,
      formState: { errors },
   } = useForm();

   const onSubmit = (data) => {
      console.log(data);
      // Handle form submission
   };

   return (
      <div>
         <h4 className='font-bold text-xl md:text-2xl lg:text-3xl mb-10'>
            Create new study session
         </h4>
         <Card className='w-full max-w-4xl'>
            <CardHeader>
               <CardDescription>
                  Fill in the details to create a new tutoring session.
               </CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
                  <div className='flex flex-wrap gap-6 *:min-w-60'>
                     <div>
                        <Label>Tutor Name</Label>
                        <Input
                           type='text'
                           value={user?.displayName}
                           disabled
                           className='w-full'
                        />
                     </div>
                     <div>
                        <Label>Tutor Email</Label>
                        <Input
                           type='email'
                           value={user?.email}
                           disabled
                           className='w-full'
                        />
                     </div>
                  </div>
                  <div>
                     <Label htmlFor='sessionTitle'>
                        Session Title <span className='text-red-500'>*</span>
                     </Label>
                     <Input
                        id='sessionTitle'
                        {...register("sessionTitle", {
                           required: "Session title is required",
                           minLength: {
                              value: 10,
                              message:
                                 "Session title must be at least 10 characters long",
                           },
                        })}
                        className='w-full'
                     />
                     {errors.sessionTitle && (
                        <p className='text-sm text-red-500 mt-1'>
                           {errors.sessionTitle.message}
                        </p>
                     )}
                  </div>
                  <div>
                     <Label htmlFor='sessionDescription'>
                        Session Description
                        <span className='text-red-500'>*</span>
                     </Label>
                     <Textarea
                        id='sessionDescription'
                        {...register("sessionDescription", {
                           required: "Session description is required",
                           minLength: {
                              value: 50,
                              message: "Description is too short",
                           },
                        })}
                        className='w-full'
                     />
                     {errors.sessionDescription && (
                        <p className='text-sm text-red-500 mt-1'>
                           {errors.sessionDescription.message}
                        </p>
                     )}
                  </div>

                  <div className='flex flex-wrap gap-6 *:min-w-60'>
                     <DatePickerField
                        name='registrationStartDate'
                        label='Registration Start Date'
                        control={control}
                        errors={errors}
                     />
                     <DatePickerField
                        name='registrationEndDate'
                        label='Registration End Date'
                        control={control}
                        errors={errors}
                     />
                     <DatePickerField
                        name='classStartDate'
                        label='Class Start Date'
                        control={control}
                        errors={errors}
                     />
                     <DatePickerField
                        name='classEndDate'
                        label='Class End Date'
                        control={control}
                        errors={errors}
                     />
                     <div>
                        <Label htmlFor='sessionDuration'>
                           Session Duration (minutes){" "}
                           <span className='text-red-500'>*</span>
                        </Label>
                        <Input
                           id='sessionDuration'
                           type='number'
                           {...register("sessionDuration", {
                              required: "Session duration is required",
                              min: {
                                 value: 30,
                                 message:
                                    "Duration must be at least 30 minutes",
                              },
                           })}
                           className='w-full'
                        />
                        {errors.sessionDuration && (
                           <p className='text-sm text-red-500 mt-1'>
                              {errors.sessionDuration.message}
                           </p>
                        )}
                     </div>
                     <div>
                        <Label htmlFor='registrationFee'>
                           Registration Fee
                        </Label>
                        <Input
                           id='registrationFee'
                           type='number'
                           value='0'
                           disabled
                           className='w-full'
                        />
                     </div>
                  </div>

                  <Button type='submit' className='w-full'>
                     Create Session
                  </Button>
               </form>
            </CardContent>
         </Card>
      </div>
   );
};

const DatePickerField = ({ name, label, control, errors }) => (
   <div className='flex flex-col space-y-2'>
      <Label htmlFor={name}>
         {label} <span className='text-red-500'>*</span>
      </Label>
      <Controller
         name={name}
         control={control}
         rules={{ required: `${label} is required` }}
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
                     disabled={(date) => date < new Date()}
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

export default CreateStudySession;
