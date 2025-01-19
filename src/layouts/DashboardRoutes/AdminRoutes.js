import { FaUsers } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { MdEventNote } from "react-icons/md";

export default [
   { label: "All Users", href: "users/all", icon: FaUsers },
   {
      label: "Manage Study Sessions",
      href: "all-study-sessions/manage",
      icon: MdEventNote,
   },
   { label: "All Materials", href: "materials/all", icon: GrResources },
];
