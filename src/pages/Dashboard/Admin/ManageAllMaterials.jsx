import { Button } from "@/components/ui/button";
import {
   Card,
   CardContent,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import { groupMaterialsBySessionId } from "@/utilities/groupMaterialsBySessionId";
import { Copy, ExternalLink, MoreVertical, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

const ManageAllMaterials = () => {
   const axiosSecure = useAxiosSecure();
   const {
      data: allMaterials = [],
      refetch: refetchAllMaterials,
      isLoading: isMaterialLoading,
   } = useFetchForGet("secure", ["allMaterials"], "/all-materials");
   const [allGroupedMaterials, setAllGroupedMaterials] = useState([]);
   const [selectedSession, setSelectedSession] = useState(null);
   const [isConfirmDeleteDialogOpen, setIsConfirmDeleteDialogOpen] =
      useState(false);
   const [selectedMaterilId, setSelectedMaterilId] = useState(null);
   useEffect(() => {
      setAllGroupedMaterials(groupMaterialsBySessionId(allMaterials));
   }, [allMaterials]);

   function Modal({ isOpen, onClose, title, children }) {
      return (
         <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>{title}</DialogTitle>
               </DialogHeader>
               <DialogDescription>{children}</DialogDescription>
            </DialogContent>
         </Dialog>
      );
   }

   // copy link
   const handleCopyLink = (link) => {
      navigator.clipboard.writeText(link);
      toast({
         description: "Link copied to clipboard",
      });
   };
   // delete a material
   const handleDeleteMaterial = async () => {
      const { data: result } = await axiosSecure.delete(
         `/delete-material-by-admin/${selectedMaterilId}`
      );
      if (result.success) {
         refetchAllMaterials();
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
      setSelectedSession(null);
   };

   // skeleton loading
   const MaterialSkeleton = () => (
      <>
         {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className='p-4'>
               <Card>
                  <CardHeader>
                     <CardTitle>
                        <Skeleton className='h-8 rounded-md' />
                     </CardTitle>
                     <CardDescription>
                        <Skeleton className='h-2 w-1/2' />
                     </CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Skeleton className='h-4 w-3/4 rounded-md' />
                  </CardContent>
                  <CardFooter>
                     <Skeleton className='h-12 w-32 rounded-md' />
                  </CardFooter>
               </Card>
            </div>
         ))}
      </>
   );

   return (
      <div>
         <Helmet>
            <title> Materials | Dashboard - Study Sphere</title>
         </Helmet>
         <h2 className='text-xl md:text-2xl lg:text-3xl font-bold mb-8 border-l-8 border-primary pl-3'>
            Manage All Materials
         </h2>
         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {isMaterialLoading ? (
               <MaterialSkeleton />
            ) : (
               allGroupedMaterials?.map((matWithDetails) => (
                  <Card key={matWithDetails?.sessionId}>
                     <CardHeader>
                        <CardTitle>{matWithDetails?.sessionTitle}</CardTitle>
                        <CardDescription>
                           Tutor email: {matWithDetails?.tutorEmail}
                        </CardDescription>
                     </CardHeader>
                     <CardContent>
                        <p>
                           {matWithDetails?.materials?.length} material(s)
                           uploaded
                        </p>
                     </CardContent>
                     <CardFooter>
                        <Button
                           onClick={() => {
                              setSelectedSession(matWithDetails);
                           }}>
                           View Materials
                        </Button>
                     </CardFooter>
                  </Card>
               ))
            )}
         </div>

         {/* Modal for viewing session materials */}
         {selectedSession && (
            <Modal
               isOpen={!!selectedSession}
               onClose={() => setSelectedSession(null)}
               title={`Materials for ${selectedSession?.sessionTitle}`}>
               <div className='grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-4'>
                  {selectedSession?.materials?.map((material) => (
                     <Card key={material._id} className='rounded-md'>
                        <CardHeader className='px-4 pb-0 pt-4'>
                           <CardTitle className='flex justify-between items-center gap-2'>
                              <span>{material?.materialTitle}</span>
                              <DropdownMenu>
                                 <DropdownMenuTrigger asChild>
                                    <MoreVertical className='h-4 w-8 cursor-pointer' />
                                 </DropdownMenuTrigger>
                                 <DropdownMenuContent align='end'>
                                    <DropdownMenuItem
                                       onClick={() =>
                                          handleCopyLink(
                                             material?.materialDriveLink
                                          )
                                       }>
                                       <Copy className='mr-2 h-4 w-4' /> Copy
                                       Link
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                       onClick={() =>
                                          window.open(
                                             material?.materialDriveLink,
                                             "_blank"
                                          )
                                       }>
                                       <ExternalLink className='mr-2 h-4 w-4' />
                                       Open Material
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                       onClick={() => {
                                          setSelectedMaterilId(material._id);
                                          setIsConfirmDeleteDialogOpen(true);
                                       }}>
                                       <Trash2 className='mr-2 h-4 w-4 text-red-500' />{" "}
                                       <span className='text-red-500'>
                                          Delete Material
                                       </span>
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
                              {/* delete confirmation dialog */}
                              <Dialog
                                 className='z-50'
                                 open={isConfirmDeleteDialogOpen}
                                 onOpenChange={setIsConfirmDeleteDialogOpen}>
                                 <DialogContent>
                                    <DialogTitle>Confirm Deletion</DialogTitle>
                                    <DialogDescription>
                                       Are you sure you want to delete this
                                       material? This action cannot be undone.
                                    </DialogDescription>
                                    <DialogFooter>
                                       <Button
                                          variant='secondary'
                                          onClick={() =>
                                             setIsConfirmDeleteDialogOpen(false)
                                          }>
                                          Cancel
                                       </Button>
                                       <Button
                                          variant='destructive'
                                          onClick={() => {
                                             handleDeleteMaterial();
                                             setIsConfirmDeleteDialogOpen(
                                                false
                                             );
                                             setSelectedMaterilId(null);
                                          }}>
                                          Delete
                                       </Button>
                                    </DialogFooter>
                                 </DialogContent>
                              </Dialog>
                           </CardTitle>
                        </CardHeader>
                        <CardContent className='p-4'>
                           <img
                              loading='lazy'
                              src={
                                 material.materialCoverImage ||
                                 "/placeholder.svg"
                              }
                              alt={material.sessionTitle}
                              className='w-full max-h-24 object-cover'
                           />
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </Modal>
         )}
      </div>
   );
};

export default ManageAllMaterials;
