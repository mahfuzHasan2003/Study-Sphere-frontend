import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Mail, Lock, User } from "lucide-react";
import GetUserWithRole from "@/shared/GetUserWithRole";

export default function UserProfile() {
  const {
    userRole = "",
    userName = "Anonymous",
    userPhotoURL = "",
    userEmail = "",
  } = GetUserWithRole();

  return (
    <div className="container max-w-4xl mt-10 px-4">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 border-l-8 border-primary pl-3">
        User Profile
      </h2>
      {/* <h1 className="text-3xl font-bold mb-4"></h1> */}
      <p className="text-muted-foreground mb-8">
        Manage your account details and preferences
      </p>

      {/* Cover Photo */}
      <div className="relative w-full h-48 sm:h-64 bg-gray-200 rounded-lg overflow-hidden mb-16">
        <img
          src="https://i.pinimg.com/736x/23/7e/84/237e84a2bdffdff84e08bf3ecd1ebf25.jpg"
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Card */}
      <Card className="relative -mt-24 mx-auto p-6 w-full shadow-lg">
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            {/* Profile Photo & Active Status */}
            <div className="relative">
              <Avatar className="w-24 h-24 border-4 border-background">
                <AvatarImage src={userPhotoURL} alt={userName} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></span>
            </div>

            {/* User Info */}
            <div className="text-center sm:text-left">
              <CardTitle className="text-2xl font-semibold">
                {userName}
              </CardTitle>
              <CardDescription className="flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Mail className="w-4 h-4" /> {userEmail}
              </CardDescription>
              <p className="text-sm text-muted-foreground mt-1">
                Role: {userRole}
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="mt-6">
          {/* TODO: add Reset pass functionality  */}
          <Button
            variant="outline"
            className="w-full sm:w-auto flex items-center gap-2"
          >
            <Lock className="w-4 h-4" /> Reset Password
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
