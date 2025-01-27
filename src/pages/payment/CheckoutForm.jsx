import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const CheckoutForm = ({ sessionId, bookedId, session }) => {
   const { user } = useAuth();
   const { theme } = useTheme();
   const [paymentError, setPaymentError] = useState("");
   const [clientSecret, setClientSecret] = useState("");
   const [paymentLoading, setPaymentLoading] = useState(false);
   const stripe = useStripe();
   const elements = useElements();
   const axiosSecure = useAxiosSecure();
   const navigate = useNavigate();
   // eslint-disable-next-line react-hooks/exhaustive-deps
   const createPaymentIntent = async () => {
      const { data } = await axiosSecure.post("/create-payment-intent", {
         sessionId,
      });
      setClientSecret(data.clientSecret);
   };
   useEffect(() => {
      createPaymentIntent();
   }, [createPaymentIntent]);
   const handleSubmit = async (e) => {
      e.preventDefault();
      setPaymentLoading(true);
      if (!stripe || !elements) {
         setPaymentLoading(false);
         return;
      }
      const card = elements.getElement(CardElement);
      if (card == null) {
         setPaymentLoading(false);
         return;
      }
      const { error, paymentMethod } = await stripe.createPaymentMethod({
         type: "card",
         card,
      });
      if (error) {
         setPaymentLoading(false);
         setPaymentError(error.message);
      } else {
         setPaymentError("");
      }

      // confirm the payment
      const { paymentIntent, error: paymentError } =
         await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
               card: card,
               billing_details: {
                  name: user?.displayName,
                  email: user?.email,
               },
            },
         });

      if (paymentIntent?.status === "succeeded") {
         setPaymentLoading(false);
         toast({
            variant: "success",
            description: `Payment successful for ${session?.sessionTitle}. Check your materials and become your own Spider-Man!`,
         });
         await axiosSecure.patch(`/update-payment-status/${bookedId}`);
         navigate("/dashboard/materials");
      }
      if (paymentError) {
         setPaymentLoading(false);
         setPaymentError(paymentError?.message);
         toast({
            variant: "error",
            description: `Error: ${paymentError?.message}`,
         });
      }
   };

   return (
      <form onSubmit={handleSubmit} className='space-y-10'>
         <CardElement
            options={{
               style: {
                  base: {
                     fontSize: "16px",
                     color: theme === "dark" ? "#ffffff" : "#000000",
                     "::placeholder": {
                        color: theme === "dark" ? "#6b7280" : "#9ca3af",
                     },
                     backgroundColor: "transparent",
                  },
                  invalid: {
                     color: theme === "dark" ? "#ef4444" : "#dc2626",
                  },
               },
               hidePostalCode: true,
            }}
         />
         <Button
            type='submit'
            disabled={!stripe || !clientSecret || paymentLoading}
            className='w-full'>
            {!paymentLoading
               ? `Pay $${session?.registrationFee}`
               : "processing..."}
         </Button>
         {paymentError ? (
            <p className='text-red-500 text-xs text-center'>
               ⚠️ {paymentError}
            </p>
         ) : null}
      </form>
   );
};

export default CheckoutForm;
