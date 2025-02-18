import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import clsx from "clsx";

const TutorCard = ({ tutor, className }) => {
  const { _id, userName, userPhotoURL, userEmail } = tutor;
  const { data: tutorAvailableSessionsCount = {} } = useFetchForGet(
    "public",
    ["tutorAvailableSessionsCount", _id],
    `/approved-sessions-count?email=${userEmail}`,
    { enabled: !!userEmail }
  );
  return (
    <Card className={clsx("overflow-hidden", className)}>
      <CardHeader className="py-2">
        <img
          src={
            userPhotoURL ||
            "https://img.freepik.com/premium-vector/user-icons-includes-user-icons-people-icons-symbols-premiumquality-graphic-design-elements_981536-526.jpg?semt=ais_hybrid"
          }
          alt={`${userName}'s profile`}
          className="w-16 h-16 rounded-full aspect-square object-cover object-center mx-auto"
        />
      </CardHeader>
      <CardContent className="text-center py-2">
        <CardTitle className="text-lg">{userName}</CardTitle>
        <p className="text-sm text-muted-foreground">
          {tutorAvailableSessionsCount?.count || 0} course(s) available
        </p>
      </CardContent>
    </Card>
  );
};

export default TutorCard;
