import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Mail, SaveAll, User, LogOut, Phone, MapPin } from "lucide-react";
import GetUserWithRole from "@/shared/GetUserWithRole";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "@/hooks/useAxiosSecure";

export default function UserProfile() {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { signOutUser } = useAuth();
  const {
    userRole = "",
    userName = "Anonymous",
    userPhotoURL = "",
    userEmail = "",
    location = "",
    phoneNumber = "",
  } = GetUserWithRole();

  const [tempPhoneNumber, setTempPhoneNumber] = useState("");
  const [tempLocation, setTempLocation] = useState("");
  const [isEditing, setIsEditing] = useState({
    phone: false,
    location: false,
  });

  const handleSaveChanges = async () => {
    try {
      const updateFields = {};
      if (tempLocation) updateFields.location = tempLocation;
      if (tempPhoneNumber) updateFields.phoneNumber = tempPhoneNumber;
      if (tempPhoneNumber || tempLocation) {
        const { data } = await axiosSecure.patch(
          `/update-profile/${userEmail}`,
          updateFields
        );
        if (data.success) {
          toast({
            variant: "success",
            description: "Profile updated successfully!",
          });
        } else {
          throw new Error("Failed to update profile");
        }
      } else {
        throw new Error("Missing required fields.");
      }
    } catch (error) {
      toast({
        variant: "error",
        description: `Error: ${error?.message}`,
      });
    }
  };

  return (
    <div className="max-w-4xl">
      <h2 className="text-xl md:text-2xl lg:text-3xl font-bold mb-4 border-l-8 border-primary pl-3">
        User Profile
      </h2>
      <p className="text-muted-foreground mb-8">
        Manage your account details and preferences
      </p>

      {/* Cover Photo */}
      <div className="relative w-full h-36 md:h-40 lg:h-48 bg-gray-200 rounded-lg overflow-hidden mb-16">
        <img
          src="https://i.pinimg.com/736x/23/7e/84/237e84a2bdffdff84e08bf3ecd1ebf25.jpg"
          alt="Cover"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Profile Card */}
      <Card className="relative -mt-24 mx-auto w-full shadow-lg">
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
          <div className="space-y-4">
            {/* Phone Number */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {isEditing.phone ? (
                  <Input
                    value={tempPhoneNumber || phoneNumber}
                    type="number"
                    onBlur={() =>
                      setIsEditing((prev) => ({ ...prev, phone: !prev.phone }))
                    }
                    autoFocus={isEditing.phone}
                    onChange={(e) => setTempPhoneNumber(e.target.value)}
                    placeholder="Enter phone number"
                    className="max-w-[200px] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                ) : (
                  <span>
                    {tempPhoneNumber || phoneNumber || "Add phone number"}
                  </span>
                )}
              </div>
              {!isEditing.phone && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setIsEditing((prev) => ({ ...prev, phone: !prev.phone }))
                  }
                >
                  Edit
                </Button>
              )}
            </div>

            {/* Location */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                {isEditing.location ? (
                  <Input
                    value={tempLocation || location}
                    onBlur={() =>
                      setIsEditing((prev) => ({
                        ...prev,
                        location: !prev.location,
                      }))
                    }
                    autoFocus={isEditing.location}
                    onChange={(e) => setTempLocation(e.target.value)}
                    placeholder="Enter location"
                    className="max-w-[200px]"
                  />
                ) : (
                  <span>{tempLocation || location || "Add location"}</span>
                )}
              </div>
              {!isEditing.location && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setIsEditing((prev) => ({
                      ...prev,
                      location: !prev.location,
                    }))
                  }
                >
                  Edit
                </Button>
              )}
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="outline"
              className="w-full sm:w-auto flex items-center gap-2"
              onClick={handleSaveChanges}
            >
              <SaveAll className="w-4 h-4" /> Save Changes
            </Button>
            <Button
              variant="destructive"
              className="w-full sm:w-auto flex items-center gap-2"
              onClick={() => {
                signOutUser()
                  .then(() => {
                    toast({
                      variant: "success",
                      description: `Logout Success!`,
                    });
                    navigate("/");
                  })
                  .catch((err) =>
                    toast({
                      variant: "error",
                      description: `Logout Failed : ${err.message}`,
                    })
                  );
              }}
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
