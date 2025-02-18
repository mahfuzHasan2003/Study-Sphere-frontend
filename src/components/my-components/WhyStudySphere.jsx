import { BookOpen, Users, Calendar, Award } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
const WhyStudySphere = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Personalized Learning",
      description: "Tailored study sessions to fit your needs",
    },
    {
      icon: Users,
      title: "Expert Tutors",
      description: "Connect with qualified tutors in various subjects",
    },
    {
      icon: Calendar,
      title: "Flexible Scheduling",
      description: "Book sessions that fit your timetable",
    },
    {
      icon: Award,
      title: "Track Progress",
      description: "Monitor your improvement with detailed analytics",
    },
  ];
  return (
    <section className="py-12 max-w-8xl mx-auto mt-5 px-5 xl:px-0">
      <h2 className="text-3xl font-bold text-center">Why Study Sphere⁉️</h2>
      <p className="text-muted-foreground text-center mt-2">
        All in one secure, easy-to-use platform
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
        {features.map((feature, index) => (
          <Card key={index}>
            <CardHeader>
              <feature.icon className="h-10 w-10 text-primary mb-2" />
              <CardTitle>{feature.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{feature.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default WhyStudySphere;
