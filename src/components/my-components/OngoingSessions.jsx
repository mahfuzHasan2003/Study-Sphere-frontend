import { useFetchForGet } from "@/hooks/useFetchForGet";
import StudySessionCard from "./StudySessionCard";

const OngoingSessions = () => {
  const { data: sessions = [] } = useFetchForGet(
    "public",
    ["OngoingSessions"],
    "/ongoing-sessions"
  );

  return (
    <section className="py-8 lg:py-12 max-w-8xl mx-auto px-5 xl:px-0">
      <h2 className="text-3xl font-bold text-center">🚀Ongoing Sessions</h2>
      <p className="text-muted-foreground text-center mt-2">
        Join a session to enhance your learning experience.
      </p>
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map((session) => (
          <StudySessionCard key={session._id} session={session} />
        ))}
      </div>
    </section>
  );
};

export default OngoingSessions;
