import { Button } from "@/components/ui/button";
import {
   Card,
   CardDescription,
   CardFooter,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import useAuth from "@/hooks/useAuth";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import { Helmet } from "react-helmet";
import { Link, useNavigate } from "react-router-dom";

const BookedSessions = () => {
   const { user } = useAuth();
   const navigate = useNavigate();
   const { data: studentBookedSessions = [] } = useFetchForGet(
      "secure",
      ["studentBookedSessions", user?.email],
      `/student-booked-sessions/${user?.email}`,
      { enabled: !!user?.email }
   );
   return (
      <div>
         <Helmet>
            <title> My booked sessions | Dashboard - Study Sphere </title>
         </Helmet>
         <h2 className='text-xl md:text-2xl lg:text-3xl font-bold mb-8 border-l-8 border-primary pl-3'>
            Sessions that I have booked
         </h2>
         <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 md:gap-5 '>
            {studentBookedSessions.map((session) => (
               <Card key={session._id} className='flex flex-col'>
                  <CardHeader>
                     <img
                        src={session?.sessionBannerImage}
                        alt={session?.sessionTitle}
                        className='max-h-48 object-cover object-center mb-3 rounded-md'
                     />
                     <CardTitle>{session?.sessionTitle}</CardTitle>
                     {session?.paymentStatus === "incomplete" ? (
                        <CardDescription className='text-red-500'>
                           Please complete your payment. Without Payment you
                           can't access it's materials
                        </CardDescription>
                     ) : (
                        <CardDescription className='text-green-500'>
                           Check all materials for the session provided by tutor
                           in the 'Study Materials' page.
                        </CardDescription>
                     )}
                  </CardHeader>
                  <CardFooter className='flex-grow mt-auto'>
                     <div className='mt-auto flex justify-between w-full flex-wrap gap-2'>
                        <Button
                           variant='outline'
                           onClick={() =>
                              navigate(`/session-details/${session?.sessionId}`)
                           }>
                           View Details
                        </Button>
                        {session?.paymentStatus === "incomplete" ? (
                           <Link
                              to={`/dashboard/make-payment/${session?.sessionId}`}
                              state={{ bookedId: session?._id }}>
                              <Button>Pay Now</Button>
                           </Link>
                        ) : null}
                     </div>
                  </CardFooter>
               </Card>
            ))}
         </div>
      </div>
   );
};

export default BookedSessions;
