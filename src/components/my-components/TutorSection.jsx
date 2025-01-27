import { useFetchForGet } from "@/hooks/useFetchForGet";
import TutorCard from "./TutorCard";

const TutorSection = () => {
   const { data: tutors = [] } = useFetchForGet(
      "public",
      ["topTutors"],
      "/top-tutors"
   );
   return (
      <section className='py-5 max-w-8xl mx-auto mt-5 px-5'>
         <h2 className='text-3xl font-bold text-center'>
            Meet Our Expert Tutors
         </h2>
         <p className='text-muted-foreground text-center mt-2'>
            Explore our team of skilled tutors, each dedicated to helping you
            achieve your goals. Learn, grow, and succeed with personalized
            guidance from the best in the field!
         </p>
         <div className='mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {tutors.map((tutor) => (
               <TutorCard key={tutor?._id} tutor={tutor} />
            ))}
         </div>
      </section>
   );
};

export default TutorSection;
