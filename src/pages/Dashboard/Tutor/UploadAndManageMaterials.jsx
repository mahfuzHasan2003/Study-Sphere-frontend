import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
} from "@/components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";

import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   MoreVertical,
   Upload,
   Copy,
   ExternalLink,
   Trash2,
   Edit,
} from "lucide-react";
import { uploadToImageBB } from "@/utilities/uploadToImageBB";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import useAuth from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import { groupMaterialsBySessionId } from "@/utilities/groupMaterialsBySessionId";

// Dummy data for uploaded materials
const initialMaterials = [
   {
      sessionId: "1",
      materials: [
         {
            id: "1",
            title: "Algebra Basics",
            image: "/placeholder.svg?height=100&width=100",
            link: "https://drive.google.com/file1",
         },
         {
            id: "2",
            title: "Geometry Fundamentals",
            image: "/placeholder.svg?height=100&width=100",
            link: "https://drive.google.com/file2",
         },
         {
            id: "2",
            title: "Geometry Fundamentals",
            image: "/placeholder.svg?height=100&width=100",
            link: "https://drive.google.com/file2",
         },
      ],
   },
   {
      sessionId: "2",
      materials: [
         {
            id: "3",
            title: "Newton's Laws",
            image: "/placeholder.svg?height=100&width=100",
            link: "https://drive.google.com/file3",
         },
      ],
   },
];

function Modal({ isOpen, onClose, title, children }) {
   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent>
            <DialogHeader>
               <DialogTitle>{title}</DialogTitle>
            </DialogHeader>
            {children}
         </DialogContent>
      </Dialog>
   );
}

export default function UploadAndManageMaterials() {
   const axiosPublic = useAxiosPublic();
   const { user } = useAuth();
   const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
   const [selectedSession, setSelectedSession] = useState(null);
   const [groupedMaterials, setGroupedMaterials] = useState([]);
   const [selectedSessionMaterials, setSelectedSessionMaterials] =
      useState(null);

   // getting approved sessions
   const { data: approvedSessions = [] } = useFetchForGet(
      ["approvedSessions"],
      `/tutor-study-sessions?email=${user?.email}&status=approved`,
      { enabled: !!user?.email }
   );
   // getting material of selected tutor
   const { data: tutorMaterials = [] } = useFetchForGet(
      ["tutorMaterials"],
      `/get-tutor-materials/${user?.email}`,
      { enabled: !!user?.email }
   );

   const {
      register,
      handleSubmit,
      reset,
      watch,
      setValue,
      formState: { errors },
      clearErrors,
   } = useForm();
   const materialFor = watch("materialFor");
   useEffect(() => {
      if (materialFor) {
         clearErrors("materialFor");
      }
      if (!isUploadDialogOpen) {
         reset();
         setValue("materialFor", null);
      }
      setGroupedMaterials(groupMaterialsBySessionId(tutorMaterials));
   }, [
      clearErrors,
      isUploadDialogOpen,
      materialFor,
      reset,
      setValue,
      tutorMaterials,
   ]);

   // adding new material
   const onSubmit = async (data) => {
      console.log("submitted");
      const materialCoverImage = await uploadToImageBB(
         data?.materialCoverImage[0]
      );
      //    TODO: post with tanstack query
      const { data: result } = await axiosPublic.post(
         "/upload-a-new-material",
         {
            sessionId: data?.materialFor,
            tutorEmail: user?.email,
            materialTitle: data?.materialTitle,
            materialCoverImage,
            materialDriveLink: data?.materialDriveLink,
         }
      );
      setIsUploadDialogOpen(false);
      if (result.success) {
         //   TODO: refetch material
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

      //   console.log("Form Data:", data);
   };

   const handleDeleteMaterial = (sessionId, materialId) => {
      const updatedMaterials = materials.map((session) => {
         if (session.sessionId === sessionId) {
            return {
               ...session,
               materials: session.materials.filter(
                  (material) => material.id !== materialId
               ),
            };
         }
         return session;
      });
      setMaterials(updatedMaterials);
   };

   const handleCopyLink = (link) => {
      navigator.clipboard.writeText(link);
      // You can add a toast notification here
   };

   const handleOpenMaterial = (link) => {
      window.open(link, "_blank");
   };

   const openSessionMaterials = (sessionId) => {
      console.log("Open sessionMaterials");

      //   setSelectedSessionMaterials();
   };

   return (
      <div className='container mx-auto p-4'>
         <h4 className='font-bold text-xl md:text-2xl lg:text-3xl my-10'>
            Upload & manage session materials
         </h4>

         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {/* Static upload card */}
            <Dialog
               open={isUploadDialogOpen}
               onOpenChange={setIsUploadDialogOpen}>
               <DialogTrigger asChild>
                  <Card className='border-2 border-dashed border-muted hover:border-muted-foreground transition-colors cursor-pointer'>
                     <CardContent className='flex flex-col items-center justify-center h-[200px]'>
                        <Upload className='h-12 w-12 text-muted-foreground' />
                        <p className='mt-4 text-lg font-medium text-muted-foreground'>
                           Upload a new material
                        </p>
                     </CardContent>
                  </Card>
               </DialogTrigger>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Upload Material</DialogTitle>
                  </DialogHeader>
                  <DialogDescription>
                     <form
                        onSubmit={handleSubmit(onSubmit)}
                        className='space-y-4'
                        noValidate>
                        <div>
                           <Label htmlFor='session'>
                              Session<span className='text-red-500'> *</span>
                           </Label>
                           <Select
                              {...register("materialFor", {
                                 required: "Session selection is required.",
                              })}
                              onValueChange={(value) =>
                                 setValue("materialFor", value)
                              }>
                              <SelectTrigger>
                                 <SelectValue placeholder='Select a session' />
                              </SelectTrigger>
                              <SelectContent>
                                 {approvedSessions?.map((session) => (
                                    <SelectItem
                                       key={session?._id}
                                       value={session?._id}>
                                       {session?.sessionTitle}
                                    </SelectItem>
                                 ))}
                              </SelectContent>
                           </Select>
                           {!materialFor && (
                              <p className='text-red-500 text-sm mt-1'>
                                 Session is required.
                              </p>
                           )}
                        </div>
                        <div>
                           <Label htmlFor='title'>
                              Title<span className='text-red-500'> *</span>
                           </Label>
                           <Input
                              id='title'
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
                        <div>
                           <Label htmlFor='image'>
                              Image<span className='text-red-500'> *</span>
                           </Label>
                           <Input
                              id='image'
                              type='file'
                              accept='image/*'
                              {...register("materialCoverImage", {
                                 required:
                                    "Image as material cover is required.",
                              })}
                           />
                           {errors.materialCoverImage && (
                              <p className='text-red-500 text-sm mt-1'>
                                 {errors.materialCoverImage.message}
                              </p>
                           )}
                        </div>
                        <div>
                           <Label htmlFor='link'>
                              Link (Google Drive)
                              <span className='text-red-500'> *</span>
                           </Label>
                           <Input
                              id='link'
                              placeholder='Enter material link'
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
                        <div className='text-end'>
                           <Button type='submit'>Upload</Button>
                        </div>
                     </form>
                  </DialogDescription>
               </DialogContent>
            </Dialog>

            {/* TODO: handle loading state */}
            {/* Dynamic material cards */}
            {groupedMaterials?.map((matWithDetails) => (
               <Card key={matWithDetails?.sessionId}>
                  <CardHeader>
                     <CardTitle>{matWithDetails?.sessionTitle}</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p>
                        {matWithDetails?.materials?.length} material(s) uploaded
                     </p>
                  </CardContent>
                  <CardFooter>
                     <Button
                        onClick={() =>
                           openSessionMaterials(matWithDetails.sessionId)
                        }>
                        View Materials
                     </Button>
                  </CardFooter>
               </Card>
            ))}
         </div>

         {/* Modal for viewing session materials */}
         {selectedSessionMaterials && (
            <Modal
               isOpen={!!selectedSessionMaterials}
               onClose={() => setSelectedSessionMaterials(null)}
               title={`Materials for ${
                  approvedSessions.find(
                     (s) => s._id === selectedSessionMaterials.sessionId
                  )?.name || "Unknown Session"
               }`}>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {selectedSessionMaterials?.materials?.map((material) => (
                     <Card key={material.id}>
                        <CardHeader>
                           <CardTitle className='flex justify-between items-center'>
                              <span>{material.title}</span>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <Button
                                       variant='ghost'
                                       className='h-8 w-8 p-0'>
                                       <MoreVertical className='h-4 w-4' />
                                    </Button>
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align='end'>
                                    <DropdownMenuItem
                                       onClick={() =>
                                          handleCopyLink(material.link)
                                       }>
                                       <Copy className='mr-2 h-4 w-4' /> Copy
                                       Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                       onClick={() =>
                                          handleOpenMaterial(material.link)
                                       }>
                                       <ExternalLink className='mr-2 h-4 w-4' />{" "}
                                       Open Material
                                    </DropdownMenuItem>
                                    <DropdownMenuItem>
                                       <Edit className='mr-2 h-4 w-4' /> Update
                                       Material
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                       onClick={() =>
                                          handleDeleteMaterial(
                                             selectedSessionMaterials.sessionId,
                                             material.id
                                          )
                                       }>
                                       <Trash2 className='mr-2 h-4 w-4 text-red-500' />{" "}
                                       <span className='text-red-500'>
                                          Delete Material
                                       </span>
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <img
                              src={material.image || "/placeholder.svg"}
                              alt={material.title}
                              className='w-full h-32 object-cover'
                           />
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </Modal>
         )}
      </div>
   );
}
