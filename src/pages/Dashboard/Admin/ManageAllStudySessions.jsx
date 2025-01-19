import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
   Dialog,
   DialogContent,
   DialogHeader,
   DialogTitle,
   DialogFooter,
   DialogDescription,
} from "@/components/ui/dialog";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "@/components/ui/pagination";
import { useToast } from "@/hooks/use-toast";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import { FaCheck, FaTimes, FaEdit, FaTrash, FaEye } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import useAxiosPublic from "@/hooks/useAxiosPublic";

const ManageAllStudySessions = () => {
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
   const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
   const [selectedSession, setSelectedSession] = useState(null);
   const [sessionFee, setSessionFee] = useState(0);
   const [isSessionPaid, setIsSessionPaid] = useState(false);
   const [rejectionReason, setRejectionReason] = useState(null);
   const [rejectionFeedback, setRejectionFeedback] = useState(null);
   const { toast } = useToast();
   const axiosPublic = useAxiosPublic();

   //    useEffect(() => {
   //       fetchSessions();
   //    }, [currentPage]);

   const {
      isLoading: isPendingLoading,
      refetch: refetchPendingData,
      data: pendingSessions = [],
   } = useFetchForGet(["pendingSessions"], "/pending-sessions");
   const {
      isLoading: isApprovedLoading,
      refetch: refetchApprovedData,
      data: approvedSessions = [],
   } = useFetchForGet(["approvedSessions"], "/approved-sessions");

   //    const fetchSessions = async () => {
   //       try {
   //          const pendingResponse = await fetch("/api/pending-sessions");
   //          const pendingData = await pendingResponse.json();
   //          setPendingSessions(pendingData);

   //          const approvedResponse = await fetch(
   //             `/api/approved-sessions?page=${currentPage}&limit=10`
   //          );
   //          const approvedData = await approvedResponse.json();
   //          setApprovedSessions(approvedData.sessions);
   //          setTotalPages(approvedData.totalPages);
   //       } catch (error) {
   //          console.error("Error fetching sessions:", error);
   //       }
   //    };

   const TableSkeleton = () => (
      <>
         {[...Array(5)].map((_, index) => (
            <TableRow key={index}>
               <TableCell>
                  <Skeleton className='h-4 w-12' />
               </TableCell>
               <TableCell>
                  <Skeleton className='h-4 w-16' />
               </TableCell>
               <TableCell>
                  <Skeleton className='h-4 max-w-[250px]' />
               </TableCell>
               <TableCell className='flex gap-1 flex-wrap justify-end'>
                  <Skeleton className='h-8 w-[50px]' />
                  <Skeleton className='h-8 w-[50px]' />
                  <Skeleton className='h-8 w-[50px]' />
               </TableCell>
            </TableRow>
         ))}
      </>
   );

   const handleViewDetails = () => {
      //
   };

   const handleReject = () => {
      // setSelectedSession(session);
      setIsRejectModalOpen(true);
   };

   // cpnfirm approve session
   const confirmApprove = async () => {
      const { data: result } = await axiosPublic.put(
         `/update-session/${selectedSession._id}`,
         {
            action: "approve",
            ...{
               additionalData: { registrationFee: sessionFee },
            },
         }
      );
      if (result?.success) {
         toast({
            variant: "success",
            description: `${result.message}`,
         });
         refetchPendingData();
      } else {
         toast({
            variant: "error",
            description: `${result.message}`,
         });
      }
      setIsApproveModalOpen(false);
   };

   // reject session
   const confirmReject = async () => {
      const { data: result } = await axiosPublic.put(
         `/update-session/${selectedSession._id}`,
         {
            action: "reject",
            ...{
               additionalData: { rejectionReason, rejectionFeedback },
            },
         }
      );

      if (result?.success) {
         toast({
            variant: "success",
            description: `${result.message}`,
         });
         refetchPendingData();
      } else {
         toast({
            variant: "error",
            description: `${result.message}`,
         });
      }
      setIsRejectModalOpen(false);
   };

   const handleUpdate = async (session) => {
      // Implement update logic here
      console.log("Update session:", session);
   };

   const handleDelete = async (session) => {
      // Implement delete logic here
      console.log("Delete session:", session);
   };

   const renderSessionTable = (sessions, isPending) => (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead>Tutor</TableHead>
               <TableHead>Title</TableHead>
               <TableHead>Description</TableHead>
               <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {isPendingLoading || isApprovedLoading ? (
               <TableSkeleton />
            ) : (
               sessions.map((session) => (
                  <TableRow key={session._id}>
                     <TableCell>{session.tutorName}</TableCell>
                     <TableCell>{session.sessionTitle}</TableCell>
                     <TableCell>
                        {session?.sessionDescription?.length > 30
                           ? session.sessionDescription.slice(0, 30) + "...."
                           : session?.sessionDescription}
                     </TableCell>
                     <TableCell className='flex gap-1 flex-wrap justify-end'>
                        {isPending ? (
                           <>
                              <Button
                                 variant='outline'
                                 onClick={() => setSelectedSession(session)}>
                                 <FaEye />
                              </Button>
                              <Button
                                 onClick={() => {
                                    setSelectedSession(session);
                                    setIsSessionPaid(false);
                                    setIsApproveModalOpen(true);
                                 }}>
                                 <FaCheck />
                              </Button>
                              <Button
                                 variant='destructive'
                                 onClick={() => {
                                    setSelectedSession(session);
                                    setRejectionFeedback(null);
                                    setRejectionReason(null);
                                    setIsRejectModalOpen(true);
                                 }}>
                                 <FaTimes />
                              </Button>
                           </>
                        ) : (
                           <>
                              <Button
                                 onClick={() => setSelectedSession(session)}>
                                 <FaEdit />
                              </Button>
                              <Button
                                 variant='destructive'
                                 onClick={() => setSelectedSession(session)}>
                                 <FaTrash />
                              </Button>
                           </>
                        )}
                     </TableCell>
                  </TableRow>
               ))
            )}
         </TableBody>
      </Table>
   );

   useEffect(() => {
      // setTotalPages(approvedData.totalPages);
   }, [approvedSessions]);

   const renderPagination = () => {
      const pages = [];
      for (let i = 1; i <= totalPages; i++) {
         pages.push(
            <PaginationItem key={i}>
               <PaginationLink
                  onClick={() => setCurrentPage(i)}
                  isActive={currentPage === i}>
                  {i}
               </PaginationLink>
            </PaginationItem>
         );
      }

      return (
         <Pagination>
            <PaginationContent>
               <PaginationItem>
                  <PaginationPrevious
                     onClick={() =>
                        setCurrentPage((prev) => Math.max(1, prev - 1))
                     }
                  />
               </PaginationItem>
               {pages}
               <PaginationItem>
                  <PaginationNext
                     onClick={() =>
                        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                     }
                  />
               </PaginationItem>
            </PaginationContent>
         </Pagination>
      );
   };

   return (
      <div>
         <h4 className='font-bold text-xl md:text-2xl lg:text-3xl my-10'>
            Manage All Study Sessions
         </h4>
         <Tabs defaultValue='pending'>
            <TabsList>
               <TabsTrigger value='pending'>Pending Sessions</TabsTrigger>
               <TabsTrigger value='approved'>Approved Sessions</TabsTrigger>
            </TabsList>
            <TabsContent value='pending'>
               {renderSessionTable(pendingSessions, true)}
            </TabsContent>
            <TabsContent value='approved'>
               {renderSessionTable(approvedSessions, false)}
               {renderPagination()}
            </TabsContent>
         </Tabs>

         {/* dialog for approve session */}
         <Dialog open={isApproveModalOpen} onOpenChange={setIsApproveModalOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Approve Session</DialogTitle>
               </DialogHeader>
               <DialogDescription className='grid gap-2'>
                  <div className='flex gap-2 items-center'>
                     <label className='min-w-32'>Session Type:</label>
                     <Select
                        onValueChange={(value) => {
                           setSessionFee(0);
                           setIsSessionPaid(value === "paid");
                        }}
                        defaultValue='free'>
                        <SelectTrigger>
                           <SelectValue placeholder='Select session type' />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value='free'>Free</SelectItem>
                           <SelectItem value='paid'>Paid</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  {isSessionPaid && (
                     <div className='flex gap-2 items-center'>
                        <label className='min-w-32'>Session Fee:</label>
                        <Input
                           type='number'
                           onChange={(e) => setSessionFee(e.target.value)}
                           placeholder='Enter fee'
                           defaultValue={0}
                           required
                           min={1}
                        />
                     </div>
                  )}
               </DialogDescription>
               <DialogFooter>
                  <Button
                     disabled={isSessionPaid && sessionFee < 1}
                     onClick={confirmApprove}>
                     Approve
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* dialog for reject session */}
         <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Reject Session</DialogTitle>
               </DialogHeader>
               <DialogDescription className='grid gap-2'>
                  <div className='flex items-center md:gap-4'>
                     <label className='min-w-32'>Rejection Reason:</label>
                     <Select onValueChange={setRejectionReason}>
                        <SelectTrigger>
                           <SelectValue placeholder='Select reason' />
                        </SelectTrigger>
                        <SelectContent>
                           <SelectItem value='Inappropriate Content'>
                              Inappropriate Content
                           </SelectItem>
                           <SelectItem value='Duplicate Session'>
                              Duplicate Session
                           </SelectItem>
                           <SelectItem value='Low Quality Content'>
                              Low Quality Content
                           </SelectItem>
                           <SelectItem value='other'>Other</SelectItem>
                        </SelectContent>
                     </Select>
                  </div>
                  <div className='flex items-center md:gap-4'>
                     <label className='min-w-32'>Feedback:</label>
                     <Textarea
                        value={rejectionFeedback}
                        onChange={(e) => setRejectionFeedback(e.target.value)}
                        placeholder='Enter feedback'
                     />
                  </div>
               </DialogDescription>
               <DialogFooter>
                  <Button
                     onClick={confirmReject}
                     variant='destructive'
                     disabled={!rejectionFeedback || !rejectionReason}>
                     Reject
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default ManageAllStudySessions;
