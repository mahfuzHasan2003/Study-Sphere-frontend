import { AiFillHome } from "react-icons/ai";
import { BiBookAlt } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { FaRegStickyNote } from "react-icons/fa";
export default [
   { label: "Home", href: "/home", icon: AiFillHome },
   { label: "All Sessions", href: "/sessions/all", icon: BiBookAlt },
   { label: "Booked Sessions", href: "/sessions/booked", icon: BiBookAlt },
   { label: "Create & Manage Note", href: "/notes/manage", icon: FiEdit },
   { label: "Study Materials", href: "/materials", icon: FaRegStickyNote },
];
