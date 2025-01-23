import { FaUsers } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { MdEventNote } from "react-icons/md";

export default [
   { label: "Manage All Users", href: "users/all", icon: FaUsers },
   {
      label: "Manage Study Sessions",
      href: "all-study-sessions/manage",
      icon: MdEventNote,
   },
   {
      label: "Manage All Materials",
      href: "materials/all/manage",
      icon: GrResources,
   },
];
