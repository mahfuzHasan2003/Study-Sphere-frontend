import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

const UpdateMaterial = () => {
   const { id } = useParams();
   const navigate = useNavigate();
   const axiosPublic = useAxiosPublic();
   const {
      register,
      handleSubmit,
      reset,
      formState: { errors },
   } = useForm();

   // fetch data from backend
   const { data: material, refetch } = useFetchForGet(
      ["UpdateMaterial", id],
      `/get-tutor-material/${id}`
   );
   const previousData = {
      materialTitle: material?.materialTitle,
      materialDriveLink: material?.materialDriveLink,
   };
   const onSubmit = async (data) => {
      const { materialTitle, materialDriveLink } = data;
      if (
         previousData?.materialDriveLink === materialDriveLink &&
         previousData?.materialTitle === materialTitle
      ) {
         reset();
         toast({
            variant: "warning",
            description: "No changes were made!!",
         });
         navigate("/dashboard/upload-and-manage-materials");
         return;
      }
      const { data: result } = await axiosPublic.patch(
         `/update-material/${id}`,
         {
            materialTitle,
            materialDriveLink,
         }
      );
      if (result.success) {
         reset();
         refetch();
         navigate("/dashboard/upload-and-manage-materials");
         toast({
            variant: "success",
            description: `${result.message}`,
         });
      } else {
         toast({
            variant: "error",
            description: `Error: ${result.message}`,
         });
      }
   };

   return (
      <div className='flex items-center justify-center mt-32 max-w-md mx-auto'>
         <Card className='w-full'>
            <CardHeader>
               <CardTitle>Update Material</CardTitle>
               <CardDescription> Fill up your changes</CardDescription>
            </CardHeader>
            <CardContent>
               <form onSubmit={handleSubmit(onSubmit)} className='space-y-3'>
                  {/* Title */}
                  <div>
                     <Label htmlFor='title'>
                        Title<span className='text-red-500'> *</span>
                     </Label>
                     <Input
                        id='title'
                        defaultValue={previousData.materialTitle}
                        {...register("materialTitle", {
                           required: "Material Title is required.",
                        })}
                        placeholder='Enter material title'
                     />
                     {errors.materialTitle && (
                        <p className='text-red-500 text-sm mt-1'>
                           {errors.materialTitle.message}
                        </p>
                     )}
                  </div>

                  {/* Drive Link */}
                  <div>
                     <Label htmlFor='link'>
                        Link (Google Drive)
                        <span className='text-red-500'> *</span>
                     </Label>
                     <Input
                        id='link'
                        placeholder='Enter material link'
                        defaultValue={previousData.materialDriveLink}
                        {...register("materialDriveLink", {
                           required: "Link is required.",
                           pattern: {
                              value: /^(https?:\/\/)?(www\.)?drive\.google\.com\/.+$/,
                              message: "Invalid Google Drive link.",
                           },
                        })}
                     />
                     {errors.materialDriveLink && (
                        <p className='text-red-500 text-sm mt-1'>
                           {errors.materialDriveLink.message}
                        </p>
                     )}
                  </div>

                  {/* Buttons */}
                  <div className='flex justify-end space-x-4 mt-5'>
                     <Button>Save Changes</Button>
                  </div>
               </form>
            </CardContent>
         </Card>
      </div>
   );
};

export default UpdateMaterial;
