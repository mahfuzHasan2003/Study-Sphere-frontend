import TutorSessionTopDashboardSummary from "@/components/my-components/TutorSessionTopDashboardSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import useAuth from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FaInfo } from "react-icons/fa";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";
import {
   Popover,
   PopoverContent,
   PopoverTrigger,
} from "@/components/ui/popover";
import useAxiosPublic from "@/hooks/useAxiosPublic";
import { toast } from "@/hooks/use-toast";

const TutorSessions = () => {
   const axiosPublic = useAxiosPublic();
   const { user, authLoading } = useAuth();
   const [selectedSession, setSelectedSession] = useState(null);
   const [isSeeReasonModalOpen, setIsSeeReasonModalOpen] = useState(false);
   const {
      data: approvedTutorSessions,
      isLoading: isApprovedLoading,
      refetch: refetchApproved,
   } = useFetchForGet(
      ["approvedTutorSessions"],
      `/tutor-study-sessions?email=${user?.email}&status=approved`,
      { enabled: !!user?.email }
   );
   const {
      data: pendingTutorSessions,
      isLoading: isPendingLoading,
      refetch: refetchPending,
   } = useFetchForGet(
      ["pendingTutorSessions"],
      `/tutor-study-sessions?email=${user?.email}&status=pending`,
      { enabled: !!user?.email }
   );
   const {
      data: rejectedTutorSessions,
      isLoading: isRejectedLoading,
      refetch: refetchRejected,
   } = useFetchForGet(
      ["rejectedTutorSessions"],
      `/tutor-study-sessions?email=${user?.email}&status=rejected`,
      { enabled: !!user?.email }
   );
   const dataLoading =
      isApprovedLoading || isPendingLoading || isRejectedLoading || authLoading;

   const sendReviewRequest = async (session) => {
      const { data: result } = await axiosPublic.patch(
         `/review-rejected-session/${session._id}`
      );
      if (result.success) {
         refetchRejected();
         refetchPending();
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
      <div>
         <h4 className='font-bold text-xl md:text-2xl lg:text-3xl'>
            View and manage your sessions
         </h4>
         <TutorSessionTopDashboardSummary
            approvedCount={approvedTutorSessions?.length}
            pendingCount={pendingTutorSessions?.length}
            rejectedCount={rejectedTutorSessions?.length}
            dataLoading={dataLoading}
         />

         {/* TODO: implemet loading skkeleton for table and fix no data text */}
         <div className='max-w-3xl'>
            <Tabs defaultValue='approved' className=''>
               <TabsList>
                  <TabsTrigger value='approved'>Approved Sessions</TabsTrigger>
                  <TabsTrigger value='pending'>Pending Sessions</TabsTrigger>
                  <TabsTrigger value='rejected'>Rejected Sessions</TabsTrigger>
               </TabsList>
               {/* approved sessions */}
               <TabsContent value='approved'>
                  {approvedTutorSessions?.length > 0 ? (
                     <Table>
                        <TableCaption>
                           A list of your approved sessions.
                        </TableCaption>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Session Title</TableHead>
                              <TableHead>Registration End</TableHead>
                              <TableHead>Class Start</TableHead>
                              <TableHead className='text-right'>
                                 Action
                              </TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {approvedTutorSessions?.map((session) => (
                              <TableRow key={session._id}>
                                 <TableCell className='font-medium'>
                                    {session.sessionTitle}
                                 </TableCell>
                                 <TableCell>
                                    {format(
                                       new Date(
                                          session?.registrationEndDate || null
                                       ),
                                       "dd MMM yyyy"
                                    )}
                                 </TableCell>
                                 <TableCell>
                                    {format(
                                       new Date(
                                          session?.registrationStartDate || null
                                       ),
                                       "dd MMM yyyy"
                                    )}
                                 </TableCell>
                                 <TableCell className='text-right'>
                                    <Button
                                       variant='secondary'
                                       onClick={() =>
                                          window.open(
                                             `/session-details/${session._id}`,
                                             "_blank"
                                          )
                                       }>
                                       View Details
                                    </Button>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  ) : (
                     <p className='text-red-500 mt-5 ml-5'>No data here</p>
                  )}
               </TabsContent>
               {/* pending sessions */}
               <TabsContent value='pending'>
                  {pendingTutorSessions?.length > 0 ? (
                     <Table>
                        <TableCaption>
                           A list of your pending sessions.
                        </TableCaption>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Session Title</TableHead>
                              <TableHead>Description</TableHead>
                              <TableHead className='text-right'>
                                 Action
                              </TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {pendingTutorSessions?.map((session) => (
                              <TableRow key={session._id}>
                                 <TableCell className='font-medium'>
                                    {session.sessionTitle}
                                 </TableCell>
                                 <TableCell>
                                    {session.sessionDescription}
                                 </TableCell>
                                 <TableCell className='text-right'>
                                    {/* TODO: Implement delete functionality */}
                                    <Button variant='destructive'>
                                       Delete
                                    </Button>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  ) : (
                     <p className='text-red-500 mt-5 ml-5'>No data here</p>
                  )}
               </TabsContent>
               {/* rejected sessions */}
               <TabsContent value='rejected'>
                  {rejectedTutorSessions?.length > 0 ? (
                     <Table>
                        <TableCaption>
                           A list of your rejected sessions.
                        </TableCaption>
                        <TableHeader>
                           <TableRow>
                              <TableHead>Session Title</TableHead>
                              <TableHead className='text-right'>
                                 Action
                              </TableHead>
                           </TableRow>
                        </TableHeader>
                        <TableBody>
                           {rejectedTutorSessions?.map((session) => (
                              <TableRow key={session._id}>
                                 <TableCell className='font-medium'>
                                    {session.sessionTitle}
                                 </TableCell>
                                 <TableCell className='flex justify-end flex-wrap gap-2'>
                                    {session.requestAttempt < 2 ? (
                                       <Popover>
                                          <PopoverTrigger>
                                             <Button
                                                variant='outline'
                                                size='iconLG'>
                                                <FaInfo />
                                             </Button>
                                          </PopoverTrigger>
                                          <PopoverContent>
                                             <p className='text-sm'>
                                                You have a last chance to send a
                                                review request for the session
                                                again.
                                             </p>
                                             <div className='flex gap-2 justify-center mt-3'>
                                                {/* TODO: complete the functionality for edit session */}
                                                <Button
                                                   variant='secondary'
                                                   size='sm'>
                                                   Edit Session
                                                </Button>
                                                <Button
                                                   variant='warning'
                                                   size='sm'
                                                   onClick={() => {
                                                      sendReviewRequest(
                                                         session
                                                      );
                                                   }}>
                                                   Send Request
                                                </Button>
                                             </div>
                                          </PopoverContent>
                                       </Popover>
                                    ) : null}
                                    <Button
                                       variant='secondary'
                                       onClick={() => {
                                          setSelectedSession(session);
                                          setIsSeeReasonModalOpen(true);
                                       }}>
                                       See Reason
                                    </Button>

                                    {/* TODO: add delete functionality */}
                                    <Button variant='destructive'>
                                       Delete
                                    </Button>
                                 </TableCell>
                              </TableRow>
                           ))}
                        </TableBody>
                     </Table>
                  ) : (
                     <p className='text-red-500 mt-5 ml-5'>No data here</p>
                  )}
               </TabsContent>
            </Tabs>
            {/* See Reason Dialog */}
            <Dialog
               open={isSeeReasonModalOpen}
               onOpenChange={setIsSeeReasonModalOpen}>
               <DialogContent>
                  <DialogHeader>
                     <DialogTitle>Rejection Reason</DialogTitle>
                  </DialogHeader>
                  <DialogDescription className='grid gap-1'>
                     <p>
                        <span className='font-semibold'>Rejection For:</span>{" "}
                        {selectedSession?.rejectionReason}
                     </p>
                     <p>
                        <span className='font-semibold'>Admin Feedback:</span>{" "}
                        {selectedSession?.rejectionFeedback}
                     </p>
                  </DialogDescription>
                  <DialogFooter>
                     <Button
                        variant='secondary'
                        onClick={() => setIsSeeReasonModalOpen(false)}>
                        Close
                     </Button>
                  </DialogFooter>
               </DialogContent>
            </Dialog>
         </div>
      </div>
   );
};

export default TutorSessions;
