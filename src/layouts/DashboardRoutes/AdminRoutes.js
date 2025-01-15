import { AiFillHome } from "react-icons/ai";
import { BiBookAlt } from "react-icons/bi";
import { FaUsers } from "react-icons/fa";
import { FaRegStickyNote } from "react-icons/fa";

export default [
   { label: "Home", href: "/home", icon: AiFillHome },
   { label: "All Sessions", href: "/sessions/all", icon: BiBookAlt },
   { label: "All Users", href: "/users/all", icon: FaUsers },
   { label: "All Materials", href: "/materials/all", icon: FaRegStickyNote },
];
