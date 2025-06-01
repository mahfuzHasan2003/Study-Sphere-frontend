import useAuth from "@/hooks/useAuth";
import { useFetchForGet } from "@/hooks/useFetchForGet";

export default function TrackBalance() {
   const { user: loggedInAdmin } = useAuth();
   const {
    isLoading,
    data: balance={},
  } = useFetchForGet(
    "secure",
    ["admin-balance"],
    "/balance/admin",
    { enabled: !!loggedInAdmin?.email }
  );
  const amount = balance?.pending?.filter(obj => obj.currency==='usd')[0].amount;
  
  const formatted = typeof amount === 'number' ? (amount / 100).toFixed(2) : '0.00';
  
  
  return (
    <div>
      <h4 className="text-center text-muted-foreground font-semibold text-lg">Balance</h4>
      <h2 className="text-center font-bold text-4xl">${formatted}</h2>
    </div>
  )
}
