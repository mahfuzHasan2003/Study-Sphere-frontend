import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
} from "@/components/ui/card";
import { useLocation, useParams } from "react-router-dom";
import { useFetchForGet } from "@/hooks/useFetchForGet";

const stripePromise = loadStripe(import.meta.env.VITE_Payment_PK);
const Payment = () => {
   const { id } = useParams();
   const { state } = useLocation();
   const { data: session = {} } = useFetchForGet(
      "public",
      ["SessionDetails", id],
      `/get-session-details/${id}`
   );
   return (
      <div className='flex items-center justify-center mt-32 max-w-md mx-auto'>
         <div>
            <h2 className='text-xl md:text-2xl lg:text-3xl font-bold mb-8 border-l-8 border-primary pl-3'>
               <span className='text-muted-foreground'>Payment for:</span>{" "}
               {session?.sessionTitle}
            </h2>
            <Card className='w-full space-y-3'>
               <CardHeader>
                  <CardTitle>Complete Your Payment</CardTitle>
                  <CardDescription>
                     Please provide your card details to securely complete the
                     payment. Your information is safe with us!
                  </CardDescription>
               </CardHeader>
               <CardContent>
                  <Elements stripe={stripePromise}>
                     <CheckoutForm
                        sessionId={id}
                        bookedId={state?.bookedId}
                        session={session}
                     />
                  </Elements>
               </CardContent>
            </Card>
         </div>
      </div>
   );
};

export default Payment;
