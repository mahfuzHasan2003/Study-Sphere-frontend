import { BsFillJournalBookmarkFill } from "react-icons/bs";
import { FiEdit } from "react-icons/fi";
import { FaRegStickyNote } from "react-icons/fa";
export default [
   {
      label: "Booked Sessions",
      href: "booked-sessions",
      icon: BsFillJournalBookmarkFill,
   },
   { label: "Create & Manage Note", href: "notes/manage", icon: FiEdit },
   { label: "Study Materials", href: "materials", icon: FaRegStickyNote },
];
