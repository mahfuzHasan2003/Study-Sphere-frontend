import { Button } from "../ui/button";
import { Card, CardContent, CardFooter } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function StudySessionCardSkeleton() {
  return (
   <Card className="overflow-hidden">
   <div className="relative">
     <Skeleton className="w-full h-48" />
     <Skeleton className="absolute top-2 right-2 py-1 rounded-sm w-24 h-6" />
   </div>

   <CardContent className="p-4">
     <div className="flex items-center mb-2">
       <Skeleton className="w-10 h-10 rounded-full mr-2" />
       <div>
         <Skeleton className="w-32 h-5 mb-2" />
         <Skeleton className="w-24 h-4" />
       </div>
     </div>
     <Skeleton className="w-2/3 h-6 mb-2" />
     <Skeleton className="w-4/5 h-4 mb-2" />
     <div className="flex items-center justify-between">
       <div className="flex items-center">
         <Skeleton className="w-16 h-4 mr-2" />
         <span className="ml-2 text-sm text-muted-foreground">
           <Skeleton className="w-10 h-4" />
         </span>
       </div>
       <Skeleton className="w-20 h-6" />
     </div>
   </CardContent>
   <CardFooter>
     <Button asChild className="w-full" variant="secondary">
       <Skeleton className="w-full h-10" />
     </Button>
   </CardFooter>
 </Card>
  )
}
