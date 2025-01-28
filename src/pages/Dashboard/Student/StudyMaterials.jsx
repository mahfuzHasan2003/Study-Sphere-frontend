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
} from "@/components/ui/dialog";
import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import { groupMaterialsBySessionId } from "@/utilities/groupMaterialsBySessionId";
import { Copy, Download, ExternalLink, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";

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

const StudyMaterials = () => {
   const { user } = useAuth();
   const [allGroupedMaterials, setAllGroupedMaterials] = useState([]);
   const [selectedSession, setSelectedSession] = useState(null);
   const { data: allMaterialsForStudent, isLoading: isMaterialsLoading } =
      useFetchForGet(
         "secure",
         ["allMaterialsForStudent"],
         `/get-student-materials/${user?.email}`,
         { enabled: !!user?.email }
      );
   useEffect(() => {
      setAllGroupedMaterials(groupMaterialsBySessionId(allMaterialsForStudent));
   }, [allMaterialsForStudent]);

   // copy link
   const handleCopyLink = (link) => {
      navigator.clipboard.writeText(link);
      toast({
         description: "Link copied to clipboard",
      });
   };

   // download material image
   const handleDownloadImage = async (material) => {
      const response = await fetch(material?.materialCoverImage);
      const blob = await response.blob();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = material?.materialTitle;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(link.href);
   };

   // skeleton loading
   const MaterialSkeleton = () => (
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
         {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className='p-4'>
               <Card>
                  <CardHeader>
                     <Skeleton className='h-8 rounded-md' />
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
      </div>
   );

   return (
      <div className='container mx-auto p-4'>
         <Helmet>
            <title> My materials | Dashboard - Study Sphere </title>
         </Helmet>
         <h2 className='text-xl md:text-2xl lg:text-3xl font-bold mb-8 border-l-8 border-primary pl-3'>
            All of your materials
         </h2>

         {isMaterialsLoading ? (
            <MaterialSkeleton />
         ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
               {allGroupedMaterials.length > 0 ? (
                  allGroupedMaterials?.map((matWithDetails) => (
                     <Card key={matWithDetails?.sessionId}>
                        <CardHeader>
                           <CardTitle>{matWithDetails?.sessionTitle}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p>
                              {matWithDetails?.materials?.length} material(s)
                              available
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
               ) : (
                  <p className='text-red-500 mt-5 col-span-full'>
                     No materials available for you!!
                  </p>
               )}
            </div>
         )}

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
                                       <ExternalLink className='mr-2 h-4 w-4' />{" "}
                                       Open Material
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                       onClick={() =>
                                          handleDownloadImage(material)
                                       }>
                                       <Download className='mr-2 h-4 w-4' />{" "}
                                       Download Image
                                    </DropdownMenuItem>
                                 </DropdownMenuContent>
                              </DropdownMenu>
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

export default StudyMaterials;
