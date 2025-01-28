import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
} from "@/components/ui/table";
import { UserPlus, UserMinus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import UserAvatar from "@/shared/UserAvatar";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
} from "@/components/ui/dialog";
import useAuth from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Pagination from "@/shared/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

const AllUsers = () => {
   const navigate = useNavigate();
   const location = useLocation();
   const [currentPage, setCurrentPage] = useState(1);
   const [searchQuery, setSearchQuery] = useState("");
   const [roleFilter, setRoleFilter] = useState("all");
   const { toast } = useToast();
   const [dialogOpen, setDialogOpen] = useState(false);
   const [actionUser, setActionUser] = useState(null);
   const [currentAction, setCurrentAction] = useState(null);
   const axiosSecure = useAxiosSecure();
   const { user: loggedInAdmin } = useAuth();

   const TableSkeleton = () => (
      <>
         {[...Array(10)].map((_, index) => (
            <TableRow key={index}>
               <TableCell>
                  <Skeleton className='h-4 w-6' />
               </TableCell>
               <TableCell>
                  <Skeleton className='h-10 w-10 rounded-full' />
               </TableCell>
               <TableCell>
                  <Skeleton className='h-4 max-w-[250px]' />
               </TableCell>
               <TableCell>
                  <Skeleton className='h-4 max-w-[200px]' />
               </TableCell>
               <TableCell>
                  <Skeleton className='h-4 max-w-[100px]' />
               </TableCell>
               <TableCell className='text-right'>
                  <Skeleton className='h-8 w-[100px] ml-auto' />
               </TableCell>
            </TableRow>
         ))}
      </>
   );

   const {
      isLoading,
      data: allUsersData = {},
      refetch,
   } = useFetchForGet(
      "secure",
      ["allUsers", searchQuery, roleFilter, currentPage],
      `/get-all-users/${loggedInAdmin?.email}?page=${currentPage}&limit=10&searchQuery=${searchQuery}&roleFilter=${roleFilter}`,
      { enabled: !!loggedInAdmin?.email }
   );

   const { totalUsers = 0, users = [], totalPages = 1 } = allUsersData;
   const handlePageChange = (newPage) => {
      setCurrentPage(newPage);
      navigate(
         `?page=${newPage}&searchQuery=${searchQuery}&roleFilter=${roleFilter}`
      );
   };
   useEffect(() => {
      const updatedQuery = new URLSearchParams(location.search);
      setCurrentPage(parseInt(updatedQuery.get("page")) || 1);
      setSearchQuery(updatedQuery.get("searchQuery") || "");
      setRoleFilter(updatedQuery.get("roleFilter") || "all");
   }, [location.search]);
   const handleConfirm = async (user) => {
      if (currentAction === "makeAdmin") {
         // handleUpdateRole(user._id);
         await axiosSecure.patch(`/update-user-role/${user._id}`, {
            newRole: "admin",
         });
         toast({
            title: "Role Updated",
            description: "User role has been updated successfully.",
         });
      } else if (currentAction === "removeAdmin") {
         await axiosSecure.patch(`/update-user-role/${user._id}`, {
            newRole: "student",
         });
         toast({
            title: "Admin Removed",
            description: "Admin privileges have been removed successfully.",
         });
      }
      refetch();
      setDialogOpen(false);
   };

   return (
      <div>
         <Helmet>
            <title> Users | Dashboard - Study Sphere</title>
         </Helmet>
         <h2 className='text-xl md:text-2xl lg:text-3xl font-bold mb-8 border-l-8 border-primary pl-3'>
            Manage All Users
         </h2>
         <div className='flex flex-col sm:flex-row gap-4 mb-5'>
            <div className='flex-1'>
               <Input
                  placeholder='Search by name or email...'
                  value={searchQuery}
                  onChange={(e) => {
                     setSearchQuery(e.target.value);
                     setCurrentPage(1);
                  }}
                  className='max-w-md'
               />
            </div>
            <Select
               value={roleFilter}
               onValueChange={(value) => {
                  setRoleFilter(value);
                  setCurrentPage(1);
               }}>
               <SelectTrigger className='w-[180px]'>
                  <SelectValue placeholder='Filter by role' />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value='all'>All Roles</SelectItem>
                  <SelectItem value='admin'>Admin</SelectItem>
                  <SelectItem value='tutor'>Tutor</SelectItem>
                  <SelectItem value='student'>Student</SelectItem>
               </SelectContent>
            </Select>
         </div>
         <div className='rounded-md border'>
            <Table>
               <TableHeader>
                  <TableRow>
                     <TableHead className='w-16'>No.</TableHead>
                     <TableHead>Profile</TableHead>
                     <TableHead>Name</TableHead>
                     <TableHead>Email</TableHead>
                     <TableHead>Role</TableHead>
                     <TableHead className='text-right'>Actions</TableHead>
                  </TableRow>
               </TableHeader>
               <TableBody>
                  {!loggedInAdmin?.email || isLoading ? (
                     <TableSkeleton />
                  ) : (
                     users.map((user, index) => (
                        <TableRow key={user._id}>
                           <TableCell>
                              {(currentPage - 1) * 10 + index + 1}
                           </TableCell>
                           <TableCell>
                              <UserAvatar
                                 userName={user.userName}
                                 imageURL={user.userPhotoURL}
                              />
                           </TableCell>
                           <TableCell className='font-medium'>
                              {user.userName}
                           </TableCell>
                           <TableCell>{user.userEmail}</TableCell>
                           <TableCell className='capitalize'>
                              {user.userRole}
                           </TableCell>
                           <TableCell className='text-right'>
                              {user.userRole === "student" && (
                                 <Button
                                    variant='warning'
                                    size='sm'
                                    onClick={() => {
                                       setCurrentAction("makeAdmin");
                                       setActionUser(user);
                                       setDialogOpen(true);
                                    }}>
                                    <UserPlus className='h-4 w-4 mr-2' />
                                    Make Admin
                                 </Button>
                              )}
                              {user.userRole === "admin" && (
                                 <Button
                                    variant='destructive'
                                    size='sm'
                                    onClick={() => {
                                       setCurrentAction("removeAdmin");
                                       setActionUser(user);
                                       setDialogOpen(true);
                                    }}>
                                    <UserMinus className='h-4 w-4 mr-2' />
                                    Remove from Admin
                                 </Button>
                              )}

                              <Dialog
                                 open={dialogOpen}
                                 onOpenChange={setDialogOpen}>
                                 <DialogContent>
                                    <DialogHeader>
                                       <DialogTitle>
                                          {currentAction === "makeAdmin"
                                             ? "Make Admin"
                                             : "Remove Admin"}
                                       </DialogTitle>
                                    </DialogHeader>
                                    <DialogDescription>
                                       Are you sure you want to{" "}
                                       {currentAction === "makeAdmin" ? (
                                          <>
                                             make
                                             <span className='font-bold'>
                                                {" "}
                                                {actionUser?.userName}{" "}
                                             </span>
                                             an Admin?
                                          </>
                                       ) : (
                                          <>
                                             remove
                                             <span className='font-bold'>
                                                {" "}
                                                {actionUser?.userName}{" "}
                                             </span>
                                             from Admin?
                                          </>
                                       )}
                                    </DialogDescription>
                                    <DialogFooter>
                                       <Button
                                          variant='outline'
                                          onClick={() => setDialogOpen(false)}>
                                          Cancel
                                       </Button>
                                       <Button
                                          variant={
                                             currentAction === "makeAdmin"
                                                ? "warning"
                                                : "destructive"
                                          }
                                          onClick={() =>
                                             handleConfirm(actionUser)
                                          }>
                                          Confirm
                                       </Button>
                                    </DialogFooter>
                                 </DialogContent>
                              </Dialog>
                           </TableCell>
                        </TableRow>
                     ))
                  )}
               </TableBody>{" "}
            </Table>{" "}
            {users.length < 1 && !isLoading ? (
               <p className='text-center text-red-500 py-5'>No data found.</p>
            ) : null}
         </div>
         {totalPages > 1 && (
            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={handlePageChange}
               className='mt-8'
               showFirstLast={true}
               showPageNumbers={true}
            />
         )}
      </div>
   );
};

export default AllUsers;
