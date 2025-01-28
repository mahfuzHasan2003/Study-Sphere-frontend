import { Loader } from "lucide-react";

const DataLoader = ({ text = "" }) => {
   return (
      <div className='flex gap-2 items-center'>
         {text}
         <span className='animate-spin'>
            <Loader />
         </span>
      </div>
   );
};

export default DataLoader;
