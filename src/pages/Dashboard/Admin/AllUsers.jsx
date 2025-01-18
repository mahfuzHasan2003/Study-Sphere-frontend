import { useState } from "react";
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

const AllUsers = () => {
   const [searchQuery, setSearchQuery] = useState("");
   const [roleFilter, setRoleFilter] = useState("all");
   const { toast } = useToast();

   console.log(searchQuery, roleFilter);

   const { isLoading, data: users = [] } = useFetchForGet(
      ["allUsers"],
      `/get-all-users`
   );

   const handleUpdateRole = (userId) => {
      toast({
         title: "Role Updated",
         description: "User role has been updated successfully.",
      });
   };

   const handleRemoveAdmin = (userId) => {
      toast({
         title: "Admin Removed",
         description: "Admin privileges have been removed successfully.",
      });
   };

   return (
      <div className='container mx-auto py-8 space-y-6'>
         <h4 className='font-bold text-xl md:text-2xl lg:text-3xl my-10'>
            View and manage all users
         </h4>
         <div className='flex flex-col sm:flex-row gap-4'>
            <div className='flex-1'>
               <Input
                  placeholder='Search by name or email...'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className='max-w-md'
               />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
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
                  {users.map((user, index) => (
                     <TableRow key={user._id}>
                        <TableCell>{index + 1}</TableCell>
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
                                 onClick={() => handleUpdateRole(user._id)}>
                                 <UserPlus className='h-4 w-4 mr-2' />
                                 Make Admin
                              </Button>
                           )}
                           {user.userRole === "admin" && (
                              <Button
                                 variant='destructive'
                                 size='sm'
                                 onClick={() => handleRemoveAdmin(user._id)}>
                                 <UserMinus className='h-4 w-4 mr-2' />
                                 Remove from Admin
                              </Button>
                           )}
                        </TableCell>
                     </TableRow>
                  ))}
               </TableBody>
            </Table>
         </div>
      </div>
   );
};

export default AllUsers;
