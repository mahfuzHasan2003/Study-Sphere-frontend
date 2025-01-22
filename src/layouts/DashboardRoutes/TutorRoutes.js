import { BiBookAlt, BiUpload } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";
// import { FaRegStickyNote } from "react-icons/fa";

export default [
   { label: "Create Study Session", href: "create-session", icon: FiEdit },
   { label: "My Sessions", href: "tutor-sessions", icon: BiBookAlt },
   {
      label: "Upload & Manage Materials",
      href: "upload-and-manage-materials",
      icon: BiUpload,
   },
   // {
   //    label: "View All Materials",
   //    href: "/materials/view",
   //    icon: FaRegStickyNote,
   // },
];
