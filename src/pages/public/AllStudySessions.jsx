import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
   Select,
   SelectContent,
   SelectItem,
   SelectTrigger,
   SelectValue,
} from "@/components/ui/select";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import StudySessionCard from "@/components/my-components/StudySessionCard";
import Pagination from "@/shared/Pagination";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

const AllStudySessions = () => {
   const [currentPage, setCurrentPage] = useState(1);
   //    const [totalPages, setTotalPages] = useState(1);
   const [searchValue, setSearchValue] = useState("");
   const [filterBy, setFilterBy] = useState("all");

   // TODO: Implement pagination
   const { data: allSessionsData = {}, isLoading } = useFetchForGet(
      ["sessions", currentPage, searchValue, filterBy],
      `/get-all-sessions?page=${currentPage}&searchValue=${searchValue}&filterBy=${filterBy}`,
      { keepPreviousData: true }
   );
   const { totalDataFound, sessions = [], totalPages = 1 } = allSessionsData;

   // setTotalPages(totalPages);

   const handleSearch = (e) => {
      setSearchValue(e.target.value);
      setCurrentPage(1);
   };
   const handleFilter = (value) => {
      setFilterBy(value);
      setCurrentPage(1);
   };

   const CardSkeleton = () => (
      <>
         {[...Array(5)].map((_, index) => (
            <Card className='overflow-hidden' key={index}>
               <div className='relative'>
                  <Skeleton className='w-full h-48' />
                  <Skeleton className='absolute top-2 right-2 py-1 rounded-sm w-24 h-6' />
               </div>

               <CardContent className='p-4'>
                  <div className='flex items-center mb-2'>
                     <Skeleton className='w-10 h-10 rounded-full mr-2' />
                     <div>
                        <Skeleton className='w-32 h-5 mb-2' />
                        <Skeleton className='w-24 h-4' />
                     </div>
                  </div>
                  <Skeleton className='w-2/3 h-6 mb-2' />
                  <Skeleton className='w-4/5 h-4 mb-2' />
                  <div className='flex items-center justify-between'>
                     <div className='flex items-center'>
                        <Skeleton className='w-16 h-4 mr-2' />
                        <span className='ml-2 text-sm text-muted-foreground'>
                           <Skeleton className='w-10 h-4' />
                        </span>
                     </div>
                     <Skeleton className='w-20 h-6' />
                  </div>
               </CardContent>
               <CardFooter>
                  <Button asChild className='w-full' variant='secondary'>
                     <Skeleton className='w-full h-10' />
                  </Button>
               </CardFooter>
            </Card>
         ))}
      </>
   );

   return (
      <div className='max-w-8xl mx-auto mt-10'>
         <h2 className='text-xl md:text-2xl lg:text-3xl font-bold mb-8 border-l-8 border-primary pl-3'>
            Keep exploring and growing your knowledge.
         </h2>
         <div className='flex flex-col md:flex-row gap-4 mb-8'>
            <Input
               type='text'
               placeholder='Search by session name ...'
               value={searchValue}
               onChange={handleSearch}
               className='flex-grow'
            />
            <Select onValueChange={handleFilter} value={filterBy}>
               <SelectTrigger className='w-full md:w-[180px]'>
                  <SelectValue placeholder='Filter by' />
               </SelectTrigger>
               <SelectContent>
                  <SelectItem value='all'>All Sessions</SelectItem>
                  <SelectItem value='ongoing'>Ongoing</SelectItem>
                  <SelectItem value='upcoming'>Upcoming</SelectItem>
                  <SelectItem value='closed'>Closed</SelectItem>
               </SelectContent>
            </Select>
         </div>
         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {isLoading ? (
               <CardSkeleton />
            ) : sessions.length > 0 ? (
               sessions.map((session) => (
                  <StudySessionCard key={session._id} session={session} />
               ))
            ) : (
               <p className='text-center col-span-full text-gray-600'>
                  No sessions found.
               </p>
            )}
         </div>
         {totalPages > 1 && (
            <Pagination
               currentPage={currentPage}
               totalPages={totalPages}
               onPageChange={setCurrentPage}
               className='mt-8'
               showFirstLast={true}
               showPageNumbers={true}
            />
         )}
      </div>
   );
};

export default AllStudySessions;
