import { useParams } from "react-router-dom";
import { format } from "date-fns";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import { convertToHoursAndMinutes } from "@/utilities/convertToHoursAndMinutes";
import { Skeleton } from "@/components/ui/skeleton";

const SessionDetails = () => {
   const { id } = useParams();

   const { data: session = {}, isLoading } = useFetchForGet(
      ["SessionDetails", id],
      `/get-session-details/${id}`
   );

   const isRegistrationOpen =
      new Date(session.registrationEndDate) > new Date();

   // TODO: fetch  review
   // Dummy reviews data
   const reviews = [
      {
         id: 1,
         author: "John Doe",
         rating: 5,
         comment: "Great session! Learned a lot.",
      },
      {
         id: 2,
         author: "Jane Smith",
         rating: 4,
         comment: "Very informative, but could use more practical examples.",
      },
      {
         id: 3,
         author: "Bob Johnson",
         rating: 4.5,
         comment: "Excellent content and well-presented.",
      },
   ];

   const SessionDetailsSkeleton = () => (
      <div className='max-w-8xl mx-auto mt-10'>
         <h1 className='text-3xl font-bold mb-8'>
            <Skeleton className='w-48 h-8' />
         </h1>
         <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='md:col-span-2'>
               <Skeleton className='w-full h-64 mb-4' />
               <Skeleton className='w-3/4 h-8 mb-4' />
               <div className='flex items-center mb-4'>
                  <Skeleton className='w-16 h-4 mr-2' />
                  <Skeleton className='w-24 h-4' />
               </div>
               <Skeleton className='w-full h-4 mb-6' />
               <div className='grid grid-cols-2 gap-4 mb-6'>
                  {[...Array(6)].map((_, index) => (
                     <div key={index}>
                        <Skeleton className='w-2/3 h-4 mb-2' />
                        <Skeleton className='w-1/2 h-4' />
                     </div>
                  ))}
               </div>
               <Skeleton className='w-32 h-10 mb-4' />
            </div>

            {/* Tutor Profile */}
            <div>
               <Card>
                  <CardContent className='p-6'>
                     <div className='flex items-center mb-4'>
                        <Skeleton className='w-16 h-16 rounded-full mr-4' />
                        <div>
                           <Skeleton className='w-32 h-5 mb-2' />
                           <Skeleton className='w-24 h-4' />
                        </div>
                     </div>
                     <Skeleton className='w-full h-4' />
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Review Section */}
         <div className='mt-12'>
            <h2 className='text-2xl font-bold mb-4'>
               <Skeleton className='w-24 h-6' />
            </h2>
            {[...Array(3)].map((_, index) => (
               <Card key={index} className='mb-4'>
                  <CardContent className='p-4'>
                     <div className='flex items-center justify-between mb-2'>
                        <Skeleton className='w-32 h-5' />
                        <Skeleton className='w-16 h-4' />
                     </div>
                     <Skeleton className='w-full h-4' />
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
   return isLoading ? (
      <SessionDetailsSkeleton />
   ) : (
      <div className='max-w-8xl mx-auto mt-10'>
         <h1 className='text-3xl font-bold mb-8 text-muted-foreground'>
            Session Details
         </h1>
         <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            <div className='md:col-span-2'>
               <img
                  src={
                     session.sessionBannerImage ||
                     "https://miro.medium.com/v2/resize:fit:2000/1*vR3W5nmBzFdVy2BCx6apPg.png"
                  }
                  alt={session.sessionTitle}
                  className='w-full h-64 object-cover rounded-lg mb-4'
               />
               <h1 className='text-3xl font-bold mb-4'>
                  {session.sessionTitle}
               </h1>
               <div className='flex items-center mb-4'>
                  <Rating value={4.5} readOnly style={{ maxWidth: 100 }} />
                  <span className='ml-2 text-sm text-muted-foreground'>
                     4.5 Average Rating
                  </span>
               </div>
               <p className='text-muted-foreground mb-6'>
                  {session.sessionDescription}
               </p>
               <div className='grid grid-cols-2 gap-4 mb-6'>
                  <div>
                     <h3 className='font-semibold'>Registration Start Date</h3>
                     <p>
                        {format(
                           new Date(session.registrationStartDate || null),
                           "dd MMM yyyy"
                        )}
                     </p>
                  </div>
                  <div>
                     <h3 className='font-semibold'>Registration End Date</h3>
                     <p>
                        {format(
                           new Date(session.registrationEndDate || null),
                           "dd MMM yyyy"
                        )}
                     </p>
                  </div>
                  <div>
                     <h3 className='font-semibold'>Class Start Date</h3>
                     <p>
                        {format(
                           new Date(session.classStartTime || null),
                           "dd MMM yyyy"
                        )}
                     </p>
                  </div>
                  <div>
                     <h3 className='font-semibold'>Class End Date</h3>
                     <p>
                        {format(
                           new Date(session.classEndDate || null),
                           "dd MMM yyyy"
                        )}
                     </p>
                  </div>
                  <div>
                     <h3 className='font-semibold'>Session Duration</h3>
                     <p>{convertToHoursAndMinutes(session.sessionDuration)}</p>
                  </div>
                  <div>
                     <h3 className='font-semibold'>Registration Fee</h3>
                     <p>
                        {session.registrationFee === 0
                           ? "FREE"
                           : `$${session.registrationFee}`}
                     </p>
                  </div>
               </div>
               {/* TODO: sisable for admin, tutor and self user. Also Add Functionality */}
               <Button disabled={!isRegistrationOpen}>
                  {isRegistrationOpen ? "Book Now" : "Registration Closed"}
               </Button>
            </div>

            {/* Tutor Profile */}
            <div>
               <Card>
                  <CardContent className='p-6'>
                     <div className='flex items-center mb-4'>
                        <img
                           src={
                              session.tutorProfileImage ||
                              "https://img.freepik.com/premium-vector/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.jpg?semt=ais_hybrid"
                           }
                           alt={session.tutorName}
                           className='w-16 h-16 rounded-full mr-4'
                        />
                        <div>
                           <h2 className='text-xl font-semibold'>
                              {session.tutorName}
                           </h2>
                           {/* TODO: make it dynamic */}
                           <p className='text-sm text-muted-foreground'>
                              5 courses available
                           </p>
                        </div>
                     </div>
                     <p className='text-gray-700'>{session.tutorBio}</p>
                  </CardContent>
               </Card>
            </div>
         </div>

         {/* Review Section */}
         <div className='mt-12'>
            <h2 className='text-2xl font-bold mb-4'>Reviews</h2>
            {reviews.map((review) => (
               <Card key={review.id} className='mb-4'>
                  <CardContent className='p-4'>
                     <div className='flex items-center justify-between mb-2'>
                        <h3 className='font-semibold'>{review.author}</h3>
                        <Rating
                           value={review.rating}
                           readOnly
                           style={{ maxWidth: 100 }}
                        />
                     </div>
                     <p className='text-muted-foreground'>{review.comment}</p>
                  </CardContent>
               </Card>
            ))}
         </div>
      </div>
   );
};

export default SessionDetails;
