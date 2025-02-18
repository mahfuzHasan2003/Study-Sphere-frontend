import { useFetchForGet } from "@/hooks/useFetchForGet";
import { useParams } from "react-router-dom";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import StudySessionCard from "@/components/my-components/StudySessionCard";

const TutorProfile = () => {
  const { email } = useParams();
  const { data: tutorSessions = [] } = useFetchForGet(
    "public",
    ["specificTutorSessions"],
    `tutor/${email}/sessions`
  );
  const { data: tutor = [] } = useFetchForGet(
    "public",
    ["specificTutorDetails"],
    `/get-specific-user/${email}`
  );

  return (
    <div className="py-5 max-w-8xl mx-auto mt-5 px-5 xl:px-0">
      <Card className="mb-8">
        <CardHeader>
          <div className="md:flex justify-between items-center">
            <div className="flex items-center gap-4 mb-4 md:mb-0">
              <Avatar className="w-24 h-24 border-primary border-2">
                <AvatarImage
                  src={
                    tutor?.userPhotoURL ||
                    "https://cdn-icons-png.flaticon.com/512/219/219983.png"
                  }
                  alt={tutor.userName}
                />
                <AvatarFallback>{tutor?.userName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl font-bold">
                  {tutor.userName}
                </CardTitle>
                <p className="text-muted-foreground">{tutor.userEmail}</p>
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => (window.location.href = `mailto:${email}`)}
            >
              <Mail className="mr-2 h-4 w-4" />
              Contact Tutor
            </Button>
          </div>
        </CardHeader>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Study Sessions</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tutorSessions.map((session) => (
          <StudySessionCard key={session._id} session={session} />
        ))}
      </div>
    </div>
  );
};

export default TutorProfile;
