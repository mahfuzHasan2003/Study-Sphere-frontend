import { BiBookAlt, BiUpload } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
import { RiMoneyDollarCircleLine } from "react-icons/ri";


export default [
   { label: "Create New Session", href: "create-session", icon: FiEdit },
   { label: "My Sessions", href: "tutor-sessions", icon: BiBookAlt },
   {
      label: "Upload & Manage Materials",
      href: "upload-and-manage-materials",
      icon: BiUpload,
   },
   {
      label: "My Balance",
      href: "my-balance",
      icon: RiMoneyDollarCircleLine,
   },
];
