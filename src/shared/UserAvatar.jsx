import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserAvatar = ({ userName = "", imageURL = "" }) => {
   function getInitialsOfName(name) {
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
            alt={userName}
            referrerPolicy='no-referrer'
         />
         <AvatarFallback>{getInitialsOfName(userName)}</AvatarFallback>
      </Avatar>
   );
};

export default UserAvatar;
