import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";
import { Link } from "react-router-dom";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import { startOfDay, parseISO, isAfter, isEqual, isBefore } from "date-fns";

const StudySessionCard = ({ session }) => {
   const { data: tutorAvailableSessionsCount = {} } = useFetchForGet(
      "public",
      ["tutorAvailableSessionsCount", session],
      `/approved-sessions-count?email=${session?.tutorEmail}`,
      { enabled: !!session?.tutorEmail }
   );
   const { data: averageRating = {} } = useFetchForGet(
      "public",
      ["averageRating", session?._id],
      `/get-average-rating/${session?._id}`
   );

   const currentDate = startOfDay(new Date());
   const startDate = startOfDay(parseISO(session?.registrationStartDate || ""));
   const endDate = startOfDay(parseISO(session?.registrationEndDate || ""));
   const isOngoing =
      (isAfter(currentDate, startDate) || isEqual(currentDate, startDate)) &&
      (isBefore(currentDate, endDate) || isEqual(currentDate, endDate));
   const isUpcoming = isAfter(startDate, currentDate);

   return (
      <Card className='overflow-hidden flex flex-col'>
         <div className='relative'>
            <img
               src={
                  session.sessionBannerImage ||
                  "https://miro.medium.com/v2/resize:fit:2000/1*vR3W5nmBzFdVy2BCx6apPg.png"
               }
               alt={session.sessionTitle}
               className='w-full h-48 object-cover'
            />
            {!isUpcoming ? (
               <Badge
                  className={`absolute top-2 right-2 py-1 rounded-sm ${
                     isOngoing ? "bg-green-700" : "bg-red-600"
                  }`}>
                  {isOngoing ? (
                     <span className='flex items-center gap-1'>
                        <span className='relative flex h-3 w-3'>
                           <span className='animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75'></span>
                           <span className='relative inline-flex rounded-full h-3 w-3 bg-green-400'></span>
                        </span>
                        Ongoing
                     </span>
                  ) : (
                     "Closed"
                  )}
               </Badge>
            ) : null}
         </div>
         <CardContent className='p-4'>
            <div className='flex items-center mb-2'>
               <img
                  src={
                     session.tutorProfileImage ||
                     "https://img.freepik.com/premium-vector/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.jpg?semt=ais_hybrid"
                  }
                  alt={session.tutorName}
                  className='w-10 h-10 rounded-full mr-2'
               />
               <div>
                  <h3 className='font-semibold'>{session?.tutorName}</h3>
                  <p className='text-sm text-muted-foreground'>
                     {tutorAvailableSessionsCount?.count || 0} course(s)
                     available
                  </p>
               </div>
            </div>
            <h2 className='text-xl font-bold mb-2'>{session?.sessionTitle}</h2>
            <p className='text-muted-foreground mb-2'>
               {session?.sessionDescription?.length > 50
                  ? `${session?.sessionDescription?.substring(0, 50)}...`
                  : session?.sessionDescription}
            </p>
            <div className='flex items-center justify-between'>
               {averageRating ? (
                  <div className='flex items-center'>
                     <Rating
                        value={averageRating.averageRating}
                        readOnly
                        style={{ maxWidth: 100 }}
                     />
                     <span className='ml-2 text-sm text-muted-foreground'>
                        {averageRating.averageRating}
                     </span>
                  </div>
               ) : (
                  <div></div>
               )}
               <span className='font-bold text-lg'>
                  {session?.registrationFee === 0
                     ? "FREE"
                     : `$${session.registrationFee}`}
               </span>
            </div>
         </CardContent>
         <CardFooter className='flex-grow'>
            <Button asChild className='w-full mt-auto' variant='secondary'>
               <Link to={`/session-details/${session._id}`}>Read More</Link>
            </Button>
         </CardFooter>
      </Card>
   );
};

export default StudySessionCard;
