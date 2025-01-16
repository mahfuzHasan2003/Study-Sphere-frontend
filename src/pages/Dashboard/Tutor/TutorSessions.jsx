import TutorSessionTopDashboardSummary from "@/components/my-components/TutorSessionTopDashboardSummary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useTutorSessionsData from "@/hooks/useTutorSessionsData";

import {
   Table,
   TableBody,
   TableCaption,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";

const TutorSessions = () => {
   const approvedTutorSessions = useTutorSessionsData({ status: "approved" });
   const pendingTutorSessions = useTutorSessionsData({ status: "pending" });
   const rejectedTutorSessions = useTutorSessionsData({ status: "rejected" });

   return (
      <div>
         <h4 className='font-bold text-xl md:text-2xl lg:text-3xl'>
            View and manage your sessions
         </h4>
         <TutorSessionTopDashboardSummary
            approvedCount={approvedTutorSessions?.length}
            pendingCount={pendingTutorSessions?.length}
            rejectedCount={rejectedTutorSessions?.length}
         />

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
                              <TableHead>Status</TableHead>
                              <TableHead>Method</TableHead>
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
                                 <TableCell>Paid</TableCell>
                                 <TableCell>Credit Card</TableCell>
                                 <TableCell className='text-right'>
                                    $250.00
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
                              <TableHead>Status</TableHead>
                              <TableHead>Method</TableHead>
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
                                 <TableCell>Paid</TableCell>
                                 <TableCell>Credit Card</TableCell>
                                 <TableCell className='text-right'>
                                    $250.00
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
                              <TableHead>Status</TableHead>
                              <TableHead>Method</TableHead>
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
                                 <TableCell>Paid</TableCell>
                                 <TableCell>Credit Card</TableCell>
                                 <TableCell className='text-right'>
                                    $250.00
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
         </div>
      </div>
   );
};

export default TutorSessions;
