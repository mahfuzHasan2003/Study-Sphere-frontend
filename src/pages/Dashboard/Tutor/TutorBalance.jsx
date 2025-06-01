import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useFetchForGet } from "@/hooks/useFetchForGet";
import GetUserWithRole from "@/shared/GetUserWithRole";
import { useState } from "react";

export default function TutorBalance() {
  const [accountCreatePending, setAccountCreatePending] = useState(false);
  const axiosSecure = useAxiosSecure();
  const {_id: userID, tutorStripeId, userRole, userName, isRoleLoading, isAuthLoading} = GetUserWithRole();

  // creating a connect account for tutor
  const handleConnect = async () => {
    try {
      setAccountCreatePending(true);
      const {data} = await axiosSecure.post("/create-stripe-account-link", {userID});
      window.location.href = data?.url;
    } catch (error) {
      toast({
        variant: "error",
        description: `Error: ${error?.message || error}`,
      });
    } finally {
      setAccountCreatePending(false);
    }
  }

  const { user: loggedInTutor } = useAuth();
  const {
    isLoading,
    data: balance={},
  } = useFetchForGet(
    "secure",
    ["tutor-balance"],
    `/balance/tutor/${tutorStripeId}`,
    { enabled: !!loggedInTutor?.email }
  );
  const amount = balance?.pending?.[0]?.amount;
  const formatted = typeof amount === 'number' ? (amount / 100).toFixed(2) : '11.00';
  
  return (
    <div>
      
      {
        !tutorStripeId ? (
        // If not tutor stripe account not available
        <div className="px-4 py-10 border rounded-md bg-muted text-center">
          <p className="mb-2 text-sm text-muted-foreground">
            You haven’t connected your Stripe account yet.
          </p>
          <Button onClick={handleConnect} 
          disabled={accountCreatePending}
          >
            {accountCreatePending ? 'Redirecting...' : 'Connect with Stripe'}
          </Button>
      </div>
      ) : (
        // If available
        <div className="px-4 py-10 border rounded-md bg-muted text-center">
          <h4 className="text-muted-foreground font-semibold text-lg">Balance</h4>
          <h2 className="font-bold text-4xl">${formatted}</h2>
        </div>
      )
      }
    </div>
  )
}
