import { BiBookAlt, BiUpload } from "react-icons/bi";
import { FiEdit } from "react-icons/fi";

export default [
   { label: "Create New Session", href: "create-session", icon: FiEdit },
   { label: "My Sessions", href: "tutor-sessions", icon: BiBookAlt },
   {
      label: "Upload & Manage Materials",
      href: "upload-and-manage-materials",
      icon: BiUpload,
   },
];
