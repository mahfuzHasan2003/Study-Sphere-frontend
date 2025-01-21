import { useFetchForGet } from "@/hooks/useFetchForGet";
import { Button } from "../ui/button";
import StudySessionCard from "./StudySessionCard";

const LatestStudySessions = () => {
   const { data: sessions = [] } = useFetchForGet([""], "/latest-sessions");

   return (
      <section className='py-12 max-w-8xl mx-auto'>
         <div className=''>
            <h2 className='text-3xl font-bold text-center'>
               Upcoming Study Sessions
            </h2>
            <p className='text-muted-foreground text-center mt-2'>
               Join a session to enhance your learning experience.
            </p>
            <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
               {sessions.map((session) => (
                  <StudySessionCard key={session._id} session={session} />
               ))}
            </div>
         </div>
      </section>
   );
};

export default LatestStudySessions;
