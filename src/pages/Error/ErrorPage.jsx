import errorAnimation from "@/assets/Error-Animation.json";
import { Button } from "@/components/ui/button";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

const ErrorPage = () => {
   return (
      <div className='h-full grid place-items-center min-h-svh'>
         <div className='text-center space-y-3'>
            <Lottie
               animationData={errorAnimation}
               loop={true}
               style={{ width: "300px", height: "300px" }}
            />
            <p className='text-muted-foreground'>Something went wrong!!</p>
            <div className='inline-flex gap-3 flex-wrap'>
               <Link to={-1}>
                  <Button variant='outline'>Go Back</Button>
               </Link>
               <Link to='/'>
                  <Button>Home</Button>
               </Link>
               <Link to='/dashboard'>
                  <Button variant='secondary'>Dashboard</Button>
               </Link>
            </div>
         </div>
      </div>
   );
};

export default ErrorPage;
