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
import { convertToHoursAndMinutes } from "@/utilities/convertToHoursAndMinutes";
import { format } from "date-fns";
import useAxiosSecure from "@/hooks/useAxiosSecure";

const ManageAllStudySessions = () => {
   const [currentPage, setCurrentPage] = useState(1);
   const [totalPages, setTotalPages] = useState(1);
   const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
   const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
   const [isShowDetailsModalOpen, setIsShowDetailsModalOpen] = useState(false);
   const [isDeleteApprovedModalOpen, setIsDeleteApprovedModalOpen] =
      useState(false);
   const [selectedSession, setSelectedSession] = useState(null);
   const [sessionFee, setSessionFee] = useState(0);
   const [isSessionPaid, setIsSessionPaid] = useState(false);
   const [rejectionReason, setRejectionReason] = useState(null);
   const [rejectionFeedback, setRejectionFeedback] = useState(null);
   const { toast } = useToast();
   const axiosSecure = useAxiosSecure();

   //    useEffect(() => {
   //       fetchSessions();
   //    }, [currentPage]);

   const {
      isLoading: isPendingLoading,
      refetch: refetchPendingData,
      data: pendingSessions = [],
   } = useFetchForGet("secure", ["pendingSessions"], "/pending-sessions");
   const {
      isLoading: isApprovedLoading,
      refetch: refetchApprovedData,
      data: approvedSessions = [],
   } = useFetchForGet("secure", ["approvedSessions"], "/approved-sessions");

   // `/api/approved-sessions?page=${currentPage}&limit=10`;

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

   // cpnfirm approve session
   const confirmApprove = async () => {
      const { data: result } = await axiosSecure.put(
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
         refetchApprovedData();
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
      const { data: result } = await axiosSecure.put(
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

   // TODO: implement functionality
   const handleUpdate = async () => {
      console.log("Update session:", selectedSession);
   };

   // delete session
   const confirmDelete = async () => {
      const { data: result } = await axiosSecure.delete(
         `/delete-session-by-admin/${selectedSession._id}`
      );
      if (result?.success) {
         toast({
            variant: "success",
            description: `${result.message}`,
         });
         refetchApprovedData();
      } else {
         toast({
            variant: "error",
            description: `${result.message}`,
         });
      }
      setIsDeleteApprovedModalOpen(false);
   };

   const renderSessionTable = (sessions, isPending) => (
      <Table>
         <TableHeader>
            <TableRow>
               <TableHead>Tutor Email</TableHead>
               <TableHead>Title</TableHead>
               <TableHead>Description</TableHead>
               <TableHead className='text-right'>Actions</TableHead>
            </TableRow>
         </TableHeader>
         <TableBody>
            {isPendingLoading || isApprovedLoading ? (
               <TableSkeleton />
            ) : sessions.length > 0 ? (
               sessions.map((session) => (
                  <TableRow key={session._id}>
                     <TableCell>{session.tutorEmail}</TableCell>
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
                                 onClick={() => {
                                    setSelectedSession(session);
                                    setIsShowDetailsModalOpen(true);
                                 }}>
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
                                 variant='outline'
                                 onClick={() => {
                                    setSelectedSession(session);
                                    setIsShowDetailsModalOpen(true);
                                 }}>
                                 <FaEye />
                              </Button>
                              {/* TODO: btn for handling update session */}
                              <Button
                                 onClick={() => setSelectedSession(session)}>
                                 <FaEdit />
                              </Button>
                              <Button
                                 variant='destructive'
                                 onClick={() => {
                                    setSelectedSession(session);
                                    setIsDeleteApprovedModalOpen(true);
                                 }}>
                                 <FaTrash />
                              </Button>
                           </>
                        )}
                     </TableCell>
                  </TableRow>
               ))
            ) : (
               <TableRow className='hover:bg-transparent'>
                  <TableCell
                     colSpan={4}
                     className='text-red-500 text-center pt-10'>
                     No {isPending ? " pending" : "Approved"} session available
                  </TableCell>
               </TableRow>
            )}
         </TableBody>
      </Table>
   );

   // TODO: implement pagination
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
         <h2 className='text-xl md:text-2xl lg:text-3xl font-bold mb-8 border-l-8 border-primary pl-3'>
            Manage All Study Sessions
         </h2>
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

         {/* dialog for approve pending session */}
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
                        <label className='min-w-32'>
                           Session Fee: <span className='text-red-500'>*</span>
                        </label>
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

         {/* dialog for reject pending session */}
         <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Reject Session</DialogTitle>
               </DialogHeader>
               <DialogDescription className='grid gap-2'>
                  <div className='flex items-center md:gap-4'>
                     <label className='min-w-32'>
                        Rejection Reason:{" "}
                        <span className='text-red-500'>*</span>
                     </label>
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
                     <label className='min-w-32'>
                        Feedback:<span className='text-red-500'>*</span>
                     </label>
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

         {/* dialog for show details of pending session */}
         <Dialog
            open={isShowDetailsModalOpen}
            onOpenChange={setIsShowDetailsModalOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Session Details</DialogTitle>
               </DialogHeader>
               <DialogDescription className='grid gap-1'>
                  <p className='mb-3'>
                     <span className='font-bold'>Tutor Email:</span>{" "}
                     {selectedSession?.tutorEmail}
                  </p>
                  <img
                     src={selectedSession?.sessionBannerImage}
                     alt='Banner Image'
                     loading='lazy'
                     className='max-h-40 mx-auto'
                  />
                  {selectedSession?.requestAttempt ? (
                     <p>
                        <span className='font-bold text-cyan-500'>
                           Request Attempt:
                        </span>{" "}
                        {selectedSession?.requestAttempt === 1
                           ? "First time"
                           : "Last chance (review request)"}
                     </p>
                  ) : null}
                  {selectedSession?.rejectionFeedback ? (
                     <p>
                        <span className='font-bold'>
                           Previos Admin Feedback:
                        </span>{" "}
                        {selectedSession?.rejectionFeedback}
                     </p>
                  ) : null}
                  <p>
                     <span className='font-semibold'>Session Title:</span>{" "}
                     {selectedSession?.sessionTitle}
                  </p>
                  <p>
                     <span className='font-semibold'>Session Description:</span>{" "}
                     {selectedSession?.sessionDescription}
                  </p>
                  <p>
                     <span className='font-semibold'>Registration Start:</span>{" "}
                     {format(
                        new Date(
                           selectedSession?.registrationStartDate || null
                        ),
                        "dd MMM yyyy"
                     )}
                  </p>
                  <p>
                     <span className='font-semibold'>Registration End:</span>{" "}
                     {format(
                        new Date(selectedSession?.registrationEndDate || null),
                        "dd MMM yyyy"
                     )}
                  </p>
                  <p>
                     <span className='font-semibold'>Class Start:</span>{" "}
                     {format(
                        new Date(selectedSession?.classStartDate || null),
                        "dd MMM yyyy"
                     )}
                  </p>
                  <p>
                     <span className='font-semibold'>Class End:</span>{" "}
                     {format(
                        new Date(selectedSession?.classEndDate || null),
                        "dd MMM yyyy"
                     )}
                  </p>
                  <p>
                     <span className='font-semibold'>Session Duration:</span>{" "}
                     {convertToHoursAndMinutes(
                        selectedSession?.sessionDuration
                     )}
                  </p>
               </DialogDescription>
               <DialogFooter>
                  <Button
                     variant='secondary'
                     onClick={() => setIsShowDetailsModalOpen(false)}>
                     Close
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>

         {/* dialog for delete approved session */}
         <Dialog
            open={isDeleteApprovedModalOpen}
            onOpenChange={setIsDeleteApprovedModalOpen}>
            <DialogContent>
               <DialogHeader>
                  <DialogTitle>Delete Session</DialogTitle>
               </DialogHeader>
               <DialogDescription>
                  Are you sure you want to delete the session?
               </DialogDescription>
               <DialogFooter>
                  <Button
                     onClick={() => setIsDeleteApprovedModalOpen(false)}
                     variant='outline'>
                     Cancel
                  </Button>
                  <Button onClick={confirmDelete} variant='destructive'>
                     Confirm
                  </Button>
               </DialogFooter>
            </DialogContent>
         </Dialog>
      </div>
   );
};

export default ManageAllStudySessions;
