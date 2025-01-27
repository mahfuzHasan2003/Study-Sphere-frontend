import { useFetchForGet } from "@/hooks/useFetchForGet";
import { Button } from "@/components/ui/button";
import StudySessionCard from "./StudySessionCard";
import { Link } from "react-router-dom";

const LatestStudySessions = () => {
   const { data: sessions = [] } = useFetchForGet(
      "public",
      ["latestStudySessions"],
      "/featured-sessions"
   );

   return (
      <section className='py-12 max-w-8xl mx-auto mt-5 px-5'>
         <h2 className='text-3xl font-bold text-center'>
            Featured Study Sessions
         </h2>
         <p className='text-muted-foreground text-center mt-2'>
            Join a session to enhance your learning experience.
         </p>
         <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
            {sessions.map((session) => (
               <StudySessionCard key={session._id} session={session} />
            ))}
         </div>
         <div className='text-center mt-5'>
            <Link to='all-sessions'>
               <Button size='lg'>Explore More</Button>
            </Link>
         </div>
      </section>
   );
};

export default LatestStudySessions;
