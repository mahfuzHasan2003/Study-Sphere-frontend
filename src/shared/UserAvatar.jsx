import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";

const UserAvatar = ({ userName = "", imageURL = "" }) => {
   function getInitialsOfName(name) {
      if (!name) return "";
      return name
         .split(" ")
         .slice(0, 2)
         .map((part) => part.charAt(0).toUpperCase())
         .join("");
   }
   return (
      <Avatar>
         <AvatarImage
            src={imageURL}
            alt={userName || "user avatar"}
            referrerPolicy='no-referrer'
         />
         <AvatarFallback>
            {getInitialsOfName(userName) || <User />}
         </AvatarFallback>
      </Avatar>
   );
};

export default UserAvatar;
